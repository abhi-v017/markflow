import * as vscode from 'vscode';
import { renderDocument } from '@markflow/markdown-core';
import { getNonce, getCspString } from '../utils/csp';
import { getPreviewStyles } from '../utils/styles';

export class MarkFlowPreviewPanel {
  public static currentPanel: MarkFlowPreviewPanel | undefined;
  public static readonly viewType = 'markflow.preview';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _documentUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri, document: vscode.TextDocument) {
    const column = vscode.ViewColumn.Beside;

    if (MarkFlowPreviewPanel.currentPanel) {
      MarkFlowPreviewPanel.currentPanel._documentUri = document.uri;
      MarkFlowPreviewPanel.currentPanel._panel.reveal(column);
      MarkFlowPreviewPanel.currentPanel.update(document);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      MarkFlowPreviewPanel.viewType,
      `Preview: ${document.fileName.split(/[/\\]/).pop()}`,
      column,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
        retainContextWhenHidden: true,
      }
    );

    MarkFlowPreviewPanel.currentPanel = new MarkFlowPreviewPanel(
      panel,
      extensionUri,
      document.uri
    );
    MarkFlowPreviewPanel.currentPanel.update(document);
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    documentUri: vscode.Uri
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._documentUri = documentUri;

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.onDidChangeViewState(
      () => {
        if (this._panel.visible) {
          const doc = vscode.workspace.textDocuments.find(
            (d) => d.uri.toString() === this._documentUri.toString()
          );
          if (doc) {
            this.update(doc);
          }
        }
      },
      null,
      this._disposables
    );
  }

  public get documentUri(): vscode.Uri {
    return this._documentUri;
  }

  public update(document: vscode.TextDocument) {
    this._documentUri = document.uri;
    const filename = document.fileName.split(/[/\\]/).pop();
    this._panel.title = `Preview: ${filename}`;
    this._panel.webview.html = this._getHtmlForWebview(
      this._panel.webview,
      document.getText(),
      filename || 'Markdown'
    );
  }

  private _getHtmlForWebview(
    webview: vscode.Webview,
    markdownText: string,
    title: string
  ): string {
    const nonce = getNonce();
    const csp = getCspString(webview, nonce);
    const styles = getPreviewStyles();
    const { html, stats } = renderDocument(markdownText);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${styles}
  </style>
</head>
<body>
  <div class="metrics-header">
    <span>📝 ${stats.words} words</span>
    <span>🔤 ${stats.characters} chars</span>
    <span>⏱️ ${stats.readingTimeMinutes} min read</span>
  </div>
  <div class="markdown-content">
    ${html}
  </div>
</body>
</html>`;
  }

  public dispose() {
    MarkFlowPreviewPanel.currentPanel = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const d = this._disposables.pop();
      if (d) {
        d.dispose();
      }
    }
  }
}
