import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { DocumentItem, EditorPreferences } from '../types';

interface MarkFlowDB extends DBSchema {
  documents: {
    key: string;
    value: DocumentItem;
    indexes: { 'by-updated': number };
  };
  preferences: {
    key: string;
    value: { key: string; value: unknown };
  };
}

const DB_NAME = 'markflow_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MarkFlowDB>> | null = null;

function getDb(): Promise<IDBPDatabase<MarkFlowDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MarkFlowDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('documents')) {
          const docStore = db.createObjectStore('documents', { keyPath: 'id' });
          docStore.createIndex('by-updated', 'updatedAt');
        }
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export const defaultPreferences: EditorPreferences = {
  fontSize: 14,
  wordWrap: true,
  showStats: true,
  syncScroll: true,
  theme: 'system',
};

const INITIAL_WELCOME_MARKDOWN = `# Welcome to MarkFlow ⚡

MarkFlow is a lightweight, local-first Markdown workspace engineered for speed, privacy, and simplicity.

## Features

- **Local First**: All documents are stored right in your browser via IndexedDB. No accounts, no clouds, no tracking.
- **Instant Preview**: Fast, safe rendering with syntax highlighting and auto-generated Table of Contents.
- **Deep Metrics**: Real-time word count, character count, and estimated reading time.
- **Universal Engine**: Shares the exact same \`@markflow/markdown-core\` parser with the VS Code extension.

### Code Highlighting Example

\`\`\`typescript
interface Developer {
  name: string;
  focus: 'clean code' | 'speed' | 'ux';
}

const user: Developer = {
  name: 'Architect',
  focus: 'clean code',
};
\`\`\`

### Formatted Table

| Feature | Web App | VS Code Extension |
| :--- | :---: | :---: |
| Local Persistence | IndexedDB | Local File System |
| Live Preview | Yes | Yes (Side Webview) |
| Syntax Highlighting | Yes | Yes |
| Export Options | MD, HTML, PDF | MD, HTML, TOC |

> *"Simplicity is the prerequisite for reliability."* — Edsger W. Dijkstra

Feel free to edit this document or create a new one using the left sidebar!
`;

export function createDefaultDocument(): DocumentItem {
  const now = Date.now();
  return {
    id: 'welcome-doc',
    title: 'Welcome to MarkFlow',
    content: INITIAL_WELCOME_MARKDOWN,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getAllDocuments(): Promise<DocumentItem[]> {
  const db = await getDb();
  const docs = await db.getAllFromIndex('documents', 'by-updated');
  if (docs.length === 0) {
    const welcome = createDefaultDocument();
    await saveDocument(welcome);
    return [welcome];
  }
  // Return most recently updated first
  return docs.reverse();
}

export async function getDocument(id: string): Promise<DocumentItem | undefined> {
  const db = await getDb();
  return db.get('documents', id);
}

export async function saveDocument(doc: DocumentItem): Promise<void> {
  const db = await getDb();
  await db.put('documents', doc);
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('documents', id);
}

export async function getPreferences(): Promise<EditorPreferences> {
  const db = await getDb();
  const record = await db.get('preferences', 'settings');
  return record ? (record.value as EditorPreferences) : defaultPreferences;
}

export async function savePreferences(prefs: EditorPreferences): Promise<void> {
  const db = await getDb();
  await db.put('preferences', { key: 'settings', value: prefs });
}
