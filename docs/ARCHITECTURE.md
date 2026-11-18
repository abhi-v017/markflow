# MarkFlow Architecture Guide

MarkFlow is a local-first Markdown workspace engineered for fast, secure, and cross-platform editing.

## High-Level Topology

```
┌─────────────────────────────────────────────────────────────┐
│                   @markflow/markdown-core                   │
│  - markdown-it (CommonMark AST parser & renderer)           │
│  - highlight.js (Syntax highlighting for code blocks)       │
│  - DOMPurify (Sanitization against XSS)                     │
│  - Slug generation & Table of Contents extraction           │
│  - Document statistics (words, characters, reading time)    │
│  - Markdown syntax validation                               │
│  - Standalone HTML document export                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│        @markflow/web         │ │  @markflow/vscode-extension  │
│  - React 18 + Vite           │ │  - VS Code Extension API     │
│  - CodeMirror 6 Editor       │ │  - Native TextDocument model │
│  - IndexedDB storage (idb)   │ │  - Webview with strict CSP   │
│  - Responsive 3-panel UI     │ │  - Command palette actions   │
│  - Tailwind CSS styling      │ │  - VS Code CSS variables     │
└──────────────────────────────┘ └──────────────────────────────┘
```

## Key Architectural Decisions

1. **Shared Engine Boundary**:
   `@markflow/markdown-core` contains zero dependencies on React, browser UI components, or VS Code APIs. It compiles cleanly to both ESM and CommonJS via `tsup`.
2. **Safe by Default**:
   HTML in Markdown input is disabled by default in `markdown-it`, and all output passes through sanitization before rendering in web or extension webviews.
3. **Local-First Persistence**:
   The web application persists documents in client-side IndexedDB using the lightweight `idb` library. No server, accounts, or telemetry required.
4. **VS Code Native Storage**:
   The VS Code extension reads and synchronizes directly with the active editor's `TextDocument`, avoiding redundant file sync mechanisms.
