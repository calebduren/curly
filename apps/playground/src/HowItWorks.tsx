import { ArrowDown, ArrowUpRight } from 'lucide-react';

const examples = [
  {
    before: '"Don\'t overlook it," she said.',
    after: '“Don’t overlook it,” she said.',
    reason: 'Paired quotation marks and a contraction.',
  },
  {
    before: '"Model 6"',
    after: '“Model 6”',
    reason: 'An opening quote gives the final mark a job.',
  },
  { before: '6" wide', after: '6″ wide', reason: 'Measurement context, with primes enabled.' },
  { before: '6"', after: '6"', reason: 'Too little context. Left exactly as written.' },
  {
    before: 'Wait... really?',
    after: 'Wait… really?',
    reason: 'Three prose dots, with ellipses enabled.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works editorial" aria-labelledby="how-title">
      <p className="section-label">How it works</p>
      <h2 id="how-title">A little context goes a long way.</h2>
      <p className="section-lead">
        Curly is a small set of English punctuation rules. Put it between the prose your app
        receives and the prose it renders. The words stay yours; the marks get a little attention.
      </p>

      <ol className="process-steps">
        <li>
          <h3>Start with the words meant to be read.</h3>
          <p>
            For Markdown or HTML, an adapter walks the parsed text nodes and skips protected
            content. For a plain string of prose, call <code>smarten()</code> directly. Your AI
            provider and frontend framework can stay the same.
          </p>
        </li>
        <li>
          <h3>Read the company each mark keeps.</h3>
          <p>
            Curly looks at neighboring characters, contractions, measurement cues, and unclosed
            quotes in the paragraph. Quote context survives inline emphasis and links. Existing
            curly punctuation stays as written; unresolved marks stay literal.
          </p>
        </li>
        <li>
          <h3>Render the result. Inspect it if you like.</h3>
          <p>
            You get formatted text without a model call or network request. Use{' '}
            <code>analyze()</code> to get each decision and its reason, with offsets into your
            original string. The playground’s “Highlight changes” switch lets you explore those
            decisions.
          </p>
        </li>
      </ol>

      <div className="worked-examples">
        <h3>A few considered decisions</h3>
        <p>Quotes and apostrophes are on by default. Primes and ellipses are opt-in.</p>
        <div
          className="example-table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Punctuation examples"
        >
          <table className="example-table">
            <thead>
              <tr>
                <th scope="col">Before</th>
                <th scope="col">With Curly</th>
              </tr>
            </thead>
            {examples.map((example) => (
              <tbody key={example.before}>
                <tr>
                  <td>
                    <code>{example.before}</code>
                  </td>
                  <td>{example.after}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="example-reason">
                    {example.reason}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
        <p className="example-footnote">
          Yes, the opening quote matters: <code>{'"Model 6"'}</code> gives Curly enough context to
          close a quotation. A bare <code>{'6"'}</code> doesn’t. Quote balance starts fresh at each
          paragraph, so an opener much earlier in a document won’t silently decide a later mark.
        </p>
      </div>

      <div className="integration-guide">
        <h3>Choose the right place to plug it in.</h3>
        <dl>
          <div>
            <dt>
              Markdown & AI chat <code>cowboy-curly/remark</code>
            </dt>
            <dd>
              Add a plugin to React Markdown, Streamdown, or a remark pipeline. Fenced and inline
              code, raw HTML, and MDX expressions are protected. Math is protected when your parser
              produces math nodes, for example with <code>remark-math</code>.
            </dd>
          </div>
          <div>
            <dt>
              Rendered HTML <code>cowboy-curly/rehype</code>
            </dt>
            <dd>
              Transform text nodes in a rehype pipeline. Attributes, code, scripts, styles, and
              editable regions stay untouched. Add <code>data-curly="off"</code> to skip a subtree.
              Keep your app’s existing HTML sanitization in place.
            </dd>
          </div>
          <div>
            <dt>
              Plain prose <code>cowboy-curly</code>
            </dt>
            <dd>
              Call <code>smarten(text, options)</code> wherever you format a string for display.
              Supply <code>protectedRanges</code> for exact spans. This function assumes prose; it
              doesn’t parse raw Markdown, HTML, JSON, or code.
            </dd>
          </div>
        </dl>
        <a className="underlined-link" href="#install">
          See the integration examples <ArrowDown size={15} />
        </a>
      </div>

      <div className="streaming-guide">
        <h3>Streaming has two useful rhythms.</h3>
        <p>
          <strong>In a Markdown renderer,</strong> Curly formats the parsed prose as chunks arrive.
          The unfinished block is provisional: a quote can change direction as more context appears.
          Replay the playground to see this with Streamdown.
        </p>
        <p>
          <strong>For committed plain text,</strong> <code>createQuoteStream()</code> buffers a
          paragraph until a blank line or the end of the stream. Completed output matches formatting
          the whole text at once. You can preview the pending paragraph, but a long paragraph means
          more buffering and a longer wait before it’s committed.
        </p>
        <p>
          Let your AI SDK decode the response first. Feed Curly the prose, keeping JSON, tool calls,
          and transport events outside that boundary.
        </p>
      </div>

      <aside className="fit-note" aria-labelledby="fit-title">
        <h3 id="fit-title">A good fit for prose. A few limits to know.</h3>
        <p>
          Use it for English chat responses, articles, and other reading surfaces. It runs locally,
          uses deterministic rules, and adds no runtime dependencies to the core package. The
          adapters use the Markdown or HTML parser already in your app.
        </p>
        <p>
          The recorded bundles are 2.3 kB gzipped for the core and about 3.5 kB for either adapter,
          excluding your renderer. The performance report includes the inputs, hardware, and method
          so you can judge the measurements or reproduce them in your own environment.
        </p>
        <p>
          It won’t rewrite sentences, change dashes or spacing, repair existing curly punctuation,
          or choose quote conventions for other languages. Unusual elisions, numeric quotations, and
          quotations spanning paragraphs can still need editorial judgment. It also doesn’t
          intercept typing, manage editor selection, or handle undo.
        </p>
        <a
          href="https://github.com/calebduren/curly/tree/main/benchmarks"
          className="underlined-link"
        >
          Read the benchmarks & methodology <ArrowUpRight size={15} />
        </a>
      </aside>
    </section>
  );
}
