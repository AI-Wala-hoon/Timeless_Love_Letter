document.addEventListener("DOMContentLoaded", () => {

const intro = document.getElementById("intro");
const envelope = document.getElementById("envelope");
const experience = document.querySelector(".experience");
const typewriterText = document.getElementById("typewriter");
const heartLayer = document.getElementById("heartLayer");
const bgMusic = document.getElementById("bgMusic");
const secondSong = document.getElementById("secondSong");
const replayBtn = document.getElementById("replayBtn");
const postcard = document.getElementById("postcard");
const playSongBtn = document.getElementById("playSongBtn");

/* IMPORTANT: Lyrics now appear inside card */
const lyricsCard = document.getElementById("lyricsCard");

/* ------------------ POEM ------------------ */

const poem = [
    "To my dearest,",
    "The stars above pale in comparison to your light,",
    "Your eyes shimmer brighter than twilight.",
    "Every moment with you feels like magic,",
    "Forever and always, my heart is yours."
];

/* ------------------ TIMESTAMPED LYRICS ------------------ */
/* 🔧 Adjust time values to match your actual song */

const lyricsData = [
    { time: 2, text: "Ohnu Kivein Na Houga Pyar Tere Nal Ni..." },
    { time: 5, text: "Jehne Vekh Leya Hasdi Nu Ik Var Ni..." },
    { time: 8, text: "Panjwa Mile Ta Oh Vi Tera Karda..." },
    { time: 18, text: "Pehla Ee A Tere Nam Din Char Ni." }
];

/* ------------------ STATE ------------------ */

let lineIndex = 0;
let charIndex = 0;
let hearts = [];
let heartInterval;
let lyricsInitialized = false;

/* ------------------ HEARTS ------------------ */

function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.top = window.innerHeight + "px";
    heartLayer.appendChild(heart);
    hearts.push(heart);

    requestAnimationFrame(() => {
        heart.style.transform = `translateY(-${window.innerHeight + 100}px)`;
    });
}

function startHearts() {
    heartInterval = setInterval(createHeart, 400);
}

function formFlower() {
    clearInterval(heartInterval);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 80;

    hearts.forEach((heart, i) => {
        const angle = (i / hearts.length) * Math.PI * 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        heart.style.left = x + "px";
        heart.style.top = y + "px";
        heart.style.transform = "none";
    });

    replayBtn.classList.remove("hidden");
}

/* ------------------ TYPEWRITER ------------------ */

function typePoem() {
    if (lineIndex < poem.length) {
        if (charIndex < poem[lineIndex].length) {
            typewriterText.innerHTML += poem[lineIndex][charIndex];
            charIndex++;
            setTimeout(typePoem, 80);
        } else {
            typewriterText.innerHTML += "<br>";
            charIndex = 0;
            lineIndex++;
            setTimeout(typePoem, 400);
        }
    } else {
        formFlower();
    }
}

/* ------------------ LYRICS SYSTEM ------------------ */

function initLyrics() {
    if (lyricsInitialized) return;

    lyricsCard.innerHTML = "";

    lyricsData.forEach(line => {
        const p = document.createElement("p");
        p.classList.add("lyric-line");
        p.textContent = line.text;
        lyricsCard.appendChild(p);
    });

    lyricsInitialized = true;
}

function syncLyrics() {
    const currentTime = secondSong.currentTime;
    const lines = document.querySelectorAll(".lyric-line");

    lyricsData.forEach((line, index) => {
        if (
            currentTime >= line.time &&
            (index === lyricsData.length - 1 || currentTime < lyricsData[index + 1].time)
        ) {
            lines.forEach(l => l.classList.remove("active"));
            if (lines[index]) {
                lines[index].classList.add("active");
            }
        }
    });
}

/* ------------------ EVENTS ------------------ */

envelope.addEventListener("click", () => {
    envelope.classList.add("open");
    setTimeout(() => {
        intro.style.display = "none";
        experience.classList.remove("hidden");
        bgMusic.volume = 0.6;
        bgMusic.play();
        startHearts();
        typePoem();
    }, 1000);
});

postcard.addEventListener("click", () => {
    postcard.classList.toggle("flipped");
});

playSongBtn.addEventListener("click", () => {

    bgMusic.pause();

    secondSong.currentTime = 0;
    secondSong.play();

    lyricsCard.classList.remove("hidden");

    initLyrics();

    /* Sync lyrics in real-time */
    secondSong.removeEventListener("timeupdate", syncLyrics);
    secondSong.addEventListener("timeupdate", syncLyrics);
});

replayBtn.addEventListener("click", () => {
    location.reload();
});

});
