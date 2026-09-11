import { useEffect, useState, type CSSProperties } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import {
  createTypeset,
  typesets,
  type TypesetName,
  type TypesetOptions,
} from '@calebduren/typograph/typography';
import { Toggle } from './Controls';

const brandFonts = import.meta.env.VITE_TYPOGRAPH_BRAND_FONTS === 'true';
const numberFace = brandFonts ? 'Saans' : 'Source Serif 4';

export type SpecimenTopic = 'rhythm' | 'hierarchy' | 'punctuation' | 'numbers';

function Range({
  id,
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="range-control">
      <div>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{display}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function TypographyLab({ topic }: { topic: Exclude<SpecimenTopic, 'punctuation'> }) {
  const [preset, setPreset] = useState<TypesetName>('article');
  const [settings, setSettings] = useState<TypesetOptions>({ ...typesets.article });
  const [family, setFamily] = useState<'serif' | 'sans'>('serif');
  const [guide, setGuide] = useState(false);
  const [hierarchy, setHierarchy] = useState(true);
  const [hanging, setHanging] = useState(false);
  const [tabular, setTabular] = useState(true);
  const [alternate, setAlternate] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const hangingSupported =
    typeof CSS !== 'undefined' && CSS.supports('hanging-punctuation', 'first');
  const leading = Math.round(settings.size * settings.leading);
  const style = createTypeset(settings, preset);
  const recipeFont =
    topic === 'numbers'
      ? 'var(--font-numbers)'
      : `var(--font-${family === 'serif' ? 'serif' : 'sans'})`;
  const recipeUtilities =
    topic === 'numbers'
      ? tabular
        ? ' type-numbers'
        : ' type-proportional'
      : hanging
        ? ' type-hang'
        : '';
  const recipe = `/* Import @calebduren/typograph/typography.css first. */\n.my-typeset {\n${Object.entries(
    style,
  )
    .map(([key, value]) => `  ${key}: ${value};`)
    .join(
      '\n',
    )}\n  --typeset-font-body: ${recipeFont};\n  --typeset-font-heading: ${recipeFont};\n  font-synthesis: none;\n}\n\n/* Add typeset my-typeset type-measure${recipeUtilities} to the container. */${topic === 'numbers' ? `\n/* Load ${numberFace} yourself, or choose a font with real pnum/tnum features. */` : ''}${topic === 'hierarchy' && !hierarchy ? '\n/* Flat hierarchy is a comparison mode; the recipe restores the reading hierarchy. */' : ''}`;
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => {
      setMessage('');
      setCopied(false);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [message]);
  function choosePreset(value: TypesetName) {
    setPreset(value);
    setSettings({ ...typesets[value] });
  }
  function reset() {
    choosePreset('article');
    setFamily('serif');
    setGuide(false);
    setHanging(false);
    setHierarchy(true);
    setTabular(true);
    setAlternate(false);
  }
  async function copyRecipe() {
    try {
      await navigator.clipboard.writeText(recipe);
      setCopied(true);
      setMessage('Recipe copied.');
    } catch {
      setMessage('Clipboard unavailable. Open the CSS recipe below and copy it manually.');
    }
  }
  return (
    <div className="typography-lab">
      <aside className="type-controls" aria-label="Typography controls">
        <div className="control-heading">
          <h2>
            {topic === 'numbers'
              ? 'Numbers in context'
              : topic === 'hierarchy'
                ? 'Make it readable'
                : 'Set the rhythm'}
          </h2>
          <button className="icon-button" aria-label="Reset typography settings" onClick={reset}>
            <RotateCcw size={15} />
          </button>
        </div>
        <div className="select-control">
          <label htmlFor="context">Reading context</label>
          <select
            id="context"
            value={preset}
            onChange={(event) => choosePreset(event.target.value as TypesetName)}
          >
            <option value="article">Article</option>
            <option value="docs">Documentation</option>
            <option value="chat">Conversation</option>
          </select>
        </div>
        {topic !== 'numbers' && (
          <div className="select-control">
            <label htmlFor="typeface">Typeface</label>
            <select
              id="typeface"
              value={family}
              onChange={(event) => setFamily(event.target.value as 'serif' | 'sans')}
            >
              <option value="serif">{brandFonts ? 'Serrif' : 'Fraunces'} · Serif</option>
              <option value="sans">{brandFonts ? 'Saans' : 'DM Sans'} · Sans serif</option>
            </select>
          </div>
        )}
        <Range
          id="type-size"
          label="Type size"
          value={settings.size}
          display={`${settings.size}px`}
          min={14}
          max={24}
          onChange={(size) =>
            setSettings({ ...settings, size, leading: Math.max(leading, size + 4) / size })
          }
        />
        <Range
          id="leading"
          label="Leading"
          value={leading}
          display={`${leading}px`}
          min={Math.max(18, settings.size + 2)}
          max={44}
          onChange={(line) => setSettings({ ...settings, leading: line / settings.size })}
        />
        {topic !== 'numbers' && (
          <>
            <Range
              id="measure"
              label="Measure"
              value={settings.measure}
              display={`${settings.measure}ch`}
              min={40}
              max={76}
              onChange={(measure) => setSettings({ ...settings, measure })}
            />
            <Range
              id="paragraph"
              label="Paragraph space"
              value={settings.paragraph}
              display={`${settings.paragraph} ${settings.paragraph === 1 ? 'line' : 'lines'}`}
              min={0.5}
              max={1.5}
              step={0.25}
              onChange={(paragraph) => setSettings({ ...settings, paragraph })}
            />
          </>
        )}
        <div className="specimen-options">
          {topic === 'rhythm' && (
            <>
              <Toggle label="Show rhythm guide" checked={guide} onChange={setGuide} />
              <Toggle
                label="Hang opening punctuation"
                checked={hanging}
                onChange={setHanging}
                disabled={!hangingSupported}
              />
              <p className="control-note">
                {hangingSupported
                  ? 'Your browser accepts hanging punctuation. Check the opening quote in the specimen.'
                  : 'Hanging punctuation is unavailable in this browser. Quotes keep their normal position.'}
              </p>
            </>
          )}
          {topic === 'hierarchy' && (
            <>
              <Toggle label="Apply hierarchy" checked={hierarchy} onChange={setHierarchy} />
              <p className="control-note">
                The words and typeface stay the same. Compare how size, weight, and space guide your
                eye.
              </p>
            </>
          )}
          {topic === 'numbers' && (
            <>
              <Toggle label="Use tabular numerals" checked={tabular} onChange={setTabular} />
              <button className="text-button" onClick={() => setAlternate(!alternate)}>
                <RotateCcw size={14} />
                Change sample values
              </button>
              <p className="control-note">
                Set in {numberFace}, with verified tabular and proportional numerals. Tabular digits
                share a width; longer numbers still need more space.
              </p>
            </>
          )}
        </div>
        <button className="button copy-recipe" onClick={copyRecipe}>
          <Copy size={15} />
          {copied ? 'Copied' : 'Copy CSS recipe'}
        </button>
        <p className="control-note">
          Sizes are shown at the default root size. The exported recipe uses scalable rem units.
        </p>
        <div className="control-status" role="status">
          {message}
        </div>
      </aside>
      <div className="specimen-stage">
        <div className="stage-meta">
          <span>
            {topic === 'numbers'
              ? 'Sample invoice'
              : topic === 'hierarchy'
                ? 'A study in hierarchy'
                : 'A reading specimen'}
          </span>
          <span className="type-numbers">
            {settings.size} / {leading}
            <span className="meta-divider">·</span>
            {settings.measure}ch
          </span>
        </div>
        <div
          className={`specimen-paper${guide && topic === 'rhythm' ? ' guide-on' : ''}`}
          style={{ ...style, '--guide-step': `${leading / 16}rem` } as CSSProperties}
        >
          {topic === 'numbers' ? (
            <div
              className={`number-specimen typeset type-measure${tabular ? ' type-numbers' : ' type-proportional'}`}
              style={style as CSSProperties}
              data-typeface="numbers"
            >
              <h3>
                The numbers
                <br />
                tell a story.
              </h3>
              <p>
                Give quantities a consistent place on the page. Compare the columns, then change the
                values.
              </p>
              <table>
                <caption>Illustrative values, shown in US dollars.</caption>
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Type studies</th>
                    <td>{alternate ? '8,888.00' : '1,111.00'}</td>
                  </tr>
                  <tr>
                    <th scope="row">Printed specimens</th>
                    <td>{alternate ? '1,111.00' : '8,888.00'}</td>
                  </tr>
                  <tr>
                    <th scope="row">Reference copies</th>
                    <td>{alternate ? '788.00' : '112.00'}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row">Total</th>
                    <td>{alternate ? '10,787.00' : '10,111.00'}</td>
                  </tr>
                </tfoot>
              </table>
              <div className="digit-comparison" aria-label="Numeral width comparison">
                <span>111111</span>
                <span>888888</span>
              </div>
            </div>
          ) : (
            <article
              className={`reading-copy typeset type-measure${hanging ? ' type-hang' : ''}${topic === 'hierarchy' && !hierarchy ? ' hierarchy-flat' : ''}`}
              style={style as CSSProperties}
              data-typeface={family}
              aria-label="Live reading specimen"
            >
              <h3>
                {topic === 'hierarchy'
                  ? 'The shape of a thought.'
                  : 'Space is part of\nthe sentence.'}
              </h3>
              <p className="specimen-lead">
                “A page begins to feel considered when its parts begin to agree.”
              </p>
              <p>
                The face gives the words a voice. The measure gives them room. Leading lets one line
                follow another without losing its place. Each decision changes the way the others
                feel.
              </p>
              <p>
                Typography lives in those relationships. A little more space can separate two ideas;
                a little less can bring a heading and its passage together. The intervals make the
                structure visible.
              </p>
              <h4>Find a comfortable pace.</h4>
              <p>
                Start with the words people will actually read. Adjust the measure and leading
                together, then look again. A useful rhythm leaves enough room for the content to
                change.
              </p>
              {preset === 'docs' && (
                <>
                  <h4>Keep the implementation small.</h4>
                  <p>
                    Use a shared rhythm in your stylesheet and apply it where prose is rendered.
                  </p>
                  <pre>
                    <code>{'.typeset {\n  --typeset-leading: 1.625;\n}'}</code>
                  </pre>
                </>
              )}
              <p className="specimen-caption">
                An original specimen for Typograph. Change one relationship and see what follows.
              </p>
            </article>
          )}
        </div>
        <div className="stage-foot">
          <span>
            {guide && topic === 'rhythm'
              ? 'Each guide interval equals one line of leading. It is not an exact baseline grid.'
              : 'The words stay the same. The relationships change.'}
          </span>
          <details className="recipe-disclosure">
            <summary>View CSS recipe</summary>
            <pre>
              <code>{recipe}</code>
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
