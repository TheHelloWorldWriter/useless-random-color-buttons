// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

// @ts-check

'use strict';

import { startGame, stopGame } from './game.js';
import { loadSettings, saveSettings, resetSettings } from './settings.js';

// Cache main view elements
const homeView = /** @type {HTMLElement} */ (document.getElementById('home-view'));
const gameView = /** @type {HTMLElement} */ (document.getElementById('game-view'));
const settingsDialog = /** @type {HTMLDialogElement} */ (document.getElementById('settings-dialog'));
const winDialog = /** @type {HTMLDialogElement} */ (document.getElementById('win-dialog'));

/**
 * Shows the home view and resets the game state.
 * Stops any running game and resets background colors.
 */
function showHomeView() {
  stopGame();
  gameView.classList.add('hidden');
  homeView.classList.remove('hidden');
  // Reset background to default
  document.body.style.backgroundColor = '';
  document.body.style.color = '';
}

/**
 * Shows the game view and starts a new game.
 */
function showGameView() {
  homeView.classList.add('hidden');
  gameView.classList.remove('hidden');
  startGame(openWinDialog);
}

/**
 * Opens the settings dialog with current settings loaded.
 */
function openSettingsDialog() {
  loadSettings();
  settingsDialog.showModal();
}

/**
 * Closes the settings dialog without saving.
 */
function closeSettingsDialog() {
  settingsDialog.close();
}

/**
 * Opens the win dialog to celebrate victory.
 */
function openWinDialog() {
  winDialog.showModal();
}

/**
 * Closes the win dialog.
 */
function closeWinDialog() {
  winDialog.close();
}

/**
 * Initializes the application by setting up all event listeners.
 * Called when the page finishes loading.
 */
function initApp() {
  // Home view buttons
  document.getElementById('btn-settings')?.addEventListener('click', openSettingsDialog);
  document.getElementById('btn-start')?.addEventListener('click', showGameView);

  // Settings dialog buttons
  document.getElementById('settings-ok')?.addEventListener('click', () => {
    saveSettings();
    closeSettingsDialog();
  });
  document.getElementById('settings-cancel')?.addEventListener('click', closeSettingsDialog);
  document.getElementById('settings-reset')?.addEventListener('click', resetSettings);

  // Close settings dialog when clicking outside (on backdrop)
  settingsDialog.addEventListener('click', (event) => {
    if (event.target === settingsDialog) {
      closeSettingsDialog();
    }
  });

  // Win dialog buttons
  document.getElementById('win-play-again')?.addEventListener('click', () => {
    closeWinDialog();
    showGameView();
  });
  document.getElementById('win-home')?.addEventListener('click', () => {
    closeWinDialog();
    showHomeView();
  });
}

// Initialize app when DOM is ready
window.addEventListener('load', initApp);
