import { expect, it } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import remarkTypograph, { transformTree, type TextTree } from '../packages/typograph/src/remark';
import rehypeTypograph from '../packages/typograph/src/rehype';

function parse(source: string) {
  return unified().use(remarkParse).use(remarkMath).parse(source) as TextTree;
}
function textOf(tree: TextTree): string {
  return tree.value ?? tree.children?.map(textOf).join('') ?? '';
}
it('retains quote context across emphasis and links', () => {
  const tree = parse('"One **good** [day](https://example.com/it\'s-here)."');
  transformTree(tree, 'markdown');
  expect(textOf(tree)).toBe('“One good day.”');
  expect(JSON.stringify(tree)).toContain("https://example.com/it's-here");
});
it('handles a contraction across inline nodes', () => {
  const tree = parse("**Don**'t stop.");
  transformTree(tree, 'markdown');
  expect(textOf(tree)).toBe('Don’t stop.');
});
it('protects fenced code, inline code, raw HTML and math', () => {
  const source =
    '"Hello." `const x = "hi"`\n\n```js\nconst x = "hi";\n```\n\n$f\'(x)$\n\n<span title="hey">"raw"</span>';
  const tree = parse(source);
  const collect = (n: TextTree): TextTree[] => [n, ...(n.children ?? []).flatMap(collect)];
  const before = collect(tree)
    .filter((n) => ['code', 'inlineCode', 'html', 'inlineMath'].includes(n.type))
    .map((n) => n.value);
  transformTree(tree, 'markdown', { primes: true });
  expect(
    collect(tree)
      .filter((n) => ['code', 'inlineCode', 'html', 'inlineMath'].includes(n.type))
      .map((n) => n.value),
  ).toEqual(before);
});
it('skips designated Markdown nodes', () => {
  const tree = parse('"Keep."\n\n"Change."');
  const first = tree.children![0];
  transformTree(tree, 'markdown', { skip: (n) => n === first });
  expect(textOf(first)).toBe('"Keep."');
  expect(textOf(tree.children![1])).toBe('“Change.”');
});
it('collapses ellipsis across text nodes without losing formatting', () => {
  const tree = parse('Wait.**.**. now.');
  transformTree(tree, 'markdown', { ellipses: true });
  expect(textOf(tree)).toBe('Wait… now.');
});
it('works as a standard remark plugin', async () => {
  const processor = unified().use(remarkParse).use(remarkTypograph);
  const tree = await processor.run(processor.parse('"Hello."'));
  expect(textOf(tree as TextTree)).toBe('“Hello.”');
});
it('protects HTML attributes and exact-code elements', async () => {
  const result = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTypograph)
    .use(rehypeStringify)
    .process(
      '<p title="a &quot;quote&quot;">"One <em>good</em> day." <code>"literal"</code></p><p data-typograph="off">"Original"</p>',
    );
  expect(String(result)).toContain('“One <em>good</em> day.”');
  expect(String(result)).toContain('<code>"literal"</code>');
  expect(String(result)).toContain('<p data-typograph="off">"Original"</p>');
});

it('supports the Typograph opt-out and exposes its report', async () => {
  const tree = unified()
    .use(rehypeParse, { fragment: true })
    .parse('<p data-typograph="off">"Keep."</p><p>"Change."</p>') as TextTree;
  const report = transformTree(tree, 'html');
  expect(textOf(tree)).toBe('"Keep."“Change.”');
  expect(tree.data?.typograph).toBe(report);
});
