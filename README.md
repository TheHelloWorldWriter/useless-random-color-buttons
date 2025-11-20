# useless random color buttons

## Overview

This is a useless time waster built with vanilla JavaScript. The concept is simple: colored buttons spawn randomly and pile up on your screen. Your job is to click them to make them disappear.

I built this to experiment with handling visual chaos in the browser and tracking simple user interactions. As you play, the app tracks your stats—like how many buttons you've created, how many you've clicked, and your clicking speed. There is no deep meaning or complex gameplay loop here. It is just you against a rising tide of colorful buttons.

It started as one of my "Hello World" experiments—small, focused projects where I learn something new. It turned into a fully responsive Progressive Web App (PWA) that works on desktop and mobile, but at its core, it remains a simple, chaotic button clicker.

## How to Play

*   **Click:** Tap or click buttons to remove them.
*   **Survive:** They spawn automatically. Don't let them cover the whole screen (or do, it's up to you).
*   **Track:** Watch your stats in the "Game View" or check the summary when you win or give up.
*   **Customize:** Open settings to change spawn rates, button labels (hex codes, numbers, timestamps), or the number of starting buttons.

## Two Ways to Run It

I've designed this project to be accessible in two distinct ways: as a modern web app and as a standalone offline file.

### 1. Online (PWA)

You can play the latest version directly in your browser at:
**[https://urcbuttons.helloworldwriter.com/](https://urcbuttons.helloworldwriter.com/)**

Since it is a Progressive Web App, you can install it on your phone or desktop to run it like a native app.

### 2. Offline (Portable Edition)

If you prefer to keep things local, I provide a packaged offline version. You can download `urcbuttons-v2.0.0-portable.zip` from the **[Releases](../../releases)** page.

**How to run the offline version:**
1.  Unzip the archive.
2.  Locate `urcbuttons.html`.
3.  Double-click it.

It will open immediately in your default web browser. No internet connection is required.

**Where is the .exe?**
You might be looking for an executable file. You won't find one. That is by design. By keeping it as a standard HTML file, the entire app remains incredibly small (under 100KB) and works on Windows, macOS, Linux, Android, and iOS without any installation or security warnings.

## Compatibility

Since this is a standard HTML5 application, it works on any modern device:
*   Windows (Edge, Chrome, Firefox)
*   macOS (Safari, Chrome, Firefox)
*   Linux (Firefox, Chromium)
*   Android & iOS

## Building from Source

If you want to tinker with the code, here is how to build it yourself.

**Prerequisites:**
*   Node.js installed.

**Setup:**
```bash
git clone https://github.com/TheHelloWorldWriter/useless-random-color-buttons.git
cd useless-random-color-buttons
npm install
```

**Development:**
To start the development server with hot reloading:
```bash
npm run dev
```

**Build:**
To create the production build (outputs to `dist/`):
```bash
npm run build
```

To create the portable zip file (outputs to `dist-packaged/release/`):
```bash
npm run build:portable
```

## License

This project is open source under the [MIT License](LICENSE).
