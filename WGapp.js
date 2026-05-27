let currentLevelIndex = 0;
let score = 0;
let currentAnswer = [];
let selectedLetterIndexes = []; 

// DOM Selectors
const emojiGrid = document.getElementById('emoji-grid');
const scoreVal = document.getElementById('score-val');
const levelVal = document.getElementById('level-val');
const hintBtn = document.getElementById('hint-btn');
const hintText = document.getElementById('hint-text');
const answerSlots = document.getElementById('answer-slots');
const keyboard = document.getElementById('keyboard');
const clearBtn = document.getElementById('clear-btn');
const installBtn = document.getElementById('install-btn');
const prevBtn = document.getElementById('prev-btn');
const nextSkipBtn = document.getElementById('next-skip-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const appContainerId = document.getElementById('app-container-id');

function initGame() {
    const savedLevel = localStorage.getItem('wg_p2w_level');
    const savedScore = localStorage.getItem('wg_p2w_score');
    
    if(savedLevel) currentLevelIndex = parseInt(savedLevel);
    if(savedScore) score = parseInt(savedScore);
    
    loadLevel();
}

function loadLevel() {
    if (typeof gameLevels === 'undefined' || gameLevels.length === 0) {
        emojiGrid.innerHTML = "<p>Data file error!</p>";
        return;
    }

    if (currentLevelIndex >= gameLevels.length) {
        alert("🎉 Marvelous! You completed all 200+ Levels of Success Zone Game!");
        currentLevelIndex = 0; 
        score = 0;
        saveProgress();
    }
    if (currentLevelIndex < 0) currentLevelIndex = 0;

    const currentLevel = gameLevels[currentLevelIndex];
    
    scoreVal.innerText = score;
    levelVal.innerText = currentLevel.level;
    
    // Render Emojis Dynamic Box Grid
    renderEmojis(currentLevel.emojis);
    
    hintText.innerText = currentLevel.hint;
    hintText.classList.add('hide');
    
    currentAnswer = new Array(currentLevel.answer.length).fill("");
    selectedLetterIndexes = [];
    
    generateAnswerSlots(currentLevel.answer.length);
    generateKeyboard(currentLevel.answer);
    updateNavigationButtons();
}

function renderEmojis(emojiArray) {
    emojiGrid.innerHTML = "";
    emojiArray.forEach((emoji, index) => {
        const box = document.createElement('div');
        box.classList.add('emoji-box');
        box.innerText = emoji;
        emojiGrid.appendChild(box);
        
        // Agar aakhri emoji nahi hai toh beech me '+' add karein
        if (index < emojiArray.length - 1) {
            const plus = document.createElement('div');
            plus.classList.add('plus-sign');
            plus.innerText = "+";
            emojiGrid.appendChild(plus);
        }
    });
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
    let letterPool = correctAnswer.toUpperCase().split("");
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
        const kbElement = document.querySelector(`.bubble-letter[data-kb-index='${kbIndex}']`);
        if(kbElement) kbElement.classList.remove('disabled');
        
        currentAnswer[slotIndex] = "";
        document.querySelector(`.letter-slot[data-index='${slotIndex}']`).innerText = "";
    }
}

function checkAnswer() {
    const finalGuess = currentAnswer.join("");
    const realAnswer = gameLevels[currentLevelIndex].answer.toUpperCase();
    
    if(finalGuess === realAnswer) {
        setTimeout(() => {
            alert("🌟 Fantastic! Correct Answer!");
            score += 10;
            currentLevelIndex++;
            saveProgress();
            loadLevel();
        }, 250);
    } else {
        setTimeout(() => {
            alert("❌ Oops! Wrong guess. Use the hint or try again.");
            clearCurrentAnswer();
        }, 250);
    }
}

function clearCurrentAnswer() {
    currentAnswer.forEach((_, i) => removeLetter(i));
}

function saveProgress() {
    localStorage.setItem('wg_p2w_level', currentLevelIndex);
    localStorage.setItem('wg_p2w_score', score);
}

function updateNavigationButtons() {
    if(currentLevelIndex === 0) {
        prevBtn.style.opacity = "0.5";
        prevBtn.style.pointerEvents = "none";
    } else {
        prevBtn.style.opacity = "1";
        prevBtn.style.pointerEvents = "auto";
    }
}

// Event Bindings
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
        alert("You are on the latest level!");
    }
});

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        appContainerId.requestFullscreen().catch(err => {
            alert(`Fullscreen error: ${err.message}`);
        });
        fullscreenBtn.innerText = "❌ Exit Full";
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerText = "📺 Fullscreen";
    }
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenBtn.innerText = "📺 Fullscreen";
    }
});

hintBtn.addEventListener('click', () => hintText.classList.toggle('hide'));
clearBtn.addEventListener('click', clearCurrentAnswer);

// PWA Installer Trigger
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
