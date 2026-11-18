import { useState, useEffect, useCallback, useRef } from 'react';
import type { DocumentItem } from '../types';
import {
  getAllDocuments,
  saveDocument,
  deleteDocument,
} from '../services/storage';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [currentDocId, setCurrentDocId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial load
  useEffect(() => {
    let mounted = true;
    getAllDocuments()
      .then((docs) => {
        if (mounted) {
          setDocuments(docs);
          if (docs.length > 0) {
            setCurrentDocId(docs[0].id);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load documents from IndexedDB', err);
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const currentDoc = documents.find((d) => d.id === currentDocId) || documents[0];

  // Auto-save logic
  const triggerAutoSave = useCallback((docToSave: DocumentItem) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveDocument(docToSave);
        setIsDirty(false);
      } catch (err) {
        console.error('Failed to auto-save document', err);
      } finally {
        setIsSaving(false);
      }
    }, 600);
  }, []);

  const updateContent = useCallback(
    (newContent: string) => {
      if (!currentDoc) return;

      const updated: DocumentItem = {
        ...currentDoc,
        content: newContent,
        updatedAt: Date.now(),
      };

      setIsDirty(true);
      setDocuments((prev) =>
        prev.map((d) => (d.id === currentDoc.id ? updated : d))
      );
      triggerAutoSave(updated);
    },
    [currentDoc, triggerAutoSave]
  );

  const createNewDocument = useCallback(async (title: string = 'Untitled Document') => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      content: `# ${title}\n\nStart writing here...`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveDocument(newDoc);
    setDocuments((prev) => [newDoc, ...prev]);
    setCurrentDocId(newDoc.id);
    setIsDirty(false);
    return newDoc;
  }, []);

  const renameDocument = useCallback(
    async (id: string, newTitle: string) => {
      const trimmed = newTitle.trim() || 'Untitled';
      setDocuments((prev) =>
        prev.map((d) => {
          if (d.id === id) {
            const updated = { ...d, title: trimmed, updatedAt: Date.now() };
            saveDocument(updated);
            return updated;
          }
          return d;
        })
      );
    },
    []
  );

  const duplicate = useCallback(
    async (id: string) => {
      const source = documents.find((d) => d.id === id);
      if (!source) return;

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: `${source.title} (Copy)`,
        content: source.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await saveDocument(newDoc);
      setDocuments((prev) => [newDoc, ...prev]);
      setCurrentDocId(newDoc.id);
    },
    [documents]
  );

  const removeDoc = useCallback(
    async (id: string) => {
      await deleteDocument(id);
      setDocuments((prev) => {
        const remaining = prev.filter((d) => d.id !== id);
        if (id === currentDocId && remaining.length > 0) {
          setCurrentDocId(remaining[0].id);
        }
        return remaining;
      });
    },
    [currentDocId]
  );

  return {
    documents,
    currentDoc,
    currentDocId,
    setCurrentDocId,
    updateContent,
    createNewDocument,
    renameDocument,
    duplicate,
    removeDoc,
    isLoading,
    isSaving,
    isDirty,
  };
}
