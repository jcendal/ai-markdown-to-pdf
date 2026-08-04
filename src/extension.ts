import path from "path";
import * as vscode from "vscode";
import { convertMarkdownToPdf, type ConvertOptions } from "./converter.js";

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(
    "aiMarkdownToPdf.exportToPdf",
    async (uri?: vscode.Uri) => {
      const fileUri = uri ?? vscode.window.activeTextEditor?.document.uri;

      if (!fileUri || !fileUri.fsPath.endsWith(".md")) {
        vscode.window.showWarningMessage(
          "Open a Markdown (.md) file to export."
        );
        return;
      }

      const doc = await vscode.workspace.openTextDocument(fileUri);
      if (doc.isDirty) {
        await doc.save();
      }

      const config = vscode.workspace.getConfiguration("aiMarkdownToPdf");
      const outputPath = fileUri.fsPath.replace(/\.md$/i, ".pdf");

      const options: ConvertOptions = {
        inputPath: fileUri.fsPath,
        outputPath,
        chromePath: config.get<string>("chromePath") || undefined,
        pageSize: config.get<string>("pageSize", "A4"),
        orientation: config.get<"portrait" | "landscape">(
          "orientation",
          "portrait"
        ),
        margins: config.get("margins", {
          top: "18mm",
          bottom: "18mm",
          left: "15mm",
          right: "15mm",
        }),
        fontSize: config.get<number>("fontSize", 13),
        mermaidWaitMs: config.get<number>("mermaidWaitMs", 4000),
        showPageNumbers: config.get<boolean>("showPageNumbers", true),
      };

      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "AI Markdown to PDF",
            cancellable: false,
          },
          async (progress) => {
            progress.report({ message: "Rendering Mermaid diagrams..." });
            await convertMarkdownToPdf(options);
          }
        );

        const openAfter = config.get<boolean>("openAfterExport", true);
        const fileName = path.basename(outputPath);

        if (openAfter) {
          const openAction = await vscode.window.showInformationMessage(
            `PDF exported: ${fileName}`,
            "Open PDF",
            "Show in Finder"
          );
          if (openAction === "Open PDF") {
            vscode.env.openExternal(vscode.Uri.file(outputPath));
          } else if (openAction === "Show in Finder") {
            vscode.commands.executeCommand(
              "revealFileInOS",
              vscode.Uri.file(outputPath)
            );
          }
        } else {
          vscode.window.showInformationMessage(`PDF exported: ${fileName}`);
        }
      } catch (err: any) {
        vscode.window.showErrorMessage(
          `AI Markdown to PDF: ${err.message || "Unknown error"}`
        );
      }
    }
  );

  context.subscriptions.push(command);
}

export function deactivate() {}
