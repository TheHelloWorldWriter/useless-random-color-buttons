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
 * Saves the current form values to localStorage.
 */
function saveSettings() {
  setIntSetting('initialCount', initialCountEl.value);
  setIntSetting('addButtonDelay', addButtonDelayEl.value);
  setBoolSetting('winOnZeroButtons', winOnZeroButtonsEl.checked);

  const selectedRadio = /** @type {HTMLInputElement} */ (document.querySelector('input[name="button-display"]:checked'));
  setIntSetting('buttonDisplay', parseInt(selectedRadio.value, 10));
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
