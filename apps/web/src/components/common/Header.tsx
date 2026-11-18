import React from 'react';
import type { ActiveView } from '../../types';
import {
  Menu,
  Share2,
  Columns,
  Eye,
  PenLine,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  docTitle: string;
  isSaving: boolean;
  isDirty: boolean;
  theme?: string;
  onSetTheme?: (theme: any) => void;
  activeView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  onToggleSidebar: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  docTitle,
  isSaving,
  isDirty,
  activeView,
  onChangeView,
  onToggleSidebar,
  onOpenExport,
}) => {
  return (
    <header className="h-13 bg-black/60 backdrop-blur-xl border-b border-white/[0.07] flex items-center justify-between px-4 shrink-0 z-20 shadow-glass">
      {/* Left section: Sidebar toggle & Title */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] shadow-sm transition-all duration-200 active:scale-95"
          title="Toggle Document Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pastel-lavender/80 hidden sm:block" />
            <span className="font-medium text-xs text-white/90 truncate max-w-[160px] sm:max-w-xs md:max-w-md tracking-tight">
              {docTitle}
            </span>
          </div>

          <div className="flex items-center text-[11px] font-medium tracking-wide">
            {isSaving ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pastel-lavender/10 text-pastel-lavender border border-pastel-lavender/20">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving
              </span>
            ) : isDirty ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pastel-peach/10 text-pastel-peach border border-pastel-peach/20">
                Unsaved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pastel-mint/10 text-pastel-mint border border-pastel-mint/20">
                <CheckCircle2 className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Neumorphic View Switcher & Export */}
      <div className="flex items-center gap-2.5">
        {/* Neumorphic Liquid Glass View Switcher */}
        <div className="flex items-center bg-black/80 p-0.5 rounded-xl border border-white/[0.08] shadow-inner">
          <button
            onClick={() => onChangeView('editor')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeView === 'editor'
                ? 'bg-white/[0.12] text-pastel-lavender border border-white/[0.15] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
            title="Editor View"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => onChangeView('split')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeView === 'split'
                ? 'bg-white/[0.12] text-pastel-lavender border border-white/[0.15] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
            title="Split View"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
          <button
            onClick={() => onChangeView('preview')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeView === 'preview'
                ? 'bg-white/[0.12] text-pastel-lavender border border-white/[0.15] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
            title="Preview View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        {/* Liquid Glass Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-pastel-lavender/10 to-pastel-sky/10 hover:from-pastel-lavender/20 hover:to-pastel-sky/20 text-white rounded-xl border border-white/[0.12] hover:border-pastel-lavender/40 shadow-sm transition-all duration-200 active:scale-95 group"
        >
          <Share2 className="w-3.5 h-3.5 text-pastel-lavender group-hover:rotate-12 transition-transform duration-200" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
