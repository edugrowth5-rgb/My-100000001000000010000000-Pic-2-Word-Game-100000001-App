const gameLevels = [
    {
        level: 1,
        images: ["https://img.icons8.com/emoji/96/sun-emoji.png", "https://img.icons8.com/emoji/96/sunflower-emoji.png"], 
        answer: "SUNFLOWER",
        hint: "A large bright yellow flower facing the sun."
    },
    {
        level: 2,
        images: ["https://img.icons8.com/emoji/96/cloud-with-rain-emoji.png", "https://img.icons8.com/emoji/96/bow-and-arrow-emoji.png"],
        answer: "RAINBOW",
        hint: "Seven beautiful colors seen in the sky after rain."
    },
    {
        level: 3,
        images: ["https://img.icons8.com/emoji/96/honey-pot.png", "https://img.icons8.com/emoji/96/honeybee-emoji.png"],
        answer: "HONEYBEE",
        hint: "A small flying insect that makes sweet honey."
    }
];

let currentLevelIndex = 0;
let score = 0;
let currentAnswer = [];
let selectedLetterIndexes = []; 

// DOM Selectors
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const scoreVal = document.getElementById('score-val');
const levelVal = document.getElementById('level-val');
const hintBtn = document.getElementById('hint-btn');
const hintText = document.getElementById('hint-text');
const answerSlots = document.getElementById('answer-slots');
const keyboard = document.getElementById('keyboard');
const clearBtn = document.getElementById('clear-btn');
const installBtn = document.getElementById('install-btn');

// New Buttons Selectors
const prevBtn = document.getElementById('prev-btn');
const nextSkipBtn = document.getElementById('next-skip-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const appContainerId = document.getElementById('app-container-id');

function initGame() {
    const savedLevel = localStorage.getItem('p2w_level');
    const savedScore = localStorage.getItem('p2w_score');
    
    if(savedLevel) currentLevelIndex = parseInt(savedLevel);
    if(savedScore) score = parseInt(savedScore);
    
    loadLevel();
}

function loadLevel() {
    // Check boundaries
    if (currentLevelIndex >= gameLevels.length) {
        alert("🎉 Spectacular! You have completed all available levels!");
        currentLevelIndex = gameLevels.length - 1; // Keep on last level
    }
    if (currentLevelIndex < 0) currentLevelIndex = 0;

    const currentLevel = gameLevels[currentLevelIndex];
    
    scoreVal.innerText = score;
    levelVal.innerText = currentLevel.level;
    
    img1.src = currentLevel.images[0];
    img2.src = currentLevel.images[1];
    
    hintText.innerText = currentLevel.hint;
    hintText.classList.add('hide');
    
    currentAnswer = new Array(currentLevel.answer.length).fill("");
    selectedLetterIndexes = [];
    
    generateAnswerSlots(currentLevel.answer.length);
    generateKeyboard(currentLevel.answer);
    updateNavigationButtons();
}

function generateAnswerSlots(length) {
    answerSlots.innerHTML = "";
    for(let i=0; i<length; i++) {
        const slot = document.createElement('div');
        slot.classList.add('letter-slot');
        slot.dataset.index = i;
        slot.addEventListener('click', () => removeLetter(i));
        answerSlots.appendChild(slot);
    }
}

function generateKeyboard(correctAnswer) {
    keyboard.innerHTML = "";
    let letterPool = correctAnswer.split("");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    while(letterPool.length < 12) {
        let randomLetter = alphabet[Math.floor(Math.random() * 26)];
        letterPool.push(randomLetter);
    }
    
    letterPool.sort(() => Math.random() - 0.5);
    
    letterPool.forEach((letter, index) => {
        const btn = document.createElement('div');
        btn.classList.add('bubble-letter');
        btn.innerText = letter;
        btn.dataset.kbIndex = index;
        btn.addEventListener('click', () => handleLetterClick(letter, index));
        keyboard.appendChild(btn);
    });
}

function handleLetterClick(letter, kbIndex) {
    const emptyIndex = currentAnswer.indexOf("");
    if(emptyIndex !== -1) {
        currentAnswer[emptyIndex] = letter;
        selectedLetterIndexes[emptyIndex] = kbIndex;
        
        document.querySelector(`.letter-slot[data-index='${emptyIndex}']`).innerText = letter;
        document.querySelector(`.bubble-letter[data-kb-index='${kbIndex}']`).classList.add('disabled');
        
        if(currentAnswer.indexOf("") === -1) {
            checkAnswer();
        }
    }
}

function removeLetter(slotIndex) {
    if(currentAnswer[slotIndex] !== "") {
        const kbIndex = selectedLetterIndexes[slotIndex];
        if(document.querySelector(`.bubble-letter[data-kb-index='${kbIndex}']`)){
            document.querySelector(`.bubble-letter[data-kb-index='${kbIndex}']`).classList.remove('disabled');
        }
        currentAnswer[slotIndex] = "";
        document.querySelector(`.letter-slot[data-index='${slotIndex}']`).innerText = "";
    }
}

function checkAnswer() {
    const finalGuess = currentAnswer.join("");
    const realAnswer = gameLevels[currentLevelIndex].answer;
    
    if(finalGuess === realAnswer) {
        setTimeout(() => {
            alert("🌟 Splendid! Correct Answer!");
            score += 10;
            currentLevelIndex++;
            saveProgress();
            loadLevel();
        }, 250);
    } else {
        setTimeout(() => {
            alert("❌ Try again! Put on your thinking cap.");
            clearCurrentAnswer();
        }, 250);
    }
}

function clearCurrentAnswer() {
    currentAnswer.forEach((_, i) => removeLetter(i));
}

function saveProgress() {
    localStorage.setItem('p2w_level', currentLevelIndex);
    localStorage.setItem('p2w_score', score);
}

function updateNavigationButtons() {
    // Level 1 par Back button ko disable ya transparent kar sakte hain
    if(currentLevelIndex === 0) {
        prevBtn.style.opacity = "0.5";
        prevBtn.style.pointerEvents = "none";
    } else {
        prevBtn.style.opacity = "1";
        prevBtn.style.pointerEvents = "auto";
    }
}

// Navigation Events
prevBtn.addEventListener('click', () => {
    if(currentLevelIndex > 0) {
        currentLevelIndex--;
        saveProgress();
        loadLevel();
    }
});

nextSkipBtn.addEventListener('click', () => {
    if(currentLevelIndex < gameLevels.length - 1) {
        currentLevelIndex++;
        saveProgress();
        loadLevel();
    } else {
        alert("This is the last available level!");
    }
});

// Fullscreen API Implementation
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        appContainerId.requestFullscreen().catch(err => {
            alert(`Error enabling fullscreen: ${err.message}`);
        });
        fullscreenBtn.innerText = "❌ Exit Full";
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerText = "📺 Fullscreen";
    }
});

// Sync UI if user exits fullscreen via system back gesture/button
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenBtn.innerText = "📺 Fullscreen";
    }
});

hintBtn.addEventListener('click', () => hintText.classList.toggle('hide'));
clearBtn.addEventListener('click', clearCurrentAnswer);

// PWA Installer
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hide');
});

installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
        installBtn.classList.add('hide');
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
        });
    }
});

window.onload = initGame;
