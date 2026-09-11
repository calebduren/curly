import { analyze, type TypographOptions, type Decision } from './index';

export interface TextTree {
  type: string;
  value?: string;
  tagName?: string;
  children?: TextTree[];
  properties?: Record<string, unknown>;
  data?: {
    typograph?: TreeDecision[];
    hName?: string;
    hProperties?: Record<string, unknown>;
    hChildren?: TextTree[];
  };
  position?: { start: { offset?: number }; end: { offset?: number } };
}
export interface TreeOptions extends Omit<TypographOptions, 'protectedRanges'> {
  /** Protect a node and all descendants. */
  skip?: (node: TextTree) => boolean;
  /** Opt-in semantic marks for inspectors. Off by default; introduces no CSS. */
  annotate?: boolean;
}
export interface TreeDecision extends Decision {
  /** The complete inline prose run; offsets refer to this string. */
  context: string;
  block: number;
}
const markdownBlocks = new Set(['paragraph', 'heading', 'tableCell']);
const markdownProtected = new Set([
  'code',
  'inlineCode',
  'html',
  'math',
  'inlineMath',
  'yaml',
  'toml',
  'definition',
  'mdxjsEsm',
  'mdxTextExpression',
  'mdxFlowExpression',
]);
const htmlProtected = new Set([
  'code',
  'pre',
  'script',
  'style',
  'kbd',
  'samp',
  'var',
  'math',
  'svg',
  'textarea',
  'input',
  'select',
  'option',
  'template',
]);
const htmlBlocks = new Set([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'td',
  'th',
  'dt',
  'dd',
  'figcaption',
  'blockquote',
  'div',
  'section',
  'article',
  'main',
  'aside',
  'header',
  'footer',
  'body',
]);

/** Transform text nodes while retaining inline formatting and protected nodes. */
export function transformTree(
  tree: TextTree,
  mode: 'markdown' | 'html',
  options: TreeOptions = {},
): TreeDecision[] {
  const report: TreeDecision[] = [];
  let block = 0;
  const literalValue = (node: TextTree): string =>
    node.value ?? node.children?.map(literalValue).join('') ?? '\ufffc';
  const isProtected = (node: TextTree) =>
    options.skip?.(node) === true ||
    markdownProtected.has(node.type) ||
    (mode === 'html' &&
      (htmlProtected.has(node.tagName ?? '') ||
        node.properties?.['data-typograph'] === 'off' ||
        node.properties?.dataTypograph === 'off' ||
        node.properties?.contentEditable === true ||
        node.properties?.contentEditable === 'true' ||
        node.properties?.contentEditable === 'plaintext-only'));
  const isBlock = (node: TextTree) =>
    mode === 'markdown' ? markdownBlocks.has(node.type) : htmlBlocks.has(node.tagName ?? '');

  function process(nodes: TextTree[]) {
    const segments: { node: TextTree; start: number; end: number; protected: boolean }[] = [];
    const values: string[] = [];
    let length = 0;
    function collect(node: TextTree) {
      if (isProtected(node)) {
        const value = literalValue(node);
        segments.push({ node, start: length, end: length + value.length, protected: true });
        values.push(value);
        length += value.length;
      } else if (node.type === 'text' && typeof node.value === 'string') {
        segments.push({ node, start: length, end: length + node.value.length, protected: false });
        values.push(node.value);
        length += node.value.length;
      } else if (node.type === 'break' || node.tagName === 'br') {
        values.push('\n');
        length++;
      } else if (node.children) node.children.forEach(collect);
    }
    nodes.forEach(collect);
    const context = values.join('');
    if (!context) return;
    const result = analyze(context, {
      ...options,
      protectedRanges: segments
        .filter((s) => s.protected)
        .map((s) => ({
          start: s.start,
          end: s.end,
          reason: 'Code, math, or literal markup stays exact.',
        })),
    });
    const blockId = block;
    for (const decision of result.decisions) report.push({ ...decision, context, block });
    block++;
    // Original offsets remain valid even when an ellipsis shrinks across nodes.
    let editIndex = 0;
    for (const segment of segments) {
      if (segment.protected) continue;
      let cursor = segment.start;
      const parts: string[] = [];
      const annotated: TextTree[] = [];
      while (editIndex < result.changes.length && result.changes[editIndex].end <= segment.start)
        editIndex++;
      for (let j = editIndex; j < result.changes.length; j++) {
        const edit = result.changes[j];
        if (edit.start >= segment.end) break;
        const preceding = context.slice(cursor, Math.max(cursor, edit.start));
        parts.push(preceding);
        if (preceding) annotated.push({ type: 'text', value: preceding });
        if (edit.start >= segment.start) {
          parts.push(edit.replacement);
          annotated.push({
            type: 'element',
            tagName: 'mark',
            properties: {
              dataTypographId: blockId + ':' + edit.start,
              dataTypographReason: edit.reason,
              dataTypographKind: edit.kind,
            },
            children: [{ type: 'text', value: edit.replacement }],
          });
        }
        cursor = Math.min(segment.end, edit.end);
      }
      const rest = context.slice(cursor, segment.end);
      parts.push(rest);
      if (rest) annotated.push({ type: 'text', value: rest });
      segment.node.value = parts.join('');
      if (options.annotate && annotated.some((n) => n.type === 'element')) {
        if (mode === 'markdown')
          segment.node.data = { ...segment.node.data, hName: 'span', hChildren: annotated };
        else {
          segment.node.type = 'element';
          segment.node.tagName = 'span';
          segment.node.children = annotated;
          delete segment.node.value;
        }
      }
    }
  }
  function walk(node: TextTree) {
    if (isProtected(node)) {
      if (node.value)
        report.push({
          start: 0,
          end: node.value.length,
          original: node.value,
          replacement: node.value,
          kind: 'protected',
          reason: 'Code, math, or literal markup stays exact.',
          context: node.value,
          block: block++,
        });
      return;
    }
    if (!node.children) return;
    let run: TextTree[] = [];
    const flush = () => {
      if (run.length) {
        process(run);
        run = [];
      }
    };
    for (const child of node.children) {
      if (
        isBlock(child) ||
        (child.children &&
          mode === 'markdown' &&
          !['emphasis', 'strong', 'delete', 'link', 'linkReference'].includes(child.type))
      ) {
        flush();
        walk(child);
      } else run.push(child);
    }
    flush();
  }
  walk(tree);
  tree.data = { ...tree.data, typograph: report };
  return report;
}
