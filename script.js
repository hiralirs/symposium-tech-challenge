/* =====================================================
   VAMPIRE TECH CHALLENGE
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   COMMON PROTECTION
===================================================== */

document.addEventListener("contextmenu", function(event) {

    event.preventDefault();

});


document.addEventListener("copy", function(event) {

    event.preventDefault();

});


document.addEventListener("cut", function(event) {

    event.preventDefault();

});


document.addEventListener("paste", function(event) {

    event.preventDefault();

});


document.addEventListener("dragstart", function(event) {

    event.preventDefault();

});


/* =====================================================
   BLOCK SOME SHORTCUTS
===================================================== */

document.addEventListener("keydown", function(event) {

    if (
        event.key === "F12" ||
        (
            event.ctrlKey &&
            event.shiftKey &&
            (
                event.key === "I" ||
                event.key === "J"
            )
        ) ||
        (
            event.ctrlKey &&
            event.key === "U"
        )
    ) {

        event.preventDefault();

    }

});


/* =====================================================
   PAGE NAME
===================================================== */

const page =
    location.pathname
        .split("/")
        .pop();


/* =====================================================
   WELCOME PAGE
===================================================== */

if (
    page === "index.html" ||
    page === ""
) {

    const startBtn =
        document.getElementById("startBtn");

    const teamInput =
        document.getElementById("teamName");


    startBtn.addEventListener(
        "click",
        startChallenge
    );


    function startChallenge() {

        const team =
            teamInput.value.trim();


        if (team === "") {

            alert(
                "Please enter your team name."
            );

            teamInput.focus();

            return;

        }


        localStorage.setItem(
            "teamName",
            team
        );


        localStorage.setItem(
            "level1Score",
            "0"
        );


        localStorage.setItem(
            "level2Score",
            "0"
        );


        localStorage.setItem(
            "finalScore",
            "0"
        );


        requestFullscreen();


        window.location.href =
            "level1.html";

    }


    /* ENTER ON WELCOME PAGE */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                startChallenge();

            }

        }
    );

}


/* =====================================================
   FULLSCREEN
===================================================== */

function requestFullscreen() {

    if (
        document.documentElement.requestFullscreen
    ) {

        document.documentElement
            .requestFullscreen()
            .catch(function() {

                console.log(
                    "Fullscreen permission was not granted."
                );

            });

    }

}


/* =====================================================
   LEVEL 1
===================================================== */

if (
    page === "level1.html"
) {

    const questions = [

        {
            question:
                "What is the output of print(2 ** 3)?",

            options: [
                "6",
                "8",
                "9",
                "5"
            ],

            answer: 1,

            marks: 10
        },

        {
            question:
                "What is the output of print(10 // 3)?",

            options: [
                "3",
                "3.33",
                "1",
                "4"
            ],

            answer: 0,

            marks: 10
        },

        {
            question:
                "Which keyword is used to define a function in Python?",

            options: [
                "function",
                "define",
                "def",
                "fun"
            ],

            answer: 2,

            marks: 10
        },

        {
            question:
                "What is the output of print(bool(0))?",

            options: [
                "True",
                "False",
                "0",
                "None"
            ],

            answer: 1,

            marks: 10
        },

        {
            question:
                "What is the output of print(len('Vampire'))?",

            options: [
                "6",
                "7",
                "8",
                "5"
            ],

            answer: 1,

            marks: 10
        }

    ];


    let currentQuestion = 0;

    let level1Score = 0;

    let selected = false;

    let timeLeft = 300;

    let timerInterval;


    const questionBox =
        document.getElementById(
            "questionBox"
        );

    const optionsBox =
        document.getElementById(
            "optionsBox"
        );

    const questionNumber =
        document.getElementById(
            "questionNumber"
        );

    const progressBar =
        document.getElementById(
            "progressBar"
        );

    const timer =
        document.getElementById(
            "timer"
        );


    /* LOAD QUESTION */

    function loadQuestion() {

        selected = false;


        const q =
            questions[currentQuestion];


        questionNumber.textContent =
            currentQuestion + 1;


        questionBox.textContent =
            q.question;


        progressBar.style.width =
            (
                ((currentQuestion + 1) / 5)
                * 100
            ) + "%";


        optionsBox.innerHTML = "";


        q.options.forEach(
            function(option, index) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "option";


                button.textContent =
                    option;


                button.addEventListener(
                    "click",
                    function() {

                        selectAnswer(
                            index
                        );

                    }
                );


                optionsBox.appendChild(
                    button
                );

            }
        );

    }


    /* SELECT ANSWER */

    function selectAnswer(index) {

        if (selected) {
            return;
        }


        selected = true;


        const q =
            questions[currentQuestion];


        if (
            index === q.answer
        ) {

            level1Score +=
                q.marks;

        }


        /*

        IMPORTANT:

        No correct/wrong message
        is displayed.

        The participant immediately
        goes to the next question.

        */


        setTimeout(
            nextQuestion,
            150
        );

    }


    /* NEXT QUESTION */

    function nextQuestion() {

        currentQuestion++;


        if (
            currentQuestion >=
            questions.length
        ) {

            finishLevel1();

            return;

        }


        loadQuestion();

    }


    /* FINISH LEVEL 1 */

    function finishLevel1() {

        clearInterval(
            timerInterval
        );


        localStorage.setItem(
            "level1Score",
            level1Score
        );


        localStorage.setItem(
            "currentLevelScore",
            level1Score
        );


        window.location.href =
            "level2.html";

    }


    /* TIMER */

    function updateTimer() {

        const minutes =
            Math.floor(
                timeLeft / 60
            );


        const seconds =
            timeLeft % 60;


        timer.textContent =
            String(minutes)
                .padStart(2, "0")
            + ":" +
            String(seconds)
                .padStart(2, "0");


        if (
            timeLeft <= 30
        ) {

            timer.parentElement
                .classList.add(
                    "timer-warning"
                );

        }


        if (
            timeLeft <= 0
        ) {

            clearInterval(
                timerInterval
            );


            finishLevel1();

        }

    }


    timerInterval =
        setInterval(
            function() {

                timeLeft--;

                updateTimer();

            },
            1000
        );


    /* ENTER KEY */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();


                if (!selected) {

                    /*
                    Enter selects the
                    first option if no
                    option was selected.
                    */

                    const firstButton =
                        document.querySelector(
                            ".option"
                        );


                    if (firstButton) {

                        firstButton.click();

                    }

                }
                else {

                    nextQuestion();

                }

            }

        }
    );


    /* START */

    loadQuestion();

    updateTimer();

}


/* =====================================================
   LEVEL 2
===================================================== */

if (
    page === "level2.html"
) {

    const puzzles = [

        {
            question:
                "I am a number. If you multiply me by 2 and add 6, the answer is 20. What am I?",

            hint:
                "Think backwards. Subtract 6 first, then divide by 2.",

            answer:
                "7",

            marks:
                25
        },

        {
            question:
                "I have keys but no locks. I have space but no room. You can enter, but you cannot go inside. What am I?",

            hint:
                "You use me when working with a computer.",

            answer:
                "keyboard",

            marks:
                25
        }

    ];


    let currentPuzzle = 0;

    let level2Score = 0;

    let timeLeft = 300;

    let timerInterval;

    let answerSelected = false;


    const puzzleArea =
        document.getElementById(
            "puzzleArea"
        );


    const timer =
        document.getElementById(
            "timer"
        );


    const instructionsPopup =
        document.getElementById(
            "instructionsPopup"
        );


    const hintPopup =
        document.getElementById(
            "hintPopup"
        );


    const instructionsContinue =
        document.getElementById(
            "instructionsContinue"
        );


    const hintContinue =
        document.getElementById(
            "hintContinue"
        );


    /* =========================================
       LEVEL 2 INSTRUCTIONS
    ========================================= */

    instructionsContinue.addEventListener(
        "click",
        function() {

            instructionsPopup
                .classList.remove(
                    "show"
                );


            hintPopup
                .classList.add(
                    "show"
                );

        }
    );


    /* =========================================
       HINT POPUP
    ========================================= */

    hintContinue.addEventListener(
        "click",
        function() {

            hintPopup
                .classList.remove(
                    "show"
                );


            loadPuzzle();

            startTimer();

        }
    );


    /* =========================================
       LOAD PUZZLE
    ========================================= */

    function loadPuzzle() {

        answerSelected = false;


        const puzzle =
            puzzles[currentPuzzle];


        puzzleArea.innerHTML = `

            <div class="question-number">
                Puzzle ${currentPuzzle + 1} / 2
            </div>

            <div class="puzzle">

                <h3>
                    🧩 PUZZLE ${currentPuzzle + 1}
                </h3>

                <div class="puzzle-question">
                    ${puzzle.question}
                </div>

                <div class="hint">

                    💡 <b>Hint:</b>

                    ${puzzle.hint}

                </div>

                <div style="text-align:center;">

                    <input
                        id="puzzleAnswer"
                        type="text"
                        placeholder="Enter your answer"
                        autocomplete="off"
                    >

                    <br>

                    <button id="submitPuzzle">
                        SUBMIT
                    </button>

                </div>

            </div>

            <p class="enter-info">
                Enter your answer and press
                <b>ENTER</b> to continue.
            </p>

        `;


        document
            .getElementById(
                "submitPuzzle"
            )
            .addEventListener(
                "click",
                submitPuzzle
            );


        document
            .getElementById(
                "puzzleAnswer"
            )
            .focus();

    }


    /* =========================================
       SUBMIT PUZZLE
    ========================================= */

    function submitPuzzle() {

        if (answerSelected) {
            return;
        }


        answerSelected = true;


        const input =
            document.getElementById(
                "puzzleAnswer"
            );


        const answer =
            input.value
                .trim()
                .toLowerCase();


        const correctAnswer =
            puzzles[currentPuzzle]
                .answer
                .toLowerCase();


        if (
            answer === correctAnswer
        ) {

            level2Score +=
                puzzles[currentPuzzle]
                    .marks;

        }


        /*
        No correct/wrong message.
        */


        setTimeout(
            nextPuzzle,
            150
        );

    }


    /* =========================================
       NEXT PUZZLE
    ========================================= */

    function nextPuzzle() {

        currentPuzzle++;


        if (
            currentPuzzle >=
            puzzles.length
        ) {

            finishLevel2();

            return;

        }


        loadPuzzle();

    }


    /* =========================================
       FINISH LEVEL 2
    ========================================= */

    function finishLevel2() {

        clearInterval(
            timerInterval
        );


        localStorage.setItem(
            "level2Score",
            level2Score
        );


        window.location.href =
            "result.html";

    }


    /* =========================================
       TIMER
    ========================================= */

    function startTimer() {

        clearInterval(
            timerInterval
        );


        updateTimer();


        timerInterval =
            setInterval(
                function() {

                    timeLeft--;

                    updateTimer();


                    if (
                        timeLeft <= 0
                    ) {

                        clearInterval(
                            timerInterval
                        );


                        finishLevel2();

                    }

                },
                1000
            );

    }


    function updateTimer() {

        const minutes =
            Math.floor(
                timeLeft / 60
            );


        const seconds =
            timeLeft % 60;


        timer.textContent =
            String(minutes)
                .padStart(2, "0")
            + ":" +
            String(seconds)
                .padStart(2, "0");


        if (
            timeLeft <= 30
        ) {

            timer.parentElement
                .classList.add(
                    "timer-warning"
                );

        }

    }


    /* =========================================
       ENTER KEY
    ========================================= */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();


                const popupOpen =
                    instructionsPopup
                        .classList.contains(
                            "show"
                        );


                const hintOpen =
                    hintPopup
                        .classList.contains(
                            "show"
                        );


                if (popupOpen) {

                    instructionsContinue
                        .click();

                    return;

                }


                if (hintOpen) {

                    hintContinue.click();

                    return;

                }


                submitPuzzle();

            }

        }
    );

}


/* =====================================================
   RESULT PAGE
===================================================== */

if (
    page === "result.html"
) {

    const team =
        localStorage.getItem(
            "teamName"
        ) || "Team";


    const level1 =
        Number(
            localStorage.getItem(
                "level1Score"
            ) || 0
        );


    const level2 =
        Number(
            localStorage.getItem(
                "level2Score"
            ) || 0
        );


    const total =
        level1 + level2;


    document.getElementById(
        "resultTeam"
    ).textContent =
        "🩸 " + team;


    document.getElementById(
        "finalScore"
    ).textContent =
        total;


    let message;


    if (total >= 80) {

        message =
            "🧛 Outstanding! You escaped the Vampire's Castle!";

    }

    else if (total >= 50) {

        message =
            "🩸 Great job! You survived the challenge!";

    }

    else {

        message =
            "☠️ The Vampire has won this time!";

    }


    document.getElementById(
        "resultMessage"
    ).textContent =
        message;


    /* RESTART */

    document.getElementById(
        "restartBtn"
    ).addEventListener(
        "click",
        function() {

            localStorage.clear();

            window.location.href =
                "index.html";

        }
    );


    /* ENTER = RESTART */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                document
                    .getElementById(
                        "restartBtn"
                    )
                    .click();

            }

        }
    );

}


/* =====================================================
   TAB SWITCH WARNING
===================================================== */

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.hidden &&
            (
                page === "level1.html" ||
                page === "level2.html"
            )
        ) {

            alert(
                "⚠️ Please remain on the challenge screen."
            );

        }

    }
);


/* ========================
