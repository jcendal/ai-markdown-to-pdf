export function buildHtml(bodyHtml: string, fontSize: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    max-width: 860px;
    margin: 0 auto;
    padding: 20px 30px;
    font-size: ${fontSize}px;
    line-height: 1.6;
    color: #24292e;
  }
  h1 { font-size: 1.8em; border-bottom: 2px solid #e1e4e8; padding-bottom: 8px; margin-top: 32px; }
  h2 { font-size: 1.4em; border-bottom: 1px solid #e1e4e8; padding-bottom: 6px; margin-top: 28px; }
  h3 { font-size: 1.15em; margin-top: 24px; }
  h4 { font-size: 1em; margin-top: 20px; }
  table { border-collapse: collapse; width: 100%; margin: 14px 0; font-size: 0.92em; }
  th, td { border: 1px solid #d0d7de; padding: 6px 10px; text-align: left; vertical-align: top; }
  th { background: #f6f8fa; font-weight: 600; }
  tr:nth-child(even) { background: #f9fafb; }
  code {
    background: #f0f2f4; padding: 1px 5px; border-radius: 3px;
    font-size: 0.88em; font-family: 'SF Mono', 'Fira Code', Consolas, 'Courier New', monospace;
  }
  pre {
    background: #f6f8fa; padding: 14px; border-radius: 6px;
    overflow-x: auto; font-size: 0.88em; line-height: 1.5;
  }
  pre code { background: none; padding: 0; }
  pre.mermaid {
    background: white; text-align: center; padding: 24px 10px;
    border: 1px solid #e1e4e8; border-radius: 6px;
  }
  blockquote {
    border-left: 4px solid #dfe2e5; margin: 14px 0;
    padding: 4px 16px; color: #57606a; background: #f9fafb;
  }
  strong { font-weight: 600; }
  hr { border: none; border-top: 1px solid #e1e4e8; margin: 24px 0; }
  a { color: #0969da; text-decoration: none; }
  ul, ol { padding-left: 24px; }
  li { margin: 3px 0; }
  img { max-width: 100%; }
  @media print {
    body { max-width: 100%; padding: 0; }
    pre.mermaid { break-inside: avoid; page-break-inside: avoid; }
    table { break-inside: avoid; page-break-inside: avoid; }
    h1, h2, h3, h4 { page-break-after: avoid; }
  }
</style>
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
  window.__mermaidReady = true;
</script>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}
