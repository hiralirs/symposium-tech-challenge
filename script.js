// --- DATA ---
const stage1Questions = [
  { code: "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))", options: ["3", "4", "Error", "None"], correct: 1 },
  { code: "print(bool('False'))", options: ["False", "True", "Error", "None"], correct: 1 },
  { code: "a = (1, 2, 3)\na[0] = 4", options: ["(4, 2, 3)", "TypeError", "SyntaxError", "None"], correct: 1 },
  { code: "print(2 ** 3 ** 2)", options: ["64", "512", "81", "256"], correct: 1 },
  { code: "print(type(1/2))", options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'number'>"], correct: 1 }
];

const stage2Puzzles = [
  { text: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo", hint: "Think of sound bouncing off cavern walls." },
  { text: "A vampire leaves his tomb at 12:00 AM, walks 3 miles south, 3 miles west, shoots a bat, and walks 3 miles north back to his exact tomb. What color was the bat?", answer: "white", hint: "The tomb location makes this place very cold and unique." }
];

// --- GLOBAL SECURITY & CONTROLS ---
function initSecurity() {
  // Point 27: Right-click blocking
  document.addEventListener('contextmenu', e => e.preventDefault());
  // Point 26: Copy/Cut/Paste blocking
  document.addEventListener('copy', e => e.preventDefault());
  document.addEventListener('cut', e => e.preventDefault());
  document.addEventListener('paste', e => e.preventDefault());

  // Point 31: Keyboard Protection
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V' || e.shiftKey))) {
      e.preventDefault();
    }
  });

  // Point 28: Tab-switch warning
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !location.pathname.includes('result.html') && !location.pathname.includes('index.html')) {
      showSecModal("Tab switching detected! Answers must be submitted without leaving the frame.");
    }
  });

  // Point 29: Fullscreen-exit warning
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && !location.pathname.includes('result.html') && !location.pathname.includes('index.html')) {
      showSecModal("Exiting fullscreen mode is flagged. Please keep the window expanded.");
    }
  });
}

function showSecModal(msg) {
  let modal = document.getElementById('secModal');
  if (modal) {
    document.getElementById('secModalMsg').innerText = msg;
    modal.classList.remove('hidden');
  }
}

function closeSecModal() {
  let modal = document.getElementById('secModal');
  if (modal) modal.classList.add('hidden');
}

// --- TIMER LOGIC ---
let timerInterval = null;
let timeRemaining = 300; // Points 6 & 13: 5 minutes per level

function startTimer(onTimeout) {
  clearInterval(timerInterval);
  timeRemaining = 300;
  updateTimerBadge();
  const badge = document.getElementById('timerDisplay');
  if (badge) badge.classList.remove('hidden');

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerBadge();
    if (timeRemaining <= 0) { // Point 30: Automatic Timeout
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
  localStorage.setItem('vampire_s1_score', 0);
  localStorage.setItem('vampire_s2_score', 0);

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
  document.getElementById('s1Progress').innerText = `Question ${s1Index + 1} of 5`; // Point 7: 5 MCQs
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
  // Point 8: Automatic Navigation
  // Points 9 & 10: No feedback / answers hidden
  renderStage1Question();
}

function finishLevel1() {
  clearInterval(timerInterval);
  localStorage.setItem('vampire_s1_score', s1Score);
  document.getElementById('s1ActiveArea').classList.add('hidden');
  document.getElementById('s1ScoreVal').innerText = s1Score; // Point 11: Score After Level
  document.getElementById('s1ScoreArea').classList.remove('hidden');
}

function goToLevel2() { // Point 12: Continue to Level 2
  window.location.href = 'level2.html';
}

// --- LEVEL 2 LOGIC ---
let s2Index = 0;
let s2Score = 0;

function initLevel2() {
  // Point 14: Level 2 Instructions Popup appears initially
  document.getElementById('stage2InstModal').classList.remove('hidden');
}

function showHintNoticeModal() {
  document.getElementById('stage2InstModal').classList.add('hidden');
  // Point 15: Centered Hint Popup
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
  document.getElementById('s2Progress').innerText = `Puzzle ${s2Index + 1} of 2`; // Point 16: 2 Logical Puzzles
  document.getElementById('s2QuestionText').innerText = p.text;
  document.getElementById('s2AnswerInput').value = "";
  document.getElementById('hintBox').innerText = p.hint; // Point 17: Hints Below
  document.getElementById('hintBox').classList.add('hidden');
}

function toggleHint() {
  document.getElementById('hintBox').classList.toggle('hidden');
}

function submitStage2Answer() {
  const userAns = document.getElementById('s2AnswerInput').value.trim().toLowerCase();
  if (userAns === stage2Puzzles[s2Index].answer.toLowerCase()) {
    s2Score++;
  }
  s2Index++;
  // Point 18: Automatic Navigation
  // Points 19 & 20: No feedback / hidden answers
  renderStage2Puzzle();
}

function finishLevel2() {
  clearInterval(timerInterval);
  localStorage.setItem('vampire_s2_score', s2Score);
  document.getElementById('s2ActiveArea').classList.add('hidden');
  document.getElementById('s2ScoreVal').innerText = s2Score; // Point 21: Score After Level
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
  const total = score1 + score2; // Point 22: Total Score Calculation

  document.getElementById('finalTeamName').innerText = team;
  document.getElementById('finalTotalScore').innerText = `${total} / 7`; // Point 23: Final Score Page

  let title = "";
  if (total === 7) title = "🦇 Sovereign Vampire Lord (Perfect Score)";
  else if (total >= 4) title = "🩸 Nightstalker Code Master";
  else title = "🕯️ Fledgling Initiate";

  document.getElementById('vampireTitle').innerText = title; // Point 24: Vampire Result Message
}

function restartApp() { // Point 25: Restart Option
  localStorage.clear();
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
  window.location.href = 'index.html';
}

// Global initialization call
document.addEventListener('DOMContentLoaded', () => {
  initSecurity();
});
