/* =====================================================
   VAMPIRE CODE HUNT
===================================================== */


const questions = [

    {
        q: "What is the output of print(2 ** 3)?",

        options: [
            "5",
            "6",
            "8",
            "9"
        ],

        answer: "8"
    },


    {
        q: "What is the output of print(len('Vampire'))?",

        options: [
            "6",
            "7",
            "8",
            "9"
        ],

        answer: "7"
    },


    {
        q: "What does 10 // 3 produce?",

        options: [
            "3",
            "3.33",
            "1",
            "0"
        ],

        answer: "3"
    },


    {
        q: "What is the output of print(5 > 3 and 2 < 1)?",

        options: [
            "True",
            "False",
            "5",
            "Error"
        ],

        answer: "False"
    },


    {
        q: "Which data type is used for [1, 2, 3]?",

        options: [
            "Tuple",
            "Set",
            "List",
            "Dictionary"
        ],

        answer: "List"
    }

];


let currentQuestion = 0;

let time = 300;

let timerInterval;


/* =====================================================
   LEVEL 1
===================================================== */

function initializeLevel1() {

    enableSecurity();

    loadQuestion();

    startTimer("level1");

}


function loadQuestion() {

    if (currentQuestion >= questions.length) {

        finishLevel1();

        return;
    }


    const question =
        questions[currentQuestion];


    document.getElementById("question")
        .innerText = question.q;


    document.getElementById("questionNo")
        .innerText = currentQuestion + 1;


    document.getElementById("number")
        .innerText = currentQuestion + 1;


    document.getElementById("progressBar")
        .style.width =
        ((currentQuestion + 1) / 5 * 100) + "%";


    const options =
        document.getElementById("options");


    options.innerHTML = "";


    question.options.forEach(function(option) {

        const button =
            document.createElement("div");


        button.className = "option";

        button.innerText = option;


        button.onclick = function() {

            checkAnswer(
                option,
                button
            );

        };


        options.appendChild(button);

    });

}


/* =====================================================
   CHECK ANSWER
===================================================== */

function checkAnswer(
    selected,
    button
) {

    const correct =
        questions[currentQuestion].answer;


    if (selected === correct) {

        button.style.background =
            "#075c25";

        button.style.borderColor =
            "#00ff66";


        document.getElementById(
            "answerMessage"
        ).innerText =
            "🩸 CORRECT!";


        let score =
            Number(
                sessionStorage.getItem("score")
            ) || 0;


        score += 10;


        sessionStorage.setItem(
            "score",
            score
        );


        document
            .querySelectorAll(".option")
            .forEach(function(element) {

                element.style.pointerEvents =
                    "none";

            });


        currentQuestion++;


        setTimeout(
            loadQuestion,
            700
        );


    } else {

        document.getElementById(
            "answerMessage"
        ).innerText =
            "❌ WRONG! Try again.";

    }

}


/* =====================================================
   FINISH LEVEL 1
===================================================== */

function finishLevel1() {

    clearInterval(timerInterval);


    const score =
        Number(
            sessionStorage.getItem("score")
        ) || 0;


    sessionStorage.setItem(
        "level1Score",
        score
    );


    window.location.href =
        "level2.html";

}


/* =====================================================
   LEVEL 2
===================================================== */

function initializeLevel2() {

    enableSecurity();

    time = 300;

    startTimer("level2");

}


function checkPuzzle() {

    const answer =
        document
            .getElementById("puzzleAnswer")
            .value
            .trim()
            .toLowerCase();


    const message =
        document.getElementById(
            "puzzleMessage"
        );


    if (
        answer === "60" ||
        answer === "sixty"
    ) {

        message.innerText =
            "🩸 CORRECT!";


        let score =
            Number(
                sessionStorage.getItem("score")
            ) || 0;


        score += 50;


        sessionStorage.setItem(
            "score",
            score
        );


        sessionStorage.setItem(
            "level2Score",
            "50"
        );


        document.getElementById(
            "puzzleAnswer"
        ).disabled = true;


        clearInterval(timerInterval);


        setTimeout(
            finishGame,
            1000
        );


    } else {

        message.innerText =
            "❌ Incorrect. Try again.";

    }

}


/* =====================================================
   FINISH GAME
===================================================== */

function finishGame() {

    window.location.href =
        "result.html";

}


/* =====================================================
   TIMER
===================================================== */

function startTimer(level) {

    clearInterval(timerInterval);


    const timer =
        document.getElementById("timer");


    updateTimer(timer);


    timerInterval =
        setInterval(function() {

            time--;

            updateTimer(timer);


            if (time <= 0) {

                clearInterval(
                    timerInterval
                );


                if (level === "level1") {

                    finishLevel1();

                } else {

                    const level1 =
                        Number(
                            sessionStorage.getItem(
                                "level1Score"
                            )
                        ) || 0;


                    const total =
                        Number(
                            sessionStorage.getItem(
                                "score"
                            )
                        ) || 0;


                    sessionStorage.setItem(
                        "level2Score",
                        Math.max(
                            total - level1,
                            0
                        )
                    );


                    window.location.href =
                        "result.html";

                }

            }

        }, 1000);

}


/* =====================================================
   TIMER DISPLAY
===================================================== */

function updateTimer(timer) {

    if (!timer) return;


    const minutes =
        Math.floor(time / 60);


    const seconds =
        time % 60;


    timer.innerText =
        String(minutes).padStart(2, "0")
        + ":" +
        String(seconds).padStart(2, "0");


    if (time <= 30) {

        timer.style.color =
            "red";

    }

}


/* =====================================================
   SECURITY
===================================================== */

function enableSecurity() {


    /* RIGHT CLICK */

    document.addEventListener(
        "contextmenu",
        function(event) {

            event.preventDefault();

            showPopup(
                "⚠️ ACTION BLOCKED",
                "Right-click is not available during this challenge."
            );

        }
    );


    /* COPY */

    document.addEventListener(
        "copy",
        function(event) {

            event.preventDefault();

            showPopup(
                "🩸 COPY-PASTE NOT AVAILABLE",
                "Copying text is disabled during the challenge."
            );

        }
    );


    /* CUT */

    document.addEventListener(
        "cut",
        function(event) {

            event.preventDefault();

            showPopup(
                "🩸 COPY-PASTE NOT AVAILABLE",
                "Cutting text is disabled during the challenge."
            );

        }
    );


    /* KEYBOARD SHORTCUTS */

    document.addEventListener(
        "keydown",
        function(event) {

            const key =
                event.key.toLowerCase();


            if (
                event.ctrlKey &&
                [
                    "c",
                    "v",
                    "x",
                    "u",
                    "s",
                    "p"
                ].includes(key)
            ) {

                event.preventDefault();

                showPopup(
                    "🩸 ACTION BLOCKED",
                    "This keyboard shortcut is not available."
                );

            }


            /* F12 */

            if (event.key === "F12") {

                event.preventDefault();

                showPopup(
                    "⚠️ ACTION BLOCKED",
                    "Developer tools are disabled."
                );

            }

        }
    );


    /* FULLSCREEN EXIT */

    document.addEventListener(
        "fullscreenchange",
        function() {

            if (!document.fullscreenElement) {

                registerViolation();

                showPopup(
                    "⚠️ EXIT BLOCKED",
                    "You must remain in fullscreen mode."
                );

            }

        }
    );


    /* TAB SWITCH */

    document.addEventListener(
        "visibilitychange",
        function() {

            if (document.hidden) {

                registerViolation();

                showPopup(
                    "🩸 CHALLENGE LEFT",
                    "Leaving the challenge screen is not allowed."
                );

            }

        }
    );

}


/* =====================================================
   VIOLATION
===================================================== */

function registerViolation() {

    let violations =
        Number(
            sessionStorage.getItem(
                "violations"
            )
        ) || 0;


    violations++;


    sessionStorage.setItem(
        "violations",
        violations
    );

}


/* =====================================================
   POPUP
===================================================== */

function showPopup(
    title,
    message
) {

    const popup =
        document.getElementById(
            "securityPopup"
        );


    if (!popup) return;


    document.getElementById(
        "popupTitle"
    ).innerText = title;


    document.getElementById(
        "popupMessage"
    ).innerText = message;


    popup.classList.remove(
        "hidden"
    );

}


/* =====================================================
   CLOSE POPUP
===================================================== */

function closePopup() {

    const popup =
        document.getElementById(
            "securityPopup"
        );


    popup.classList.add(
        "hidden"
    );


    /*
       Try to return to fullscreen.
    */

    if (!document.fullscreenElement) {

        document.documentElement
            .requestFullscreen()
            .catch(function() {});

    }

}


/* =====================================================
   HINT POPUP
===================================================== */

function closeHint() {

    const popup =
        document.getElementById(
            "hintPopup"
        );


    if (popup) {

        popup.classList.add(
            "hidden"
        );

    }

}
