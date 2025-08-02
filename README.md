# Edge Master Volume
A Microsoft Edge extension to individually control, mute, and boost the volume of each browser tab.

## ✨ Features
- Per-tab volume control (0%–200%)
- Mute/unmute tabs
- Volume remembered per tab
- Automatically highlights the current tab
- Minimal UI with favicons and tab names

## 🛠️ Installation
1. Clone this repository:
  ```bash
  git clone https://github.com/yourusername/edge-master-volume.git
  ```
2. Open Edge and go to edge://extensions
3. Enable Developer mode
4. Click Load unpacked
5. Select the extension folder (edge-master-volume)

## 🧠 How It Works
This extension injects a script into each tab to control HTML5 audio/video using the Web Audio API.
It stores volume settings using `chrome.storage.local`, keyed by tab ID.

The popup displays:
- Mute/unmute button with icon
- Volume slider (0–200%)
- Per-tab favicon and title

## 🎨 Icons
- Mute/Unmute icons from [Font Awesome Free](https://fontawesome.com/) under CC BY 4.0 license

## 📝 License
Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material

Under the following terms:
- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- NonCommercial — You may not use the material for commercial purposes.

License details: https://creativecommons.org/licenses/by-nc/4.0/

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)