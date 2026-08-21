/* =========================================
   INDEX PAGE
========================================= */

const startBtn =
    document.getElementById("startBtn");

const teamNameInput =
    document.getElementById("teamName");

const warningPopup =
    document.getElementById("warningPopup");

const closePopup =
    document.getElementById("closePopup");


/* =========================================
   START FUNCTION
========================================= */

function startChallenge() {

    const teamName =
        teamNameInput.value.trim();


    /* Team name required */

    if (teamName === "") {

        warningPopup.style.display =
            "flex";

        teamNameInput.focus();

        return;
    }


    /* Save team name */

    localStorage.setItem(
        "teamName",
        teamName
    );


    /* Reset scores */

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


    /* Try fullscreen */

    enterFullscreen();


    /* Go to Level 1 */

    window.location.href =
        "level1.html";
}


/* =========================================
   START BUTTON
========================================= */

if (startBtn) {

    startBtn.addEventListener(
        "click",
        startChallenge
    );

}


/* =========================================
   ENTER KEY
   ENTER → LEVEL 1
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            startChallenge();

        }

    }
);


/* =========================================
   CLOSE POPUP
========================================= */

if (closePopup) {

    closePopup.addEventListener(
        "click",
        function() {

            warningPopup.style.display =
                "none";

            teamNameInput.focus();

        }
    );

}


/* =========================================
   FULLSCREEN
========================================= */

function enterFullscreen() {

    if (
        document.documentElement
            .requestFullscreen
    ) {

        document.documentElement
            .requestFullscreen()
            .catch(function() {

                console.log(
                    "Fullscreen permission not granted."
                );

            });

    }

}


/* =========================================
   COPY PROTECTION
========================================= */

document.addEventListener(
    "copy",
    function(event) {

        event.preventDefault();

    }
);


/* =========================================
   CUT PROTECTION
========================================= */

document.addEventListener(
    "cut",
    function(event) {

        event.preventDefault();

    }
);


/* =========================================
   PASTE PROTECTION
========================================= */

document.addEventListener(
    "paste",
    function(event) {

        event.preventDefault();

    }
);


/* =========================================
   RIGHT CLICK
========================================= */

document.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();

    }
);


/* =========================================
   DRAG PROTECTION
========================================= */

document.addEventListener(
    "dragstart",
    function(event) {

        event.preventDefault();

    }
);


/* =========================================
   SHORTCUT PROTECTION
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

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

    }
);
