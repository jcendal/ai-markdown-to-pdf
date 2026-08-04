import { execSync } from "child_process";
import { existsSync } from "fs";
import { platform } from "os";

const MACOS_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
];

const LINUX_NAMES = [
  "google-chrome-stable",
  "google-chrome",
  "chromium-browser",
  "chromium",
  "microsoft-edge-stable",
  "brave-browser",
];

const WINDOWS_PATHS = [
  `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
  `${process.env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
  `${process.env.PROGRAMFILES}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
  `${process.env.LOCALAPPDATA}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
];

function findOnMac(): string | undefined {
  return MACOS_PATHS.find((p) => existsSync(p));
}

function findOnLinux(): string | undefined {
  for (const name of LINUX_NAMES) {
    try {
      const result = execSync(`which ${name}`, { encoding: "utf8" }).trim();
      if (result) {
        return result;
      }
    } catch {
      // not found
    }
  }
  return undefined;
}

function findOnWindows(): string | undefined {
  return WINDOWS_PATHS.find((p) => p && existsSync(p));
}

export function findChrome(): string | undefined {
  const os = platform();
  switch (os) {
    case "darwin":
      return findOnMac();
    case "linux":
      return findOnLinux();
    case "win32":
      return findOnWindows();
    default:
      return undefined;
  }
}
