

let initialCountEl;
let addButtonDelayEl;
let winOnZeroButtonsEl;

function initPage() {

  initialCountEl = document.querySelector('#settings-initial');
  addButtonDelayEl = document.querySelector('#settings-delay');
  winOnZeroButtonsEl = document.querySelector('#settings-win-on-zero-buttons');

  initialCountEl.value = localStorage.getItem('initialCount') ?? 100;
  addButtonDelayEl.value = localStorage.getItem('addButtonDelay') ?? 1000;

  const winOnZeroButtons = localStorage.getItem('winOnZeroButtons') ?? true;
  console.log(winOnZeroButtons);
  winOnZeroButtonsEl.checked = winOnZeroButtons === 'true';
  console.log(winOnZeroButtons === 'true');
  // winOnZeroButtonsEl.checked = winOnZeroButtons;
  // keepPlayingEl.checked = winOnZeroButtons == false;
  // if (winOnZeroButtons == true) {
  //   console.log('winOnZeroButtonsEl');
  //   keepPlayingEl.checked = false;
  //   winOnZeroButtonsEl.checked = true;
  // } else {
  //   console.log('keepPlayingEl');
  //   winOnZeroButtonsEl.checked = false;
  //   keepPlayingEl.checked = true;
  // }

  // Initialize buttons' click events
  document.querySelector('#settings-ok').addEventListener('click', okClicked);
  document.querySelector('#settings-cancel').addEventListener('click', (e) => history.back());
  document.querySelector('#settings-reset').addEventListener('click', resetClicked);
}

function okClicked() {

  localStorage.setItem('initialCount', initialCountEl.value);
  localStorage.setItem('addButtonDelay', addButtonDelayEl.value);
  localStorage.setItem('winOnZeroButtons', winOnZeroButtonsEl.checked);
  console.log(winOnZeroButtonsEl.checked);

  location.assign('/');
}

function resetClicked() {
  initialCountEl.value = 100;
  addButtonDelayEl.value = 1000;
  winOnZeroButtonsEl.checked = true;
}

/**
 * Initialize the page in the window load event.
 */
 window.addEventListener("load", initPage);