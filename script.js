// --- QUESTIONS & CONFIG ---
const QUESTIONS = [
    {
        question: "What is the output of: print(type(1 / 1)) in Python 3?",
        options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'number'>"],
        correct: 1
    },
    {
        question: "Which of the following data structures is immutable in Python?",
        options: ["List", "Dictionary", "Tuple", "Set"],
        correct: 2
    },
    {
        question: "What keyword is used to create an anonymous function in Python?",
        options: ["def", "function", "lambda", "anon"],
        correct: 2
    },
    {
        question: "How do you start writing a block comment spanning multiple lines in Python?",
        options: ["//", "/*", "''' (Triple quotes)", "<!--"],
        correct: 2
    },
    {
        question: "Which library is foundational for handling data frames in Python Data Science?",
        options: ["Matplotlib", "Pandas", "Math", "Urllib"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let l1Score = 0;
let l2Score = 0;
let teamName = "";
let teamId = "";
let l1Timer, l2Timer;
let timeLeft = 300; // 5 minutes per level

// --- DOM ELEMENTS ---
const welcomeScreen = document.getElementById("welcome-screen");
const level1Screen = document.getElementById("level1-screen");
const level2Screen = document.getElementById("level2-screen");
const qualifiedScreen = document.getElementById("qualified-screen");

document.getElementById("start-btn").addEventListener("click", () => {
    teamName = document.getElementById("team-name").value.trim();
    teamId = document.getElementById("team-id").value.trim();

    if (!teamName || !teamId) {
        alert("Enter Team Name and Team ID to enter the crypt!");
        return;
    }

    // Trigger Fullscreen Lockdown
    document.documentElement.requestFullscreen().catch(err => {
        console.log("Fullscreen request denied:", err);
    });

    switchScreen(level1Screen);
    startLevel1Timer();
    loadQuestion();
});

function switchScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
}

// --- LEVEL 1 LOGIC ---
function startLevel1Timer() {
    timeLeft = 300;
    l1Timer = setInterval(() => {
        timeLeft--;
        let min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        let sec = String(timeLeft % 60).padStart(2, '0');
        document.getElementById("l1-timer").innerText = `Timer: ${min}:${sec}`;

        if (timeLeft <= 0) {
            clearInterval(l1Timer);
            startLevel2();
        }
    }, 1000);
}

function loadQuestion() {
    if (currentQuestionIndex >= QUESTIONS.length) {
        clearInterval(l1Timer);
        startLevel2();
        return;
    }

    let q = QUESTIONS[currentQuestionIndex];
    document.getElementById("question-text").innerText = `Q${currentQuestionIndex + 1}: ${q.question}`;
    
    let optContainer = document.getElementById("options-container");
    optContainer.innerHTML = "";

    q.options.forEach((opt, idx) => {
        let btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt;
        btn.addEventListener("click", () => checkAnswer(idx, btn));
        optContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIdx, btnElement) {
    let q = QUESTIONS[currentQuestionIndex];
    if (selectedIdx === q.correct) {
        l1Score += 3; // 5 questions * 3 marks = 15 total max for Level 1
        currentQuestionIndex++;
        loadQuestion();
    } else {
        // Shake effect on wrong answer
        btnElement.classList.add("shake");
        setTimeout(() => btnElement.classList.remove("shake"), 400);
    }
}

// --- LEVEL 2 LOGIC ---
function startLevel2() {
    switchScreen(level2Screen);
    timeLeft = 300;
    
    // Popup prompt behavior as specified
    setTimeout(() => {
        alert("The hint of the puzzle will appear below the crypt seal...");
    }, 500);

    l2Timer = setInterval(() => {
        timeLeft--;
        let min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        let sec = String(timeLeft % 60).padStart(2, '0');
        document.getElementById("l2-timer").innerText = `Timer: ${min}:${sec}`;

        if (timeLeft <= 0) {
            clearInterval(l2Timer);
            showResults();
        }
    }, 1000);

    document.getElementById("submit-puzzle").addEventListener("click", () => {
        let userAns = document.getElementById("puzzle-answer").value.trim().toUpperCase();
        // FPSSH QSSR shifted back by 3 becomes BLOOD MOON
        if (userAns === "BLOOD MOON") {
            l2Score = 5; // Level 2 puzzle is worth 5 marks
            clearInterval(l2Timer);
            showResults();
        } else {
            let box = document.getElementById("puzzle-answer");
            box.classList.add("shake");
            setTimeout(() => box.classList.remove("shake"), 400);
        }
    });
}

// --- QUALIFIED PAGE & SCORING ---
function showResults() {
    switchScreen(qualifiedScreen);
    
    // Exit fullscreen safely on finish
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
    }

    document.getElementById("res-team").innerText = teamName;
    document.getElementById("res-id").innerText = teamId;
    document.getElementById("res-l1").innerText = l1Score;
    document.getElementById("res-l2").innerText = l2Score;
    document.getElementById("res-total").innerText = l1Score + l2Score; // Total out of 20
}

// --- ANTI-CHEATING TAB SWITCH / MINIMIZE DETECTION ---
document.addEventListener("visibilitychange", () => {
    if (document.hidden && welcomeScreen.classList.contains("active") === false && qualifiedScreen.classList.contains("active") === false) {
        document.getElementById("warning-modal").classList.remove("hidden");
        setTimeout(() => {
            document.getElementById("warning-modal").classList.add("hidden");
        }, 3000);
    }
});

// Disable Right-Click context menus to deter cheating
document.addEventListener("contextmenu", event => event.preventDefault());
