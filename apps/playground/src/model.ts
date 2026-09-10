import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { transformTree, type TextTree } from 'cowboy-curly/remark';
import type { CurlyOptions } from 'cowboy-curly';

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
export function inspectMarkdown(source: string, options: CurlyOptions) {
  const tree = parser.parse(source) as TextTree;
  const start = performance.now();
  const decisions = transformTree(tree, 'markdown', options);
  return { decisions, elapsed: performance.now() - start };
}
export function integrationSnippet(kind: string, options: CurlyOptions) {
  const config = JSON.stringify({
    primes: options.primes ?? false,
    ellipses: options.ellipses ?? false,
  });
  if (kind === 'React Markdown')
    return `import Markdown from 'react-markdown';\nimport remarkCurly from 'cowboy-curly/remark';\n\n<Markdown\n  remarkPlugins={[[remarkCurly, ${config}]]}\n>\n  {message}\n</Markdown>`;
  if (kind === 'Streamdown')
    return `import { Streamdown, defaultRemarkPlugins } from 'streamdown';\nimport remarkCurly from 'cowboy-curly/remark';\n\n<Streamdown\n  remarkPlugins={[\n    ...Object.values(defaultRemarkPlugins),\n    [remarkCurly, ${config}]\n  ]}\n  isAnimating={isStreaming}\n>\n  {message}\n</Streamdown>`;
  if (kind === 'HTML / rehype')
    return `import rehypeCurly from 'cowboy-curly/rehype';\n\n// Add to your existing HTML processing pipeline.\nprocessor.use(rehypeCurly, ${config});\n\n// Protect exact text with data-curly="off".`;
  return `import { smarten, analyze } from 'cowboy-curly';\n\nconst text = smarten(prose, ${config});\n\n// Need to see what changed?\nconst { decisions } = analyze(prose, ${config});`;
}
