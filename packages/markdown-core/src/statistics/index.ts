import type { DocumentStats } from '../types';

export function getDocumentStatistics(markdown: string): DocumentStats {
  if (!markdown || typeof markdown !== 'string') {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      lines: 0,
      readingTimeMinutes: 0,
    };
  }

  const characters = markdown.length;
  const charactersNoSpaces = markdown.replace(/\s/g, '').length;
  const lines = markdown.split(/\r\n|\r|\n/).length;

  const trimmed = markdown.trim();
  // Filter tokens that contain at least one alphanumeric or unicode word/number character
  // This correctly excludes Markdown syntax markers like "#", "##", "-", "*", ">", etc.
  const words = trimmed
    ? trimmed.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length
    : 0;

  // Assuming average reading speed of 200 words per minute
  const readingTimeMinutes = words === 0 ? 0 : Math.ceil(words / 200);

  return {
    words,
    characters,
    charactersNoSpaces,
    lines,
    readingTimeMinutes,
  };
}
