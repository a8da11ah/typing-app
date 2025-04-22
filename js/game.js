

import {DOMUtils} from "./dom-utils";
import {DataService} from "./data-service";

const gameConfig = {
    mode :'words',
    options :{
        words: '10',
        time: '10',
        quote: 'short'
    }
}



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
        gameConfig.options.quoteLength = value.toLowerCase();
    }

    console.log('Updated Config:', gameConfig);
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
    updateGameConfig(gameConfig.mode, buttons[0].textContent);
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
            this.textContent
        );
    });
});

// Initialize first mode options on load
document.addEventListener('DOMContentLoaded', () => {
    const initialMode = document.querySelector('.mode-btn.active-mode').dataset.mode;
    handleModeChange(initialMode);
    console.log(initialMode)
});



async function initializeApp() {
    await DataService.fetchData()

}





export class TypingGame {
    constructor(config, wordGenerator) {
        this.config = config;
        this.wordGenerator = wordGenerator;
        this.timer = new GameTimer(config.GAME_DURATION);
        this.initDOMReferences();
        this.registerEventListeners();
    }

    initDOMReferences() {
        this.dom = {
            gameContainer: document.getElementById('game'),
            wordsContainer: document.getElementById('words'),
            infoDisplay: document.getElementById('info'),
            newGameButton: document.getElementById('new-game'),
            cursor: document.getElementById('cursor')
        };
    }

    registerEventListeners() {
        this.dom.newGameButton.addEventListener('click', () => this.newGame());
        this.dom.gameContainer.addEventListener('keydown', e => this.handleInput(e));
    }

    newGame() {
        // Reset game state
        this.resetGameState();
        this.generateWords();
        this.startGame();
    }

    resetGameState() {
        this.timer.stop();
        DOMUtils.removeClass(this.dom.gameContainer, 'over');
        this.dom.wordsContainer.innerHTML = '';
        this.currentWordIndex = 0;
        this.currentLetterIndex = 0;
    }

    generateWords() {
        let wordsHTML = '';
        for (let i = 0; i < this.config.WORDS_PER_GAME; i++) {
            wordsHTML += this.wordGenerator.formatWord(this.wordGenerator.getRandomWord());
        }
        this.dom.wordsContainer.innerHTML = wordsHTML;
        this.activateCurrentWordAndLetter();
    }

    startGame() {
        this.timer.start(remaining => {
            this.dom.infoDisplay.textContent = remaining;
            if (remaining <= 0) this.gameOver();
        });
    }

    gameOver() {
        this.timer.stop();
        DOMUtils.addClass(this.dom.gameContainer, 'over');
        const wpm = this.calculateWPM();
        this.dom.infoDisplay.textContent = `WPM: ${wpm}`;
    }

    calculateWPM() {
        const words = [...document.querySelectorAll('.word')];
        const lasttypedWord = document.querySelector('.word.current');
        const index = words.indexOf(lasttypedWord);
        const typedWords = words.slice(0,index);
        const correctWords = typedWords.filter(word => {
            const letters = [...word.children];
            const correctLetters = letters.filter(letter => letter.classList.contains('correct'));
            const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect'));
            return correctLetters.length === letters.length && incorrectLetters.length === 0;
        });
        const wpm = correctWords.length / (gameTimer/1000/60);
        return wpm;    }

    handleInput(event) {
        // ... existing input handling logic
        // Break into smaller methods:
        // - handleLetter()
        // - handleSpace()
        // - handleBackspace()
        // - updateCursorPosition()
        // - adjustWordPosition()
    }

    // Add other helper methods here
}

// Initialize the game
const wordGenerator = new WordGenerator(WORDS);
const game = new TypingGame(CONFIG, wordGenerator);
game.newGame();
