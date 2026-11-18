# MarkFlow Development Guide

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build packages**:
   ```bash
   # Build the shared markdown-core package
   pnpm --filter @markflow/markdown-core build

   # Build all packages and apps
   pnpm build
   ```

3. **Run Unit Tests**:
   ```bash
   pnpm test
   ```

4. **Start Web Application (Dev Mode)**:
   ```bash
   pnpm --filter @markflow/web dev
   ```

5. **Run Linting & Formatting**:
   ```bash
   pnpm lint
   pnpm format
   ```
