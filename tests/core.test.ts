import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { analyze, smarten } from '../packages/typograph/src/index';
import { corpus } from './corpus';

describe('English typography corpus', () => {
  for (const fixture of corpus)
    it(fixture.name, () => {
      expect(smarten(fixture.input, fixture.options)).toBe(fixture.expected);
      expect(smarten(fixture.expected, fixture.options)).toBe(fixture.expected);
    });
});
describe('observable contract', () => {
  it('returns original UTF-16 offsets and reconstructable edits', () => {
    const input = '🤠 "It\'s ready..."';
    const result = analyze(input, { ellipses: true });
    let rebuilt = input;
    for (const edit of [...result.changes].reverse()) {
      expect(input.slice(edit.start, edit.end)).toBe(edit.original);
      rebuilt = rebuilt.slice(0, edit.start) + edit.replacement + rebuilt.slice(edit.end);
    }
    expect(rebuilt).toBe(result.text);
  });
  it('does not mutate caller ranges and protects literals', () => {
    const input = 'Use "hello" and say "hi".';
    const ranges = Object.freeze([Object.freeze({ start: 4, end: 11 })]);
    expect(smarten(input, { protectedRanges: ranges })).toBe('Use "hello" and say “hi”.');
    expect(ranges[0]).toEqual({ start: 4, end: 11 });
  });
  it('does not collapse dots through a protected span', () => {
    expect(smarten('...', { ellipses: true, protectedRanges: [{ start: 1, end: 2 }] })).toBe('...');
  });
  it('validates caller offsets', () => {
    expect(() => smarten('abc', { protectedRanges: [{ start: -1, end: 2 }] })).toThrow(RangeError);
  });
  it('conserves everything except reported changes', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 300 }), (input) => {
        const r = analyze(input, { ellipses: true, primes: true });
        expect(smarten(r.text, { ellipses: true, primes: true })).toBe(r.text);
        expect(
          r.changes.every((c) =>
            ['opening-quote', 'closing-quote', 'apostrophe', 'prime', 'ellipsis'].includes(c.kind),
          ),
        ).toBe(true);
      }),
      { numRuns: 1000, seed: 20260910 },
    );
  });
  it('is idempotent across punctuation-rich input', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('a', 's', '1', ' ', "'", '"', '\n', '.', '’', '“', '”', '\\'), {
          maxLength: 100,
        }),
        (chars) => {
          const input = chars.join('');
          const out = smarten(input, { primes: true, ellipses: true });
          expect(smarten(out, { primes: true, ellipses: true })).toBe(out);
        },
      ),
      { numRuns: 2000, seed: 20260911 },
    );
  });
});
