# 🧛 Vampire's Crypt - Tech Symposium Challenge

A lightweight, offline-ready coding challenge built for our college symposium. This project requires no backend server or database—it runs entirely in the browser using HTML, CSS, and JavaScript, making it perfect for rapid deployment across multiple lab computers.

## 🩸 Challenge Flow

The game follows a strict, timed progression:

**START**
  ↓
**🧛 Vampire Welcome Page** (Triggers Fullscreen)
  ↓
**LEVEL 1 — Vampire's Logic**
* 5 Python MCQs
* 5-minute timer
* Correct answer → automatically advances to next question
* Wrong answer → shake effect / retry handling
  ↓
**LEVEL 2 — Vampire's Puzzle**
* 5-minute timer
* Popup alert: *"The hint of the puzzle will appear below..."*
* Puzzle + Hint are displayed
* Correct answer required to advance
  ↓
**🩸 QUALIFIED PAGE**
* Displays Final Score (MCQs solved, Puzzle status, Time spent)

## 🛡️ Anti-Cheating Features
To maintain the integrity of the symposium event, this app includes:
* **No Copy-Paste:** Right-click context menus, copying, and pasting are disabled via JavaScript.
* **Text Selection Disabled:** CSS prevents highlighting text to search for answers.
* **Tab-Switching Detection:** Minimizing the browser or switching tabs triggers an immediate warning alert.

## 🚀 How to Deploy in the Lab
Since this is a standalone web app, you do not need Python, Flask, or an internet connection.

1. Download or clone this repository.
2. Copy the folder to a USB drive.
3. Paste the folder onto each participant's computer.
4. Double-click `index.html` to open it in Chrome, Edge, or Firefox. 

## 📝 How to Customize Questions
To change the Python questions or the final puzzle before the event, simply open `script.js` in any text editor.

* **To change MCQs:** Edit the `QUESTIONS` array at the top of the file. Ensure the `correct` index matches your options (0 = first option, 1 = second option, etc.).
* **To change the Puzzle:** Edit the `PUZZLE_ANSWER` variable and update the HTML text inside `index.html`.

## 👥 Contributors
* **[hiralirs]** 
* **[thilo28]** 
