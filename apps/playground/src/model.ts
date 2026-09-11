import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { transformTree, type TextTree } from '@calebduren/typograph/remark';
import type { TypographOptions } from '@calebduren/typograph';

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
export function inspectMarkdown(source: string, options: TypographOptions) {
  const tree = parser.parse(source) as TextTree;
  const start = performance.now();
  const decisions = transformTree(tree, 'markdown', options);
  return { decisions, elapsed: performance.now() - start };
}
export function integrationSnippet(kind: string, options: TypographOptions) {
  const config = JSON.stringify({
    primes: options.primes ?? false,
    ellipses: options.ellipses ?? false,
  });
  if (kind === 'React Markdown')
    return `import Markdown from 'react-markdown';\nimport remarkTypograph from '@calebduren/typograph/remark';\n\n<Markdown\n  remarkPlugins={[[remarkTypograph, ${config}]]}\n>\n  {message}\n</Markdown>`;
  if (kind === 'Streamdown')
    return `import { Streamdown, defaultRemarkPlugins } from 'streamdown';\nimport remarkTypograph from '@calebduren/typograph/remark';\n\n<Streamdown\n  remarkPlugins={[\n    ...Object.values(defaultRemarkPlugins),\n    [remarkTypograph, ${config}]\n  ]}\n  isAnimating={isStreaming}\n>\n  {message}\n</Streamdown>`;
  if (kind === 'HTML / rehype')
    return `import rehypeTypograph from '@calebduren/typograph/rehype';\n\n// Add to your existing HTML processing pipeline.\nprocessor.use(rehypeTypograph, ${config});\n\n// Protect exact text with data-typograph="off".`;
  return `import { smarten, analyze } from '@calebduren/typograph';\n\nconst text = smarten(prose, ${config});\n\n// Need to see what changed?\nconst { decisions } = analyze(prose, ${config});`;
}
