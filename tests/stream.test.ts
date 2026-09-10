import { expect, it } from 'vitest';
import { corpus } from './corpus';
import { smarten } from '../packages/curly/src/index';
import { createQuoteStream, curlyTransformStream } from '../packages/curly/src/stream';

for (const fixture of corpus)
  it('stream splits: ' + fixture.name, () => {
    for (let split = 0; split <= fixture.input.length; split++) {
      const stream = createQuoteStream(fixture.options);
      const output =
        stream.write(fixture.input.slice(0, split)) + stream.end(fixture.input.slice(split));
      expect(output).toBe(smarten(fixture.input, fixture.options));
    }
    const stream = createQuoteStream(fixture.options);
    let output = '';
    for (const char of fixture.input.split('')) output += stream.write(char);
    expect(output + stream.end()).toBe(smarten(fixture.input, fixture.options));
  });
it('commits a completed paragraph and keeps a provisional tail', () => {
  const stream = createQuoteStream();
  expect(stream.write('"Hello."\r\n')).toBe('');
  expect(stream.write(' \r\n"Next')).toBe('“Hello.”\r\n \r\n');
  expect(stream.preview().text).toBe('“Next');
  expect(stream.end('."')).toBe('“Next.”');
  expect(() => stream.write('more')).toThrow('ended');
});
it('provides a real Web TransformStream', async () => {
  const chunks = ['"Don', "'", 't."\n', '\n', '"Go."'];
  const readable = new ReadableStream<string>({
    start(c) {
      for (const s of chunks) c.enqueue(s);
      c.close();
    },
  });
  const reader = readable.pipeThrough(curlyTransformStream()).getReader();
  let output = '';
  while (true) {
    const next = await reader.read();
    if (next.done) break;
    output += next.value;
  }
  expect(output).toBe('“Don’t.”\n\n“Go.”');
});
