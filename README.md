# MarkFlow ⚡

[![Version](https://img.shields.io/badge/version-0.1.3-blue.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=abekdev.markflow-preview)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Local First](https://img.shields.io/badge/Privacy-100%25%20Local-emerald.svg?style=flat-square)](#core-product-philosophy)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=flat-square)](https://nodejs.org/)
[![VS Code](https://img.shields.io/badge/VS%20Code-v1.85+-orange.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=abekdev.markflow-preview)

A high-performance, local-first **Markdown workspace and developer productivity suite**, available as a standalone **Web Application** and an official **Visual Studio Code Extension**, both powered by a shared, universal Markdown processing engine.

---

## 📸 Product Showcase

### 1. Web Application (`@markflow/web`)
> Pure AMOLED Black liquid glass interface with live synchronized preview, CodeMirror 6 editor, Table of Contents drawer, and local IndexedDB persistence.

![MarkFlow Web Workspace](https://raw.githubusercontent.com/abhi-v017/markflow/main/docs/screenshots/web-split-view.png)

### 2. VS Code Extension (`markflow-preview`)
> Side-by-side native Markdown preview, real-time word/character count, reading time estimation, and syntax highlighting.

![MarkFlow VS Code Extension](https://raw.githubusercontent.com/abhi-v017/markflow/main/docs/screenshots/vscode-preview.png)

---

## 💡 Core Product Philosophy

- **Write Markdown Once**: Identical rendering, parsing, syntax highlighting, and Table of Contents extraction across the Web and VS Code.
- **Local-First & Private**: Zero telemetry, zero mandatory cloud accounts, and no third-party servers. Your documents remain strictly on your machine.
- **Fast Startup & Minimal Footprint**: Modular architecture with debounced preview updates ($150\text{ms}$) and minimal dependency footprint.

---

## 🏛️ Monorepo Architecture

```
markflow/
├── apps/
│   ├── web/                    # React 18 + Vite + CodeMirror 6 + Tailwind CSS + IndexedDB
│   └── vscode-extension/       # Native VS Code Extension (Webview API + CSP)
├── packages/
│   └── markdown-core/          # Shared engine (markdown-it, highlight.js, DOMPurify)
├── docs/                       # Architectural specs & development guides
└── docs/screenshots/          # High-resolution showcase assets
```

### The Shared Engine: `@markflow/markdown-core`
All parsing, AST traversal, syntax highlighting, slug generation, and metrics are encapsulated within `@markflow/markdown-core`. Fix a Markdown rendering rule once, and both the Web App and VS Code Extension immediately benefit.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/abhi-v017/markflow.git
cd markflow

# 2. Install dependencies across all workspaces
npm install

# 3. Start the Web Workspace in dev mode
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build All Workspaces

```bash
# Build the shared engine and all packages
npm run build
```

---

## 📦 Deployment & Marketplace

### Web Application (Vercel)
The web application is pre-configured with [vercel.json](vercel.json) for instant deployment:
```bash
npx vercel --prod
```

### VS Code Extension (Marketplace & VSIX)
Build and package the extension locally:
```bash
cd apps/vscode-extension
npm run build
npx @vscode/vsce package --no-dependencies -o abekdev.markflow-preview-0.1.1.vsix
```
Install directly into VS Code:
```text
VS Code -> Extensions (Ctrl+Shift+X) -> "..." Menu -> "Install from VSIX..."
```
Or install from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=abekdev.markflow-preview).

---

## 📄 License

Open-source software licensed under the [MIT License](LICENSE).
