// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

// @ts-check

'use strict';

import { DEFAULTS, getIntSetting, setIntSetting, getBoolSetting, setBoolSetting } from './config.js';

// Cache DOM elements for settings form
const initialCountEl = /** @type {HTMLInputElement} */ (document.getElementById('settings-initial'));
const addButtonDelayEl = /** @type {HTMLInputElement} */ (document.getElementById('settings-delay'));
const winOnZeroButtonsEl = /** @type {HTMLInputElement} */ (document.getElementById('settings-win-on-zero-buttons'));
const buttonDisplayRadios = /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('input[name="button-display"]'));

/**
 * Loads settings from localStorage into the settings form.
 * Uses default values if no saved settings exist.
 */
function loadSettings() {
  initialCountEl.value = String(getIntSetting('initialCount'));
  addButtonDelayEl.value = String(getIntSetting('addButtonDelay'));
  winOnZeroButtonsEl.checked = getBoolSetting('winOnZeroButtons');

  const buttonDisplay = getIntSetting('buttonDisplay');
  buttonDisplayRadios[buttonDisplay].checked = true;
}

/**
 * Validates settings inputs and returns error message if invalid.
 *
 * @returns {string|null} Error message or null if valid
 */
function validateSettings() {
  const initialCount = parseInt(initialCountEl.value, 10);
  const delay = parseInt(addButtonDelayEl.value, 10);

  const initialMin = parseInt(initialCountEl.min, 10);
  const initialMax = parseInt(initialCountEl.max, 10);
  const delayMin = parseInt(addButtonDelayEl.min, 10);
  const delayMax = parseInt(addButtonDelayEl.max, 10);

  if (isNaN(initialCount) || initialCount < initialMin || initialCount > initialMax) {
    return `Initial button count must be between ${initialMin} and ${initialMax}`;
  }

  if (isNaN(delay) || delay < delayMin || delay > delayMax) {
    return `Button delay must be between ${delayMin} and ${delayMax} ms`;
  }

  return null;
}

/**
 * Saves the current form values to localStorage.
 * Returns true if successful, false if validation failed.
 *
 * @returns {boolean} True if saved successfully
 */
function saveSettings() {
  const error = validateSettings();
  if (error) {
    alert(error);
    return false;
  }

  setIntSetting('initialCount', initialCountEl.value);
  setIntSetting('addButtonDelay', addButtonDelayEl.value);
  setBoolSetting('winOnZeroButtons', winOnZeroButtonsEl.checked);

  const selectedRadio = /** @type {HTMLInputElement} */ (document.querySelector('input[name="button-display"]:checked'));
  setIntSetting('buttonDisplay', parseInt(selectedRadio.value, 10));

  return true;
}

/**
 * Resets the settings form to default values.
 * Note: Does not save to localStorage until saveSettings() is called.
 */
function resetSettings() {
  initialCountEl.value = String(DEFAULTS.initialCount);
  addButtonDelayEl.value = String(DEFAULTS.addButtonDelay);
  winOnZeroButtonsEl.checked = DEFAULTS.winOnZeroButtons;

  buttonDisplayRadios[DEFAULTS.buttonDisplay].checked = true;
}

export { loadSettings, saveSettings, resetSettings };
