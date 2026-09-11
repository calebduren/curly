import React, {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkTypograph, { type TreeOptions } from '@calebduren/typograph/remark';
import type { TypographOptions } from '@calebduren/typograph';
import { ChevronDown, Copy, Pause, Play, RotateCcw, StepForward, Terminal, X } from 'lucide-react';
import { samples } from './samples';
import { inspectMarkdown } from './model';
import { ReplayBoundary } from './ReplayBoundary';
import { TaskStatus, Toggle } from './Controls';

const StreamingSpecimen = lazy(() => import('./StreamingSpecimen'));
const defaults = { primes: false, ellipses: false };
const chunkSizes = [1, 3, 2, 4, 1, 2, 3, 2];
const kindNames: Record<string, string> = {
  'opening-quote': 'Opening quote',
  'closing-quote': 'Closing quote',
  apostrophe: 'Apostrophe',
  prime: 'Prime',
  ellipsis: 'Ellipsis',
  protected: 'Kept exact',
  ambiguous: 'Left for you',
};

const InspectionContext = createContext<{
  inspect: boolean;
  selected: string | null;
  select: (id: string) => void;
}>({ inspect: false, selected: null, select: () => {} });

function ChangeMark({
  node,
  children,
}: React.ComponentProps<'mark'> & { node?: { properties?: Record<string, unknown> } }) {
  const { inspect, selected, select } = useContext(InspectionContext);
  const id = String(node?.properties?.dataTypographId ?? '');
  const reason = String(node?.properties?.dataTypographReason ?? 'Punctuation change');
  return (
    <span
      className={'change-mark' + (selected === id ? ' selected' : '')}
      role={inspect ? 'button' : undefined}
      tabIndex={inspect ? 0 : undefined}
      aria-label={inspect ? reason : undefined}
      aria-pressed={inspect ? selected === id : undefined}
      onClick={() => {
        if (inspect) select(id);
      }}
      onKeyDown={(event) => {
        if (inspect && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          select(id);
        }
      }}
    >
      {children}
    </span>
  );
}

function ProseLink({ children, node, ...props }: React.ComponentProps<'a'> & { node?: unknown }) {
  const { inspect } = useContext(InspectionContext);
  return inspect ? (
    <span className="inspection-link">{children}</span>
  ) : (
    <a {...props} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

const markComponents = {
  mark: ChangeMark,
  img: ({ alt }: React.ComponentProps<'img'>) => (
    <span className="omitted-image">[Image: {alt ?? 'remote media'}]</span>
  ),
  a: ProseLink,
  input: TaskStatus,
};

export function PunctuationLab({ active }: { active: boolean }) {
  const [source, setSource] = useState(samples[0].source);
  const [sample, setSample] = useState('letter');
  const [options, setOptions] = useState<TypographOptions>(defaults);
  const [formatted, setFormatted] = useState(true);
  const [inspect, setInspect] = useState(false);
  const [reading, setReading] = useState(true);
  const [typeface, setTypeface] = useState<'serif' | 'sans'>('serif');
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [speed, setSpeed] = useState('natural');
  const [notice, setNotice] = useState('');
  const [copyState, setCopyState] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const shown = streaming ? source.slice(0, cursor) : source;
  const report = useMemo(() => inspectMarkdown(shown, options), [shown, options]);
  const changes = report.decisions.filter((d) => d.original !== d.replacement);
  const protectedCount = report.decisions.filter((d) => d.kind === 'protected').length;
  const current = report.decisions.find((d) => d.block + ':' + d.start === selected);
  useEffect(() => {
    if (!active) setPlaying(false);
  }, [active]);
  useEffect(() => {
    if (!playing || !active) return;
    let chunk = 0;
    const timer = window.setInterval(
      () =>
        setCursor((n) =>
          Math.min(
            source.length,
            n + (speed === 'slow' ? 1 : chunkSizes[chunk++ % chunkSizes.length]),
          ),
        ),
      speed === 'slow' ? 110 : 90,
    );
    return () => window.clearInterval(timer);
  }, [playing, source, speed, active]);
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

  return (
    <section id="punctuation-lab" className="desk" aria-label="Punctuation playground">
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
      </div>
      <div className="workspace">
        <div className="source-pane">
          <div className="pane-toolbar">
            <label htmlFor="source">Your words</label>
            <span>Markdown welcome</span>
          </div>
          <textarea
            id="source"
            value={source}
            onChange={(e) => updateSource(e.target.value)}
            spellCheck={false}
            maxLength={100000}
            placeholder={'Put your words here. "Quotes", apostrophes, code...'}
            aria-describedby="source-help"
          />
          <div className="source-footer">
            <span id="source-help">
              Your text is processed here in your browser. It isn’t uploaded.
            </span>
            <span>{source.length.toLocaleString()} / 100,000</span>
          </div>
        </div>
        <div className="output-pane">
          <div className="pane-toolbar output-toolbar">
            <div className="preview-toggles">
              <div
                className="segmented preview-punctuation"
                role="group"
                aria-label="Preview punctuation"
              >
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
                  Formatted
                </button>
              </div>
              <div className="segmented typeface-switch" role="group" aria-label="Reading typeface">
                <button
                  type="button"
                  aria-pressed={typeface === 'serif'}
                  onClick={() => setTypeface('serif')}
                >
                  Serif
                </button>
                <button
                  type="button"
                  aria-pressed={typeface === 'sans'}
                  onClick={() => setTypeface('sans')}
                >
                  Sans serif
                </button>
              </div>
            </div>
            <Toggle
              className="highlight-toggle"
              label="Highlight changes"
              checked={inspect}
              controls="inspection"
              disabled={!formatted || streaming}
              onChange={(value) => {
                setInspect(value);
                setSelected(null);
              }}
            />
          </div>
          <div className={'specimen-wrap' + (reading ? ' reading-on' : '')}>
            <div
              ref={outputRef}
              data-typeface={typeface}
              className={
                'specimen' +
                (reading ? ' typeset typeset-docs' : '') +
                (inspect ? ' inspecting' : '')
              }
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
                <InspectionContext.Provider value={{ inspect, selected, select: setSelected }}>
                  <Markdown
                    remarkPlugins={[
                      remarkGfm,
                      remarkMath,
                      ...(formatted
                        ? [
                            [remarkTypograph, { ...options, annotate: true }] as [
                              typeof remarkTypograph,
                              TreeOptions,
                            ],
                          ]
                        : []),
                    ]}
                    components={markComponents}
                  >
                    {shown}
                  </Markdown>
                </InspectionContext.Provider>
              )}
            </div>
          </div>
          <div className="output-footer">
            <span>
              {formatted ? (
                <>
                  <strong>{changes.length}</strong>{' '}
                  {changes.length === 1 ? 'punctuation change' : 'punctuation changes'}
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
                <Copy size={15} />
                {copyState === 'output' ? 'Copied' : 'Copy text'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="playground-controls">
        <div className="rule-bar" role="group" aria-label="Optional formatting">
          <Toggle
            label="Primes"
            checked={!!options.primes}
            onChange={(value) => {
              setOptions({ ...options, primes: value });
              setSelected(null);
            }}
          />
          <Toggle
            label="Ellipses"
            checked={!!options.ellipses}
            onChange={(value) => {
              setOptions({ ...options, ellipses: value });
              setSelected(null);
            }}
          />
          <Toggle label="Reading styles" checked={reading} onChange={setReading} />
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
            <span className="replay-explanation">Watch the preview arrive a little at a time.</span>
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
      </div>
      <div
        className="inspection-reveal"
        id="inspection"
        data-open={inspect}
        aria-hidden={!inspect}
        inert={!inspect}
      >
        <div className="inspection-clip">
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
                  Apostrophes, quotation marks, and primes have different jobs. Typograph pays
                  attention to the company they keep.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="live-note" role="status">
        {notice}
      </p>
    </section>
  );
}
