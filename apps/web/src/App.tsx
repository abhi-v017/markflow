import React, { useState, useEffect } from 'react';
import { useDocuments } from './hooks/useDocuments';
import { useDebounce } from './hooks/useDebounce';
import { Header } from './components/common/Header';
import { DocumentSidebar } from './features/documents/DocumentSidebar';
import { CodeEditor } from './features/editor/CodeEditor';
import { MarkdownPreview } from './features/preview/MarkdownPreview';
import { ExportModal } from './features/export/ExportModal';
import type { ActiveView } from './types';

export const App: React.FC = () => {
  const {
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
  } = useDocuments();

  const [activeView, setActiveView] = useState<ActiveView>('split');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Responsive default view on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setActiveView((prev) => (prev === 'split' ? 'editor' : prev));
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentContent = currentDoc ? currentDoc.content : '';
  const debouncedContent = useDebounce(currentContent, 120);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-pastel-lavender border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(196,181,253,0.3)]" />
          <span className="text-xs font-medium tracking-wider uppercase text-slate-400">
            Initializing MarkFlow...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-black text-slate-100 font-sans antialiased selection:bg-pastel-lavender/25 selection:text-white">
      {/* Subtle AMOLED Ambient Mesh Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-pastel-lavender/[0.03] blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] w-[450px] h-[450px] rounded-full bg-pastel-sky/[0.025] blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[30%] w-[600px] h-[600px] rounded-full bg-pastel-mint/[0.02] blur-[130px]" />
      </div>

      {/* Document Management Sidebar */}
      <DocumentSidebar
        documents={documents}
        currentDocId={currentDocId}
        onSelectDoc={setCurrentDocId}
        onCreateDoc={() => createNewDocument('Untitled Document')}
        onRenameDoc={renameDocument}
        onDuplicateDoc={duplicate}
        onDeleteDoc={removeDoc}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 h-full">
        <Header
          docTitle={currentDoc?.title || 'MarkFlow'}
          isSaving={isSaving}
          isDirty={isDirty}
          activeView={activeView}
          onChangeView={setActiveView}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenExport={() => setIsExportOpen(true)}
        />

        {/* Editor & Preview Split Workspace */}
        <main className="flex-1 flex min-h-0 overflow-hidden">
          {/* Editor Container */}
          {(activeView === 'editor' || activeView === 'split') && (
            <div
              className={`h-full min-w-0 ${
                activeView === 'split' ? 'w-1/2' : 'w-full'
              }`}
            >
              {currentDoc && (
                <CodeEditor
                  content={currentDoc.content}
                  onChange={updateContent}
                  docId={currentDoc.id}
                />
              )}
            </div>
          )}

          {/* Live Preview Container */}
          {(activeView === 'preview' || activeView === 'split') && (
            <div
              className={`h-full min-w-0 ${
                activeView === 'split' ? 'w-1/2' : 'w-full'
              }`}
            >
              <MarkdownPreview content={debouncedContent} />
            </div>
          )}
        </main>
      </div>

      {/* Liquid Glass Export Modal */}
      {currentDoc && (
        <ExportModal
          document={currentDoc}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
};
