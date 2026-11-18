import DOMPurify from 'dompurify';
import { createMarkdownParser } from '../parser/markdown';
import { extractTableOfContents } from '../toc';
import { getDocumentStatistics } from '../statistics';
import type { RenderOptions, RenderResult } from '../types';

export function sanitizeHtml(html: string): string {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'id', 'class'],
      ADD_TAGS: ['mark'],
    });
  }

  // Fallback for non-browser / Node test environments
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s*on\w+\s*=\s*(?:["'“”][^"'“”]*["'“”]|[^\s>]+)/gi, '')
    .replace(/(?:href|src)\s*=\s*["'“”]\s*javascript:[^"'“”]*["'“”]/gi, '$1="#"');
}

export function renderMarkdown(markdown: string, options: RenderOptions = {}): string {
  if (!markdown) {
    return '';
  }

  const parser = createMarkdownParser(options);
  const rawHtml = parser.render(markdown);

  if (options.sanitize === false) {
    return rawHtml;
  }

  return sanitizeHtml(rawHtml);
}

export function renderDocument(markdown: string, options: RenderOptions = {}): RenderResult {
  const content = markdown || '';
  const html = renderMarkdown(content, options);
  const toc = extractTableOfContents(content);
  const stats = getDocumentStatistics(content);

  return {
    html,
    toc,
    stats,
  };
}
