export function getPreviewStyles(): string {
  return `
    :root {
      color-scheme: light dark;
    }
    body {
      font-family: var(--vscode-editor-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
      font-size: var(--vscode-editor-font-size, 14px);
      line-height: 1.6;
      color: var(--vscode-editor-foreground, #cccccc);
      background-color: var(--vscode-editor-background, #1e1e1e);
      padding: 20px 28px;
      margin: 0;
      word-wrap: break-word;
    }
    h1, h2, h3, h4, h5, h6 {
      color: var(--vscode-editor-foreground);
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 14px;
      line-height: 1.25;
    }
    h1 {
      font-size: 1.85em;
      border-bottom: 1px solid var(--vscode-widget-border, rgba(125, 125, 125, 0.3));
      padding-bottom: 0.3em;
    }
    h2 {
      font-size: 1.4em;
      border-bottom: 1px solid var(--vscode-widget-border, rgba(125, 125, 125, 0.2));
      padding-bottom: 0.25em;
    }
    h3 {
      font-size: 1.2em;
      color: #c4b5fd;
    }
    a {
      color: #7dd3fc;
      text-decoration: none;
    }
    a:hover {
      color: #bae6fd;
      text-decoration: underline;
    }
    p, blockquote, ul, ol, dl, table, pre {
      margin-top: 0;
      margin-bottom: 16px;
    }
    code {
      font-family: var(--vscode-editor-font-family, ui-monospace, monospace);
      font-size: 85%;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      color: #a7f3d0;
      background-color: var(--vscode-textCodeBlock-background, rgba(125, 125, 125, 0.15));
    }
    pre {
      padding: 14px;
      overflow: auto;
      font-size: 85%;
      border-radius: 6px;
      background-color: var(--vscode-textCodeBlock-background, rgba(125, 125, 125, 0.15));
      border: 1px solid var(--vscode-widget-border, transparent);
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      margin: 0 0 16px 0;
      padding: 0 1em;
      color: var(--vscode-descriptionForeground, #8b949e);
      border-left: 4px solid var(--vscode-textBlockQuote-border, #007acc);
      background-color: var(--vscode-textBlockQuote-background, transparent);
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    table th, table td {
      padding: 6px 12px;
      border: 1px solid var(--vscode-widget-border, rgba(125, 125, 125, 0.3));
    }
    table tr:nth-child(2n) {
      background-color: rgba(125, 125, 125, 0.05);
    }
    img {
      max-width: 100%;
      height: auto;
    }
    .metrics-header {
      display: flex;
      gap: 16px;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--vscode-widget-border, rgba(125, 125, 125, 0.2));
    }
  `;
}
