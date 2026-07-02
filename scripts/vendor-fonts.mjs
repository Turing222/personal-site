// One-time vendoring script for the LXGW WenKai GB webfont.
// Downloads the pinned npm tarball, verifies its SHA512 integrity, and
// extracts only the regular sliced-woff2 set into public/fonts/.
// Rerun (after updating VERSION + INTEGRITY) to upgrade the font.
//
// Usage: node scripts/vendor-fonts.mjs

import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const VERSION = '1.522.0';
const TARBALL_URL = `https://registry.npmjs.org/lxgw-wenkai-gb-web/-/lxgw-wenkai-gb-web-${VERSION}.tgz`;
const INTEGRITY_SHA512 = 'aklciHOJfGOY2s/csLcNUwVnZ5JziCi8xrnW0PWI9cDVFDl8qTiKOQFDBuVLMCQtZFZkUDrhNWmkhuPa4VjnJg==';
const SOURCE_SUBDIR = 'package/lxgwwenkaigb-regular';
const TARGET_DIR = path.resolve('public/fonts/lxgw-wenkai-gb-regular');

async function main() {
  const workDir = await mkdtemp(path.join(tmpdir(), 'lxgw-font-'));
  try {
    console.log(`Downloading ${TARBALL_URL} ...`);
    const response = await fetch(TARBALL_URL);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    const tarball = Buffer.from(await response.arrayBuffer());

    const actual = createHash('sha512').update(tarball).digest('base64');
    if (actual !== INTEGRITY_SHA512) {
      throw new Error(`Integrity mismatch!\n  expected sha512-${INTEGRITY_SHA512}\n  actual   sha512-${actual}`);
    }
    console.log('Integrity verified (sha512).');

    const tarballPath = path.join(workDir, 'font.tgz');
    await writeFile(tarballPath, tarball);
    // Run tar from workDir with relative paths — GNU tar on Windows treats
    // "C:\..." as a remote host specifier otherwise.
    execFileSync('tar', ['-xzf', 'font.tgz', SOURCE_SUBDIR], { cwd: workDir });

    await rm(TARGET_DIR, { recursive: true, force: true });
    await mkdir(path.dirname(TARGET_DIR), { recursive: true });
    await cp(path.join(workDir, SOURCE_SUBDIR), TARGET_DIR, { recursive: true });

    const css = await readFile(path.join(TARGET_DIR, 'result.css'), 'utf8');
    const faceCount = (css.match(/@font-face/g) ?? []).length;
    console.log(`Vendored ${faceCount} @font-face slices into ${TARGET_DIR}`);
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
