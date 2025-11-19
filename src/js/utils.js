// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

// @ts-check

'use strict';

/**
 * Generates a random position for the specified element within the viewport.
 * Uses window.innerWidth/innerHeight to include the full viewport width including
 * any scrollbar reserve space, ensuring buttons can reach the right edge.
 *
 * @param {HTMLElement} child - The element to position
 * @returns {{left: number, top: number}} Random coordinates in pixels
 */
function getRandomPosition(child) {
  const childRect = child.getBoundingClientRect();

  // Use viewport dimensions instead of parent rect to avoid scrollbar reserve issues
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Clamp to 0 to prevent negative values when child is larger than viewport
  const left = Math.max(0, Math.random() * (viewportWidth - childRect.width));
  const top = Math.max(0, Math.random() * (viewportHeight - childRect.height));

  return { left, top };
}

/**
 * Generates a random background color and its associated contrast text color.
 *
 * @returns {{backcolor: string, textcolor: string}} Object with hex background color and contrast text color
 */
function getRandomColor() {
  // Generate random hex and pad to ensure 6 digits (Math.random can produce short strings)
  const hexcolor = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  const contrastColor = getContrastYIQ(hexcolor);
  return { backcolor: `#${hexcolor}`, textcolor: contrastColor };
}

/**
 * Calculates the optimal contrast text color (black or white) for a given background.
 * Uses the YIQ color space formula to determine perceived brightness.
 *
 * @param {string} hexcolor - 6-character hex color string without # prefix
 * @returns {string} Either 'black' or 'white' for optimal contrast
 * @see https://24ways.org/2010/calculating-color-contrast/
 */
function getContrastYIQ(hexcolor) {
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  // YIQ formula weights RGB by human eye sensitivity (green > red > blue)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  // 128 is the midpoint of 0-255 range
  return yiq >= 128 ? 'black' : 'white';
}

/**
 * Formats a duration in milliseconds as HH:MM:SS string.
 * Supports durations longer than 24 hours (e.g., "25:30:45").
 *
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration string
 */
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  /** @param {number} n */
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export { getRandomPosition, getRandomColor, formatDuration };