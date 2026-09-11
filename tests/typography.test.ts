import { describe, expect, it } from 'vitest';
import { createTypeset, typesets } from '../packages/typograph/src/typography';

describe('typeset recipes', () => {
  it('uses rem for the type size and keeps leading unitless', () => {
    const style = createTypeset({ size: 20, leading: 1.6, measure: 60, paragraph: 0.5 });
    expect(Number.parseFloat(style['--typeset-size']) * 16).toBe(20);
    expect(style['--typeset-size']).toMatch(/rem$/);
    expect(Number(style['--typeset-leading'])).toBe(1.6);
    expect(style['--typograph-measure']).toBe('60ch');
    expect(style['--typograph-paragraph']).toBe('0.5');
  });
  it('applies partial overrides without mutating a shared preset', () => {
    const before = structuredClone(typesets);
    const options = Object.freeze({ measure: 52 });
    const style = createTypeset(options, 'chat');
    expect(Number(style['--typeset-leading'])).toBe(1.5);
    expect(style['--typograph-measure']).toBe('52ch');
    expect(typesets).toEqual(before);
    expect(createTypeset({}, 'chat')['--typograph-measure']).toBe('58ch');
  });
  it('allows paragraph indentation recipes to remove the paragraph gap', () => {
    expect(createTypeset({ paragraph: 0 })['--typograph-paragraph']).toBe('0');
  });
  it.each([NaN, Infinity, -Infinity, -1, 0])('rejects an unusable size %s', (size) => {
    expect(() => createTypeset({ size })).toThrow(RangeError);
  });
  it.each([{ leading: 0 }, { measure: -1 }, { paragraph: -1 }, { paragraph: Infinity }])(
    'rejects unusable measurements %j',
    (options) => {
      expect(() => createTypeset(options)).toThrow(RangeError);
    },
  );
  it('rejects an unknown preset instead of returning undefined CSS', () => {
    expect(() => createTypeset({}, 'missing' as 'article')).toThrow(RangeError);
  });
});
