#!/usr/bin/env node

// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

/**
 * Build script for generating a standalone single-file HTML version
 * of the app that can run locally without a web server.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  distDir: './dist',
  outputDir: './dist-standalone',
  outputFile: 'useless-random-color-buttons.html',
  indexHtml: 'index.html',
  cssFile: 'css/output.css',
  jsFile: 'js/app.js'
};

/**
 * Reads a file from the dist directory
 */
function readDistFile(filename) {
  try {
    return readFileSync(`${CONFIG.distDir}/${filename}`, 'utf-8');
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error.message);
    console.error('   Make sure you run "npm run build" first.');
    process.exit(1);
  }
}

/**
 * Finds content between marker comments
 */
function findBetweenMarkers(html, markerName) {
  const startMarker = `<!-- ${markerName} -->`;
  const endMarker = `<!-- /${markerName} -->`;

  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Could not find markers for ${markerName}`);
  }

  return {
    before: html.substring(0, startIdx),
    content: html.substring(startIdx + startMarker.length, endIdx),
    after: html.substring(endIdx + endMarker.length),
    fullMatch: html.substring(startIdx, endIdx + endMarker.length)
  };
}

/**
 * Removes content between REMOVE markers
 */
function removeMarkedSections(html) {
  const markerStart = '<!-- STANDALONE:REMOVE-START -->';
  const markerEnd = '<!-- STANDALONE:REMOVE-END -->';

  let result = html;
  let startIdx;

  // Remove all REMOVE sections
  while ((startIdx = result.indexOf(markerStart)) !== -1) {
    const endIdx = result.indexOf(markerEnd, startIdx);
    if (endIdx === -1) {
      throw new Error('Found STANDALONE:REMOVE-START without matching REMOVE-END');
    }
    result = result.substring(0, startIdx) + result.substring(endIdx + markerEnd.length);
  }

  return result;
}

/**
 * Main build function
 */
function buildStandalone() {
  console.log('🔨 Building standalone HTML file...\n');

  // Read source files
  console.log('📖 Reading dist files...');
  let html = readDistFile(CONFIG.indexHtml);
  const css = readDistFile(CONFIG.cssFile);
  const js = readDistFile(CONFIG.jsFile);

  console.log('✅ Files read successfully\n');

  // Replace CSS link with inline style
  console.log('🎨 Inlining CSS...');
  try {
    const cssSection = findBetweenMarkers(html, 'STANDALONE:CSS');
    const inlinedCss = `<!-- STANDALONE:CSS -->\n  <style>\n${css}\n  </style>\n  <!-- /STANDALONE:CSS -->`;
    html = cssSection.before + inlinedCss + cssSection.after;
    console.log('✅ CSS inlined\n');
  } catch (error) {
    console.error(`❌ Error inlining CSS: ${error.message}`);
    process.exit(1);
  }

  // Replace JS module script with inline script
  console.log('⚡ Inlining JavaScript...');
  try {
    const jsSection = findBetweenMarkers(html, 'STANDALONE:JS');
    const inlinedJs = `<!-- STANDALONE:JS -->\n  <script type="module">\n${js}\n  </script>\n  <!-- /STANDALONE:JS -->`;
    html = jsSection.before + inlinedJs + jsSection.after;
    console.log('✅ JavaScript inlined\n');
  } catch (error) {
    console.error(`❌ Error inlining JavaScript: ${error.message}`);
    process.exit(1);
  }

  // Remove PWA-specific sections
  console.log('🧹 Removing PWA-specific code...');
  try {
    html = removeMarkedSections(html);
    console.log('✅ PWA code removed\n');
  } catch (error) {
    console.error(`❌ Error removing sections: ${error.message}`);
    process.exit(1);
  }

  // Create output directory
  console.log('📁 Creating output directory...');
  try {
    mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log('✅ Output directory ready\n');
  } catch (error) {
    console.error(`❌ Error creating directory: ${error.message}`);
    process.exit(1);
  }

  // Write output file
  console.log('💾 Writing standalone HTML file...');
  const outputPath = `${CONFIG.outputDir}/${CONFIG.outputFile}`;
  try {
    writeFileSync(outputPath, html, 'utf-8');
    console.log('✅ File written successfully\n');
  } catch (error) {
    console.error(`❌ Error writing file: ${error.message}`);
    process.exit(1);
  }

  // Calculate file size
  const fileSizeKB = Math.round(Buffer.byteLength(html, 'utf-8') / 1024);

  console.log('═══════════════════════════════════════════════');
  console.log('✨ Standalone build complete!');
  console.log('═══════════════════════════════════════════════');
  console.log(`📦 Output: ${outputPath}`);
  console.log(`📊 File size: ${fileSizeKB} KB`);
  console.log('\n💡 This file can be opened directly in any browser');
  console.log('   without a web server (file:// protocol).');
  console.log('═══════════════════════════════════════════════\n');
}

// Run the build
buildStandalone();
