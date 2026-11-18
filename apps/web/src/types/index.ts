export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type ActiveView = 'editor' | 'preview' | 'split';

export interface EditorPreferences {
  fontSize: number;
  wordWrap: boolean;
  showStats: boolean;
  syncScroll: boolean;
  theme: ThemeMode;
}
