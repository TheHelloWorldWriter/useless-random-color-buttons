// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

// @ts-check

'use strict';

import { getRandomPosition, getRandomColor, formatDuration } from './utils.js';
import { getIntSetting, getBoolSetting, getStringSetting, ButtonDisplay } from './config.js';

// Game state
let winOnZeroButtons = true;
let createdCounter = 0;
let clickedCounter = 0;
let gameStartTime = 0;

// Interval IDs for cleanup
/** @type {ReturnType<typeof setInterval>|undefined} */
let addButtonIntervalID;
/** @type {ReturnType<typeof setInterval>|undefined} */
let updateStatsIntervalID;

// Callback for win event
/** @type {Function|null} */
let onWinCallback = null;

// Cache DOM elements for stats display
const createdEl = /** @type {HTMLElement} */ (document.getElementById('stats-created'));
const clickedEl = /** @type {HTMLElement} */ (document.getElementById('stats-clicked'));
const remainingEl = /** @type {HTMLElement} */ (document.getElementById('stats-remaining'));
const elapsedEl = /** @type {HTMLElement} */ (document.getElementById('stats-elapsed'));
const avgCpsEl = /** @type {HTMLElement} */ (document.getElementById('stats-avg-cps'));
const maxCpsEl = /** @type {HTMLElement} */ (document.getElementById('stats-max-cps'));

/**
 * Starts a new game session with the current settings.
 * Resets counters, creates initial buttons, and begins the game loop.
 *
 * @param {Function} onWin - Callback function to invoke when the player wins
 */
function startGame(onWin) {
  onWinCallback = onWin;

  // Reset game state
  createdCounter = 0;
  clickedCounter = 0;
  gameStartTime = Date.now();
  updateCounters();

  removeAllButtons();
  addInitialButtons();

  // Load settings from centralized config
  const addButtonDelay = getIntSetting('addButtonDelay');
  winOnZeroButtons = getBoolSetting('winOnZeroButtons');

  // Start adding buttons at regular intervals
  addButtonIntervalID = setInterval(() => addButton(), addButtonDelay);

  startUpdatingStats();
}

/**
 * Stops the current game session.
 * Clears all intervals and removes game buttons from the DOM.
 */
function stopGame() {
  clearInterval(addButtonIntervalID);
  clearInterval(updateStatsIntervalID);
  removeAllButtons();
}

/**
 * Removes all game buttons from the DOM.
 * Only removes buttons with the .game-button class to preserve decorative buttons.
 */
function removeAllButtons() {
  const buttons = document.querySelectorAll('.game-button');
  buttons.forEach((button) => button.remove());
}

/**
 * Starts the stats update loop that runs every second.
 * Tracks elapsed time, average clicks per second, and max clicks per second.
 */
function startUpdatingStats() {
  let prevClickedCounter = 0;
  const startTime = Date.now();
  let prevTime = startTime;
  let maxClickrate = 0;

  // Initialize stats display
  elapsedEl.textContent = '00:00:00';
  avgCpsEl.textContent = '0';
  maxCpsEl.textContent = '0';

  updateStatsIntervalID = setInterval(() => {
    const nowTime = Date.now();

    // Calculate clicks per second since last update
    const clickrate = ((clickedCounter - prevClickedCounter) * 1000) / (nowTime - prevTime);
    // Calculate average clicks per second since game start
    const avgClickrate = (clickedCounter * 1000) / (nowTime - startTime);
    maxClickrate = Math.max(maxClickrate, clickrate);

    elapsedEl.textContent = formatDuration(nowTime - startTime);
    avgCpsEl.textContent = avgClickrate.toFixed(2);
    maxCpsEl.textContent = maxClickrate.toFixed(2);

    prevClickedCounter = clickedCounter;
    prevTime = nowTime;
  }, 1000);
}

/**
 * Strategy pattern for button text generation.
 * Each strategy takes the current state and returns the button text.
 *
 * @type {Object.<string, function({backcolor: string}): string>}
 */
const buttonTextStrategies = {
  [ButtonDisplay.HEX_COLOR]: (color) => color.backcolor,
  [ButtonDisplay.COUNTER]: () => String(createdCounter + 1),
  [ButtonDisplay.ELAPSED_TIME]: () => formatDuration(Date.now() - gameStartTime)
};

/**
 * Creates and adds a new color button to the game area.
 * The button has a random color and position, and clicking it
 * changes the page background and removes the button.
 */
function addButton() {
  const button = document.createElement('button');
  button.classList.add('absolute', 'color-button', 'game-button');

  const color = getRandomColor();
  const displayMode = getStringSetting('buttonDisplay');
  const textStrategy = buttonTextStrategies[displayMode] || buttonTextStrategies[ButtonDisplay.HEX_COLOR];

  button.textContent = textStrategy(color);
  button.style.backgroundColor = color.backcolor;
  button.style.color = color.textcolor;

  button.addEventListener('click', () => {
    // Change page background to match clicked button
    document.body.style.backgroundColor = button.style.backgroundColor;
    document.body.style.color = button.style.color;

    button.remove();

    clickedCounter++;
    updateCounters();
  });

  // Add to DOM first so we can calculate position based on actual size
  document.body.appendChild(button);
  const position = getRandomPosition(button);
  button.style.left = `${position.left}px`;
  button.style.top = `${position.top}px`;

  createdCounter++;
  updateCounters();
}

/**
 * Creates the initial batch of buttons when the game starts.
 * The number of buttons is determined by the initialCount setting.
 * Buttons are added in batches to avoid blocking the UI thread.
 */
function addInitialButtons() {
  const initialCount = getIntSetting('initialCount');

  // Add buttons in batches to avoid UI freeze
  const BATCH_SIZE = 10;
  for (let i = 0; i < initialCount; i++) {
    // Stagger creation: buttons 0-9 at 0ms, 10-19 at 1ms, etc.
    setTimeout(() => addButton(), Math.floor(i / BATCH_SIZE));
  }
}

/**
 * Updates the counter displays and checks for win condition.
 * Called whenever buttons are created or clicked.
 */
function updateCounters() {
  const remainingCounter = createdCounter - clickedCounter;

  createdEl.textContent = String(createdCounter);
  clickedEl.textContent = String(clickedCounter);
  remainingEl.textContent = String(remainingCounter);

  // Check win condition: all buttons clicked and at least one was created
  if (winOnZeroButtons && remainingCounter === 0 && createdCounter > 0) {
    win();
  }
}

/**
 * Handles the win condition by stopping the game loop and invoking the callback.
 */
function win() {
  clearInterval(addButtonIntervalID);
  clearInterval(updateStatsIntervalID);
  if (onWinCallback) {
    onWinCallback();
  }
}

export { startGame, stopGame };
