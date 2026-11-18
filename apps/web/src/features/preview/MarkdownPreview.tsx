import React, { useState } from 'react';
import { renderDocument, TocItem } from '@markflow/markdown-core';
import { ListOrdered, Clock, FileText, ChevronRight } from 'lucide-react';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const [showToc, setShowToc] = useState<boolean>(true);
  const { html, toc, stats } = renderDocument(content);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#020203] border-l border-white/[0.06]">
      {/* Top Preview Glass Bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.05] bg-black/40 backdrop-blur-md text-xs">
        <span className="font-medium tracking-wider text-[11px] text-slate-400 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pastel-mint shadow-[0_0_8px_rgba(167,243,208,0.6)]" />
          Live Preview
        </span>
        <button
          onClick={() => setShowToc((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all duration-200 border ${
            showToc && toc.length > 0
              ? 'bg-pastel-lavender/15 text-pastel-lavender border-pastel-lavender/30 shadow-sm'
              : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
          }`}
          title="Toggle Table of Contents"
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>TOC ({toc.length})</span>
        </button>
      </div>

      {/* Main Split: Rendered Content + Floating Liquid Glass TOC */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Rendered HTML */}
        <div className="flex-1 overflow-y-auto px-8 py-8 markdown-body">
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="max-w-3xl mx-auto"
          />
        </div>

        {/* Table of Contents Floating Glass Drawer */}
        {showToc && toc.length > 0 && (
          <aside className="w-60 border-l border-white/[0.06] bg-[#060609]/75 backdrop-blur-xl p-4 overflow-y-auto text-xs hidden lg:block animate-fade-in shadow-glass-sm">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-1.5 text-xs tracking-tight">
              <ChevronRight className="w-3.5 h-3.5 text-pastel-lavender" />
              Table of Contents
            </h4>
            <nav className="space-y-1">
              {toc.map((item: TocItem, index: number) => {
                const indent = (item.level - 1) * 12;
                return (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => scrollToHeading(item.id)}
                    style={{ paddingLeft: `${Math.max(6, indent)}px` }}
                    className="block w-full text-left truncate py-1.5 px-2 text-slate-400 hover:text-pastel-lavender hover:bg-white/[0.04] rounded-lg transition-all duration-150"
                    title={item.text}
                  >
                    {item.text}
                  </button>
                );
              })}
            </nav>
          </aside>
        )}
      </div>

      {/* Bottom Liquid Glass Metrics Bar */}
      <footer className="flex items-center justify-between px-5 py-2 border-t border-white/[0.05] bg-black/60 backdrop-blur-md text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <FileText className="w-3.5 h-3.5 text-pastel-mint" />
            <strong className="text-white">{stats.words}</strong> words
          </span>
          <span className="text-slate-600">•</span>
          <span>
            <strong className="text-slate-300">{stats.characters}</strong> chars
          </span>
          <span className="text-slate-600">•</span>
          <span>
            <strong className="text-slate-300">{stats.lines}</strong> lines
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-pastel-peach/90 bg-pastel-peach/[0.06] px-2.5 py-0.5 rounded-full border border-pastel-peach/20">
          <Clock className="w-3 h-3 text-pastel-peach" />
          <span>{stats.readingTimeMinutes} min read</span>
        </div>
      </footer>
    </div>
  );
};
