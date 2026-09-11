import { Streamdown, defaultRemarkPlugins } from 'streamdown';
import remarkTypograph from '@calebduren/typograph/remark';

export function StreamingMessage({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  return (
    <Streamdown
      isAnimating={isStreaming}
      remarkPlugins={[...Object.values(defaultRemarkPlugins), [remarkTypograph, { primes: true }]]}
    >
      {text}
    </Streamdown>
  );
}
