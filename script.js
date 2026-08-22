// --- STAGE 1 & STAGE 2 QUESTION DATA ---
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

// --- GLOBAL SECURITY & CONTROLS ---
let isWarningOpen = false;

function initSecurity() {
  // Prevent Right Click, Copy, Cut, Paste
  ['contextmenu', 'copy', 'cut', 'paste'].forEach(evt =>
    document.addEventListener(evt, e => {
      e.preventDefault();
      recordViolation("Copy/Paste or Right-Click");
    })
  );

  // Prevent Keyboard Shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && ['u', 'U', 'c', 'C', 'v', 'V'].includes(e.key))) {
      e.preventDefault();
      recordViolation("Prohibited Keyboard Shortcut");
    }
  });

  // Prevent Tab Switching
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isSafePage()) {
      recordViolation("Tab Switching Detected");
    }
  });

  // Prevent leaving window focus
  window.addEventListener('blur', () => {
    if (!isSafePage() && !isWarningOpen && !document.hidden) {
      recordViolation("Leaving quiz window focus");
    }
  });

  // Enforce Fullscreen
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && !isSafePage() && !isWarningOpen) {
      recordViolation("Exiting Fullscreen");
    }
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
  
  if (attempts === 1) {
    showSecModal(`⚠️ WARNING 1/3: ${reason} is strictly prohibited!\n\nReturn to the quiz immediately.`);
  } 
  else if (attempts === 2) {
    showSecModal(`⚠️ WARNING 2/3: ${reason} is strictly prohibited!\n\nReturn to the quiz immediately.`);
  } 
  else if (attempts === 3) {
    showSecModal(`🛑 FINAL WARNING 3/3: ${reason} is strictly prohibited!\n\nOne more violation will result in immediate disqualification.`);
  } 
  else if (attempts > 3) {
    // 4th Offense = Disqualified
    alert("🚨 DISQUALIFIED: You have been disqualified as you are not honest.");
    if (typeof timerInterval !== 'undefined') clearInterval(timerInterval);
    window.location.href = 'result.html';
  }
}

function showSecModal(msg) {
  isWarningOpen = true;
  let modal = document.getElementById('secModal');
  if (modal) {
    document.getElementById('secModalMsg').innerText = msg;
    modal.classList.remove('hidden');
  } else {
    alert(msg);
  }
}

function closeSecModal() {
  isWarningOpen = false;
  let modal = document.getElementById('secModal');
  if (modal) modal.classList.add('hidden');
  
  // Force re-entry into fullscreen
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

// --- TIMER LOGIC ---
let timerInterval = null;
let timeRemaining = 300; 

function startTimer(onTimeout) {
  clearInterval(timerInterval);
  timeRemaining = 300;
  updateTimerBadge();
  const badge = document.getElementById('timerDisplay');
  if (badge) badge.classList.remove('hidden');

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerBadge();
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      onTimeout();
    }
  }, 1000);
}

function updateTimerBadge() {
  const badge = document.getElementById('timerDisplay');
  if (!badge) return;
  const mins = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
  const secs = String(timeRemaining % 60).padStart(2, '0');
  badge.innerText = `⏱ ${mins}:${secs}`;
}

// --- INDEX PAGE LOGIC ---
function startQuiz() {
  const teamInput = document.getElementById('teamNameInput').value.trim();
  if (!teamInput) {
    alert("Please enter a valid team name.");
    return;
  }
  localStorage.setItem('vampire_team', teamInput);
  localStorage.setItem('vampire_s1_score', '0');
  localStorage.setItem('vampire_s2_score', '0');
  localStorage.setItem('vampire_violations', '0');

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
  window.location.href = 'level1.html';
}

// --- LEVEL 1 LOGIC ---
let s1Index = 0;
let s1Score = 0;

function initLevel1() {
  startTimer(finishLevel1);
  renderStage1Question();
}

function renderStage1Question() {
  if (s1Index >= stage1Questions.length) {
    finishLevel1();
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
    btn.onclick = () => selectStage1Option(idx);
    optDiv.appendChild(btn);
  });
}

function selectStage1Option(idx) {
  if (idx === stage1Questions[s1Index].correct) {
    s1Score++;
  }
  s1Index++;
  renderStage1Question();
}

function finishLevel1() {
  clearInterval(timerInterval);
  localStorage.setItem('vampire_s1_score', s1Score);
  document.getElementById('s1ActiveArea').classList.add('hidden');
  document.getElementById('s1ScoreVal').innerText = s1Score;
  document.getElementById('s1ScoreArea').classList.remove('hidden');
}

function goToLevel2() {
  window.location.href = 'level2.html';
}

// --- LEVEL 2 LOGIC ---
let s2Index = 0;
let s2Score = 0;

function initLevel2() {
  document.getElementById('stage2InstModal').classList.remove('hidden');
}

function showHintNoticeModal() {
  document.getElementById('stage2InstModal').classList.add('hidden');
  document.getElementById('stage2HintModal').classList.remove('hidden');
}

function startLevel2Actual() {
  document.getElementById('stage2HintModal').classList.add('hidden');
  document.getElementById('s2ActiveArea').classList.remove('hidden');
  startTimer(finishLevel2);
  renderStage2Puzzle();
}

function renderStage2Puzzle() {
  if (s2Index >= stage2Puzzles.length) {
    finishLevel2();
    return;
  }
  const p = stage2Puzzles[s2Index];
  document.getElementById('s2Progress').innerText = `Puzzle ${s2Index + 1} of 5`;
  document.getElementById('s2QuestionText').innerText = p.text;
  document.getElementById('s2AnswerInput').value = "";
  document.getElementById('hintBox').innerText = p.hint;
  document.getElementById('hintBox').classList.add('hidden');
}

function toggleHint() {
  document.getElementById('hintBox').classList.toggle('hidden');
}

function submitStage2Answer() {
  const userAns = document.getElementById('s2AnswerInput').value.trim().toLowerCase();
  const validAnswers = stage2Puzzles[s2Index].answers;
  
  if (validAnswers.some(ans => userAns === ans || userAns.includes(ans))) {
    s2Score++;
  }
  s2Index++;
  renderStage2Puzzle();
}

function finishLevel2() {
  clearInterval(timerInterval);
  localStorage.setItem('vampire_s2_score', s2Score);
  document.getElementById('s2ActiveArea').classList.add('hidden');
  document.getElementById('s2ScoreVal').innerText = s2Score;
  document.getElementById('s2ScoreArea').classList.remove('hidden');
}

function goToResults() {
  window.location.href = 'result.html';
}

// --- RESULT PAGE LOGIC ---
function initResults() {
  const team = localStorage.getItem('vampire_team') || "Unknown Team";
  const score1 = parseInt(localStorage.getItem('vampire_s1_score') || 0);
  const score2 = parseInt(localStorage.getItem('vampire_s2_score') || 0);
  const violations = parseInt(localStorage.getItem('vampire_violations') || 0);
  const total = score1 + score2;

  document.getElementById('finalTeamName').innerText = team;
  document.getElementById('finalTotalScore').innerText = `${total} / 10`;

  const violationEl = document.getElementById('violationCountDisplay');
  if (violationEl) {
    violationEl.innerText = `Security Violations: ${violations}`;
    violationEl.style.color = violations > 0 ? "#ff4d4d" : "#00ff00"; 
  }

  let title = "";
  if (violations > 3) {
    title = "🚫 Disqualified: You have been disqualified as you are not honest.";
    document.getElementById('finalTotalScore').innerText = "0 / 10 (Nullified)";
  } else {
    if (total === 10) title = "🦇 Sovereign Vampire Lord (Perfect Score)";
    else if (total >= 7) title = "🩸 Nightstalker Code Master";
    else if (total >= 4) title = "🕯️ Shadow Crypt Keeper";
    else title = "💀 Fledgling Initiate";
  }
  document.getElementById('vampireTitle').innerText = title;
}

function restartApp() {
  localStorage.clear();
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  initSecurity();
});
