// word-generator.js
export class WordGenerator {
    constructor(wordSource) {
        this.wordSource = wordSource;
    }

    getRandomWord() {
        const randomIndex = Math.floor(Math.random() * this.wordSource.length);
        return this.wordSource[randomIndex];
    }

    formatWord(word) {
        return `<div class="word"><span class="letter">${
            word.split('').join('</span><span class="letter">')
        }</span></div>`;
    }
}
