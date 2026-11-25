// Renders layout.html to entry.png (1024x1024) with Playwright.
// Build-time tool only: main.ts never uses it. Run: node render.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { statSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

let chromium;
try {
  ({ chromium } = require('playwright-core'));
} catch {
  ({ chromium } = require('/tmp/pw-shot/node_modules/playwright-core'));
}

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
await page.goto('file://' + join(here, 'layout.html'), { waitUntil: 'load' });
await page.waitForTimeout(400);
await page.screenshot({ path: join(here, 'entry.png'), type: 'png' });
await browser.close();

const size = statSync(join(here, 'entry.png')).size;
console.log('entry.png:', size, 'bytes');
if (size > 1048576) throw new Error('entry.png exceeds 1 MiB');
