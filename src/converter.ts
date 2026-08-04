import { readFileSync, unlinkSync, writeFileSync } from "fs";
import { marked } from "marked";
import puppeteer from "puppeteer-core";
import { findChrome } from "./chrome-finder.js";
import { buildHtml } from "./html-template.js";

export interface ConvertOptions {
  inputPath: string;
  outputPath: string;
  chromePath?: string;
  pageSize: string;
  orientation: "portrait" | "landscape";
  margins: { top: string; bottom: string; left: string; right: string };
  fontSize: number;
  mermaidWaitMs: number;
  showPageNumbers: boolean;
}

export async function convertMarkdownToPdf(
  options: ConvertOptions
): Promise<void> {
  const chrome = options.chromePath || findChrome();
  if (!chrome) {
    throw new Error(
      'Chrome/Chromium not found. Install Google Chrome or set "aiMarkdownToPdf.chromePath" in settings.'
    );
  }

  const md = readFileSync(options.inputPath, "utf8");
  const cleanMd = md.replace(/^---[\s\S]*?---\n*/m, "");

  marked.use({
    renderer: {
      code({ text, lang }: { text: string; lang?: string | null }) {
        if (lang === "mermaid") {
          return `<pre class="mermaid">${text}</pre>`;
        }
        const escaped = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<pre><code class="language-${
          lang || ""
        }">${escaped}</code></pre>`;
      },
    },
  });

  const bodyHtml = marked.parse(cleanMd) as string;
  const fullHtml = buildHtml(bodyHtml, options.fontSize);

  const tmpHtml = options.inputPath.replace(/\.md$/i, ".__tmp__.html");
  writeFileSync(tmpHtml, fullHtml, "utf8");

  try {
    const browser = await puppeteer.launch({
      executablePath: chrome,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });

    const page = await browser.newPage();
    await page.goto(`file://${tmpHtml}`, {
      waitUntil: "networkidle0",
      timeout: 30_000,
    });

    await new Promise((r) => setTimeout(r, options.mermaidWaitMs));

    const footerTemplate = options.showPageNumbers
      ? '<div style="font-size:9px;color:#999;width:100%;text-align:center;margin:0 auto;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
      : "<span></span>";

    await page.pdf({
      path: options.outputPath,
      format: options.pageSize as any,
      landscape: options.orientation === "landscape",
      printBackground: true,
      margin: options.margins,
      displayHeaderFooter: options.showPageNumbers,
      headerTemplate: "<span></span>",
      footerTemplate,
    });

    await browser.close();
  } finally {
    try {
      unlinkSync(tmpHtml);
    } catch {
      // ignore cleanup errors
    }
  }
}
