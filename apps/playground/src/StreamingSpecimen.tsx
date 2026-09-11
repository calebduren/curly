import { Streamdown, defaultRemarkPlugins } from 'streamdown';
import remarkTypograph from '@calebduren/typograph/remark';
import type { TypographOptions } from '@calebduren/typograph';
import { TaskStatus } from './Controls';
export default function StreamingSpecimen({
  source,
  options,
  formatted,
  playing,
}: {
  source: string;
  options: TypographOptions;
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
        ...(formatted
          ? [[remarkTypograph, options] as [typeof remarkTypograph, TypographOptions]]
          : []),
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
