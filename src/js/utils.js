// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * Generates a random position for the specified element in the bounds of its parent.
 */
function getRandomPosition(child) {
  const childRect = child.getBoundingClientRect();
  const parentRect = child.parentNode.getBoundingClientRect();
  const left = Math.random() * (parentRect.width - childRect.width);
  const top = Math.random() * (parentRect.height - childRect.height);
  return { left: left, top: top };
}

/**
 * Generates a random background color and its associated contrast text color.
 */
function getRandomColor() {
  const hexcolor = `${Math.random().toString(16).slice(-6)}`;
  const contrastColor = getContrastYIQ(hexcolor);
  return { backcolor: `#${hexcolor}`, textcolor: contrastColor };
}

/**
 * Calculates the contrast color of the specified hex color.
 * From https://24ways.org/2010/calculating-color-contrast/
 */
function getContrastYIQ(hexcolor) {
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}

function formatDuration(ms) {
  return new Date(ms).toISOString().substring(11, 19);
}

export { getRandomPosition, getRandomColor, formatDuration };