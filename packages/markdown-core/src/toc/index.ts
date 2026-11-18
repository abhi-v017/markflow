import MarkdownIt from 'markdown-it';
import type { TocItem } from '../types';
import { slugify } from '../parser/markdown';

export function extractTableOfContents(markdown: string): TocItem[] {
  if (!markdown || typeof markdown !== 'string') {
    return [];
  }

  const md = new MarkdownIt();
  const env: { slugCounts?: Map<string, number> } = {
    slugCounts: new Map<string, number>(),
  };
  const tokens = md.parse(markdown, env);
  const toc: TocItem[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.replace(/^h/i, ''), 10) || 1;
      const inlineToken = tokens[i + 1];
      const text = inlineToken && inlineToken.content ? inlineToken.content.trim() : '';

      if (text) {
        const baseSlug = slugify(text) || 'heading';
        const counts = env.slugCounts!;
        const count = counts.get(baseSlug) || 0;
        counts.set(baseSlug, count + 1);

        const id = count === 0 ? baseSlug : `${baseSlug}-${count}`;
        toc.push({ id, text, level });
      }
    }
  }

  return toc;
}
