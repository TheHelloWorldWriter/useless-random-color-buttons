// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

'use strict';

// Cache DOM elements for settings form
const initialCountEl = document.getElementById('settings-initial');
const addButtonDelayEl = document.getElementById('settings-delay');
const winOnZeroButtonsEl = document.getElementById('settings-win-on-zero-buttons');

// Default settings values
const DEFAULT_INITIAL_COUNT = 100;
const DEFAULT_ADD_BUTTON_DELAY = 1000;
const DEFAULT_WIN_ON_ZERO_BUTTONS = true;

/**
 * Loads settings from localStorage into the settings form.
 * Uses default values if no saved settings exist.
 */
function loadSettings() {
  const storedInitialCount = localStorage.getItem('initialCount');
  const storedAddButtonDelay = localStorage.getItem('addButtonDelay');
  const storedWinOnZeroButtons = localStorage.getItem('winOnZeroButtons');

  // Use stored value if exists (including '0'), otherwise use default
  initialCountEl.value = storedInitialCount !== null ? storedInitialCount : DEFAULT_INITIAL_COUNT;
  addButtonDelayEl.value = storedAddButtonDelay !== null ? storedAddButtonDelay : DEFAULT_ADD_BUTTON_DELAY;

  // Handle null (not set) separately from 'false' string
  winOnZeroButtonsEl.checked = storedWinOnZeroButtons === null ? DEFAULT_WIN_ON_ZERO_BUTTONS : storedWinOnZeroButtons === 'true';
}

/**
 * Saves the current form values to localStorage.
 */
function saveSettings() {
  localStorage.setItem('initialCount', initialCountEl.value);
  localStorage.setItem('addButtonDelay', addButtonDelayEl.value);
  localStorage.setItem('winOnZeroButtons', winOnZeroButtonsEl.checked);
}

/**
 * Resets the settings form to default values.
 * Note: Does not save to localStorage until saveSettings() is called.
 */
function resetSettings() {
  initialCountEl.value = DEFAULT_INITIAL_COUNT;
  addButtonDelayEl.value = DEFAULT_ADD_BUTTON_DELAY;
  winOnZeroButtonsEl.checked = DEFAULT_WIN_ON_ZERO_BUTTONS;
}

export { loadSettings, saveSettings, resetSettings };
