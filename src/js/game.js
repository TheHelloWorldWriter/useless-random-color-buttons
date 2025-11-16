// Copyright 2020-2025 The Hello World Writer. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

'use strict';

import { getRandomPosition, getRandomColor, formatDuration } from '/js/utils.js';

let winOnZeroButtons = true;
let createdCounter = 0;
let clickedCounter = 0;

let addButtonIntervalID;
let updateStatsIntervalID;

/**
 * Initializes the page.
 */
function initPage() {
  // Add initial buttons
  addInitialButtons();

  const addButtonDelay = localStorage.getItem('addButtonDelay') ?? 1000;
  winOnZeroButtons = localStorage.getItem('winOnZeroButtons') === 'true' ?? true;

  // Start adding buttons
  addButtonIntervalID = setInterval(() => addButton(), addButtonDelay);

  startUpdatingStats();

}

function startUpdatingStats() {
  const elapsedEl = document.querySelector('#stats-elapsed');
  const avgCpsEl = document.querySelector('#stats-avg-cps');
  const maxCpsEl = document.querySelector('#stats-max-cps');

  let prevClickedCounter = 0;
  let startTime = Date.now();
  let prevTime = startTime;
  let maxClickrate = 0;

  updateStatsIntervalID = setInterval(() => {
    const nowTime = Date.now();

    const clickrate = (clickedCounter - prevClickedCounter) * 1000 / (nowTime - prevTime);
    const avgClickrate = clickedCounter * 1000 / (nowTime - startTime);
    maxClickrate = Math.max(maxClickrate, clickrate);

    elapsedEl.textContent = formatDuration(nowTime - startTime);
    avgCpsEl.textContent = avgClickrate.toFixed(2);
    maxCpsEl.textContent = maxClickrate.toFixed(2);

    prevClickedCounter = clickedCounter;
    prevTime = nowTime;
  }, 1000);
}


/**
 * Adds a new random color button.
 */
function addButton() {
  const button = document.createElement('button');
  button.classList.add('absolute', 'color-button');

  // Set a random button color
  const color = getRandomColor();
  button.textContent = color.backcolor;
  button.style.backgroundColor = color.backcolor;
  button.style.color = color.textcolor;

  // Initialize the button click event
  button.addEventListener('click', (e) => {
    // Update the background and text color of the document body
    document.body.style.backgroundColor = e.target.style.backgroundColor;
    document.body.style.color = e.target.style.color;

    // Remove the button
    e.target.remove();

    // Update the clicked counter
    clickedCounter++;
    updateCounters();
  });

  // Add the button at a random position
  document.body.appendChild(button);
  const position = getRandomPosition(button);
  button.style.left = position.left + 'px';
  button.style.top = position.top + 'px';

  // Update the created counter
  createdCounter++;
  updateCounters();
}

function addInitialButtons() {
  const initialCount = localStorage.getItem('initialCount') ?? 100;
  for (let i = 0; i < initialCount; i++) {
    setTimeout(() => addButton());
  }
}

/**
 * Updates the counters.
 */
function updateCounters() {

  const remainingCounter = createdCounter - clickedCounter;

  // Update counter stats
  updateCounters.createdEl ??= document.querySelector('#stats-created');
  updateCounters.createdEl.textContent = createdCounter;
  updateCounters.clickedEl ??= document.querySelector('#stats-clicked');
  updateCounters.clickedEl.textContent = clickedCounter;
  updateCounters.remainingEl ??= document.querySelector('#stats-remaining');
  updateCounters.remainingEl.textContent = remainingCounter;

  // Check if user has won
  if (winOnZeroButtons && (remainingCounter == 0)) {
    win();
  }
  // document.title = `${createdCounter} created, ${clickedCounter} clicked, ${createdCounter - clickedCounter} remaining`;
}


function win() {
  clearInterval(addButtonIntervalID);
  clearInterval(updateStatsIntervalID);

  document.querySelector('#win-section').classList.remove('hidden');
}


/**
 * Initialize the page in the window load event.
 */
 window.addEventListener("load", initPage);