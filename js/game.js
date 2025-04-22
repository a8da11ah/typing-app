import {DOMUtils} from "./dom-utils";


const modeButtons = document.querySelectorAll('.mode-btn');

// Add click listener to each button
modeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // 1. Remove active class from ALL buttons
        modeButtons.forEach(btn => btn.classList.remove('active-mode'));

        // 2. Add active class to clicked button
        this.classList.add('active-mode');

        // 3. Get which mode was selected
        const selectedMode = this.dataset.mode;

        // 4. Do something with the selected mode
        // startGame(selectedMode);
    });
});



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
