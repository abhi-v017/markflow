import { describe, it, expect } from 'vitest';
import { renderMarkdown, renderDocument, sanitizeHtml } from '../src';

describe('renderMarkdown', () => {
  it('renders standard markdown elements to html', () => {
    const md = '# Title\n\nThis is **bold** and *italic*.';
    const html = renderMarkdown(md);

    expect(html).toContain('<h1 id="title">Title</h1>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
  });

  it('renders fenced code blocks with language highlighting class', () => {
    const md = '```typescript\nconst greeting: string = "hello";\n```';
    const html = renderMarkdown(md);

    expect(html).toContain('class="language-typescript"');
  });

  it('strips unsafe script tags and dangerous event handlers', () => {
    const md = '<script>alert("xss")</script><img src="x" onerror="alert(1)">';
    const html = renderMarkdown(md);

    expect(html).not.toContain('<script>');
    expect(html).not.toContain('onerror=');
  });

  it('generates unique heading IDs for identical headings', () => {
    const md = '# Section\n\n# Section\n\n# Section';
    const html = renderMarkdown(md);

    expect(html).toContain('id="section"');
    expect(html).toContain('id="section-1"');
    expect(html).toContain('id="section-2"');
  });
});

describe('renderDocument', () => {
  it('returns html, table of contents, and stats in one invocation', () => {
    const md = '# Main\n\n## Sub\n\nA quick brown fox jumps over the lazy dog.';
    const result = renderDocument(md);

    expect(result.html).toBeDefined();
    expect(result.toc).toHaveLength(2);
    expect(result.toc[0]).toEqual({ id: 'main', text: 'Main', level: 1 });
    expect(result.toc[1]).toEqual({ id: 'sub', text: 'Sub', level: 2 });
    expect(result.stats.words).toBe(11);
    expect(result.stats.readingTimeMinutes).toBe(1);
  });
});

describe('sanitizeHtml', () => {
  it('removes javascript: links', () => {
    const dirty = '<a href="javascript:stealData()">Click me</a>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('javascript:');
  });
});
