import { describe, it, expect } from 'vitest';
import { validateMarkdown } from '../src';

describe('validateMarkdown', () => {
  it('detects unclosed code fences', () => {
    const md = '# Title\n\n```typescript\nconst x = 1;\n';
    const issues = validateMarkdown(md);

    expect(issues.some((i) => i.message.includes('Unclosed code block'))).toBe(true);
  });

  it('detects empty headings', () => {
    const md = '## \nSome text';
    const issues = validateMarkdown(md);

    expect(issues.some((i) => i.message.includes('Empty heading'))).toBe(true);
  });

  it('detects empty link targets', () => {
    const md = 'Click [here]() to learn more.';
    const issues = validateMarkdown(md);

    expect(issues.some((i) => i.message.includes('Empty link URL target'))).toBe(true);
  });

  it('reports no issues on clean markdown', () => {
    const md = '# Clean Markdown\n\nThis is a [link](https://example.com) and a paragraph.';
    const issues = validateMarkdown(md);

    expect(issues).toHaveLength(0);
  });
});
