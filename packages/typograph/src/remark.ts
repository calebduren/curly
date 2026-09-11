import { transformTree, type TextTree, type TreeOptions } from './tree';
export { transformTree };
export type { TextTree, TreeOptions, TreeDecision } from './tree';
/** A remark plugin. Reads prose across emphasis and links; never edits code or URLs. */
export default function remarkTypograph(options: TreeOptions = {}) {
  return (tree: TextTree) => {
    transformTree(tree, 'markdown', options);
  };
}
