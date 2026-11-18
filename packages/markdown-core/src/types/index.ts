export interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  readingTimeMinutes: number;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface RenderOptions {
  sanitize?: boolean;
  highlight?: boolean;
  linkify?: boolean;
  typographer?: boolean;
  breaks?: boolean;
}

export interface ValidationIssue {
  line: number;
  message: string;
  severity: 'warning' | 'error' | 'info';
}

export interface RenderResult {
  html: string;
  toc: TocItem[];
  stats: DocumentStats;
}
