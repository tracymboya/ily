let currentPage = 0;

const pages = document.querySelectorAll(".page");
const progressBar = document.getElementById("progressBar");
const pageNumber = document.getElementById("pageNumber");
const pageTitle = document.getElementById("pageTitle");
const form = document.getElementById("beckyForm");

const answers = {};

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
    "A special message ❤️"
];


// Show the current page
function showPage(page) {
    pages.forEach((item) => {
        item.classList.remove("active");
    });

    if (pages[page]) {
        pages[page].classList.add("active");
    }

    const progress = ((page + 1) / pages.length) * 100;

    if (progressBar) {
        progressBar.style.width = progress + "%";
    }

    if (pageNumber) {
        pageNumber.textContent = `${page + 1} / ${pages.length}`;
    }

    if (pageTitle) {
        pageTitle.textContent = titles[page] || "";
    }
}


function nextPage() {
    const currentPageElement = pages[currentPage];

    // Check whether this page has answer choices
    const choices = currentPageElement.querySelector(".choices");

    if (choices) {
        // Check whether Becky selected an answer
        const selectedAnswer = choices.querySelector("button.selected");

        if (!selectedAnswer) {
            alert("Please choose an answer before continuing 😊");
            return;
        }
    }

    // Move to the next page only if an answer was selected
    if (currentPage < pages.length - 1) {
        currentPage++;
        showPage(currentPage);
    }
}

// Go to the previous page
function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
    }
}


// Save and highlight an answer
function choose(question, response, button) {
    // Save answer in JavaScript
    answers[question] = response;

    // Save answer in the hidden Formspree field
    const hiddenInput = document.getElementById(question);

    if (hiddenInput) {
        hiddenInput.value = response;
    }

    // Find all answer buttons in this group
    const choices = button.closest(".choices");

    if (choices) {
        const buttons = choices.querySelectorAll("button");

        // Remove selection from other answers
        buttons.forEach((item) => {
            item.classList.remove("selected");
        });
    }

    // Highlight the button that was clicked
    button.classList.add("selected");

    console.log("Answer saved:", question, response);
}


// Send the form answers
async function sendAnswers() {
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json"
            }
        });

        return response.ok;

    } catch (error) {
        console.error("Error sending answers:", error);
        return false;
    }
}


// Submit the message
async function submitMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();

    if (!message) {
        alert("Please write a message before continuing 🖤");
        return;
    }

    answers.message = message;

    const sent = await sendAnswers();

    if (sent) {
        nextPage();
    } else {
        alert(
            "Something went wrong. Please check your internet connection and try again."
        );
    }
}


// Show the final love message
function showLove() {
    const loveMessage = document.getElementById("loveMessage");

    if (loveMessage) {
        loveMessage.style.display = "block";
    }
}


// Prevent normal form submission
if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
    });
}


// Music controls
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");


// Update the music button appearance
function updateMusicButton() {
    if (!music || !musicBtn) return;

    if (music.paused) {
        musicBtn.classList.remove("playing");
        musicBtn.innerHTML = "🎵";
        musicBtn.setAttribute("aria-label", "Play music");
    } else {
        musicBtn.classList.add("playing");
        musicBtn.innerHTML = "🎶";
        musicBtn.setAttribute("aria-label", "Pause music");
    }
}


// Play or pause music when the button is clicked
if (music && musicBtn) {
    musicBtn.addEventListener("click", async () => {
        if (music.paused) {
            try {
                await music.play();
            } catch (error) {
                console.error("Music could not play:", error);
                alert("The music could not be played. Please try again.");
            }
        } else {
            music.pause();
        }
    });


    // Keep the button state correct
    music.addEventListener("play", updateMusicButton);
    music.addEventListener("pause", updateMusicButton);
    music.addEventListener("ended", updateMusicButton);

    // Set the correct button state when the page loads
    updateMusicButton();
}


// Start the website on the first page
showPage(currentPage);
