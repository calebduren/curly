/** Typography recipes use CSS pixels at the default 16px root; output uses rem. */
export interface TypesetOptions {
  size: number;
  leading: number;
  measure: number;
  paragraph: number;
}

export const typesets = {
  article: { size: 18, leading: 30 / 18, measure: 64, paragraph: 1 },
  docs: { size: 16, leading: 26 / 16, measure: 68, paragraph: 0.75 },
  chat: { size: 16, leading: 24 / 16, measure: 58, paragraph: 0.75 },
} as const satisfies Record<string, TypesetOptions>;

export type TypesetName = keyof typeof typesets;
export type TypesetStyle = Record<
  '--typeset-size' | '--typeset-leading' | '--typograph-measure' | '--typograph-paragraph',
  string
>;

/** Build scoped CSS variables. This describes a rhythm, not a baseline-grid guarantee. */
export function createTypeset(
  options: Partial<TypesetOptions> = {},
  preset: TypesetName = 'article',
): TypesetStyle {
  if (!Object.prototype.hasOwnProperty.call(typesets, preset)) {
    throw new RangeError('Choose an article, docs, or chat typeset.');
  }
  const values = { ...typesets[preset], ...options };
  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0 || (key !== 'paragraph' && value === 0)) {
      throw new RangeError(
        `Typography ${key} must be finite and ${key === 'paragraph' ? 'nonnegative' : 'positive'}.`,
      );
    }
  }
  return {
    '--typeset-size': `${values.size / 16}rem`,
    '--typeset-leading': String(values.leading),
    '--typograph-measure': `${values.measure}ch`,
    '--typograph-paragraph': String(values.paragraph),
  };
}
