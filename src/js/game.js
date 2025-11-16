// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

'use strict';

import { getRandomPosition, getRandomColor, formatDuration } from './utils.js';

let winOnZeroButtons = true;
let createdCounter = 0;
let clickedCounter = 0;

let addButtonIntervalID;
let updateStatsIntervalID;
let onWinCallback = null;

const createdEl = document.getElementById('stats-created');
const clickedEl = document.getElementById('stats-clicked');
const remainingEl = document.getElementById('stats-remaining');
const elapsedEl = document.getElementById('stats-elapsed');
const avgCpsEl = document.getElementById('stats-avg-cps');
const maxCpsEl = document.getElementById('stats-max-cps');

function startGame(onWin) {
  onWinCallback = onWin;

  createdCounter = 0;
  clickedCounter = 0;
  updateCounters();

  removeAllButtons();

  addInitialButtons();

  const addButtonDelay = localStorage.getItem('addButtonDelay') ?? 1000;
  winOnZeroButtons = localStorage.getItem('winOnZeroButtons') === 'true';

  addButtonIntervalID = setInterval(() => addButton(), addButtonDelay);

  startUpdatingStats();
}

function stopGame() {
  clearInterval(addButtonIntervalID);
  clearInterval(updateStatsIntervalID);
  removeAllButtons();
}

function removeAllButtons() {
  const buttons = document.querySelectorAll('.absolute.color-button');
  buttons.forEach((button) => button.remove());
}

function startUpdatingStats() {
  let prevClickedCounter = 0;
  const startTime = Date.now();
  let prevTime = startTime;
  let maxClickrate = 0;

  elapsedEl.textContent = '00:00:00';
  avgCpsEl.textContent = '0';
  maxCpsEl.textContent = '0';

  updateStatsIntervalID = setInterval(() => {
    const nowTime = Date.now();

    const clickrate = ((clickedCounter - prevClickedCounter) * 1000) / (nowTime - prevTime);
    const avgClickrate = (clickedCounter * 1000) / (nowTime - startTime);
    maxClickrate = Math.max(maxClickrate, clickrate);

    elapsedEl.textContent = formatDuration(nowTime - startTime);
    avgCpsEl.textContent = avgClickrate.toFixed(2);
    maxCpsEl.textContent = maxClickrate.toFixed(2);

    prevClickedCounter = clickedCounter;
    prevTime = nowTime;
  }, 1000);
}

function addButton() {
  const button = document.createElement('button');
  button.classList.add('absolute', 'color-button');

  const color = getRandomColor();
  button.textContent = color.backcolor;
  button.style.backgroundColor = color.backcolor;
  button.style.color = color.textcolor;

  button.addEventListener('click', (event) => {
    document.body.style.backgroundColor = event.target.style.backgroundColor;
    document.body.style.color = event.target.style.color;

    event.target.remove();

    clickedCounter++;
    updateCounters();
  });

  document.body.appendChild(button);
  const position = getRandomPosition(button);
  button.style.left = position.left + 'px';
  button.style.top = position.top + 'px';

  createdCounter++;
  updateCounters();
}

function addInitialButtons() {
  const initialCount = localStorage.getItem('initialCount') ?? 100;
  for (let i = 0; i < initialCount; i++) {
    setTimeout(() => addButton());
  }
}

function updateCounters() {
  const remainingCounter = createdCounter - clickedCounter;

  createdEl.textContent = createdCounter;
  clickedEl.textContent = clickedCounter;
  remainingEl.textContent = remainingCounter;

  if (winOnZeroButtons && remainingCounter === 0 && createdCounter > 0) {
    win();
  }
}

function win() {
  clearInterval(addButtonIntervalID);
  clearInterval(updateStatsIntervalID);
  if (onWinCallback) {
    onWinCallback();
  }
}

export { startGame, stopGame };
