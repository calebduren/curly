import { typographTransformStream } from '@calebduren/typograph/stream';

// Input has already been decoded and selected as plain prose by your AI client.
export function formatProse(source: ReadableStream<string>) {
  return source.pipeThrough(typographTransformStream());
}
