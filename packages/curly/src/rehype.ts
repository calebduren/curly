import { transformTree, type TextTree, type TreeOptions } from './tree';
export type { TextTree, TreeOptions, TreeDecision } from './tree';
/** A rehype plugin. Attributes and explicitly protected elements are untouched. */
export default function rehypeCurly(options: TreeOptions = {}) {
  return (tree: TextTree) => {
    transformTree(tree, 'html', options);
  };
}
