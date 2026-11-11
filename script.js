
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

    progressBar.style.width = progress + "%";
    pageNumber.textContent = `${page + 1} / ${pages.length}`;
    pageTitle.textContent = titles[page] || "";
}


// Go to the next page
function nextPage() {
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

    // Find all answer buttons on the current page
    const buttons = button
        .closest(".choices")
        .querySelectorAll("button");

    // Remove selection from other answers
    buttons.forEach((item) => {
        item.classList.remove("selected");
    });

    // Highlight the button that was actually clicked
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


// Submit the message on Page 7
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
form.addEventListener("submit", (event) => {
    event.preventDefault();
});


// Start the website
showPage(currentPage);
/* =========================
   BACKGROUND MUSIC
   ========================= */

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let isPlaying = false;

// Play or pause music when the music button is clicked
musicBtn.addEventListener("click", () => {
    if (isPlaying) {
        music.pause();
        musicBtn.classList.remove("playing");
        musicBtn.innerHTML = "🎵";
        musicBtn.setAttribute("aria-label", "Play music");
    } else {
        music.play();
        musicBtn.classList.add("playing");
        musicBtn.innerHTML = "🎶";
        musicBtn.setAttribute("aria-label", "Pause music");
    }

    isPlaying = !isPlaying;
});
// Start music on the visitor's first interaction
document.addEventListener("click", function startMusic() {
    if (!isPlaying) {
        music.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add("playing");
            musicBtn.innerHTML = "🎶";
        }).catch(() => {
            console.log("Music could not start.");
        });
    }
}, { once: true });
