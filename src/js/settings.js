// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

'use strict';

import { DEFAULTS, getIntSetting, setIntSetting, getBoolSetting, setBoolSetting } from './config.js';

// Cache DOM elements for settings form
const initialCountEl = document.getElementById('settings-initial');
const addButtonDelayEl = document.getElementById('settings-delay');
const winOnZeroButtonsEl = document.getElementById('settings-win-on-zero-buttons');

/**
 * Loads settings from localStorage into the settings form.
 * Uses default values if no saved settings exist.
 */
function loadSettings() {
  initialCountEl.value = getIntSetting('initialCount');
  addButtonDelayEl.value = getIntSetting('addButtonDelay');
  winOnZeroButtonsEl.checked = getBoolSetting('winOnZeroButtons');
}

/**
 * Saves the current form values to localStorage.
 */
function saveSettings() {
  setIntSetting('initialCount', initialCountEl.value);
  setIntSetting('addButtonDelay', addButtonDelayEl.value);
  setBoolSetting('winOnZeroButtons', winOnZeroButtonsEl.checked);
}

/**
 * Resets the settings form to default values.
 * Note: Does not save to localStorage until saveSettings() is called.
 */
function resetSettings() {
  initialCountEl.value = DEFAULTS.initialCount;
  addButtonDelayEl.value = DEFAULTS.addButtonDelay;
  winOnZeroButtonsEl.checked = DEFAULTS.winOnZeroButtons;
}

export { loadSettings, saveSettings, resetSettings };
