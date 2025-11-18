// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

// @ts-check

'use strict';

/**
 * Button display mode enum.
 * Defines how text is displayed on game buttons.
 *
 * @enum {number}
 */
export const ButtonDisplay = Object.freeze({
  /** Display hex color code (e.g., #abc123) */
  HEX_COLOR: 0,
  /** Display sequential counter (e.g., 1, 2, 3...) */
  COUNTER: 1,
  /** Display elapsed time since game start (e.g., 00:01:25) */
  ELAPSED_TIME: 2
});

/**
 * Default settings for the application.
 * These values are used when no saved settings exist in localStorage.
 *
 * @type {{initialCount: number, addButtonDelay: number, winOnZeroButtons: boolean, buttonDisplay: number}}
 */
export const DEFAULTS = {
  initialCount: 100,
  addButtonDelay: 1000,
  winOnZeroButtons: true,
  buttonDisplay: ButtonDisplay.HEX_COLOR
};

/**
 * Retrieves an integer setting value from localStorage.
 * Returns the default value if the setting is not found.
 *
 * @param {keyof typeof DEFAULTS} key - The setting key to retrieve
 * @returns {number} The integer setting value
 */
export function getIntSetting(key) {
  const stored = localStorage.getItem(key);
  return stored !== null ? parseInt(stored, 10) : /** @type {number} */ (DEFAULTS[key]);
}

/**
 * Saves an integer setting value to localStorage.
 *
 * @param {string} key - The setting key to save
 * @param {number|string} value - The integer value to save
 */
export function setIntSetting(key, value) {
  localStorage.setItem(key, String(value));
}

/**
 * Retrieves a boolean setting value from localStorage.
 * Returns the default value if the setting is not found.
 *
 * @param {keyof typeof DEFAULTS} key - The setting key to retrieve
 * @returns {boolean} The boolean setting value
 */
export function getBoolSetting(key) {
  const stored = localStorage.getItem(key);
  return stored !== null ? stored === 'true' : /** @type {boolean} */ (DEFAULTS[key]);
}

/**
 * Saves a boolean setting value to localStorage.
 *
 * @param {string} key - The setting key to save
 * @param {boolean} value - The boolean value to save
 */
export function setBoolSetting(key, value) {
  localStorage.setItem(key, String(value));
}

