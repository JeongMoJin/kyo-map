import { chromium, devices } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "submission", "mobile-check");
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.LIVE_URL ?? "https://kyo-map.vercel.app";

async function main() {
  const browser = await chromium.launch();
  const iPhone = devices["iPhone 13"];
  const context = await browser.newContext({ ...iPhone });
  const page = await context.newPage();

  const pages: Array<[string, string]> = [
    ["/", "main"],
    ["/house/H00018", "detail"],
    ["/dashboard", "dashboard"],
  ];

  for (const [route, name] of pages) {
    console.log(`[mobile] ${route}`);
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    // Full-page mobile screenshot
    await page.screenshot({
      path: path.join(OUT, `${name}.png`),
      fullPage: true,
    });
  }

  // Also: filter sheet open state on main
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const fab = page.locator("button", { hasText: /^필터/ });
  await fab.click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(OUT, "main_filter_open.png"),
    fullPage: false,
  });

  await browser.close();
  console.log("DONE -> submission/mobile-check/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
