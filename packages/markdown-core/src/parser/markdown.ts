import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import type { RenderOptions } from '../types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createMarkdownParser(options: RenderOptions = {}): MarkdownIt {
  const md = new MarkdownIt({
    html: false, // Default to false for strict security
    xhtmlOut: false,
    breaks: options.breaks ?? true,
    langPrefix: 'language-',
    linkify: options.linkify ?? true,
    typographer: options.typographer ?? true,
    highlight: (str: string, lang: string): string => {
      if (options.highlight === false) {
        return '';
      }
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
        } catch {
          return '';
        }
      }
      return ''; // Fallback to markdown-it default escaping
    },
  });

  // Heading anchor plugin: adds unique IDs to headings for TOC linking
  const originalHeadingOpen =
    md.renderer.rules.heading_open ||
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const inlineToken = tokens[idx + 1];
    if (inlineToken && inlineToken.content) {
      const headingText = inlineToken.content;
      const baseSlug = slugify(headingText) || 'heading';

      // Ensure slug uniqueness within document
      if (!env.slugCounts) {
        env.slugCounts = new Map<string, number>();
      }
      const counts: Map<string, number> = env.slugCounts;
      const count = counts.get(baseSlug) || 0;
      counts.set(baseSlug, count + 1);

      const uniqueId = count === 0 ? baseSlug : `${baseSlug}-${count}`;
      tokens[idx].attrSet('id', uniqueId);
    }
    return originalHeadingOpen(tokens, idx, options, env, self);
  };

  return md;
}
