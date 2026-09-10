import { analyze, type CurlyOptions, type CurlyResult } from './index';

export type StreamOptions = Omit<CurlyOptions, 'protectedRanges'>;
/**
 * An append-only prose stream. write() emits completed paragraphs; end() flushes.
 * preview() is explicitly provisional and should be called at display cadence.
 * Buffering a paragraph preserves quotation context regardless of chunk splits.
 * This is for decoded prose, never raw JSON, SSE, Markdown, or tool arguments.
 */
export function createQuoteStream(options: StreamOptions = {}) {
  let parts: string[] = [];
  let pendingLength = 0;
  let afterNewline = false;
  let afterCR = false;
  let ended = false;
  const ensureOpen = () => {
    if (ended) throw new Error('This Curly stream has ended. Create a new stream.');
  };
  const write = (chunk: string): string => {
    ensureOpen();
    if (typeof chunk !== 'string')
      throw new TypeError('Curly streams accept decoded string chunks.');
    const output: string[] = [];
    let start = 0;
    // Visit each incoming code unit once. No rescanning or joining the growing tail.
    for (let i = 0; i < chunk.length; i++) {
      const c = chunk[i];
      if (c === '\n') {
        if (afterNewline) {
          parts.push(chunk.slice(start, i + 1));
          output.push(analyze(parts.join(''), options).text);
          parts = [];
          pendingLength = 0;
          start = i + 1;
          afterNewline = false;
        } else afterNewline = true;
        afterCR = false;
      } else if (afterNewline && c === '\r' && !afterCR) afterCR = true;
      else if (!(afterNewline && !afterCR && (c === ' ' || c === '\t'))) {
        afterNewline = false;
        afterCR = false;
      }
    }
    if (start < chunk.length) {
      const tail = chunk.slice(start);
      parts.push(tail);
      pendingLength += tail.length;
    }
    return output.join('');
  };
  return {
    write,
    preview(): CurlyResult {
      return analyze(parts.join(''), options);
    },
    end(chunk = ''): string {
      ensureOpen();
      const committed = write(chunk);
      const tail = analyze(parts.join(''), options).text;
      parts = [];
      pendingLength = 0;
      ended = true;
      return committed + tail;
    },
    get pendingLength(): number {
      return pendingLength;
    },
  };
}

/** Standard Web TransformStream adapter with the same paragraph buffering policy. */
export function curlyTransformStream(options: StreamOptions = {}): TransformStream<string, string> {
  const stream = createQuoteStream(options);
  return new TransformStream({
    transform(chunk, controller) {
      const output = stream.write(chunk);
      if (output) controller.enqueue(output);
    },
    flush(controller) {
      const output = stream.end();
      if (output) controller.enqueue(output);
    },
  });
}
