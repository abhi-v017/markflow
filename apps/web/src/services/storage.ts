import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { DocumentItem } from '../types';

interface MarkFlowDB extends DBSchema {
  documents: {
    key: string;
    value: DocumentItem;
    indexes: { 'by-updated': number };
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
      },
    });
  }
  return dbPromise;
}

const INITIAL_WELCOME = `# Welcome to MarkFlow ⚡

MarkFlow is a local-first, minimal Markdown workspace designed for privacy, focus, and speed.

## Quick Start

- **Local Storage**: Documents are saved in your browser's IndexedDB. No accounts or tracking.
- **Fast Syntax**: Code blocks, tables, and task lists are rendered with syntax highlighting.
- **Navigation**: Use the Table of Contents on the right to jump between headings.

\`\`\`typescript
const greeting = "Hello, MarkFlow!";
console.log(greeting);
\`\`\`

> *"Simplicity is prerequisite for reliability."* — Edsger W. Dijkstra
`;

export function createDefaultDocument(): DocumentItem {
  const now = Date.now();
  return {
    id: 'welcome-doc',
    title: 'Welcome to MarkFlow',
    content: INITIAL_WELCOME,
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
