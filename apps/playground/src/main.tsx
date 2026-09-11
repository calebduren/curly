import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowDownToLine, ArrowUpRight, Copy } from 'lucide-react';
import { principles } from '@calebduren/typograph/principles';
import { TypographyLab, type SpecimenTopic } from './TypographyLab';
import { PunctuationLab } from './PunctuationLab';
import { Disclosure } from './Controls';
import { installCommand, packageFilename } from './distribution';
import { integrationSnippet } from './model';
import './fonts.css';
import './styles.css';

const topics: { id: SpecimenTopic; title: string }[] = [
  { id: 'rhythm', title: 'Rhythm & measure' },
  { id: 'hierarchy', title: 'Hierarchy' },
  { id: 'punctuation', title: 'Punctuation' },
  { id: 'numbers', title: 'Numbers' },
];

function Mark() {
  return (
    <svg className="brand-symbol" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="currentColor" d="M2 4h23v6H2zm9 8h7v16h-7z" />
      <circle cx="26" cy="24" r="4" fill="var(--gray)" />
    </svg>
  );
}

function App() {
  const [topic, setTopic] = useState<SpecimenTopic>('rhythm');
  const [copied, setCopied] = useState('');
  const [notice, setNotice] = useState('');
  const [integration, setIntegration] = useState('React Markdown');
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => {
      setNotice('');
      setCopied('');
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setNotice('Copied to your clipboard.');
    } catch {
      setNotice('Clipboard access is unavailable. Select the text and copy it manually.');
    }
  }

  return (
    <>
      <a className="skip-link" href="#specimen">
        Skip to specimen
      </a>
      <header className="site-header" id="top">
        <a className="wordmark" href="#top" aria-label="Typograph home">
          <Mark />
          <span>typograph</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#specimen">Specimen</a>
          <a href="#principles">Principles</a>
          <a href="#skill">Agent skill</a>
          <a className="nav-download" href="#get">
            Get Typograph <ArrowDown size={15} />
          </a>
        </nav>
      </header>
      <main>
        <section className="intro" aria-labelledby="intro-title">
          <h1 id="intro-title">
            Type with <span>intention.</span>
          </h1>
          <div className="intro-aside">
            <p>
              Good typography is a relationship between letters, words, and the space around them.
            </p>
            <p className="muted">
              Typograph brings that care to the web, with practical tools and principles for you and
              your agents.
            </p>
            <a className="inline-link" href="#specimen">
              Find your rhythm <ArrowDown size={17} />
            </a>
          </div>
        </section>

        <section
          className="specimen-section"
          id="specimen"
          aria-label="Interactive typography specimen"
        >
          <div className="specimen-nav">
            <div className="topic-switch" role="group" aria-label="Choose a typography specimen">
              {topics.map(({ id, title }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={topic === id}
                  onClick={() => setTopic(id)}
                >
                  {title}
                </button>
              ))}
            </div>
            <span className="specimen-hint">A study in the details</span>
          </div>
          <div hidden={topic === 'punctuation'}>
            <TypographyLab topic={topic === 'punctuation' ? 'rhythm' : topic} />
          </div>
          <div hidden={topic !== 'punctuation'}>
            <PunctuationLab active={topic === 'punctuation'} />
          </div>
        </section>

        <section
          className="principles-section section-grid"
          id="principles"
          aria-labelledby="principles-title"
        >
          <div className="section-intro">
            <h2 id="principles-title">
              A reason for <br />
              every rule.
            </h2>
            <p>Typography becomes easier to judge when you know what to look for.</p>
            <p className="muted">
              These principles connect an intention to something you can observe, change, and check.
            </p>
          </div>
          <div className="principle-list">
            {principles.map((principle) => (
              <Disclosure title={principle.title} key={principle.id}>
                <p className="principle-summary">{principle.summary}</p>
                <dl className="principle-details">
                  <div>
                    <dt>Look for</dt>
                    <dd>{principle.observe}</dd>
                  </div>
                  <div>
                    <dt>Make a decision</dt>
                    <dd>{principle.action}</dd>
                  </div>
                  <div>
                    <dt>Check the result</dt>
                    <dd>{principle.verify}</dd>
                  </div>
                  <div>
                    <dt>Use judgment</dt>
                    <dd>{principle.exception}</dd>
                  </div>
                </dl>
                <div className="principle-sources">
                  <span>{principle.kind}</span>
                  {principle.sources.map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                      <ArrowUpRight size={13} />
                    </a>
                  ))}
                </div>
              </Disclosure>
            ))}
          </div>
        </section>

        <section className="skill-section section-grid" id="skill" aria-labelledby="skill-title">
          <div className="section-intro">
            <h2 id="skill-title">
              Give your agent <br />
              an eye for type.
            </h2>
            <p>
              The same principles, written as a practical skill. It starts with your content, your
              fonts, and the way people read.
            </p>
            <a className="button primary-button" href="./downloads/typograph-skill.tar.gz" download>
              Download the skill <ArrowDownToLine size={16} />
            </a>
            <a
              className="inline-link quiet-link"
              href="./skill/SKILL.md"
              target="_blank"
              rel="noreferrer"
            >
              Read the instructions <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="skill-preview">
            <div className="skill-prompt">
              <span>Try asking</span>
              <p>
                “Use Typograph to improve the typography on this page. Keep our fonts. Explain the
                changes.”
              </p>
              <button
                className="text-button"
                onClick={() =>
                  copy(
                    'Use $typograph to improve the typography on this page. Keep our fonts. Explain the changes.',
                    'prompt',
                  )
                }
              >
                <Copy size={15} />
                {copied === 'prompt' ? 'Copied' : 'Copy prompt'}
              </button>
            </div>
            <ol className="skill-sequence">
              <li>
                <strong>Understand the context.</strong>
                <span>Reading, scanning, comparing, or watching text arrive.</span>
              </li>
              <li>
                <strong>Make the relationships deliberate.</strong>
                <span>Choose a hierarchy. Connect the size, measure, and leading.</span>
              </li>
              <li>
                <strong>Look at the result.</strong>
                <span>Inspect real content, fallback fonts, narrow screens, and larger text.</span>
              </li>
            </ol>
            <p className="skill-install">
              Extract the archive into your project’s <code>.agents/skills/</code> directory. The{' '}
              <code>typograph</code> folder includes the skill and its references.
            </p>
          </div>
        </section>

        <section className="get-section section-grid" id="get" aria-labelledby="get-title">
          <div className="section-intro">
            <h2 id="get-title">
              A place in <br />
              your toolkit.
            </h2>
            <p>
              Use the reading styles, the punctuation engine, or the skill. Each works
              independently.
            </p>
            <p className="muted">
              This preview is distributed as an installable archive. Download it, then run the
              command from the same directory.
            </p>
            <a className="button primary-button" href={`./downloads/${packageFilename}`} download>
              Download the package <ArrowDownToLine size={16} />
            </a>
          </div>
          <div className="integration-panel">
            <div className="install-command">
              <code>{installCommand}</code>
              <button
                className="icon-button"
                aria-label="Copy install command"
                onClick={() => copy(installCommand, 'install')}
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="integration-toolbar">
              <label htmlFor="integration">Use it with</label>
              <select
                id="integration"
                value={integration}
                onChange={(event) => setIntegration(event.target.value)}
              >
                <option>Reading CSS</option>
                <option>React Markdown</option>
                <option>Streamdown</option>
                <option>Plain text</option>
                <option>HTML / rehype</option>
              </select>
              <button
                className="text-button"
                onClick={() =>
                  copy(
                    integration === 'Reading CSS'
                      ? cssExample
                      : integrationSnippet(integration, {}),
                    'code',
                  )
                }
              >
                <Copy size={15} />
                {copied === 'code' ? 'Copied' : 'Copy code'}
              </button>
            </div>
            <pre className="integration-code">
              <code>
                {integration === 'Reading CSS' ? cssExample : integrationSnippet(integration, {})}
              </code>
            </pre>
            <p className="integration-note">
              The punctuation engine runs locally, with no runtime dependencies. The skill works
              with your existing agent.
            </p>
          </div>
        </section>
        <section className="colophon section-grid" aria-labelledby="colophon-title">
          <div className="section-intro">
            <h2 id="colophon-title">
              Built on a <br />
              long tradition.
            </h2>
          </div>
          <div>
            <p>
              Informed by Robert Bringhurst’s <cite>The Elements of Typographic Style</cite>,
              Richard Rutter’s adaptation for the web, and Impeccable’s approach to typography. The
              reading CSS builds on shadcn Typeset.
            </p>
            <div className="source-links">
              <a href="https://webtypography.net/" target="_blank" rel="noreferrer">
                Web typography <ArrowUpRight size={14} />
              </a>
              <a href="https://impeccable.style/docs/typeset/" target="_blank" rel="noreferrer">
                Impeccable <ArrowUpRight size={14} />
              </a>
              <a href="https://ui.shadcn.com/docs/typeset" target="_blank" rel="noreferrer">
                shadcn Typeset <ArrowUpRight size={14} />
              </a>
            </div>
            <p className="colophon-note">
              English punctuation conventions. Contextual typography guidance. Every automatic
              change can be inspected.
            </p>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <a className="wordmark" href="#top">
          <Mark />
          <span>typograph</span>
        </a>
        <span>Consider the details.</span>
        <div className="footer-links">
          <a href="https://github.com/calebduren/typograph" target="_blank" rel="noreferrer">
            Source <ArrowUpRight size={14} />
          </a>
          <a href="https://calebduren.com" target="_blank" rel="noreferrer">
            Caleb Durenberger <ArrowUpRight size={14} />
          </a>
        </div>
        <p className="font-credit">
          Set in{' '}
          <a href="https://displaay.net/typeface/serrif" target="_blank" rel="noreferrer">
            Serrif
          </a>{' '}
          and{' '}
          <a href="https://displaay.net/typeface/saans" target="_blank" rel="noreferrer">
            Saans
          </a>{' '}
          by{' '}
          <a href="https://displaay.net/" target="_blank" rel="noreferrer">
            Displaay Type Foundry
          </a>
          .
        </p>
      </footer>
      <div className="toast" role="status" aria-live="polite" data-visible={!!notice}>
        {notice}
      </div>
    </>
  );
}

const cssExample = `import '@calebduren/typograph/typography.css';\n\n<article className="typeset typeset-article type-measure">\n  {children}\n</article>\n\n/* Your fonts. A considered starting rhythm. */\n.typeset-article {\n  --typeset-font-body: var(--font-body);\n  --typeset-size: 1.125rem;\n  --typeset-leading: 1.666667;\n  --typograph-measure: 64ch;\n}`;

createRoot(document.getElementById('root')!).render(<App />);
