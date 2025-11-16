#!/usr/bin/env node

/**
 * Development Server Script
 *
 * This script provides a development environment with:
 * - File watching: Monitors src/ directory for changes
 * - Auto-copy: Copies changed files to dist/ automatically
 * - HTTP server: Serves dist/ directory
 * - Tailwind CSS: Runs Tailwind CLI in watch mode
 *
 * Uses only Node.js built-in modules (no extra dev dependencies).
 * Note: Manual browser refresh required (no auto-reload).
 */

import { watch, copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname, extname } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const SRC_DIR = join(ROOT_DIR, 'src');
const DIST_DIR = join(ROOT_DIR, 'dist');

// Files/directories to watch and copy
const WATCH_PATTERNS = ['.html', '.js', '.ico', '.webmanifest'];
const IGNORE_PATTERNS = ['input.css']; // CSS handled by Tailwind

// Debounce map to prevent duplicate events
const debounceMap = new Map();
const DEBOUNCE_MS = 100;

/**
 * Copies a file from src to dist, preserving directory structure
 */
function copyFile(srcPath) {
  const relativePath = relative(SRC_DIR, srcPath);
  const destPath = join(DIST_DIR, relativePath);

  // Ensure destination directory exists
  const destDir = dirname(destPath);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  try {
    copyFileSync(srcPath, destPath);
    console.log(`[copy] ${relativePath}`);
  } catch (error) {
    console.error(`[error] Failed to copy ${relativePath}:`, error.message);
  }
}

/**
 * Recursively copies a directory from src to dist
 */
function copyDirectory(srcPath) {
  const relativePath = relative(SRC_DIR, srcPath);
  const destPath = join(DIST_DIR, relativePath);

  if (!existsSync(destPath)) {
    mkdirSync(destPath, { recursive: true });
  }

  const items = readdirSync(srcPath);
  for (const item of items) {
    const itemSrcPath = join(srcPath, item);
    const stat = statSync(itemSrcPath);

    if (stat.isDirectory()) {
      copyDirectory(itemSrcPath);
    } else if (shouldCopyFile(item)) {
      copyFile(itemSrcPath);
    }
  }
}

/**
 * Checks if a file should be copied based on extension
 */
function shouldCopyFile(filename) {
  if (IGNORE_PATTERNS.some((pattern) => filename.includes(pattern))) {
    return false;
  }

  const ext = extname(filename);
  return WATCH_PATTERNS.includes(ext) || filename === 'sw.js';
}

/**
 * Handles file change events with debouncing
 */
function handleFileChange(eventType, filename) {
  if (!filename) return;

  // Debounce to prevent duplicate events
  const key = `${eventType}-${filename}`;
  if (debounceMap.has(key)) {
    clearTimeout(debounceMap.get(key));
  }

  debounceMap.set(
    key,
    setTimeout(() => {
      debounceMap.delete(key);

      const srcPath = join(SRC_DIR, filename);

      // Skip if file doesn't exist (might be deleted) or shouldn't be copied
      if (!existsSync(srcPath)) return;

      const stat = statSync(srcPath);
      if (stat.isDirectory()) {
        copyDirectory(srcPath);
      } else if (shouldCopyFile(filename)) {
        copyFile(srcPath);
      }
    }, DEBOUNCE_MS)
  );
}

/**
 * Performs initial copy of all source files to dist
 */
function initialCopy() {
  console.log('[init] Copying source files to dist...');

  // Create dist directories
  mkdirSync(join(DIST_DIR, 'css'), { recursive: true });
  mkdirSync(join(DIST_DIR, 'js'), { recursive: true });
  mkdirSync(join(DIST_DIR, 'img'), { recursive: true });

  // Copy all relevant files
  copyDirectory(SRC_DIR);

  console.log('[init] Initial copy complete');
}

/**
 * Starts the Tailwind CSS watcher
 */
function startTailwindWatcher() {
  console.log('[tailwind] Starting Tailwind CSS watcher...');

  const tailwind = spawn(
    'npx',
    ['@tailwindcss/cli', '-i', './src/css/input.css', '-o', './dist/css/output.css', '--watch'],
    {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    }
  );

  tailwind.on('error', (error) => {
    console.error('[tailwind] Error:', error.message);
  });

  return tailwind;
}

/**
 * Starts the HTTP server using serve
 */
function startServer() {
  console.log('[server] Starting HTTP server...');

  const server = spawn('npx', ['serve', 'dist', '-l', '8080'], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });

  server.on('error', (error) => {
    console.error('[server] Error:', error.message);
  });

  return server;
}

/**
 * Starts watching the src directory for changes
 */
function startFileWatcher() {
  console.log('[watch] Watching src/ for changes...');

  const watcher = watch(SRC_DIR, { recursive: true }, handleFileChange);

  watcher.on('error', (error) => {
    console.error('[watch] Error:', error.message);
  });

  return watcher;
}

/**
 * Main entry point
 */
function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Development Server Starting...       ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');

  // Clean and initial copy
  initialCopy();

  // Build initial CSS
  console.log('[tailwind] Building initial CSS...');
  const initialBuild = spawn(
    'npx',
    ['@tailwindcss/cli', '-i', './src/css/input.css', '-o', './dist/css/output.css'],
    {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    }
  );

  initialBuild.on('close', () => {
    console.log('');
    console.log('[ready] Development server ready!');
    console.log('[ready] Open http://localhost:8080 in your browser');
    console.log('[ready] Press Ctrl+C to stop');
    console.log('');

    // Start all watchers and server
    const tailwindProcess = startTailwindWatcher();
    const serverProcess = startServer();
    const fileWatcher = startFileWatcher();

    // Cleanup on exit
    const cleanup = () => {
      console.log('\n[shutdown] Cleaning up...');
      fileWatcher.close();
      tailwindProcess.kill();
      serverProcess.kill();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  });
}

main();
