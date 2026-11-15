
// Current page
let currentPage = 0;

// Get all pages
const pages = document.querySelectorAll(".page");

// Get page elements
const progressBar = document.getElementById("progressBar");
const pageNumber = document.getElementById("pageNumber");
const pageTitle = document.getElementById("pageTitle");

// Get form
const form = document.getElementById("beckyForm");

// Store answers
const answers = {};


// ========================================
// PAGE TITLES
// ========================================

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


// ========================================
// DISPLAY CURRENT PAGE
// ========================================

function showPage(page) {

    pages.forEach((item) => {
        item.classList.remove("active");
    });

    if (pages[page]) {
        pages[page].classList.add("active");
    }

    // Update progress
    const progress = ((page + 1) / pages.length) * 100;

    if (progressBar) {
        progressBar.style.width = progress + "%";
    }

    // Update page number
    if (pageNumber) {
        pageNumber.textContent =
            `${page + 1} / ${pages.length}`;
    }

    // Update page title
    if (pageTitle) {
        pageTitle.textContent = titles[page] || "";
    }

    // Scroll to top when changing pages
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// NEXT PAGE
// ========================================

function nextPage() {

    const currentPageElement = pages[currentPage];

    if (!currentPageElement) return;

    // Check if current page has answer choices
    const choices = currentPageElement.querySelector(".choices");

    if (choices) {

        const selectedAnswer =
            choices.querySelector("button.selected");

        if (!selectedAnswer) {
            alert("Please choose an answer before continuing 😊");
            return;
        }
    }

    // Move to next page
    if (currentPage < pages.length - 1) {

        currentPage++;

        showPage(currentPage);

    }
}


// ========================================
// PREVIOUS PAGE
// ========================================

function previousPage() {

    if (currentPage > 0) {

        currentPage--;

        showPage(currentPage);

    }
}


// ========================================
// SAVE ANSWERS
// ========================================

function choose(question, response, button) {

    // Save response
    answers[question] = response;

    // Get hidden Formspree input
    const hiddenInput = document.getElementById(question);

    if (hiddenInput) {
        hiddenInput.value = response;
    }

    // Get answer buttons
    const choices = button.closest(".choices");

    if (choices) {

        const buttons = choices.querySelectorAll("button");

        // Remove previous selection
        buttons.forEach((item) => {
            item.classList.remove("selected");
        });

    }

    // Highlight selected answer
    button.classList.add("selected");

    console.log("Answer saved:", question, response);

}


// ========================================
// FORM DATA
// ========================================

function updateFormData() {

    // Save all answers into their hidden fields
    Object.keys(answers).forEach((question) => {

        const input = document.getElementById(question);

        if (input) {
            input.value = answers[question];
        }

    });

    // Save written message
    const messageInput = document.getElementById("message");

    if (messageInput) {
        answers.message = messageInput.value.trim();
    }

}


// ========================================
// SUBMIT TO FORMSPREE
// ========================================

async function sendAnswers() {

    updateFormData();

    const formData = new FormData(form);

    try {

        const response = await fetch(form.action, {

            method: "POST",

            body: formData,

            headers: {
                Accept: "application/json"
            }

        });

        if (response.ok) {

            console.log("Responses successfully submitted!");

            return true;

        } else {

            const result = await response.json().catch(() => null);

            console.error("Formspree error:", result);

            return false;

        }

    } catch (error) {

        console.error("Submission error:", error);

        return false;

    }

}


// ========================================
// PAGE 7 MESSAGE
// ========================================

// Continue without submitting the form.
// All answers will be submitted together on page 14.

function submitMessage() {

    const messageInput = document.getElementById("message");

    if (!messageInput.value.trim()) {

        alert("You can write something before continuing 🖤");

        return;

    }

    answers.message = messageInput.value.trim();

    nextPage();

}


// ========================================
// FINAL LOVE MESSAGE
// ========================================

function showLove() {

    const loveMessage = document.getElementById("loveMessage");

    if (loveMessage) {

        loveMessage.style.display = "block";

    }

}


// ========================================
// FINAL FORM SUBMISSION
// ========================================

if (form) {

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        const submitBtn = document.getElementById("submitBtn");

        // Prevent multiple submissions
        if (submitBtn.disabled) return;

        submitBtn.disabled = true;

        submitBtn.textContent = "Sending... ❤️";

        const sent = await sendAnswers();

        if (sent) {

            submitBtn.textContent = "Sent successfully ❤️";

            // Display confirmation
            const card = document.querySelector(".card");

            card.innerHTML = `
                <div class="page active">
                    <div class="circle">❤️</div>

                    <p class="small-title">THANK YOU</p>

                    <h1>Message received!</h1>

                    <p class="main-text">
                        Thank you for taking your time
                        to go through this little space.
                    </p>

                    <p>
                        Your responses mean a lot to me. 🖤
                    </p>
                </div>
            `;

        } else {

            submitBtn.disabled = false;

            submitBtn.textContent = "Send my responses ❤️";

            alert(
                "Something went wrong. Please check your internet connection and try again."
            );

        }

    });

}


// ========================================
// MUSIC CONTROLS
// ========================================

const music = document.getElementById("bgMusic");

const musicBtn = document.getElementById("musicBtn");


// Playlist
const playlist = [
    "music.mp3",
    "song2.mp3"
];

let currentTrack = 0;


// Load first song
if (music && playlist.length > 0) {

    music.src = playlist[currentTrack];

    music.load();

}


// ========================================
// UPDATE MUSIC BUTTON
// ========================================

function updateMusicButton() {

    if (!music || !musicBtn) return;

    if (music.paused) {

        musicBtn.classList.remove("playing");

        musicBtn.textContent = "🎵";

        musicBtn.setAttribute(
            "aria-label",
            "Play music"
        );

    } else {

        musicBtn.classList.add("playing");

        musicBtn.textContent = "🎶";

        musicBtn.setAttribute(
            "aria-label",
            "Pause music"
        );

    }

}


// ========================================
// PLAY AND PAUSE MUSIC
// ========================================

if (music && musicBtn) {

    musicBtn.addEventListener("click", async function() {

        if (music.paused) {

            try {

                await music.play();

            } catch (error) {

                console.error("Music playback error:", error);

                alert(
                    "Music could not be played. Please try again."
                );

            }

        } else {

            music.pause();

        }

    });


    // Update button when music starts
    music.addEventListener("play", updateMusicButton);


    // Update button when music pauses
    music.addEventListener("pause", updateMusicButton);


    // Automatically play next song
    music.addEventListener("ended", function() {

        currentTrack++;

        // Restart playlist after the last song
        if (currentTrack >= playlist.length) {

            currentTrack = 0;

        }

        music.src = playlist[currentTrack];

        music.load();

        music.play().catch(error => {

            console.error("Next song playback error:", error);

        });

    });


    // Initial button state
    updateMusicButton();

}


// ========================================
// START WEBSITE
// ========================================

showPage(currentPage);

