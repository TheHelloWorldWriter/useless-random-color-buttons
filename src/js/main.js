// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

'use strict';

import { startGame, stopGame } from './game.js';
import { loadSettings, saveSettings, resetSettings } from './settings.js';

const homeView = document.getElementById('home-view');
const gameView = document.getElementById('game-view');
const settingsDialog = document.getElementById('settings-dialog');
const winDialog = document.getElementById('win-dialog');

function showHomeView() {
  stopGame();
  gameView.classList.add('hidden');
  homeView.classList.remove('hidden');
  document.body.style.backgroundColor = '';
  document.body.style.color = '';
}

function showGameView() {
  homeView.classList.add('hidden');
  gameView.classList.remove('hidden');
  startGame(openWinDialog);
}

function openSettingsDialog() {
  loadSettings();
  settingsDialog.showModal();
}

function closeSettingsDialog() {
  settingsDialog.close();
}

function openWinDialog() {
  winDialog.showModal();
}

function closeWinDialog() {
  winDialog.close();
}

function initApp() {
  document.getElementById('btn-settings').addEventListener('click', openSettingsDialog);
  document.getElementById('btn-start').addEventListener('click', showGameView);

  document.getElementById('settings-ok').addEventListener('click', () => {
    saveSettings();
    closeSettingsDialog();
  });
  document.getElementById('settings-cancel').addEventListener('click', closeSettingsDialog);
  document.getElementById('settings-reset').addEventListener('click', resetSettings);

  settingsDialog.addEventListener('click', (event) => {
    if (event.target === settingsDialog) {
      closeSettingsDialog();
    }
  });

  document.getElementById('win-play-again').addEventListener('click', () => {
    closeWinDialog();
    showGameView();
  });
  document.getElementById('win-home').addEventListener('click', () => {
    closeWinDialog();
    showHomeView();
  });
}

window.addEventListener('load', initApp);
