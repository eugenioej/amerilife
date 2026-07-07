#!/usr/bin/env node
/**
 * Regenerate ideaxchange-jit-atlas-overview.pdf from the HTML source.
 * Requires: npm install puppeteer (run once in this folder)
 */
import puppeteer from "puppeteer";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(dir, "ideaxchange-jit-atlas-overview.html");
const pdfPath = join(dir, "ideaxchange-jit-atlas-overview.pdf");

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0", timeout: 120_000 });
await page.waitForFunction(
  () => document.querySelectorAll(".mermaid svg").length >= 2,
  { timeout: 90_000 },
);
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
});
await browser.close();
console.log(`PDF written: ${pdfPath}`);
