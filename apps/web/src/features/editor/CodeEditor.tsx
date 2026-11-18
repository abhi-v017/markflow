import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  bracketMatching,
  defaultHighlightStyle,
  syntaxHighlighting,
} from '@codemirror/language';

interface CodeEditorProps {
  content: string;
  onChange: (value: string) => void;
  docId: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  content,
  onChange,
  docId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const currentContentRef = useRef(content);
  currentContentRef.current = content;

  useEffect(() => {
    if (!containerRef.current) return;

    const startState = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        bracketMatching(),
        markdown(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        oneDark,
        EditorView.lineWrapping,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const nextVal = update.state.doc.toString();
            currentContentRef.current = nextVal;
            onChange(nextVal);
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14.5px',
            backgroundColor: '#000000',
            color: '#e2e8f0',
          },
          '.cm-content': {
            padding: '24px 28px',
            caretColor: '#c4b5fd',
          },
          '.cm-gutters': {
            backgroundColor: '#030305',
            color: '#475569',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            paddingRight: '8px',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(196, 181, 253, 0.08)',
            color: '#c4b5fd',
          },
          '.cm-selectionBackground, ::selection': {
            backgroundColor: 'rgba(196, 181, 253, 0.22) !important',
          },
          '.cm-cursor': {
            borderLeftColor: '#c4b5fd',
            borderLeftWidth: '2px',
          },
        }, { dark: true }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [docId]);

  // Sync external content update if doc changed from outside
  useEffect(() => {
    const view = viewRef.current;
    if (view && content !== currentContentRef.current) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: content },
      });
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden focus:outline-none bg-black"
    />
  );
};
