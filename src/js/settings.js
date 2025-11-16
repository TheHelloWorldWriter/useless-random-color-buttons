// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

'use strict';

const initialCountEl = document.getElementById('settings-initial');
const addButtonDelayEl = document.getElementById('settings-delay');
const winOnZeroButtonsEl = document.getElementById('settings-win-on-zero-buttons');

const DEFAULT_INITIAL_COUNT = 100;
const DEFAULT_ADD_BUTTON_DELAY = 1000;
const DEFAULT_WIN_ON_ZERO_BUTTONS = true;

function loadSettings() {
  initialCountEl.value = localStorage.getItem('initialCount') ?? DEFAULT_INITIAL_COUNT;
  addButtonDelayEl.value = localStorage.getItem('addButtonDelay') ?? DEFAULT_ADD_BUTTON_DELAY;

  const winOnZeroButtons = localStorage.getItem('winOnZeroButtons');
  winOnZeroButtonsEl.checked = winOnZeroButtons === null ? DEFAULT_WIN_ON_ZERO_BUTTONS : winOnZeroButtons === 'true';
}

function saveSettings() {
  localStorage.setItem('initialCount', initialCountEl.value);
  localStorage.setItem('addButtonDelay', addButtonDelayEl.value);
  localStorage.setItem('winOnZeroButtons', winOnZeroButtonsEl.checked);
}

function resetSettings() {
  initialCountEl.value = DEFAULT_INITIAL_COUNT;
  addButtonDelayEl.value = DEFAULT_ADD_BUTTON_DELAY;
  winOnZeroButtonsEl.checked = DEFAULT_WIN_ON_ZERO_BUTTONS;
}

export { loadSettings, saveSettings, resetSettings };
