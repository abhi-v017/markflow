import { describe, it, expect } from 'vitest';
import { getDocumentStatistics } from '../src';

describe('getDocumentStatistics', () => {
  it('counts words, characters, and lines correctly', () => {
    const text = 'Hello world!\nSecond line of text.';
    const stats = getDocumentStatistics(text);

    expect(stats.words).toBe(6);
    expect(stats.lines).toBe(2);
    expect(stats.characters).toBe(text.length);
    expect(stats.charactersNoSpaces).toBe(text.replace(/\s/g, '').length);
  });

  it('handles empty string properly', () => {
    const stats = getDocumentStatistics('');

    expect(stats.words).toBe(0);
    expect(stats.lines).toBe(0);
    expect(stats.characters).toBe(0);
    expect(stats.readingTimeMinutes).toBe(0);
  });

  it('calculates reading time based on 200 wpm', () => {
    const words = Array.from({ length: 450 }, () => 'word').join(' ');
    const stats = getDocumentStatistics(words);

    expect(stats.words).toBe(450);
    expect(stats.readingTimeMinutes).toBe(3);
  });

  it('excludes markdown syntax tokens from word count', () => {
    const md = '# Title\n\n## Subtitle\n\n- item 1\n- item 2\n\n> quote here';
    const stats = getDocumentStatistics(md);

    // Title, Subtitle, item, 1, item, 2, quote, here = 8 words
    expect(stats.words).toBe(8);
  });
});
