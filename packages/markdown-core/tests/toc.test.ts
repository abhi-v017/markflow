import { describe, it, expect } from 'vitest';
import { extractTableOfContents } from '../src';

describe('extractTableOfContents', () => {
  it('extracts multi-level headings accurately', () => {
    const md = `
# Project MarkFlow
Intro paragraph.

## Architecture
Some details.

### Shared Engine
More details.

## Getting Started
Setup steps.
    `;
    const toc = extractTableOfContents(md);

    expect(toc).toEqual([
      { id: 'project-markflow', text: 'Project MarkFlow', level: 1 },
      { id: 'architecture', text: 'Architecture', level: 2 },
      { id: 'shared-engine', text: 'Shared Engine', level: 3 },
      { id: 'getting-started', text: 'Getting Started', level: 2 },
    ]);
  });

  it('ignores headings inside code blocks', () => {
    const md = `
# Real Heading

\`\`\`markdown
# Fake Heading in Code Block
\`\`\`
    `;
    const toc = extractTableOfContents(md);
    expect(toc).toHaveLength(1);
    expect(toc[0].text).toBe('Real Heading');
  });

  it('handles empty input gracefully', () => {
    expect(extractTableOfContents('')).toEqual([]);
  });
});
