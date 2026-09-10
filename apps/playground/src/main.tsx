import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkCurly, { type TreeOptions } from 'cowboy-curly/remark';
import type { CurlyOptions } from 'cowboy-curly';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Pause,
  Plus,
  Play,
  RotateCcw,
  ScanText,
  StepForward,
  Terminal,
  Download,
  X,
} from 'lucide-react';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/dm-sans';
import '@fontsource/dm-mono/400.css';
import 'cowboy-curly/prose.css';
import './styles.css';
import { samples } from './samples';
import { inspectMarkdown, integrationSnippet } from './model';
import { ReplayBoundary } from './ReplayBoundary';
import { installCommand, distributionLabel } from './distribution';

const StreamingSpecimen = lazy(() => import('./StreamingSpecimen'));
const defaults = { primes: false, ellipses: false };
const chunkSizes = [1, 3, 2, 7, 1, 4, 6, 2];
const kindNames: Record<string, string> = {
  'opening-quote': 'Opening quote',
  'closing-quote': 'Closing quote',
  apostrophe: 'Apostrophe',
  prime: 'Prime',
  ellipsis: 'Ellipsis',
  protected: 'Kept exact',
  ambiguous: 'Left for you',
};

function App() {
  const [source, setSource] = useState(samples[0].source);
  const [sample, setSample] = useState('letter');
  const [options, setOptions] = useState<CurlyOptions>(defaults);
  const [formatted, setFormatted] = useState(true);
  const [inspect, setInspect] = useState(false);
  const [reading, setReading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [speed, setSpeed] = useState('natural');
  const [snippetKind, setSnippetKind] = useState('React Markdown');
  const [notice, setNotice] = useState('');
  const [copyState, setCopyState] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const shown = streaming ? source.slice(0, cursor) : source;
  const report = useMemo(() => inspectMarkdown(shown, options), [shown, options]);
  const changes = report.decisions.filter((d) => d.original !== d.replacement);
  const protectedCount = report.decisions.filter((d) => d.kind === 'protected').length;
  const current = report.decisions.find((d) => d.block + ':' + d.start === selected);
  const snippet = useMemo(() => integrationSnippet(snippetKind, options), [snippetKind, options]);
  useEffect(() => {
    if (!playing) return;
    let chunk = 0;
    const timer = window.setInterval(
      () =>
        setCursor((n) =>
          Math.min(
            source.length,
            n + (speed === 'slow' ? 1 : chunkSizes[chunk++ % chunkSizes.length]),
          ),
        ),
      speed === 'slow' ? 80 : 35,
    );
    return () => window.clearInterval(timer);
  }, [playing, source, speed]);
  useEffect(() => {
    if (streaming && cursor >= source.length) setPlaying(false);
  }, [cursor, source.length, streaming]);
  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(id);
  }, [notice]);
  useEffect(() => {
    if (!copyState) return;
    const id = window.setTimeout(() => setCopyState(''), 1800);
    return () => clearTimeout(id);
  }, [copyState]);
  const stopStream = () => {
    setPlaying(false);
    setStreaming(false);
    setCursor(0);
  };
  function updateSource(value: string) {
    setSource(value);
    setSample('custom');
    setSelected(null);
    stopStream();
  }
  function chooseSample(value: string) {
    const next = samples.find((s) => s.id === value);
    if (next) {
      setSource(next.source);
      setSample(value);
      setSelected(null);
      stopStream();
    }
  }
  function replay() {
    setInspect(false);
    setSelected(null);
    if (!streaming || cursor >= source.length) {
      setCursor(0);
      setStreaming(true);
      setPlaying(true);
    } else setPlaying(!playing);
  }
  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(key);
      setNotice('Copied to your clipboard.');
    } catch {
      setNotice('Clipboard access is unavailable. Select the text and copy it manually.');
    }
  }
  function download() {
    const blob = new Blob([outputRef.current?.innerText ?? ''], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'curly.txt';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Your formatted text was downloaded.');
  }
  const markComponents = useMemo(
    () => ({
      mark: ({
        node,
        children,
      }: React.ComponentProps<'mark'> & { node?: { properties?: Record<string, unknown> } }) => {
        const id = String(node?.properties?.dataCurlyId ?? '');
        const reason = String(node?.properties?.dataCurlyReason ?? 'Punctuation change');
        return (
          <button
            type="button"
            className={'change-mark' + (selected === id ? ' selected' : '')}
            aria-label={reason}
            onClick={() => setSelected(id)}
          >
            {children}
          </button>
        );
      },
      img: ({ alt }: React.ComponentProps<'img'>) => (
        <span className="omitted-image">[Image: {alt ?? 'remote media'}]</span>
      ),
      a: ({ children, node, ...props }: React.ComponentProps<'a'> & { node?: unknown }) =>
        inspect ? (
          <span className="inspection-link">{children}</span>
        ) : (
          <a {...props} target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
    }),
    [selected, inspect],
  );

  return (
    <>
      <a className="skip-link" href="#playground">
        Skip to playground
      </a>
      <header className="masthead" id="top">
        <a className="wordmark" href="#top" aria-label="Curly home">
          Curly<span aria-hidden="true">”</span>
        </a>
        <a className="cowboy" href="https://cowboy.is">
          A LITTLE SOMETHING BY <strong>COWBOY</strong>
          <ArrowUpRight size={14} />
        </a>
        <nav aria-label="Main navigation">
          <a href="#playground">Playground</a>
          <a href="#install">
            Install <ArrowDown size={13} />
          </a>
          <a href="#field-notes">Field notes</a>
        </nav>
      </header>

      <main>
        <section className="introduction" aria-labelledby="title">
          <h1 id="title">
            Mind your <em>marks.</em>
          </h1>
          <div className="intro-copy">
            <p>Good words deserve good type.</p>
            <p>
              A small, open-source typography kit for AI apps. <br />
              Try your words. See the difference. Take it with you.
            </p>
          </div>
        </section>

        <section id="playground" className="desk" aria-label="Typography playground">
          <div className="desk-top">
            <div className="sample-select">
              <label htmlFor="sample">Start with</label>
              <div className="select-wrap">
                <select id="sample" value={sample} onChange={(e) => chooseSample(e.target.value)}>
                  {samples.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                  {sample === 'custom' && <option value="custom">Your own words</option>}
                </select>
                <ChevronDown size={14} />
              </div>
            </div>
            <span className="local-note">
              <span className="status-dot" />
              Stays in your browser
            </span>
          </div>
          <div className="workspace">
            <div className="source-pane">
              <div className="pane-toolbar">
                <label htmlFor="source">Your words</label>
                <span>Markdown welcome</span>
                <button
                  className="icon-button"
                  aria-label="Copy original source"
                  onClick={() => copy(source, 'source')}
                >
                  {copyState === 'source' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <textarea
                id="source"
                ref={sourceRef}
                value={source}
                onChange={(e) => updateSource(e.target.value)}
                spellCheck={false}
                maxLength={100000}
                placeholder={'Put your words here. "Quotes", apostrophes, code...'}
                aria-describedby="source-help"
              />
              <div className="source-footer">
                <span id="source-help">Type, paste, or pick a sample.</span>
                <span>{source.length.toLocaleString()} / 100,000</span>
              </div>
            </div>
            <div className="output-pane">
              <div className="pane-toolbar output-toolbar">
                <div className="segmented" aria-label="Preview typography">
                  <button
                    type="button"
                    aria-pressed={!formatted}
                    onClick={() => {
                      setFormatted(false);
                      setInspect(false);
                    }}
                  >
                    Original
                  </button>
                  <button type="button" aria-pressed={formatted} onClick={() => setFormatted(true)}>
                    With Curly
                    <span className="tiny-quote" aria-hidden="true">
                      ”
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  className={'inspect-button' + (inspect ? ' active' : '')}
                  aria-label="See changes"
                  aria-pressed={inspect}
                  disabled={!formatted || streaming}
                  onClick={() => {
                    setInspect(!inspect);
                    setSelected(null);
                  }}
                >
                  <ScanText size={15} />
                  <span>See changes</span>
                </button>
              </div>
              <div className={'specimen-wrap' + (reading ? ' reading-on' : '')}>
                <div
                  ref={outputRef}
                  className={'specimen' + (reading ? ' curly-prose' : '')}
                  aria-label={formatted ? 'Formatted reading preview' : 'Original reading preview'}
                >
                  {!shown ? (
                    <p className="empty-specimen">
                      A little space for
                      <br />
                      <em>your next good thought.</em>
                    </p>
                  ) : streaming ? (
                    <ReplayBoundary onExit={stopStream}>
                      <Suspense fallback={<p className="replay-loading">Loading the replay…</p>}>
                        <StreamingSpecimen
                          source={shown}
                          options={options}
                          formatted={formatted}
                          playing={playing}
                        />
                      </Suspense>
                    </ReplayBoundary>
                  ) : (
                    <Markdown
                      remarkPlugins={[
                        remarkGfm,
                        remarkMath,
                        ...(formatted
                          ? [
                              [remarkCurly, { ...options, annotate: inspect }] as [
                                typeof remarkCurly,
                                TreeOptions,
                              ],
                            ]
                          : []),
                      ]}
                      components={markComponents}
                    >
                      {shown}
                    </Markdown>
                  )}
                  {playing && <span className="stream-caret" aria-label="Replaying text" />}
                </div>
              </div>
              <div className="output-footer">
                <span>
                  {formatted ? (
                    <>
                      <strong>{changes.length}</strong>{' '}
                      {changes.length === 1 ? 'little improvement' : 'little improvements'}
                      {protectedCount > 0 && <> · {protectedCount} kept exact</>}
                    </>
                  ) : (
                    'Your punctuation, just as you wrote it.'
                  )}
                </span>
                <div>
                  <button
                    type="button"
                    className="text-button"
                    disabled={!shown}
                    onClick={() => copy(outputRef.current?.innerText ?? '', 'output')}
                  >
                    {copyState === 'output' ? <Check size={14} /> : <Copy size={14} />}Copy text
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={!shown}
                    aria-label="Download preview as text"
                    onClick={download}
                  >
                    <Download size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="rule-bar">
            <div className="rule-toggles">
              <span className="rule-label">The finishing touches</span>
              <label className="rule fixed">
                <Check size={13} />
                Quotes & apostrophes
              </label>
              <label className="rule">
                <input
                  type="checkbox"
                  checked={!!options.primes}
                  onChange={(e) => {
                    setOptions({ ...options, primes: e.target.checked });
                    setSelected(null);
                  }}
                />
                <span>
                  Primes <b>′ ″</b>
                </span>
              </label>
              <label className="rule">
                <input
                  type="checkbox"
                  checked={!!options.ellipses}
                  onChange={(e) => {
                    setOptions({ ...options, ellipses: e.target.checked });
                    setSelected(null);
                  }}
                />
                <span>
                  Ellipses <b>…</b>
                </span>
              </label>
            </div>
            <label className="reading-toggle">
              <input
                type="checkbox"
                checked={reading}
                onChange={(e) => setReading(e.target.checked)}
              />
              <span>Reading styles</span>
              <span className="optional-label">optional</span>
            </label>
          </div>
          <div className="stream-bar">
            <div>
              <button type="button" className="replay-button" disabled={!source} onClick={replay}>
                {playing ? <Pause size={14} /> : <Play size={14} />}{' '}
                {playing
                  ? 'Pause replay'
                  : streaming && cursor < source.length
                    ? 'Resume replay'
                    : 'Replay as a stream'}
              </button>
              <span className="replay-explanation">Same words. A few characters at a time.</span>
            </div>
            {streaming && (
              <div className="stream-controls">
                <label className="visually-hidden" htmlFor="speed">
                  Replay speed
                </label>
                <select id="speed" value={speed} onChange={(e) => setSpeed(e.target.value)}>
                  <option value="natural">Natural pace</option>
                  <option value="slow">One character</option>
                </select>
                <button
                  className="icon-button"
                  disabled={playing || cursor >= source.length}
                  aria-label="Advance one character"
                  onClick={() => setCursor((n) => Math.min(source.length, n + 1))}
                >
                  <StepForward size={15} />
                </button>
                <button
                  className="icon-button"
                  aria-label="End replay and show all text"
                  onClick={stopStream}
                >
                  <RotateCcw size={15} />
                </button>
                <span className="stream-progress">
                  {Math.round((cursor / Math.max(1, source.length)) * 100)}%
                </span>
              </div>
            )}
          </div>
          {inspect && (
            <div className="inspection-panel">
              <div className="inspection-heading">
                <h3>A closer look</h3>
                <span>Select a mark in the preview or a decision below.</span>
                <button
                  className="icon-button"
                  aria-label="Close inspection"
                  onClick={() => {
                    setInspect(false);
                    setSelected(null);
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="decision-list">
                {report.decisions.length ? (
                  report.decisions.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      className={
                        'decision' + (selected === d.block + ':' + d.start ? ' selected' : '')
                      }
                      onClick={() => setSelected(d.block + ':' + d.start)}
                    >
                      <span className="decision-glyph">
                        {d.kind === 'protected' ? (
                          <Terminal size={15} />
                        ) : (
                          <>
                            {d.original}
                            <span>→</span>
                            {d.replacement}
                          </>
                        )}
                      </span>
                      <span>{kindNames[d.kind]}</span>
                    </button>
                  ))
                ) : (
                  <p>No punctuation decisions to make. Your words are ready.</p>
                )}
              </div>
              <div className="decision-detail" aria-live="polite">
                {current ? (
                  <>
                    <strong>{kindNames[current.kind]}.</strong> {current.reason}
                    <code>
                      {current.context.slice(
                        Math.max(0, current.start - 30),
                        Math.min(current.context.length, current.end + 30),
                      )}
                    </code>
                  </>
                ) : (
                  <p>
                    Apostrophes, quotation marks, and primes have different jobs. Curly pays
                    attention to the company they keep.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="principle" aria-label="Our point of view">
          <span className="principle-mark" aria-hidden="true">
            ‘
          </span>
          <p>
            A little care for
            <br />
            <em>the written word.</em>
          </p>
          <div>
            <p>
              An apostrophe is a small thing. So is the difference between something that works and
              something that feels considered.
            </p>
            <p>
              Curly brings that care to the text in your app. It respects code, keeps your words
              intact, and leaves uncertain marks for you to decide.
            </p>
            <a href="#field-notes" className="underlined-link">
              Read our field notes <ArrowUpRight size={15} />
            </a>
          </div>
        </section>

        <section id="install" className="install-section">
          <div className="install-copy">
            <h2>
              Good type.
              <br />
              <em>Small package.</em>
            </h2>
            <p>Add Curly where your app renders prose. Your model, your interface, your words.</p>
            <div className="install-command">
              <code>{installCommand}</code>
              <button
                className="icon-button"
                aria-label="Copy npm install command"
                onClick={() => copy(installCommand, 'install')}
              >
                {copyState === 'install' ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
            <p className="install-footnote">
              {distributionLabel}
              <br />
              Open source · MIT licensed · Runs locally
            </p>
            <a className="underlined-link" href="https://github.com/calebduren/curly">
              Source & documentation <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="code-panel">
            <div className="code-toolbar">
              <label className="visually-hidden" htmlFor="integration">
                Integration
              </label>
              <div className="select-wrap">
                <select
                  id="integration"
                  value={snippetKind}
                  onChange={(e) => setSnippetKind(e.target.value)}
                >
                  {['React Markdown', 'Streamdown', 'Plain text', 'HTML / rehype'].map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </div>
              <button
                className="icon-button"
                aria-label="Copy integration code"
                onClick={() => copy(snippet, 'snippet')}
              >
                {copyState === 'snippet' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <pre>
              <code>{snippet}</code>
            </pre>
            <p>Uses the punctuation options selected above.</p>
          </div>
        </section>

        <section id="field-notes" className="field-notes">
          <div>
            <h2>
              Small marks.
              <br />
              <em>Considered decisions.</em>
            </h2>
            <p>What to know before you put Curly to work.</p>
          </div>
          <div className="notes-list">
            <details open>
              <summary>
                What does Curly change?
                <span>
                  <Plus size={15} aria-hidden="true" />
                </span>
              </summary>
              <p>
                Straight quotation marks become directional quotes. Contractions and possessives get
                proper apostrophes. Enable primes for clear measurement notation, or ellipses for
                three prose dots. Existing curly punctuation is preserved. English conventions are
                supported in V1.
              </p>
            </details>
            <details>
              <summary>
                Will it touch my code?
                <span>
                  <Plus size={15} aria-hidden="true" />
                </span>
              </summary>
              <p>
                The Markdown integration protects code blocks, inline code, HTML markup, and math
                nodes. The HTML integration protects code elements and attributes. Mark exact HTML
                with <code>data-curly="off"</code>, or supply protected ranges to the plain-text
                function. Pass prose to the plain-text API; use the integrations for structured
                content.
              </p>
            </details>
            <details>
              <summary>
                How does streaming work?
                <span>
                  <Plus size={15} aria-hidden="true" />
                </span>
              </summary>
              <p>
                For Markdown, Curly works inside your renderer. The playground uses Streamdown for
                its replay. An unfinished block is provisional and may change as more text arrives.
                The separate prose stream utility buffers paragraphs and emits settled text; it does
                not process JSON, SSE envelopes, or tool calls.
              </p>
            </details>
            <details>
              <summary>
                What happens to my text?
                <span>
                  <Plus size={15} aria-hidden="true" />
                </span>
              </summary>
              <p>
                The playground processes text in your browser. No account, model call, or text
                upload is needed. Copy text takes the currently displayed reading preview; Copy
                original source preserves your Markdown. Remote images in your input are not loaded.
              </p>
            </details>
            <details>
              <summary>
                Why doesn’t it change every mark?
                <span>
                  <Plus size={15} aria-hidden="true" />
                </span>
              </summary>
              <p>
                Typography has ambiguities. An isolated <code>6"</code> could be a measurement or
                the end of a quotation. Curly uses context where it can, and leaves uncertain cases
                alone. “See changes” makes that judgment visible. You can always supply the intended
                Unicode character yourself.
              </p>
            </details>
            <details>
              <summary>
                Can I use just the reading styles?
                <span>
                  <Plus size={15} aria-hidden="true" />
                </span>
              </summary>
              <p>
                Yes. Import <code>cowboy-curly/prose.css</code> and apply <code>curly-prose</code>{' '}
                to a prose container. It adds line length, paragraph rhythm, heading balance, and
                sensible overflow. It inherits your fonts and colors, and works independently of
                punctuation conversion.
              </p>
            </details>
          </div>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#top">
          Curly<span aria-hidden="true">”</span>
        </a>
        <p>
          Made with a little conviction.
          <br />
          <a href="https://cowboy.is">By Cowboy.</a>
        </p>
        <div>
          <a href="https://github.com/calebduren/curly">
            GitHub <ExternalLink size={13} />
          </a>
          <a href="https://github.com/calebduren/curly/releases">
            Releases <ExternalLink size={13} />
          </a>
          <span>© {new Date().getFullYear()} Caleb Duren</span>
        </div>
      </footer>
      <div className={'toast' + (notice ? ' visible' : '')} role="status">
        {notice}
      </div>
    </>
  );
}
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
