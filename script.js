
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // PAGE NAVIGATION
    // =====================================

    let currentPage = 0;

    const pages = document.querySelectorAll(".page");
    const progressBar = document.getElementById("progressBar");
    const pageNumber = document.getElementById("pageNumber");
    const pageTitle = document.getElementById("pageTitle");

    const form = document.getElementById("beckyForm");

    const titles = [
        "A message for you",
        "My apology",
        "Being cool again",
        "Good memories",
        "Favorite people",
        "Being honest",
        "Your thoughts",
        "Just wondering",
        "A random question",
        "One last thing",
        "Something on my mind 🖤",
        "Chess lessons ♟️",
        "A picture for you 🖤",
        "A special message ❤️"
    ];

    const answers = {};

    // Display page
    function showPage(page) {

        pages.forEach(item => {
            item.classList.remove("active");
        });

        pages[page].classList.add("active");

        const progress = ((page + 1) / pages.length) * 100;

        progressBar.style.width = progress + "%";

        pageNumber.textContent =
            `${page + 1} / ${pages.length}`;

        pageTitle.textContent = titles[page];

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Next page
    window.nextPage = function () {

        const current = pages[currentPage];

        const choices = current.querySelector(".choices");

        if (choices) {

            const selected = choices.querySelector(".selected");

            if (!selected) {
                alert("Please choose an answer before continuing 😊");
                return;
            }
        }

        if (currentPage < pages.length - 1) {

            currentPage++;

            showPage(currentPage);

        }
    };

    // Previous page
    window.previousPage = function () {

        if (currentPage > 0) {

            currentPage--;

            showPage(currentPage);

        }
    };


    // =====================================
    // SAVE ANSWERS
    // =====================================

    window.choose = function (question, response, button) {

        answers[question] = response;

        const hiddenInput = document.getElementById(question);

        if (hiddenInput) {
            hiddenInput.value = response;
        }

        const choices = button.closest(".choices");

        choices.querySelectorAll("button").forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        console.log("Saved:", question, response);

    };


    // =====================================
    // PAGE 7 MESSAGE
    // =====================================

    window.submitMessage = function () {

        const messageInput = document.getElementById("message");

        if (!messageInput.value.trim()) {

            alert("Please write a message before continuing 🖤");

            return;
        }

        answers.message = messageInput.value.trim();

        nextPage();

    };


    // =====================================
    // FINAL LOVE MESSAGE
    // =====================================

    window.showLove = function () {

        const loveMessage = document.getElementById("loveMessage");

        if (loveMessage) {

            loveMessage.style.display = "block";

        }

    };


    // =====================================
    // FORMSPREE SUBMISSION
    // =====================================

    if (form) {

        form.addEventListener("submit", async function (event) {

            event.preventDefault();

            const submitBtn = document.getElementById("submitBtn");

            const status = document.getElementById("submitStatus");

            if (submitBtn.disabled) return;

            // Update all hidden fields
            Object.keys(answers).forEach(question => {

                const input = document.getElementById(question);

                if (input) {
                    input.value = answers[question];
                }

            });

            // Save message
            const messageInput = document.getElementById("message");

            if (messageInput) {
                messageInput.value = messageInput.value.trim();
            }

            submitBtn.disabled = true;

            submitBtn.textContent = "Sending... ❤️";

            if (status) {
                status.textContent = "";
            }

            try {

                const response = await fetch(form.action, {

                    method: "POST",

                    body: new FormData(form),

                    headers: {
                        Accept: "application/json"
                    }

                });

                if (!response.ok) {
                    throw new Error("Formspree submission failed");
                }

                submitBtn.textContent = "Responses sent ❤️";

                if (status) {
                    status.textContent =
                        "Thank you! Your responses have been received. 🖤";
                }

                // Keep the final page and Back button visible.

            } catch (error) {

                console.error("Form submission error:", error);

                submitBtn.disabled = false;

                submitBtn.textContent = "Send my responses ❤️";

                if (status) {
                    status.textContent =
                        "Submission failed. Please check your connection and try again.";
                }

            }

        });

    }


    // =====================================
    // MUSIC PLAYLIST
    // =====================================

    const music = document.getElementById("bgMusic");

    const musicBtn = document.getElementById("musicBtn");

    const playlist = [
        "music.mp3",
        "song2.mp3"
    ];

    let currentTrack = 0;

    let isSwitchingTrack = false;

    const failedTracks = new Set();

    // Update music button
    function updateMusicButton() {

        if (!music || !musicBtn) return;

        if (music.paused) {

            musicBtn.textContent = "🎵";

            musicBtn.classList.remove("playing");

            musicBtn.setAttribute("aria-label", "Play music");

        } else {

            musicBtn.textContent = "🎶";

            musicBtn.classList.add("playing");

            musicBtn.setAttribute("aria-label", "Pause music");

        }

    }

    // Play selected track
    async function playTrack(index) {

        if (!music || !musicBtn) return;

        currentTrack = index;

        isSwitchingTrack = true;

        music.src = playlist[currentTrack];

        music.load();

        try {

            await music.play();

            isSwitchingTrack = false;

        } catch (error) {

            isSwitchingTrack = false;

            console.error("Music playback error:", error);

            // Try the other song if this one cannot play
            if (!failedTracks.has(currentTrack)) {

                failedTracks.add(currentTrack);

                const nextTrack = (currentTrack + 1) % playlist.length;

                if (!failedTracks.has(nextTrack)) {

                    playTrack(nextTrack);

                } else {

                    musicBtn.textContent = "🎵";

                    alert("Music could not be played. Please check the audio files.");

                }

            }

        }

    }

    // Play and pause button
    if (music && musicBtn) {

        musicBtn.addEventListener("click", function () {

            if (music.paused) {

                if (failedTracks.size === playlist.length) {
                    failedTracks.clear();
                }

                playTrack(currentTrack);

            } else {

                music.pause();

            }

        });

        // When a song ends, play the next song
        music.addEventListener("ended", function () {

            if (isSwitchingTrack) return;

            const nextTrack = (currentTrack + 1) % playlist.length;

            if (!failedTracks.has(nextTrack)) {

                playTrack(nextTrack);

            } else {

                playTrack(currentTrack);

            }

        });

        // Handle missing or damaged audio files
        music.addEventListener("error", function () {

            if (isSwitchingTrack) return;

            if (!failedTracks.has(currentTrack)) {

                failedTracks.add(currentTrack);

                const nextTrack = (currentTrack + 1) % playlist.length;

                if (!failedTracks.has(nextTrack)) {
                    playTrack(nextTrack);
                } else {
                    updateMusicButton();
                }

            }

        });

        music.addEventListener("play", updateMusicButton);

        music.addEventListener("pause", updateMusicButton);

        updateMusicButton();

    }


    // =====================================
    // START WEBSITE
    // =====================================

    showPage(currentPage);

});
