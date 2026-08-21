/* =====================================================
   VAMPIRE CHALLENGE
===================================================== */


/* =====================================================
   QUESTIONS
===================================================== */

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

        answer: "8"
    },


    {
        question:
            "What is the output of print(10 // 3)?",

        options: [
            "3",
            "3.33",
            "4",
            "1"
        ],

        answer: "3"
    },


    {
        question:
            "What is the data type of 10.5?",

        options: [
            "int",
            "str",
            "float",
            "double"
        ],

        answer: "float"
    },


    {
        question:
            "What is the output of len('Python')?",

        options: [
            "5",
            "6",
            "7",
            "8"
        ],

        answer: "6"
    },


    {
        question:
            "What is the output of print(5 > 3 and 2 > 4)?",

        options: [
            "True",
            "False",
            "5",
            "Error"
        ],

        answer: "False"
    }

];


/* =====================================================
   VARIABLES
===================================================== */

let currentQuestion = 0;

let selectedAnswer = null;

let level1Score = 0;

let timerInterval = null;

let timeLeft = 300;

let violationTriggered = false;


const currentPage =
    window.location.pathname
        .split("/")
        .pop();


/* =====================================================
   START ROUND
===================================================== */

function startRound() {

    const teamName =
        document
            .getElementById("teamName")
            .value
            .trim();


    const teamId =
        document
            .getElementById("teamId")
            .value
            .trim();


    if (
        teamName === "" ||
        teamId === ""
    ) {

        document
            .getElementById("error")
            .innerText =
                "Please enter Team Name and Team ID.";

        return;
    }


    localStorage.clear();


    localStorage.setItem(
        "teamName",
        teamName
    );


    localStorage.setItem(
        "teamId",
        teamId
    );


    localStorage.setItem(
        "disqualified",
        "false"
    );


    localStorage.setItem(
        "level1Answers",
        JSON.stringify([])
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
        "puzzleAnswer",
        ""
    );


    requestFullscreen();


    window.location.href =
        "level1.html";
}


/* =====================================================
   CHECK TEAM
===================================================== */

function checkTeam() {

    const teamName =
        localStorage.getItem("teamName");


    const teamId =
        localStorage.getItem("teamId");


    if (
        !teamName ||
        !teamId
    ) {

        window.location.href =
            "index.html";

        return false;
    }


    return true;
}


/* =====================================================
   LEVEL 1 LOAD
===================================================== */

function loadLevel1() {

    if (!checkTeam()) {
        return;
    }


    document
        .getElementById("teamNameDisplay")
        .innerText =
            localStorage.getItem("teamName");


    document
        .getElementById("teamIdDisplay")
        .innerText =
            localStorage.getItem("teamId");

}


/* =====================================================
   START LEVEL 1
===================================================== */

function startLevel1() {

    document
        .getElementById(
            "level1Instructions"
        )
        .classList.add("hidden");


    document
        .getElementById(
            "level1Questions"
        )
        .classList.remove("hidden");


    currentQuestion = 0;

    selectedAnswer = null;


    showQuestion();


    /*
       5 MINUTES
    */

    startTimer();


    requestFullscreen();

}


/* =====================================================
   SHOW QUESTION
===================================================== */

function showQuestion() {

    selectedAnswer = null;


    document
        .getElementById(
            "questionNumber"
        )
        .innerText =
            currentQuestion + 1;


    const question =
        questions[currentQuestion];


    let html = `

        <div class="question-box">

            <h3>
                ${question.question}
            </h3>

    `;


    question.options.forEach(
        function(option) {

            const safeOption =
                option.replace(
                    /'/g,
                    "\\'"
                );


            html += `

                <div
                    class="option"
                    onclick="selectOption(
                        this,
                        '${safeOption}'
                    )"
                >

                    ${option}

                </div>

            `;

        }
    );


    html += `

        </div>

    `;


    document
        .getElementById(
            "questionContainer"
        )
        .innerHTML =
            html;
}


/* =====================================================
   SELECT ANSWER
===================================================== */

function selectOption(
    element,
    answer
) {

    document
        .querySelectorAll(".option")
        .forEach(
            function(option) {

                option.classList.remove(
                    "selected"
                );

            }
        );


    element.classList.add(
        "selected"
    );


    selectedAnswer =
        answer;
}


/* =====================================================
   NEXT QUESTION
===================================================== */

function nextQuestion() {

    if (
        selectedAnswer === null
    ) {

        document
            .getElementById(
                "questionError"
            )
            .innerText =
                "Please select an answer.";

        return;
    }


    document
        .getElementById(
            "questionError"
        )
        .innerText = "";


    let answers =
        JSON.parse(
            localStorage.getItem(
                "level1Answers"
            ) || "[]"
        );


    answers[currentQuestion] =
        selectedAnswer;


    localStorage.setItem(
        "level1Answers",
        JSON.stringify(answers)
    );


    currentQuestion++;


    if (
        currentQuestion <
        questions.length
    ) {

        showQuestion();

    }

    else {

        finishLevel1();

    }
}


/* =====================================================
   FINISH LEVEL 1
===================================================== */

function finishLevel1() {

    clearInterval(
        timerInterval
    );


    calculateLevel1Score();


    /*
       Correct answers are NOT shown.

       Go to Level 2 instructions.
    */

    window.location.href =
        "level2.html";
}


/* =====================================================
   LEVEL 1 SCORE
===================================================== */

function calculateLevel1Score() {

    const answers =
        JSON.parse(
            localStorage.getItem(
                "level1Answers"
            ) || "[]"
        );


    level1Score = 0;


    answers.forEach(
        function(answer, index) {

            if (
                answer ===
                questions[index].answer
            ) {

                level1Score += 10;

            }

        }
    );


    localStorage.setItem(
        "level1Score",
        level1Score
    );
}


/* =====================================================
   LEVEL 2 LOAD
===================================================== */

function loadLevel2() {

    if (!checkTeam()) {
        return;
    }


    document
        .getElementById(
            "teamNameDisplay"
        )
        .innerText =
            localStorage.getItem(
                "teamName"
            );


    document
        .getElementById(
            "teamIdDisplay"
        )
        .innerText =
            localStorage.getItem(
                "teamId"
            );

}


/* =====================================================
   START LEVEL 2
===================================================== */

function startLevel2() {

    /*
       Hide instructions.
    */

    document
        .getElementById(
            "level2Instructions"
        )
        .classList.add(
            "hidden"
        );


    /*
       Show popup.
    */

    document
        .getElementById(
            "level2Popup"
        )
        .classList.remove(
            "hidden"
        );

}


/* =====================================================
   CLOSE LEVEL 2 POPUP
===================================================== */

function closeLevel2Popup() {

    /*
       Close popup.
    */

    document
        .getElementById(
            "level2Popup"
        )
        .classList.add(
            "hidden"
        );


    /*
       Show puzzle.
    */

    document
        .getElementById(
            "level2Puzzle"
        )
        .classList.remove(
            "hidden"
        );


    /*
       Start 5-minute timer.
    */

    startTimer();


    requestFullscreen();

}


/* =====================================================
   SUBMIT PUZZLE
===================================================== */

function submitPuzzle() {

    const answer =
        document
            .getElementById(
                "puzzleAnswer"
            )
            .value
            .trim();


    if (
        answer === ""
    ) {

        document
            .getElementById(
                "puzzleError"
            )
            .innerText =
                "Please enter your answer.";

        return;
    }


    clearInterval(
        timerInterval
    );


    localStorage.setItem(
        "puzzleAnswer",
        answer
    );


    let score = 0;


    /*
       5 + 6 = 5 × 11 = 55
    */

    if (
        answer === "55"
    ) {

        score = 40;

    }


    localStorage.setItem(
        "level2Score",
        score
    );


    window.location.href =
        "result.html";
}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    clearInterval(
        timerInterval
    );


    /*
       5 MINUTES = 300 SECONDS
    */

    timeLeft = 300;


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


                    timeExpired();

                }

            },
            1000
        );
}


/* =====================================================
   UPDATE TIMER
===================================================== */

function updateTimer() {

    const timer =
        document.getElementById(
            "timer"
        );


    if (!timer) {
        return;
    }


    const minutes =
        Math.floor(
            timeLeft / 60
        );


    const seconds =
        timeLeft % 60;


    timer.innerText =

        String(minutes)
            .padStart(2, "0")

        + ":" +

        String(seconds)
            .padStart(2, "0");
}


/* =====================================================
   TIME EXPIRED
===================================================== */

function timeExpired() {

    /*
       LEVEL 1
    */

    if (
        currentPage ===
        "level1.html"
    ) {

        calculateLevel1Score();


        alert(
            "⏰ Level 1 time is over!\n\n" +
            "Your current score has been saved."
        );


        window.location.href =
            "level2.html";


        return;
    }


    /*
       LEVEL 2
    */

    if (
        currentPage ===
        "level2.html"
    ) {

        localStorage.setItem(
            "puzzleAnswer",
            "Not Answered"
        );


        localStorage.setItem(
            "level2Score",
            "0"
        );


        alert(
            "⏰ Level 2 time is over!"
        );


        window.location.href =
            "result.html";
    }
}


/* =====================================================
   FULLSCREEN
===================================================== */

function requestFullscreen() {

    if (
        !document.fullscreenElement &&
        document.documentElement.requestFullscreen
    ) {

        document.documentElement
            .requestFullscreen()
            .catch(
                function() {

                    console.log(
                        "Fullscreen permission denied."
                    );

                }
            );

    }
}


/* =====================================================
   DETECT TAB SWITCHING
===================================================== */

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.hidden &&
            isExamPage() &&
            !violationTriggered
        ) {

            triggerViolation(
                "Tab switching or minimizing is not allowed."
            );

        }

    }
);


/* =====================================================
   DETECT FULLSCREEN EXIT
===================================================== */

document.addEventListener(
    "fullscreenchange",
    function() {

        if (
            !document.fullscreenElement &&
            isExamPage() &&
            !violationTriggered
        ) {

            triggerViolation(
                "Fullscreen mode was exited."
            );

        }

    }
);


/* =====================================================
   ESC DETECTION
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            isExamPage() &&
            !violationTriggered
        ) {

            event.preventDefault();


            triggerViolation(
                "ESC key is not allowed."
            );

        }

    }
);


/* =====================================================
   COPY BLOCK
===================================================== */

document.addEventListener(
    "copy",
    function(event) {

        if (isExamPage()) {

            event.preventDefault();


            alert(
                "⚠️ Copying is not allowed."
            );

        }

    }
);


/* =====================================================
   CUT BLOCK
===================================================== */

document.addEventListener(
    "cut",
    function(event) {

        if (isExamPage()) {

            event.preventDefault();

        }

    }
);


/* =====================================================
   PASTE BLOCK
===================================================== */

document.addEventListener(
    "paste",
    function(event) {

        if (isExamPage()) {

            event.preventDefault();


            alert(
                "⚠️ Pasting is not allowed."
            );

        }

    }
);


/* =====================================================
   RIGHT CLICK BLOCK
===================================================== */

document.addEventListener(
    "contextmenu",
    function(event) {

        if (isExamPage()) {

            event.preventDefault();

        }

    }
);


/* =====================================================
   DEVTOOLS SHORTCUTS
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (!isExamPage()) {
            return;
        }


        /*
           F12
        */

        if (
            event.key === "F12"
        ) {

            event.preventDefault();


            triggerViolation(
                "Developer tools are not allowed."
            );

        }


        /*
           CTRL + SHIFT + I
        */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "i"
        ) {

            event.preventDefault();


            triggerViolation(
                "Developer tools are not allowed."
            );

        }


        /*
           CTRL + SHIFT + J
        */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "j"
        ) {

            event.preventDefault();


            triggerViolation(
                "Developer tools are not allowed."
            );

        }


        /*
           CTRL + U
        */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "u"
        ) {

            event.preventDefault();


            triggerViolation(
                "Viewing page source is not allowed."
            );

        }

    }
);


/* =====================================================
   EXAM PAGE CHECK
===================================================== */

function isExamPage() {

    return (

        currentPage ===
        "level1.html"

        ||

        currentPage ===
        "level2.html"

    );

}


/* =====================================================
   VIOLATION
===================================================== */

function triggerViolation(
    reason
) {

    if (
        violationTriggered
    ) {

        return;
    }


    violationTriggered =
        true;


    clearInterval(
        timerInterval
    );


    localStorage.setItem(
        "disqualified",
        "true"
    );


    localStorage.setItem(
        "disqualificationReason",
        reason
    );


    if (
        currentPage ===
        "level1.html"
    ) {

        calculateLevel1Score();

    }


    if (
        currentPage ===
        "level2.html"
    ) {

        localStorage.setItem(
            "level2Score",
            "0"
        );

    }


    alert(
        "⚠️ VIOLATION DETECTED\n\n" +
        reason +
        "\n\n" +
        "The team has been disqualified."
    );


    window.location.href =
        "result.html";
}


/* =====================================================
   RESULT PAGE
===================================================== */

function loadResult() {

    const teamName =
        localStorage.getItem(
            "teamName"
        );


    const teamId =
        localStorage.getItem(
            "teamId"
        );


    if (
        !teamName ||
        !teamId
    ) {

        window.location.href =
            "index.html";

        return;
    }


    const disqualified =
        localStorage.getItem(
            "disqualified"
        );


    /*
       DISQUALIFIED
    */

    if (
        disqualified ===
        "true"
    ) {

        document
            .getElementById(
                "normalResult"
            )
            .classList.add(
                "hidden"
            );


        document
            .getElementById(
                "disqualifiedResult"
            )
            .classList.remove(
                "hidden"
            );


        document
            .getElementById(
                "disqualifiedTeam"
            )
            .innerText =
                teamName;


        document
            .getElementById(
                "disqualifiedId"
            )
            .innerText =
                teamId;
