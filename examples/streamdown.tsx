import { Streamdown, defaultRemarkPlugins } from 'streamdown';
import remarkCurly from 'cowboy-curly/remark';

export function StreamingMessage({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  return (
    <Streamdown
      isAnimating={isStreaming}
      remarkPlugins={[...Object.values(defaultRemarkPlugins), [remarkCurly, { primes: true }]]}
    >
      {text}
    </Streamdown>
  );
}
