import { expect, it } from 'vitest';
import fc from 'fast-check';
import { smarten } from '../packages/curly/src/index';
import { createQuoteStream } from '../packages/curly/src/stream';

it('is invariant across random multi-chunk streams and newline boundaries', () => {
  fc.assert(
    fc.property(
      fc.array(fc.constantFrom('a', 'b', '1', '"', "'", ' ', '.', '\r', '\n', '\t', '😀'), {
        maxLength: 200,
      }),
      fc.array(fc.integer({ min: 1, max: 17 }), { minLength: 1, maxLength: 20 }),
      (chars, sizes) => {
        const input = chars.join('');
        const stream = createQuoteStream({ primes: true, ellipses: true });
        let output = '',
          offset = 0,
          index = 0;
        while (offset < input.length) {
          const size = sizes[index++ % sizes.length];
          output += stream.write(input.slice(offset, offset + size));
          offset += size;
        }
        expect(output + stream.end()).toBe(smarten(input, { primes: true, ellipses: true }));
      },
    ),
    { seed: 20260912, numRuns: 1000 },
  );
});
it('handles a long paragraph delivered one code unit at a time', () => {
  const input = 'a'.repeat(100000) + ' "done"';
  const { write, end } = createQuoteStream();
  for (const c of input) expect(write(c)).toBe('');
  expect(end()).toBe('a'.repeat(100000) + ' “done”');
});
it('preserves pending length after committing one paragraph and buffering another', () => {
  const s = createQuoteStream();
  s.write('"first');
  expect(s.pendingLength).toBe(6);
  expect(s.write('"\n\n"next')).toBe('“first”\n\n');
  expect(s.pendingLength).toBe(5);
  s.end();
  expect(s.pendingLength).toBe(0);
});
