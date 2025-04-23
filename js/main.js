const words ="The quick brown fox jumps over the lazy dog while the sun shines brightly in the clear blue sky. Programming is an essential skill in today's world, and JavaScript is one of the most popular languages. Developers use it to build websites, apps, and games that run smoothly on any device. Typing games help improve speed and accuracy, making them a great way to practice coding. As you type, focus on precision and avoid mistakes to achieve a high score. The more you play, the better you'll get at typing complex sentences and code snippets. Challenge yourself with different levels of difficulty and compete with friends to see who can type the fastest. Remember to take breaks and stretch your hands to avoid strain. Consistency is key to mastering any skill, so keep practicing every day. With dedication and effort, you'll soon notice significant improvements in your typing speed and coding abilities. Stay motivated and enjoy the process of learning something new. Good luck, and have fun playing the game!".split(' ');

import {DOMUtils} from "./dom-utils.js";
import {DataService} from "./data-service.js";



async function initializeApp() {
     await DataService.fetchData()
    // console.log(localStorage.getItem("wordsCache"))
    // console.log(DataService.getQuotesFromStorage())
}

// console.log(initializeApp())


const gameConfig = {
    mode :'words',
    options :{
        words: '10',
        time: '10',
        quote: 'short'
    }
}
const typingStats = {
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
    get accuracy() {
        const totalAttempted = this.correct + this.incorrect + this.extra;
        return totalAttempted > 0
            ? Math.round((this.correct / totalAttempted) * 100)
            : 0;
    }
};



// Initialize first mode options on load
document.addEventListener('DOMContentLoaded', () => {
    console.log(initializeApp());
    const initialMode = document.querySelector('.mode-btn.active-mode').dataset.mode;
    handleModeChange(initialMode);
});


// Add click listener to each button
const modeButtons = document.querySelectorAll('.mode-btn');
const modeOptionsMap = {
    'words': 'words-options',
    'time': 'time-options',
    'quote': 'quote-options',
};

function updateGameConfig(mode, value) {
    gameConfig.mode = mode;

    if (mode === 'words') {
        gameConfig.options.words = parseInt(value);
    } else if (mode === 'time') {
        gameConfig.options.time = parseInt(value);
    } else if (mode === 'quote') {
        gameConfig.options.quote = value.toLowerCase();
    }

    console.log('Updated Config:', gameConfig);
    newGame()
}

// Handle mode change
function handleModeChange(selectedMode) {
    // Hide all options
    document.querySelectorAll('.mode-options').forEach(opt => {
        opt.style.display = 'none';
    });

    // Show and activate options for selected mode
    const optionsDivId = modeOptionsMap[selectedMode];
    if (optionsDivId) {
        const optionsDiv = document.getElementById(optionsDivId);
        optionsDiv.style.display = 'flex';
        activateFirstOption(optionsDiv);
    }
}

// Activate first option in a container
function activateFirstOption(optionsDiv) {
    const buttons = optionsDiv.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('active-option'));
    if (buttons.length > 0) {
        buttons[0].classList.add('active-option');
    }
    updateGameConfig(gameConfig.mode, buttons[0].dataset.value);
}

// Handle option selection
function handleOptionClick(clickedButton) {
    const parentOptions = clickedButton.closest('.mode-options');
    parentOptions.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active-option');
    });
    clickedButton.classList.add('active-option');
}

// Mode button event listeners
modeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Update active mode button
        modeButtons.forEach(btn => btn.classList.remove('active-mode'));
        this.classList.add('active-mode');

        let mode= this.dataset.mode;
        gameConfig.mode = mode;

        // Handle mode change
        handleModeChange(mode);
    });
});

// Option button event listeners
document.querySelectorAll('.mode-options button').forEach(button => {
    button.addEventListener('click', function() {
        console.log("Option clicked:", this);
        handleOptionClick(this);

        updateGameConfig(
            gameConfig.mode,
            this.dataset.value
        );
    });
});




window.timer = null;
window.gameStart = null;

let wordsRemaining;

function addClass(el,cName){
    el.className +=" "+cName;
}
function removeClass(el,cName) {
    el.className = el.className.replace(cName,'');
}



function randomWord() {
    const words = DataService.getWordsFromStorage();
    if (!words || words.length === 0) {
        console.error('No words available');
        return '';
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function formatWord(word) {
    if (!word) return '';
    const safeWord = word.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<div class="word"><span class="letter">${safeWord.split('').join('</span><span class="letter">')}</span></div>`;
}






function newGame() {

    typingStats.correct = 0;
    typingStats.incorrect = 0;
    typingStats.extra = 0;
    typingStats.missed = 0;
    console.log("reset typing stats",typingStats)

    clearInterval(window.timer);  // 🚨 Clear any existing timer
    window.timer = null;
    window.gameStart = null;
    removeClass(document.getElementById('game'), 'over');
    const wordsContainer = document.getElementById('words');
    wordsContainer.innerHTML = '';
    wordsContainer.style.marginTop = '0px';

    let content = [];
    if (gameConfig.mode === 'quote') {
        console.log("game mode is quote")
        const quotes = DataService.getQuotesFromStorage();
        const quoteCategory = gameConfig.options.quote;
        const filteredQuotes = quotes[quoteCategory] || [];

        // Add validation for empty quotes
        if (filteredQuotes.length === 0) {
            console.error('No quotes found for category:', quoteCategory);
            return;
        }
        const selectedQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        content = selectedQuote.split(' ');
    } else if (gameConfig.mode === 'words') {
        console.log("game mode is words")

        const wordCount = parseInt(gameConfig.options.words);
        for (let i = 0; i < wordCount; i++) {
            content.push(randomWord());
        }
    } else { // Time mode
        console.log("game mode is time")
        for (let i = 0; i <100; i++) {
            content.push(randomWord());
        }
    }

    content.forEach(word => {
        wordsContainer.innerHTML += formatWord(word);
    });

    // Initialize current word and letter
    const firstWord = document.querySelector('.word');
    const firstLetter = firstWord.querySelector('.letter');
    addClass(firstWord, 'current');
    addClass(firstLetter, 'current');
    updateCursorPosition()

    // Set initial info display
    if (gameConfig.mode === 'time') {
        document.getElementById('info').textContent = gameConfig.options.time;
    } else if (gameConfig.mode === 'words') {
        wordsRemaining = parseInt(gameConfig.options.words);
        document.getElementById('total-words').textContent = wordsRemaining;
        document.getElementById('words-remain').textContent = wordsRemaining;

    } else {
        document.getElementById('info').textContent = '0';
    }

    // window.timer = null;
}


// function getWpm() {
//
//     const elapsed = (Date.now() - window.gameStart) / 1000 / 60;
//     const wpm = Math.round(typingStats.correct / 5 / elapsed);
//
//     return wpm;
// }

function getWpm() {
    typingStats.correct = document.querySelectorAll('.correct').length;
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const index = words.indexOf(lastTypedWord);
    const typedWords = index === -1 ? words : words.slice(0, index);
    const correctWords = typedWords.filter(word =>
        [...word.children].every(letter =>
            letter.classList.contains('correct') &&
            !letter.classList.contains('incorrect')
        )
    );


    const elapsedTime = (Date.now() - window.gameStart) / 1000;
    console.log("elapsed time", elapsedTime/60)
    return elapsedTime > 0 ? Math.round(correctWords.length / (elapsedTime / 60)) : 0;
}





function gameOver() {
    // updateAllStats()
    clearInterval(window.timer)
    addClass(document.getElementById('game'),'over');
    const wpm = getWpm();
    // alert(`Game Over! Your WPM: ${wpm}`);
    // document.getElementById('info').innerHTML = ` WPM: ${wpm}`;



    document.getElementById('wpm').innerHTML = ` WPM: ${wpm}`
    document.getElementById('accuracy').innerHTML = ` accuracy: ${typingStats.accuracy}`
    document.getElementById('letters-stats').innerHTML =
        `${typingStats.correct}/${typingStats.incorrect}/${typingStats.extra}/${typingStats.missed}`

}







document.getElementById('new-game').addEventListener('click', () => {
    const wpm = getWpm();
    // alert(`Game Over! Your WPM: ${wpm}`);
    document.getElementById('info').innerHTML = ` WPM: ${wpm}`;
    newGame();
});






document.getElementById('game').addEventListener("keydown", ev => {
    const gameElement = document.getElementById('game');
    if (gameElement.classList.contains('over')) return;

    const { key } = ev;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === " ";
    const isBackspace = key === 'Backspace';

    // Handle different key types
    if (isLetter) handleLetter(key, currentWord, currentLetter);
    if (isSpace) handleSpace(currentWord, currentLetter);
    if (isBackspace) handleBackspace(currentWord, currentLetter);

    updateCursorPosition();
    startTimerIfNeeded(key);
    handleWordContainerScroll(currentWord);
});

// Helper functions
function startTimerIfNeeded(key) {
    if (!window.timer && key.length === 1 && key !== ' ') {
        window.gameStart = Date.now();
        if (gameConfig.mode === 'time') {
            const timeLimit = parseInt(gameConfig.options.time) * 1000;
            window.timer = setInterval(() => {
                const timeRemaining = timeLimit - (Date.now() - window.gameStart);
                if (timeRemaining <= 0) gameOver();
                document.getElementById('info').textContent = Math.round(timeRemaining / 1000);
            }, 1000);
        }
    }
}

function handleLetter(key, currentWord, currentLetter) {
    if (currentLetter) {
        const wasIncorrect = currentLetter.classList.contains('incorrect');
        const isCorrect = key === currentLetter.innerText;
        currentLetter.classList.add(isCorrect ? 'correct' : 'incorrect');
        currentLetter.classList.remove('current');


        // Update stats
        if (isCorrect) {
            typingStats.correct++;
            if (wasIncorrect) typingStats.incorrect--;
        } else {
            typingStats.incorrect++;
            if (wasIncorrect) typingStats.incorrect--; // Prevent double-counting
        }


        const nextLetter = currentLetter.nextElementSibling?.classList?.contains('letter')
            ? currentLetter.nextElementSibling
            : null;
        if (nextLetter) nextLetter.classList.add('current');
    } else {
        const extraLetter = document.createElement("span");
        extraLetter.textContent = key;
        extraLetter.className = 'letter incorrect extra';
        currentWord.appendChild(extraLetter);
        typingStats.extra++;
    }
}

function handleSpace(currentWord, currentLetter) {
    let missedInWord= 0;
    // Invalidate incorrect letters in current word
    document.querySelectorAll('.word.current .letter:not(.correct)')
        .forEach(letter => {
            letter.classList.add('incorrect')
            missedInWord++;
            // typingStats.missed++;
        });
    typingStats.missed += missedInWord;
    typingStats.incorrect += missedInWord;

    currentWord?.classList.remove('current');
    currentLetter?.classList.remove('current');

    const nextWord = currentWord?.nextElementSibling;
    if (nextWord) {
        nextWord.classList.add('current');
        nextWord.firstElementChild?.classList.add('current');

        if (gameConfig.mode === 'words') {
            wordsRemaining--;
            document.getElementById('words-remain').textContent = wordsRemaining;
        }
    } else {
        gameOver();
    }
}

function handleBackspace(currentWord, currentLetter) {
    const extraLetters = document.querySelectorAll('.letter.incorrect.extra');
    if (extraLetters.length > 0) {
        extraLetters[extraLetters.length - 1].remove();
        typingStats.extra = Math.max(0, typingStats.extra - 1);

        return;
    }
    if (currentLetter) {
        const wasCorrect = currentLetter.classList.contains('correct');
        const wasIncorrect = currentLetter.classList.contains('incorrect');

        if (wasCorrect) typingStats.correct--;
        if (wasIncorrect) typingStats.incorrect--;
    }

    if (!currentLetter && currentWord.lastElementChild) {
        const lastLetter = currentWord.lastElementChild;
        lastLetter.classList.add('current');
        lastLetter.classList.remove('incorrect', 'correct');
        return;
    }



    if (currentLetter?.previousElementSibling) {
        currentLetter.classList.remove('current');
        const prevLetter = currentLetter.previousElementSibling;
        prevLetter.classList.add('current');
        prevLetter.classList.remove('incorrect', 'correct');
    } else if (currentWord?.previousElementSibling) {
        handlePreviousWord(currentWord);
    }
}

function handlePreviousWord(currentWord) {
    currentWord.classList.remove('current');
    const prevWord = currentWord.previousElementSibling;
    prevWord.classList.add('current');

    const lastLetter = prevWord.lastElementChild;
    if (lastLetter) {
        lastLetter.classList.add('current');
        lastLetter.classList.remove('incorrect', 'correct');
    }
}

function updateCursorPosition() {
    const cursor = document.getElementById('cursor');
    const target = document.querySelector('.letter.current') || document.querySelector('.word.current');
    // console.log()
    if (target && cursor) {
        const rect = target.getBoundingClientRect();
        cursor.style.top = `${rect.top + (target.classList.contains('letter') ? +2 : 0)}px`;
        cursor.style.left = `${rect[target.classList.contains('letter') ? 'left' : 'right']+1}px`;
    }
}

function handleWordContainerScroll(currentWord) {
    if (currentWord?.getBoundingClientRect().top > 265) {
        const wordsContainer = document.getElementById('words');
        const currentMargin = parseInt(wordsContainer.style.marginTop || '0');
        wordsContainer.style.marginTop = `${currentMargin - 30}px`;
    }
}


// newGame();



function showWords(){

    console.log(localStorage.getItem('words'))
}
