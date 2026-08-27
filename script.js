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

            if (errorMessage) {
                errorMessage.style.display = "none";
            }

            localStorage.setItem("teamName", teamName);

            if (teamDisplay) {
                teamDisplay.textContent = teamName.toUpperCase();
            }

            if (vampireAudio) {
                vampireAudio.play().catch(function (error) {
                    console.log("Audio autoplay restricted by browser:", error);
                });
            }

            if (rulesPanel) {
                rulesPanel.classList.add("active");
                rulesPanel.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    if (teamNameInput) {
        teamNameInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                enterButton.click();
            }
        });
    }

    // 2. Handle "CONTINUE TO ROUND 1" click (Lightning Storm Intro)
    if (continueButton) {
        continueButton.addEventListener("click", function () {
            
            const stormOverlay = document.createElement("div");
            stormOverlay.style.position = "fixed";
            stormOverlay.style.inset = "0";
            stormOverlay.style.backgroundColor = "#0a0a0a";
            stormOverlay.style.zIndex = "99999";
            document.body.appendChild(stormOverlay);

            const canvas = document.createElement("canvas");
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.position = "absolute";
            canvas.style.left = "0";
            canvas.style.top = "0";
            canvas.style.background = "#0a0a0a";
            stormOverlay.appendChild(canvas);

            let thunderAudio = document.getElementById("thunderAudio");
            if (!thunderAudio) {
                thunderAudio = new Audio("assets/thunder.mp4");
                document.body.appendChild(thunderAudio);
            }
            thunderAudio.currentTime = 0;
            thunderAudio.play().catch(e => console.log("Audio locked:", e));

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext("2d");

            function drawSingleBolt() {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                let sx = Math.random() * canvas.width;
                let sy = 0;
                ctx.beginPath();
                ctx.strokeStyle = "silver";
                ctx.lineWidth = 3;
                ctx.shadowBlur = 15;
                ctx.shadowColor = "aliceblue";
                ctx.moveTo(sx, sy);

                let limit = Math.floor(canvas.height * 0.7);
                for (let i = 0; i < limit; i += 20) {
                    sx += (Math.random() - 0.5) * 40;
                    sy += 20;
                    ctx.lineTo(sx, sy);
                }
                ctx.stroke();

                setTimeout(() => {
                    ctx.fillStyle = "black";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }, 120);
            }

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            setTimeout(() => drawSingleBolt(), 400);
            setTimeout(() => drawSingleBolt(), 1300);
            setTimeout(() => drawSingleBolt(), 2200);

            setTimeout(function () {
                window.location.href = "level1.html";
            }, 3200);
        });
    }
});