import { curlyTransformStream } from 'cowboy-curly/stream';

// Input has already been decoded and selected as plain prose by your AI client.
export function formatProse(source: ReadableStream<string>) {
  return source.pipeThrough(curlyTransformStream());
}
