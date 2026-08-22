// --- DATA ---
const stage1Questions = [
  {
    code: "def func(a, b=[]):\n    b.append(a)\n    return b\n\nprint(func(1))\nprint(func(2))",
    options: ["[1]\n[2]", "[1]\n[1, 2]", "[1, 2]\n[1, 2]", "TypeError"],
    correct: 1
  },
  {
    code: "a = [1, 2, 3]\nb = a[:]\nprint(a is b, a == b)",
    options: ["True True", "False True", "True False", "False False"],
    correct: 1
  },
  {
    code: "x = [10, 20, 30]\nprint(x[1:5])",
    options: ["[20, 30]", "IndexError", "[20, 30, None, None]", "[10, 20, 30]"],
    correct: 0
  },
  {
    code: "print(True or False and False)",
    options: ["False", "True", "SyntaxError", "None"],
    correct: 1
  },
  {
    code: "data = [1, 2, 3]\nres = [x * 2 for x in data if x % 2 == 0]\nprint(res)",
    options: ["[2, 4, 6]", "[4]", "[2]", "[1, 4, 3]"],
    correct: 1
  }
];

const stage2Puzzles = [
  {
    text: "A vampire hunter stands before two doors (Door A & Door B) guarded by two gargoyles. One gargoyle always tells the truth; the other always lies. One door leads to freedom, the other to the vampire's lair. The hunter asks: 'Which door would the OTHER gargoyle say leads to freedom?' The gargoyle points to Door A. Which door leads to freedom?",
    answers: ["door b", "b"],
    hint: "Both gargoyles will direct you toward the WRONG door when asked about the other. Choose the opposite!"
  },
  {
    text: "Count Dracula lines up 4 victims facing a wall (Person 4 sees 3, 2, 1; Person 3 sees 2, 1; Person 2 sees 1; Person 1 sees the wall). They wear capes from a pool of 2 Black and 2 Red capes. Nobody can talk, except to state their own cape color. If Person 4 remains silent, who can deduce their cape color first?",
    answers: ["person 3", "3", "p3"],
    hint: "Silence from Person 4 means Person 2 and Person 1 have DIFFERENT cape colors!"
  },
  {
    text: "A vampire enters a pitch-black crypt carrying a match, a candle, a lantern, and a fireplace. He can only light one thing first. What must he light first?",
    answers: ["match", "the match", "a match"],
    hint: "Before you can ignite any lantern or fireplace, you need the initial flame."
  },
  {
    text: "A vampire locked his sanctuary with a 3-digit code. The sum of the digits is 15. The second digit is 4 times the first digit. The third digit is the first digit plus 3. What is the code?",
    answers: ["285"],
    hint: "Set up the equation: X + 4X + (X + 3) = 15."
  },
  {
    text: "A vampire claims: 'Two days ago, I was 100 years old. Next year, I will turn 103.' On what month and day was the vampire turned?",
    answers: ["december 31", "dec 31", "december 31st", "31 december", "31st december"],
    hint: "Think about the very last day of the year and a statement made on January 1st."
  }
];

// --- SECURITY PROTOCOLS ---
let isWarningOpen = false;

function initSecurity() {
  ['contextmenu', 'copy', 'cut', 'paste'].forEach(evt =>
    document.addEventListener(evt, e => {
      e.preventDefault();
      recordViolation("Copy/Paste or Right-Click");
    })
  );

  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && ['u', 'U', 'c', 'C', 'v', 'V'].includes(e.key))) {
      e.preventDefault();
      recordViolation("Prohibited Keyboard Shortcut");
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isSafePage()) recordViolation("Tab Switching Detected");
  });

  window.addEventListener('blur', () => {
    if (!isSafePage() && !isWarningOpen && !document.hidden) recordViolation("Leaving quiz window focus");
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && !isSafePage() && !isWarningOpen) recordViolation("Exiting Fullscreen");
  });

  window.addEventListener('beforeunload', (e) => {
    if (!isSafePage()) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
}

function isSafePage() {
  return location.pathname.includes('result.html') || location.pathname.includes('index.html');
}

function recordViolation(reason) {
  if (isSafePage()) return;
  
  let attempts = parseInt(localStorage.getItem('vampire_violations') || '0');
  attempts++;
  localStorage.setItem('vampire_violations', attempts.toString());
  
  if (attempts < 4) {
    showSecModal(`⚠️ WARNING ${attempts}/3: ${reason} is strictly prohibited!\n\nReturn to the quiz immediately.`);
  } else {
    localStorage.setItem('disqualified', 'true');
    alert("🚨 DISQUALIFIED: You have been disqualified for rule violations.");
    window.location.href = 'result.html';
  }
}

function showSecModal(msg) {
  isWarningOpen = true;
  let modal = document.getElementById('secModal');
  if (modal) {
    document.getElementById('secMsg').innerText = msg;
    modal.classList.remove('hidden');
  } else {
    alert(msg);
  }
}

function closeSecModal() {
  isWarningOpen = false;
  let modal = document.getElementById('secModal');
  if (modal) modal.classList.add('hidden');
  
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

// --- INDEX LOGIC ---
function startQuiz() {
  const teamInput = document.getElementById('teamName').value.trim();
  if (!teamInput) {
    document.getElementById('startError').style.display = 'block';
    return;
  }
  
  localStorage.setItem('teamName', teamInput);
  localStorage.setItem('s1Score', '0');
  localStorage.setItem('s2Score', '0');
  localStorage.setItem('vampire_violations', '0');
  localStorage.setItem('disqualified', 'false');

  // FORCE FULLSCREEN ON CLICK
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => {
      console.log("Error attempting to enable fullscreen:", err.message);
    });
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }

  // Move to Level 1
  window.location.href = 'level1.html';
}

// --- TIMER LOGIC ---
let timerInterval;
let timeRemaining = 300;

function startTimer(displayElementId, onTimeout) {
  clearInterval(timerInterval);
  timeRemaining = 300; 
  updateTimerDisplay(displayElementId);

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay(displayElementId);
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      onTimeout();
    }
  }, 1000);
}

function updateTimerDisplay(displayElementId) {
  const badge = document.getElementById(displayElementId);
  if (!badge) return;
  const mins = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
  const secs = String(timeRemaining % 60).padStart(2, '0');
  badge.innerText = `${mins}:${secs}`;
}

// --- LEVEL 1 LOGIC ---
let s1Index = 0;
let s1Score = 0;

function startLevel1() {
  document.getElementById('teamDisplayS1').innerText = localStorage.getItem('teamName') || 'Unknown Soul';
  startTimer('timerS1', endLevel1);
  renderS1Question();
}

function renderS1Question() {
  if (s1Index >= stage1Questions.length) {
    endLevel1();
    return;
  }
  const q = stage1Questions[s1Index];
  document.getElementById('s1Progress').innerText = `Question ${s1Index + 1} of 5`;
  document.getElementById('s1CodeBlock').innerText = q.code;
  
  const optDiv = document.getElementById('s1Options');
  optDiv.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt;
    btn.onclick = () => submitS1Answer(idx);
    optDiv.appendChild(btn);
  });
}

function submitS1Answer(idx) {
  if (idx === stage1Questions[s1Index].correct) {
    s1Score++;
  }
  s1Index++;
  renderS1Question(); // Immediately moves to next question, no going back
}

function endLevel1() {
  clearInterval(timerInterval);
  localStorage.setItem('s1Score', s1Score);
  window.location.href = 'level2.html';
}

// --- LEVEL 2 LOGIC ---
let s2Index = 0;
let s2Score = 0;

function startLevel2Actual() {
  document.getElementById('stage2InstModal').classList.add('hidden');
  document.getElementById('level2MainUI').classList.remove('hidden');
  startTimer('timerS2', endLevel2);
  renderS2Question();
}

function renderS2Question() {
  if (s2Index >= stage2Puzzles.length) {
    endLevel2();
    return;
  }
  const p = stage2Puzzles[s2Index];
  document.getElementById('s2Progress').innerText = `Puzzle ${s2Index + 1} of 5`;
  document.getElementById('s2PuzzleText').innerText = p.text;
  document.getElementById('s2Answer').value = "";
  document.getElementById('hintText').innerText = p.hint;
  document.getElementById('hintText').classList.add('hidden');
}

function showHint() {
  document.getElementById('hintText').classList.remove('hidden');
}

function submitS2Answer() {
  const userAns = document.getElementById('s2Answer').value.trim().toLowerCase();
  if (userAns === "") return; // Prevent empty accidental submits
  
  const validAnswers = stage2Puzzles[s2Index].answers;
  if (validAnswers.some(ans => userAns === ans || userAns.includes(ans))) {
    s2Score++;
  }
  s2Index++;
  renderS2Question();
}

function endLevel2() {
  clearInterval(timerInterval);
  localStorage.setItem('s2Score', s2Score);
  window.location.href = 'result.html';
}

// --- RESULT LOGIC ---
function loadResult() {
  const team = localStorage.getItem('teamName') || 'Unknown Soul';
  const s1 = parseInt(localStorage.getItem('s1Score')) || 0;
  const s2 = parseInt(localStorage.getItem('s2Score')) || 0;
  const dq = localStorage.getItem('disqualified') === 'true';
  
  let total = s1 + s2;
  if (dq) total = 0;

  document.getElementById('teamResultName').innerText = team;
  document.getElementById('finalScoreDisplay').innerText = total;

  let rank = "";
  if (dq) rank = "☠️ Banished & Disqualified (Cheating)";
  else if (total === 10) rank = "👑 Vampire Lord";
  else if (total >= 7) rank = "🦇 Creature of the Night";
  else if (total >= 4) rank = "🐺 Thrall";
  else rank = "💀 Fledgling Initiate";

  document.getElementById('rankDisplay').innerText = rank;
}
