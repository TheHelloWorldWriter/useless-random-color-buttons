#!/usr/bin/env node

/**
 * Production Build Script
 *
 * This script creates a production-ready build with:
 * - Minified JavaScript files (separate, not bundled)
 * - Minified CSS via Tailwind CLI
 * - Copied static assets
 *
 * Uses Node.js built-in modules plus esbuild for JS minification.
 */

import { rmSync, mkdirSync, copyFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const SRC_DIR = join(ROOT_DIR, 'src');
const DIST_DIR = join(ROOT_DIR, 'dist');

/**
 * Cleans the dist directory
 */
function clean() {
  console.log('[clean] Removing dist directory...');
  if (existsSync(DIST_DIR)) {
    rmSync(DIST_DIR, { recursive: true, force: true });
  }
  console.log('[clean] Done');
}

/**
 * Creates necessary directories in dist
 */
function createDirectories() {
  console.log('[dirs] Creating directories...');
  mkdirSync(join(DIST_DIR, 'css'), { recursive: true });
  mkdirSync(join(DIST_DIR, 'js'), { recursive: true });
  mkdirSync(join(DIST_DIR, 'img', 'manifest'), { recursive: true });
  console.log('[dirs] Done');
}

/**
 * Copies static assets (HTML, favicon, manifest, service worker, images)
 */
function copyStaticAssets() {
  console.log('[assets] Copying static assets...');

  // Copy HTML
  copyFileSync(join(SRC_DIR, 'index.html'), join(DIST_DIR, 'index.html'));
  console.log('  - index.html');

  // Copy favicon
  copyFileSync(join(SRC_DIR, 'favicon.ico'), join(DIST_DIR, 'favicon.ico'));
  console.log('  - favicon.ico');

  // Copy manifest
  copyFileSync(join(SRC_DIR, 'site.webmanifest'), join(DIST_DIR, 'site.webmanifest'));
  console.log('  - site.webmanifest');

  // Copy service worker
  copyFileSync(join(SRC_DIR, 'sw.js'), join(DIST_DIR, 'sw.js'));
  console.log('  - sw.js');

  // Copy images
  const imgDir = join(SRC_DIR, 'img', 'manifest');
  const images = readdirSync(imgDir);
  for (const img of images) {
    copyFileSync(join(imgDir, img), join(DIST_DIR, 'img', 'manifest', img));
    console.log(`  - img/manifest/${img}`);
  }

  console.log('[assets] Done');
}

/**
 * Minifies JavaScript files using esbuild
 */
function minifyJavaScript() {
  return new Promise((resolve, reject) => {
    console.log('[js] Minifying JavaScript files...');

    const jsDir = join(SRC_DIR, 'js');
    const jsFiles = readdirSync(jsDir).filter((f) => extname(f) === '.js');

    const args = [...jsFiles.map((f) => join(jsDir, f)), '--minify', '--outdir=' + join(DIST_DIR, 'js'), '--format=esm'];

    const esbuild = spawn('npx', ['esbuild', ...args], {
      cwd: ROOT_DIR,
      stdio: 'pipe',
    });

    let output = '';
    esbuild.stdout.on('data', (data) => {
      output += data.toString();
    });
    esbuild.stderr.on('data', (data) => {
      output += data.toString();
    });

    esbuild.on('close', (code) => {
      if (code === 0) {
        // Parse and display file sizes
        const lines = output.trim().split('\n');
        for (const line of lines) {
          if (line.includes('dist/js/')) {
            console.log('  ' + line.trim());
          }
        }
        console.log('[js] Done');
        resolve();
      } else {
        reject(new Error(`esbuild exited with code ${code}`));
      }
    });
  });
}

/**
 * Builds and minifies CSS using Tailwind CLI
 */
function buildCSS() {
  return new Promise((resolve, reject) => {
    console.log('[css] Building and minifying CSS...');

    const tailwind = spawn('npx', ['@tailwindcss/cli', '-i', './src/css/input.css', '-o', './dist/css/output.css', '--minify'], {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });

    tailwind.on('close', (code) => {
      if (code === 0) {
        console.log('[css] Done');
        resolve();
      } else {
        reject(new Error(`Tailwind CSS exited with code ${code}`));
      }
    });
  });
}

/**
 * Displays build summary
 */
function displaySummary() {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Build Complete!                      ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log('Output: dist/');
  console.log('');
  console.log('To preview the build:');
  console.log('  npm run preview');
  console.log('');
}

/**
 * Main build process
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Production Build Starting...         ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');

  const startTime = Date.now();

  try {
    clean();
    createDirectories();
    copyStaticAssets();
    await minifyJavaScript();
    await buildCSS();

    const elapsed = Date.now() - startTime;
    console.log(`\n[build] Total time: ${elapsed}ms`);

    displaySummary();
  } catch (error) {
    console.error('\n[error] Build failed:', error.message);
    process.exit(1);
  }
}

main();
