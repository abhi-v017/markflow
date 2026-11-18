# MarkFlow ⚡

A high-performance, local-first Markdown workspace and developer productivity tool, available as a standalone Web Application and a Visual Studio Code Extension powered by a shared Markdown engine.

---

## Overview

MarkFlow is designed with a strict **local-first, minimal-dependency** philosophy:
- **Write Markdown Once**: Identical rendering, parsing, syntax highlighting, and table of contents extraction across the Web and VS Code.
- **Privacy by Design**: Zero telemetry, zero mandatory cloud infrastructure, and no accounts. Documents stay on your machine.
- **Instant Speed**: Lightweight editor powered by CodeMirror 6 and debounced live rendering.

---

## Monorepo Architecture

```
markflow/
├── apps/
│   ├── web/                    # React 18 + Vite + Tailwind CSS + idb
│   └── vscode-extension/       # Native VS Code Extension + Webview API
├── packages/
│   └── markdown-core/          # Shared engine (markdown-it, highlight.js, DOMPurify)
├── docs/                       # Architecture & Development guides
└── .github/workflows/          # Continuous Integration workflow
```

---

## Features

### Web Application (`@markflow/web`)
- **Responsive 3-Panel Layout**: Document sidebar, CodeMirror 6 editor, and live HTML preview with collapsible Table of Contents.
- **Local Persistence**: Client-side storage via IndexedDB (`idb`) with debounced auto-save.
- **Document Management**: Create, rename, duplicate, search, and delete documents with confirmation.
- **Themes**: Seamless support for Light, Dark, and System color schemes.
- **Live Metrics**: Real-time word count, character count, and reading time estimation.
- **Export Options**: Download raw `.md`, standalone styled `.html`, or print to PDF.

### VS Code Extension (`@markflow/vscode-extension`)
- **Native Commands**:
  - `MarkFlow: Open Markdown Preview` (opens synchronized preview beside active document)
  - `MarkFlow: Refresh Preview`
  - `MarkFlow: Export as HTML` (saves self-contained HTML file via file picker)
  - `MarkFlow: Copy Table of Contents` (copies formatted Markdown heading list to clipboard)
- **Native Look & Feel**: Dynamically styled with VS Code theme CSS variables.
- **Security**: Strict Content Security Policy (CSP) with cryptographic nonces and HTML sanitization.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Workspace & Tooling** | pnpm Workspaces, TypeScript, tsup, esbuild, Vitest |
| **Core Engine** | markdown-it, highlight.js, DOMPurify |
| **Web Frontend** | React 18, Vite, Tailwind CSS, Lucide React, CodeMirror 6, idb |
| **VS Code Extension** | VS Code Extension API, Webview API, @vscode/vsce |

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/markflow.git
cd markflow

# Install all workspace dependencies
pnpm install
```

### Development

```bash
# Run tests across all packages
pnpm test

# Start the web application in dev mode
pnpm --filter @markflow/web dev

# Build the shared engine and all packages
pnpm build
```

---

## Deployment & Distribution

### Web Application (Cloudflare Pages / Vercel)
The web application is a static Single Page Application (SPA).
1. Build the web app:
   ```bash
   pnpm --filter @markflow/web build
   ```
2. Deploy the `apps/web/dist` directory to Cloudflare Pages, Vercel, or GitHub Pages. No backend or environment variables required.

### VS Code Extension (.vsix)
Package the extension locally using `@vscode/vsce`:
```bash
cd apps/vscode-extension
pnpm run build
npx @vscode/vsce package
```
Install the generated `.vsix` in VS Code via:
`Extensions View -> ... Menu -> Install from VSIX...`

---

## License

This project is open-source software licensed under the MIT License.
