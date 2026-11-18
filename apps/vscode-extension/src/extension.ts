import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { MarkFlowPreviewPanel } from './panels/PreviewPanel';

let debounceTimer: NodeJS.Timeout | null = null;

export function activate(context: vscode.ExtensionContext) {
  // Register all extension commands
  registerCommands(context);

  // Auto-sync preview when active markdown document content changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (
        MarkFlowPreviewPanel.currentPanel &&
        event.document.uri.toString() ===
          MarkFlowPreviewPanel.currentPanel.documentUri.toString()
      ) {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
          MarkFlowPreviewPanel.currentPanel?.update(event.document);
        }, 150);
      }
    })
  );

  // Switch preview when active text editor switches to another markdown file
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (
        editor &&
        editor.document.languageId === 'markdown' &&
        MarkFlowPreviewPanel.currentPanel
      ) {
        MarkFlowPreviewPanel.currentPanel.update(editor.document);
      }
    })
  );
}

export function deactivate() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
}
