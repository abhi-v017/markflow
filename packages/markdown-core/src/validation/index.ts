import type { ValidationIssue } from '../types';

export function validateMarkdown(markdown: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!markdown) {
    return issues;
  }

  const lines = markdown.split(/\r\n|\r|\n/);
  let inCodeBlock = false;
  let codeBlockStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check code fence matching
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockStartLine = lineNum;
      } else {
        inCodeBlock = false;
      }
      continue;
    }

    // Skip validation inside code blocks
    if (inCodeBlock) {
      continue;
    }

    // Check for empty headings (e.g. "#", "## ")
    if (/^#{1,6}\s*$/.test(line.trim())) {
      issues.push({
        line: lineNum,
        message: 'Empty heading detected',
        severity: 'warning',
      });
    }

    // Check for empty link targets (e.g. "[text]()")
    if (/\[.*?\]\(\s*\)/.test(line)) {
      issues.push({
        line: lineNum,
        message: 'Empty link URL target found',
        severity: 'warning',
      });
    }

    // Check for empty image sources (e.g. "![alt]()")
    if (/!\[.*?\]\(\s*\)/.test(line)) {
      issues.push({
        line: lineNum,
        message: 'Empty image source found',
        severity: 'warning',
      });
    }
  }

  // Check unclosed code block
  if (inCodeBlock) {
    issues.push({
      line: codeBlockStartLine,
      message: 'Unclosed code block (missing closing ```)',
      severity: 'error',
    });
  }

  return issues;
}
