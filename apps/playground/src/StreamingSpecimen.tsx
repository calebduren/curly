import { Streamdown, defaultRemarkPlugins } from 'streamdown';
import remarkCurly from 'cowboy-curly/remark';
import type { CurlyOptions } from 'cowboy-curly';
import { TaskStatus } from './Controls';
export default function StreamingSpecimen({
  source,
  options,
  formatted,
  playing,
}: {
  source: string;
  options: CurlyOptions;
  formatted: boolean;
  playing: boolean;
}) {
  return (
    <Streamdown
      isAnimating={playing}
      skipHtml
      controls={false}
      codeBlockMaxHeight={0}
      remarkPlugins={[
        ...Object.values(defaultRemarkPlugins),
        ...(formatted ? [[remarkCurly, options] as [typeof remarkCurly, CurlyOptions]] : []),
      ]}
      components={{
        input: ({ checked }) => <TaskStatus checked={checked === true} />,
        strong: ({ children }) => <strong>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        img: ({ alt }) => <span className="omitted-image">[Image: {alt ?? 'remote media'}]</span>,
      }}
    >
      {source}
    </Streamdown>
  );
}
