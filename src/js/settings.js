// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

// @ts-check

'use strict';

import { DEFAULTS, getIntSetting, setIntSetting, getBoolSetting, setBoolSetting, getStringSetting, setStringSetting } from './config.js';

// Cache DOM elements for settings form
const initialCountEl = /** @type {HTMLInputElement} */ (document.getElementById('settings-initial'));
const addButtonDelayEl = /** @type {HTMLInputElement} */ (document.getElementById('settings-delay'));
const winOnZeroButtonsEl = /** @type {HTMLInputElement} */ (document.getElementById('settings-win-on-zero-buttons'));
const displayHexEl = /** @type {HTMLInputElement} */ (document.getElementById('settings-display-hex'));
const displayCounterEl = /** @type {HTMLInputElement} */ (document.getElementById('settings-display-counter'));
const displayElapsedEl = /** @type {HTMLInputElement} */ (document.getElementById('settings-display-elapsed'));

/**
 * Loads settings from localStorage into the settings form.
 * Uses default values if no saved settings exist.
 */
function loadSettings() {
  initialCountEl.value = String(getIntSetting('initialCount'));
  addButtonDelayEl.value = String(getIntSetting('addButtonDelay'));
  winOnZeroButtonsEl.checked = getBoolSetting('winOnZeroButtons');

  const buttonDisplay = getStringSetting('buttonDisplay');
  displayHexEl.checked = buttonDisplay === 'hex';
  displayCounterEl.checked = buttonDisplay === 'counter';
  displayElapsedEl.checked = buttonDisplay === 'elapsed';
}

/**
 * Saves the current form values to localStorage.
 */
function saveSettings() {
  setIntSetting('initialCount', initialCountEl.value);
  setIntSetting('addButtonDelay', addButtonDelayEl.value);
  setBoolSetting('winOnZeroButtons', winOnZeroButtonsEl.checked);

  if (displayHexEl.checked) {
    setStringSetting('buttonDisplay', 'hex');
  } else if (displayCounterEl.checked) {
    setStringSetting('buttonDisplay', 'counter');
  } else if (displayElapsedEl.checked) {
    setStringSetting('buttonDisplay', 'elapsed');
  }
}

/**
 * Resets the settings form to default values.
 * Note: Does not save to localStorage until saveSettings() is called.
 */
function resetSettings() {
  initialCountEl.value = String(DEFAULTS.initialCount);
  addButtonDelayEl.value = String(DEFAULTS.addButtonDelay);
  winOnZeroButtonsEl.checked = DEFAULTS.winOnZeroButtons;

  displayHexEl.checked = DEFAULTS.buttonDisplay === 'hex';
  displayCounterEl.checked = DEFAULTS.buttonDisplay === 'counter';
  displayElapsedEl.checked = DEFAULTS.buttonDisplay === 'elapsed';
}

export { loadSettings, saveSettings, resetSettings };
