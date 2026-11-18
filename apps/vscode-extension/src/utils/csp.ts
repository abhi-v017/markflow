import * as crypto from 'crypto';
import * as vscode from 'vscode';

export function getNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

export function getCspString(webview: vscode.Webview, nonce: string): string {
  return [
    `default-src 'none'`,
    `img-src ${webview.cspSource} https: data:`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `script-src 'nonce-${nonce}'`,
    `font-src ${webview.cspSource}`,
  ].join('; ');
}
