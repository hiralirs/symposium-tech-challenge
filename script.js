/* =========================================
   CRIMSON HACK — LANDING PAGE SCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const enterButton = document.getElementById("enterButton");
    const teamNameInput = document.getElementById("teamName");
    const errorMessage = document.getElementById("errorMessage");
    const rulesPanel = document.getElementById("rulesPanel");
    const teamDisplay = document.getElementById("teamDisplay");
    const continueButton = document.getElementById("continueButton");
    const mouthTransition = document.getElementById("mouthTransition");
    const vampireAudio = document.getElementById("vampireAudio");

    // Clear stale state on load
    localStorage.removeItem("disqualified");
    localStorage.removeItem("warningCount");

    // 1. Handle "ENTER THE BLOODLINE" click
    if (enterButton) {
        enterButton.addEventListener("click", function () {
            const teamName = teamNameInput.value.trim();

            if (teamName === "") {
                if (errorMessage) {
                    errorMessage.style.display = "block";
                }
                teamNameInput.focus();
                return;
            }

            // Hide error if previously shown
            if (errorMessage) {
                errorMessage.style.display = "none";
            }

            // Save team name to localStorage
            localStorage.setItem("teamName", teamName);

            // Update team display inside the rules panel
            if (teamDisplay) {
                teamDisplay.textContent = teamName.toUpperCase();
            }

            // Play the vampire audio effect right after entering the team name
            if (vampireAudio) {
                vampireAudio.play().catch(function (error) {
                    console.log("Audio autoplay restricted by browser:", error);
                });
            }

            // Smoothly reveal the rules panel
            if (rulesPanel) {
                rulesPanel.classList.add("active");
                rulesPanel.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Allow pressing "Enter" key inside the input field to submit
    if (teamNameInput) {
        teamNameInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                enterButton.click();
            }
        });
    }

    // 2. Handle "CONTINUE TO ROUND 1" click
    if (continueButton) {
        continueButton.addEventListener("click", function () {
            // Trigger the vampire mouth closing transition animation
            if (mouthTransition) {
                mouthTransition.classList.add("active");
            }

            // Redirect to level1.html after the transition animation plays out
            setTimeout(function () {
                window.location.href = "level1.html";
            }, 1800); // Matches transition duration
        });
    }
});