import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import { Streamdown, defaultRemarkPlugins } from 'streamdown';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { expect, it } from 'vitest';
import remarkCurly from '../packages/curly/src/remark';
import rehypeCurly from '../packages/curly/src/rehype';

const source =
  '"One **good** day."\n\nDon\'t change `"my code"`.\n\n```js\nconst x = "hello";\n```';
it('renders React Markdown with cross-node quotes and literal code', () => {
  const html = renderToStaticMarkup(<Markdown remarkPlugins={[remarkCurly]}>{source}</Markdown>);
  expect(html).toContain('“One <strong>good</strong> day.”');
  expect(html).toContain('Don’t change <code>&quot;my code&quot;</code>');
  expect(html).toContain('const x = &quot;hello&quot;;');
  expect(html).not.toContain('<mark');
});
it('renders opt-in diagnostics as semantic marks with original offsets', () => {
  const html = renderToStaticMarkup(
    <Markdown remarkPlugins={[[remarkCurly, { annotate: true }]]}>{'"Hello."'}</Markdown>,
  );
  expect(html).toContain('<mark data-curly-id="0:0"');
  expect(html).toContain('data-curly-kind="closing-quote">”</mark>');
  expect(html).toContain('Hello.');
});
it('works with Streamdown defaults and keeps rendered code literal', () => {
  const html = renderToStaticMarkup(
    <Streamdown mode="static" remarkPlugins={[...Object.values(defaultRemarkPlugins), remarkCurly]}>
      {source}
    </Streamdown>,
  );
  expect(html).toMatch(/“One <[^>]+>good<\/[^>]+> day.”/);
  expect(html).toContain('Don’t change');
  expect(html).toContain('&quot;my code&quot;');
  expect(html).not.toContain('const x = “');
});
it('supports rehype annotations without changing attributes or editable text', async () => {
  const html = String(
    await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeCurly, { annotate: true })
      .use(rehypeStringify)
      .process(
        '<p>"Hello."</p><div contenteditable="true">"Edit me"</div><p data-curly="off">"Keep"</p>',
      ),
  );
  expect(html).toContain('<mark data-curly-id="0:0"');
  expect(html).toContain('<div contenteditable="true">"Edit me"</div>');
  expect(html).toContain('<p data-curly="off">"Keep"</p>');
});
