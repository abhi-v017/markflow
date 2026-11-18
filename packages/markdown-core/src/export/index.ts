export interface ExportHtmlOptions {
  theme?: 'light' | 'dark';
  customCss?: string;
}

export function generateHtmlDocument(
  title: string,
  bodyHtml: string,
  options: ExportHtmlOptions = {}
): string {
  const isDark = options.theme === 'dark';
  const bgColor = isDark ? '#030305' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#24292f';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#d0d7de';
  const codeBg = isDark ? '#0d0d14' : '#f6f8fa';

  const defaultCss = `
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: ${textColor};
      background-color: ${bgColor};
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      color: inherit;
    }
    h1 { font-size: 2em; border-bottom: 1px solid ${borderColor}; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid ${borderColor}; padding-bottom: 0.3em; }
    p, blockquote, ul, ol, dl, table, pre { margin-top: 0; margin-bottom: 16px; }
    a { color: #58a6ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: ${codeBg};
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    }
    pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: ${codeBg};
      border-radius: 6px;
      border: 1px solid ${borderColor};
    }
    pre code { background-color: transparent; padding: 0; }
    blockquote {
      padding: 0 1em;
      color: #8b949e;
      border-left: 0.25em solid ${borderColor};
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    table th, table td {
      padding: 6px 13px;
      border: 1px solid ${borderColor};
    }
    table tr:nth-child(2n) { background-color: ${codeBg}; }
    img { max-width: 100%; height: auto; }
    @media print {
      body { background-color: #fff; color: #000; max-width: 100%; padding: 0; }
      pre, blockquote { page-break-inside: avoid; }
    }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(title || 'MarkFlow Document')}</title>
  <style>
    ${defaultCss}
    ${options.customCss || ''}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
