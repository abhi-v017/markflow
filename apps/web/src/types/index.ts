export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type ActiveView = 'editor' | 'preview' | 'split';
