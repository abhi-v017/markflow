import React, { useState } from 'react';
import { generateHtmlDocument, renderMarkdown } from '@markflow/markdown-core';
import type { DocumentItem } from '../../types';
import { Download, Printer, Copy, Check, X, FileCode, Sparkles } from 'lucide-react';

interface ExportModalProps {
  document: DocumentItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  document: doc,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const filename = `${doc.title.toLowerCase().replace(/\s+/g, '-') || 'document'}.md`;
    downloadFile(doc.content, filename, 'text/markdown;charset=utf-8');
  };

  const handleDownloadHtml = () => {
    const bodyHtml = renderMarkdown(doc.content);
    const fullHtml = generateHtmlDocument(doc.title, bodyHtml, {
      theme: 'dark',
    });
    const filename = `${doc.title.toLowerCase().replace(/\s+/g, '-') || 'document'}.html`;
    downloadFile(fullHtml, filename, 'text/html;charset=utf-8');
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyHtml = async () => {
    const bodyHtml = renderMarkdown(doc.content);
    await navigator.clipboard.writeText(bodyHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#09090f]/95 rounded-2xl p-6 max-w-md w-full shadow-glass border border-white/[0.1] animate-scale-in">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-pastel-lavender/15 border border-pastel-lavender/30">
              <Sparkles className="w-4 h-4 text-pastel-lavender" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">
                Export Document
              </h3>
              <p className="text-[11px] text-slate-400">
                Choose format for "{doc.title}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-2.5">
          {/* Download MD */}
          <button
            onClick={handleDownloadMarkdown}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-pastel-lavender/30 shadow-sm transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pastel-lavender/10 border border-pastel-lavender/20 text-pastel-lavender rounded-xl group-hover:scale-105 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-pastel-lavender transition-colors">
                  Markdown (.md)
                </p>
                <p className="text-[11px] text-slate-400">
                  Raw document source
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-pastel-lavender opacity-80 group-hover:opacity-100">
              Download
            </span>
          </button>

          {/* Download Standalone HTML */}
          <button
            onClick={handleDownloadHtml}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-pastel-mint/30 shadow-sm transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pastel-mint/10 border border-pastel-mint/20 text-pastel-mint rounded-xl group-hover:scale-105 transition-transform">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-pastel-mint transition-colors">
                  Styled HTML (.html)
                </p>
                <p className="text-[11px] text-slate-400">
                  Self-contained document for web viewing
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-pastel-mint opacity-80 group-hover:opacity-100">
              Download
            </span>
          </button>

          {/* Print / Save to PDF */}
          <button
            onClick={handlePrintPdf}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-pastel-peach/30 shadow-sm transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pastel-peach/10 border border-pastel-peach/20 text-pastel-peach rounded-xl group-hover:scale-105 transition-transform">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-pastel-peach transition-colors">
                  Print / Save as PDF
                </p>
                <p className="text-[11px] text-slate-400">
                  Native browser print dialog
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-pastel-peach opacity-80 group-hover:opacity-100">
              Print
            </span>
          </button>

          {/* Copy HTML Fragment */}
          <button
            onClick={handleCopyHtml}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-pastel-sky/30 shadow-sm transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pastel-sky/10 border border-pastel-sky/20 text-pastel-sky rounded-xl group-hover:scale-105 transition-transform">
                {copied ? (
                  <Check className="w-4 h-4 text-pastel-mint" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-pastel-sky transition-colors">
                  Copy HTML Snippet
                </p>
                <p className="text-[11px] text-slate-400">
                  Rendered HTML copied to clipboard
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 group-hover:text-white">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
