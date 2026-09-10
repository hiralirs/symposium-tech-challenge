/* =========================================
   CRIMSON HACK — GAME ENGINE
   (Stage 1: Python, Stage 2: Logic)
========================================= */

// Initialize the 20-second warning audio using the correct .mpeg extension found in assets
const warningSound = new Audio('assets/timer-warning.mpeg');

/* =========================================
   BAT SWARM TRANSITION SYSTEM (VIDEO + AUDIO)
========================================= */

// Triggers the video transition and plays the bat-sound audio file
function triggerBatSwarm(callback) {
    const batOverlay = document.createElement("div");
    batOverlay.className = "bat-overlay";
    batOverlay.style.display = "block";
    document.body.appendChild(batOverlay);

    // Play the standalone bat-sound audio file
    let batAudio = document.getElementById("batAudio");
    if (!batAudio) {
        batAudio = new Audio("assets/bat-sound.mp4");
        batAudio.id = "batAudio";
        document.body.appendChild(batAudio);
    }
    batAudio.currentTime = 0;
    batAudio.play().catch(e => console.log("Audio locked:", e));

    // Create and configure the video element (muted so it pairs with bat-sound)
    const video = document.createElement("video");
    video.src = "assets/bat-transition.mp4";
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.style.position = "absolute";
    video.style.inset = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    batOverlay.appendChild(video);

    video.play().catch(e => console.log("Video play locked:", e));

    // Automatically clean up and proceed when the video finishes playing
    video.onended = function() {
        batOverlay.remove();
        if (callback) callback();
    };

    // Fallback safety timeout
    setTimeout(() => {
        if (document.body.contains(batOverlay)) {
            batOverlay.remove();
            if (callback) callback();
        }
    }, 6000); 
}


/* =========================================
   SECURITY / ANTI-CHEAT SYSTEM
========================================= */

function initSecurity() {
    setTimeout(function() {
        document.addEventListener("visibilitychange", function() {
            if (document.hidden) {
                // Triggers warning system instead of instant disqualification
                registerWarning("Tab switching or window minimization detected!");
            }
        });
    }, 1500);

    document.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    document.addEventListener("keydown", function(e) {
        const key = e.key.toUpperCase();
        const isCmdOrCtrl = e.ctrlKey || e.metaKey;

        if (
            key === "F12" ||
            (isCmdOrCtrl && e.shiftKey && ["I", "J", "C"].includes(key)) ||
            (isCmdOrCtrl && key === "U")
        ) {
            e.preventDefault();
            registerWarning("Developer tools and view-source are strictly prohibited.");
        }
    });
}

function registerWarning(reason) {
    let count = parseInt(localStorage.getItem("warningCount") || "0", 10) + 1;
    localStorage.setItem("warningCount", String(count));

    const secModal = document.getElementById("secModal");
    const secMsg = document.getElementById("secMsg");

    if (count >= 4) {
        if (secMsg) {
            secMsg.textContent = reason + "\n\nThis was your 4th warning.\nYou have been DISQUALIFIED.";
        }
        if (secModal) {
            secModal.classList.remove("hidden");
            secModal.style.display = "block";
            const btn = secModal.querySelector("button");
            if (btn) btn.style.display = "none";
        }

        localStorage.setItem("disqualified", "true");

        setTimeout(function() {
            finishStage2();
        }, 2000);

        return;
    }

    if (secMsg) {
        secMsg.textContent = reason + "\n\nWarning " + count + " of 3.\nOne more will result in disqualification.";
    }
    if (secModal) {
        secModal.classList.remove("hidden");
        secModal.style.display = "block";
    }
}

function closeSecModal() {
    const isDisqualified = localStorage.getItem("disqualified") === "true";
    const secModal = document.getElementById("secModal");

    if (secModal && !isDisqualified) {
        secModal.classList.add("hidden");
        secModal.style.display = "none";
    }
}


/* =========================================
   STAGE 1 — PYTHON MCQ
========================================= */

const pythonQuestions = [
    { code: `x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)`, options: ["[1, 2, 3]", "[1, 2, 3, 4]", "Error", "[4, 1, 2, 3]"], correct: 1 },
    { code: `def f(a, b=5):\n    return a + b\n\nprint(f(10))`, options: ["Error", "10", "15", "5"], correct: 2 },
    { code: `print(3 == 3.0)`, options: ["True", "False", "Error", "None"], correct: 0 },
    { code: `s = "vampire"\nprint(s[::-1])`, options: ["vampire", "eripmav", "Error", "v"], correct: 1 },
    { code: `total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)`, options: ["10", "9", "6", "4"], correct: 0 }
];

let s1Index = 0;
let s1Score = 0;
let s1TimerInterval = null;
let s1TimeLeft = 300;

function startLevel1() {
    initSecurity();

    if (localStorage.getItem("disqualified") === "true") {
        window.location.href = "level2.html";
        return;
    }

    const teamDisplay = document.getElementById("teamDisplayS1");
    if (teamDisplay) {
        teamDisplay.innerText = "TEAM: " + (localStorage.getItem("teamName") || "UNKNOWN SOUL").toUpperCase();
    }

    s1Index = 0;
    s1Score = 0;
    s1TimeLeft = 300;

    renderS1Question();
    startS1Timer();
}

function startS1Timer() {
    clearInterval(s1TimerInterval);
    updateS1TimerDisplay();

    s1TimerInterval = setInterval(function() {
        s1TimeLeft--;
        updateS1TimerDisplay();

        // 20-second warning trigger for Level 1
        if (s1TimeLeft === 20) {
            warningSound.play().catch(e => console.log("Audio play failed:", e));
        }

        if (s1TimeLeft <= 0) {
            clearInterval(s1TimerInterval);
            finishStage1();
        }
    }, 1000);
}

function updateS1TimerDisplay() {
    const el = document.getElementById("timerS1");
    if (!el) return;
    const m = String(Math.floor(s1TimeLeft / 60)).padStart(2, "0");
    const s = String(s1TimeLeft % 60).padStart(2, "0");
    el.textContent = m + ":" + s;
    el.classList.toggle("low-time", s1TimeLeft <= 60);
}

function renderS1Question() {
    const q = pythonQuestions[s1Index];

    document.getElementById("s1Progress").textContent = "Question " + (s1Index + 1) + " of " + pythonQuestions.length;
    document.getElementById("s1CodeBlock").textContent = q.code;

    const optionsWrap = document.getElementById("s1Options");
    optionsWrap.innerHTML = "";

    q.options.forEach(function(optionText, i) {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = String.fromCharCode(65 + i) + ") " + optionText;
        btn.onclick = function() {
            handleS1Answer(i, btn);
        };
        optionsWrap.appendChild(btn);
    });
}

function handleS1Answer(selectedIndex, btnEl) {
    const q = pythonQuestions[s1Index];
    const allBtns = document.querySelectorAll("#s1Options .option-btn");
    
    allBtns.forEach(function(b) { b.disabled = true; });

    if (selectedIndex === q.correct) {
        s1Score++;
    }

    s1Index++;
    if (s1Index < pythonQuestions.length) {
        renderS1Question();
    } else {
        finishStage1();
    }
}

function finishStage1() {
    clearInterval(s1TimerInterval);
    localStorage.setItem("s1Score", String(s1Score));

    const activeArea = document.getElementById("s1ActiveArea");
    const completeArea = document.getElementById("s1CompleteArea");
    const scoreDisplay = document.getElementById("s1ScoreDisplay");

    if (activeArea && completeArea) {
        activeArea.classList.add("hidden");
        
        triggerBatSwarm(function() {
            completeArea.classList.remove("hidden");
            if (scoreDisplay) scoreDisplay.textContent = s1Score;
        });

    } else {
        window.location.href = "level2.html";
    }
}


/* =========================================
   STAGE 2 — LOGIC PUZZLES
========================================= */

const logicPuzzles = [
    { text: "Three doors: A, B, C. Behind one is treasure, behind the other two are traps. The sign on A says 'Treasure is not here.' The sign on B says 'Treasure is in C.' Only one sign is true. Which door hides the treasure?", hint: "Try assuming each sign is the true one and check for contradictions.", answers: ["a", "door a", "door A"] },
    { text: "A vampire lord always lies. A guard always tells the truth. You meet one of them who says: 'I am the vampire lord.' Is the speaker the vampire lord or the guard?", hint: "If the vampire lord said this, would it be a lie or the truth?", answers: ["guard", "the guard"] },
    { text: "What has keys but no locks, space but no room, and you can enter but not go inside?", hint: "You are probably using one right now.", answers: ["keyboard", "a keyboard"] },
    { text: "I am an odd number. Take away one letter and I become even. What number am I?", hint: "Think of the number spelled out in words.", answers: ["seven", "7"] },
    { text: "A crypt has 5 coffins in a row. The vampire sleeps in a coffin that is not at either end, and not next to the coffin with the silver cross (coffin 3). Which coffin position(s) could the vampire be sleeping in?", hint: "Positions are numbered 1 to 5. Rule out the ends and the neighbors of position 3.", answers: ["2 and 4", "2, 4", "4 and 2", "4, 2", "2,4", "4,2", "coffin 2 and 4"] }
];

let s2Index = 0;
let s2Score = 0;
let s2TimerInterval = null;
let s2TimeLeft = 300;

function startLevel2Actual() {
    initSecurity();

    const instModal = document.getElementById("stage2InstModal");
    const mainUI = document.getElementById("level2MainUI");
    const activeArea = document.getElementById("s2ActiveArea");
    const completeArea = document.getElementById("s2CompleteArea");

    if (instModal) {
        instModal.classList.add("hidden");
        instModal.style.display = "none";
    }
    if (mainUI) {
        mainUI.classList.remove("hidden");
        mainUI.style.display = "block";
    }
    if (activeArea) {
        activeArea.classList.remove("hidden");
        activeArea.style.display = "block";
    }
    if (completeArea) {
        completeArea.classList.add("hidden");
        completeArea.style.display = "none";
    }

    if (localStorage.getItem("disqualified") === "true") {
        finishStage2();
        return;
    }

    s2Index = 0;
    s2Score = 0;
    s2TimeLeft = 300;

    renderS2Puzzle();
    startS2Timer();
}

function startS2Timer() {
    clearInterval(s2TimerInterval);
    updateS2TimerDisplay();

    s2TimerInterval = setInterval(function() {
        s2TimeLeft--;
        updateS2TimerDisplay();

        // 20-second warning trigger for Level 2
        if (s2TimeLeft === 20) {
            warningSound.play().catch(e => console.log("Audio play failed:", e));
        }

        if (s2TimeLeft <= 0) {
            clearInterval(s2TimerInterval);
            finishStage2();
        }
    }, 1000);
}

function updateS2TimerDisplay() {
    const el = document.getElementById("timerS2");
    if (!el) return;
    const m = String(Math.floor(s2TimeLeft / 60)).padStart(2, "0");
    const s = String(s2TimeLeft % 60).padStart(2, "0");
    el.textContent = m + ":" + s;
    el.classList.toggle("low-time", s2TimeLeft <= 60);
}

function renderS2Puzzle() {
    const p = logicPuzzles[s2Index];
    document.getElementById("s2Progress").textContent = "Puzzle " + (s2Index + 1) + " of " + logicPuzzles.length;
    document.getElementById("s2PuzzleText").textContent = p.text;

    const hintText = document.getElementById("hintText");
    if (hintText) {
        hintText.textContent = p.hint;
        hintText.classList.add("hidden");
        hintText.style.display = "none";
    }

    const answerInput = document.getElementById("s2Answer");
    if (answerInput) {
        answerInput.value = "";
        answerInput.focus();
    }
}

function showHint() {
    const hintText = document.getElementById("hintText");
    if (hintText) {
        hintText.classList.remove("hidden");
        hintText.style.display = "block";
    }
}

function submitS2Answer() {
    const p = logicPuzzles[s2Index];
    const input = document.getElementById("s2Answer");
    if (!input) return;

    const given = input.value.trim().toLowerCase();
    if (given === "") {
        input.focus();
        return;
    }

    if (p.answers.some(ans => ans.toLowerCase() === given)) {
        s2Score++;
    }

    s2Index++;
    if (s2Index < logicPuzzles.length) {
        renderS2Puzzle();
    } else {
        finishStage2();
    }
}

function finishStage2() {
    clearInterval(s2TimerInterval);
    localStorage.setItem("s2Score", String(s2Score));

    const activeArea = document.getElementById("s2ActiveArea");

    // Hide the questions
    if (activeArea) {
        activeArea.classList.add("hidden");
        activeArea.style.display = "none";
    }

    // Trigger video transition and audio, then FORCE the game to load the dedicated result.html page
    triggerBatSwarm(function() {
        window.location.href = "result.html";
    });
}

function loadResult() {
    const teamName = localStorage.getItem("teamName") || "Unknown Soul";
    const disqualified = localStorage.getItem("disqualified") === "true";

    const s1 = parseInt(localStorage.getItem("s1Score") || "0", 10);
    const s2 = parseInt(localStorage.getItem("s2Score") || "0", 10);
    const total = disqualified ? 0 : s1 + s2;

    const nameEl = document.getElementById("teamResultName");
    const round1El = document.querySelector("#round1Display span");
    const round2El = document.querySelector("#round2Display span");
    const scoreEl = document.getElementById("finalScoreDisplay");
    const rankEl = document.getElementById("rankDisplay");

    if (nameEl) nameEl.textContent = "Team: " + teamName;
    if (round1El) round1El.textContent = disqualified ? 0 : s1;
    if (round2El) round2El.textContent = disqualified ? 0 : s2;
    if (scoreEl) scoreEl.textContent = total;

    // --- NEW: Audio Playback Logic with Fallback ---
    const gameOverAudio = new Audio('assets/game-over.mp3');
    gameOverAudio.play().catch(e => {
        console.log("Audio autoplay restricted by browser, waiting for user interaction:", e);
        // Fallback: Play audio on first click anywhere on the page
        document.body.addEventListener('click', function playAudioOnce() {
            gameOverAudio.play().catch(err => console.log("Audio still restricted:", err));
            document.body.removeEventListener('click', playAudioOnce);
        }, { once: true });
    });

    if (!rankEl) return;

    if (disqualified) {
        rankEl.textContent = "⚰️ DISQUALIFIED — The Kingdom rejects your bloodline.";
        rankEl.style.color = "#ff3333";
        return;
    }

    let rank;
    if (total >= 9) {
        rank = "🩸 Vampire Lord — A masterful hunt.";
    } else if (total >= 7) {
        rank = "🦇 Nightstalker — Sharp and swift.";
    } else if (total >= 5) {
        rank = "🕯️ Apprentice Hunter — Solid effort.";
    } else if (total >= 3) {
        rank = "🌫️ Wandering Soul — The crypt tested you well.";
    } else {
        rank = "☠️ Lost to the Dark — Better luck next hunt.";
    }

    rankEl.textContent = rank;
}

document.addEventListener("keydown", function(e) {
    const answerInput = document.getElementById("s2Answer");
    if (answerInput && document.activeElement === answerInput && e.key === "Enter") {
        submitS2Answer();
    }
});