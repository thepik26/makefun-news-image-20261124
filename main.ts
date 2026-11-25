// news-image-20261124 entry (Node 22, standard library only).
// The image lives beside this file as entry.png; the program writes an
// exact copy of it to the output directory as entry.png. It reads no
// network and no other file, so two runs always write identical bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output, e.g.:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const IMAGE_NAME = 'entry.png';

function entryImagePath(): string {
  return join(dirname(fileURLToPath(import.meta.url)), IMAGE_NAME);
}

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
}

const image = readFileSync(entryImagePath());
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!image.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error(`${IMAGE_NAME} is not a PNG`);
}
const targetDir = outputDir();
mkdirSync(targetDir, { recursive: true });
const target = join(targetDir, IMAGE_NAME);
writeFileSync(target, image);
if (readFileSync(target).length !== image.length) {
  throw new Error(`wrote ${target} with the wrong size`);
}
console.log(`wrote ${target} (${image.length} bytes)`);
