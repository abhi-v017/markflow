import React, { useState } from 'react';
import type { DocumentItem } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Copy,
  Trash2,
  Edit2,
  HardDrive,
  Sparkles,
} from 'lucide-react';

interface DocumentSidebarProps {
  documents: DocumentItem[];
  currentDocId: string;
  onSelectDoc: (id: string) => void;
  onCreateDoc: () => void;
  onRenameDoc: (id: string, newTitle: string) => void;
  onDuplicateDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  documents,
  currentDocId,
  onSelectDoc,
  onCreateDoc,
  onRenameDoc,
  onDuplicateDoc,
  onDeleteDoc,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startRenaming = (doc: DocumentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(doc.id);
    setEditingTitle(doc.title);
  };

  const submitRename = (id: string) => {
    if (editingTitle.trim()) {
      onRenameDoc(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocToDelete(id);
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#040406]/85 backdrop-blur-2xl border-r border-white/[0.07] flex flex-col transition-all duration-300 ease-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-glass' : '-translate-x-full'
        }`}
      >
        {/* Brand & New Document Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pastel-lavender/30 via-pastel-sky/20 to-pastel-mint/10 border border-white/20 flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pastel-lavender" />
            </div>
            <div>
              <span className="font-semibold text-xs tracking-wide text-white block">
                MarkFlow
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-tight block">
                v0.1.0 • local
              </span>
            </div>
          </div>
          <button
            onClick={onCreateDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-pastel-lavender/20 to-pastel-sky/20 hover:from-pastel-lavender/35 hover:to-pastel-sky/35 border border-white/15 hover:border-pastel-lavender/40 rounded-xl shadow-sm transition-all duration-200 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-pastel-lavender" />
            <span>New</span>
          </button>
        </div>

        {/* Neumorphic Search */}
        <div className="p-3 border-b border-white/[0.04]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter notes..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/60 border border-white/[0.06] focus:border-pastel-lavender/40 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pastel-lavender/30 transition-all"
            />
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {filteredDocs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-medium">
              No matching notes
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isActive = doc.id === currentDocId;
              const isEditing = doc.id === editingId;

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectDoc(doc.id);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-white/[0.08] to-white/[0.04] text-white border border-pastel-lavender/30 shadow-glass-sm font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <FileText
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-pastel-lavender'
                          : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => submitRename(doc.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') submitRename(doc.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-0.5 w-full bg-black border border-pastel-lavender rounded-lg text-xs text-white focus:outline-none"
                      />
                    ) : (
                      <span className="truncate tracking-tight">{doc.title}</span>
                    )}
                  </div>

                  {/* Contextual Actions on Hover */}
                  {!isEditing && (
                    <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-1">
                      <button
                        onClick={(e) => startRenaming(doc, e)}
                        className="p-1 hover:text-pastel-lavender rounded-md hover:bg-white/[0.08] transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateDoc(doc.id);
                        }}
                        className="p-1 hover:text-pastel-sky rounded-md hover:bg-white/[0.08] transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {documents.length > 1 && (
                        <button
                          onClick={(e) => confirmDelete(doc.id, e)}
                          className="p-1 hover:text-pastel-rose rounded-md hover:bg-white/[0.08] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/[0.06] text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <HardDrive className="w-3.5 h-3.5 text-pastel-mint/70" />
            IndexedDB Local
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.05] text-[10px]">
            {documents.length} docs
          </span>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0c0c12]/95 border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full shadow-glass animate-scale-in">
            <h3 className="font-semibold text-sm text-white mb-2">
              Delete Document?
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              This action permanently removes the document from your browser's IndexedDB storage.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setDocToDelete(null)}
                className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (docToDelete) onDeleteDoc(docToDelete);
                  setDocToDelete(null);
                }}
                className="px-3.5 py-1.5 text-xs bg-gradient-to-r from-red-500/80 to-rose-600/80 hover:from-red-500 hover:to-rose-600 text-white font-medium rounded-xl shadow-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
};
