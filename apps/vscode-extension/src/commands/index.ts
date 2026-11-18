import * as vscode from 'vscode';
import {
  extractTableOfContents,
  generateHtmlDocument,
  renderMarkdown,
} from '@markflow/markdown-core';
import { MarkFlowPreviewPanel } from '../panels/PreviewPanel';

export function registerCommands(context: vscode.ExtensionContext) {
  // Command 1: Open Preview
  context.subscriptions.push(
    vscode.commands.registerCommand('markflow.openPreview', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== 'markdown') {
        vscode.window.showWarningMessage('Please open a Markdown file first.');
        return;
      }
      MarkFlowPreviewPanel.createOrShow(context.extensionUri, editor.document);
    })
  );

  // Command 2: Refresh Preview
  context.subscriptions.push(
    vscode.commands.registerCommand('markflow.refreshPreview', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && MarkFlowPreviewPanel.currentPanel) {
        MarkFlowPreviewPanel.currentPanel.update(editor.document);
        vscode.window.showInformationMessage('MarkFlow Preview refreshed.');
      }
    })
  );

  // Command 3: Export as HTML
  context.subscriptions.push(
    vscode.commands.registerCommand('markflow.exportHtml', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== 'markdown') {
        vscode.window.showWarningMessage('Please open a Markdown file to export.');
        return;
      }

      const doc = editor.document;
      const text = doc.getText();
      const filename = doc.fileName.split(/[/\\]/).pop()?.replace(/\.md$/i, '') || 'document';

      const bodyHtml = renderMarkdown(text);
      const fullHtml = generateHtmlDocument(filename, bodyHtml);

      const targetUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(`${filename}.html`),
        filters: { 'HTML files': ['html'] },
      });

      if (targetUri) {
        await vscode.workspace.fs.writeFile(
          targetUri,
          Buffer.from(fullHtml, 'utf8')
        );
        vscode.window.showInformationMessage(
          `Exported HTML successfully to ${targetUri.fsPath}`
        );
      }
    })
  );

  // Command 4: Copy Table of Contents
  context.subscriptions.push(
    vscode.commands.registerCommand('markflow.copyToc', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== 'markdown') {
        vscode.window.showWarningMessage('Please open a Markdown file first.');
        return;
      }

      const text = editor.document.getText();
      const toc = extractTableOfContents(text);

      if (toc.length === 0) {
        vscode.window.showInformationMessage('No headings found in the current document.');
        return;
      }

      const formattedToc = toc
        .map((item) => {
          const indent = '  '.repeat(Math.max(0, item.level - 1));
          return `${indent}- [${item.text}](#${item.id})`;
        })
        .join('\n');

      await vscode.env.clipboard.writeText(formattedToc);
      vscode.window.showInformationMessage(
        `Copied ${toc.length} Table of Contents items to clipboard!`
      );
    })
  );
}
