const words ="The quick brown fox jumps over the lazy dog while the sun shines brightly in the clear blue sky. Programming is an essential skill in today's world, and JavaScript is one of the most popular languages. Developers use it to build websites, apps, and games that run smoothly on any device. Typing games help improve speed and accuracy, making them a great way to practice coding. As you type, focus on precision and avoid mistakes to achieve a high score. The more you play, the better you'll get at typing complex sentences and code snippets. Challenge yourself with different levels of difficulty and compete with friends to see who can type the fastest. Remember to take breaks and stretch your hands to avoid strain. Consistency is key to mastering any skill, so keep practicing every day. With dedication and effort, you'll soon notice significant improvements in your typing speed and coding abilities. Stay motivated and enjoy the process of learning something new. Good luck, and have fun playing the game!".split(' ');

// حساب الوقت
const gameTimer = 10 * 1000;
window.timer = null;
window.gameStart = null;


function addClass(el,cName){
    el.className +=" "+cName;
}
function removeClass(el,cName) {
    el.className = el.className.replace(cName,'');
}



function randomWord() {
    const randonIndex = Math.ceil(Math.random()*words.length-1);
    return words[randonIndex ];
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}


function newGame() {
    window.gameStart = null;
    removeClass(document.getElementById('game'),'over');

    document.getElementById('words').innerHTML = '';
    for (let i = 0; i <50; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'),'current')
    addClass(document.querySelector('.letter'),'current')
    document.getElementById('info').innerHTML = gameTimer / 1000;
    window.timer = null;
}

function getWpm() { // الكلمات في الدقيقة
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
    return wpm;
}

function gameOver() {
    clearInterval(window.timer)
    addClass(document.getElementById('game'),'over');
    const wpm = getWpm();
    // alert(`Game Over! Your WPM: ${wpm}`);
    document.getElementById('info').innerHTML = ` WPM: ${wpm}`;
}





function extraLetters() {
    const incorrectLetter = document.createElement("span");
    incorrectLetter.innerHTML = key;
    incorrectLetter.className = 'letter incorrect extra';
    currentWord.appendChild(incorrectLetter);
}

document.getElementById('new-game').addEventListener('click', () => {
    const wpm = getWpm();
    // alert(`Game Over! Your WPM: ${wpm}`);
    document.getElementById('info').innerHTML = ` WPM: ${wpm}`;
    newGame();
});
document.getElementById('game').addEventListener("keydown", ev => {

    if (document.getElementById('game').classList.contains('over')) {
        return;
    }
    const key = ev.key;
    let currentWord = document.querySelector('.word.current')
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML ||' ';
    const isLetter = key.length ===1 && key !==' ';
    const isSpace = key === " ";
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    console.log({key,expected})




    if(!window.timer && isLetter) {
        window.timer = setInterval(() => {
            if (!window.gameStart){
                window.gameStart = Date.now();
            }
            const currentTime = Date.now();
            const elapsedTime = currentTime - window.gameStart;
            const timeRemaining = gameTimer - elapsedTime;
            if (timeRemaining <= 0) {
                gameOver();
                return;
            }
            document.getElementById('info').innerHTML =  Math.round(timeRemaining / 1000); ;
        }, 1000);
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');

            if (currentLetter.nextSibling && currentLetter.nextSibling.classList.contains('letter')) {
                addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            // If currentLetter is null, it means we've already reached the end of the word
            // Append incorrect letters at the end of the word
            const incorrectLetter = document.createElement("span");
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }


    if (isSpace){
        if (expected !==' '){
            const letterToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            letterToInvalidate.forEach(letter =>{
                addClass(letter,'incorrect');
            });

        }
        removeClass(currentWord,'current');
        addClass(currentWord.nextSibling,'current');

        if (currentLetter){
            removeClass(currentLetter,'current');
        }
        addClass(currentWord.nextSibling.firstChild,'current');
    }




    if (isBackspace) {
        console.log({currentLetter})
        let extraLetters = document.querySelectorAll('.letter.incorrect.extra');
        if (extraLetters.length > 0) {
            extraLetters[extraLetters.length - 1].remove();
        } else {
            // let isFirstLetter = currentLetter.previousSibling ? false: true;

            // If at the start of the word and it's the first word, do nothing
            if (isFirstLetter && !currentWord.previousSibling) {
                return;
            }

            // If at the start of the word, move to the last letter of the previous word
            if (isFirstLetter && currentWord) {
                console.log("اول حرف ولازم يرجع كلمة")
                removeClass(currentWord, 'current');
                addClass(currentWord.previousSibling, 'current');
                removeClass(currentLetter, 'current');
                addClass(currentWord.previousSibling.lastChild, 'current');
                removeClass(currentWord.previousSibling.lastChild, 'incorrect');
                removeClass(currentWord.previousSibling.lastChild, 'correct');

            }

            if (currentLetter && !isFirstLetter) {
                console.log("لازم يرجع حرف واحد")
                removeClass(currentLetter, 'current');
                const prevLetter = currentLetter?.previousElementSibling;
                if (prevLetter) {
                    addClass(prevLetter, 'current');
                    removeClass(prevLetter, 'incorrect');
                    removeClass(prevLetter, 'correct');
                }

            }

            if (!currentLetter) {
                const lastLetter = currentWord?.lastElementChild;
                if (lastLetter) {
                    addClass(lastLetter, 'current');
                    removeClass(lastLetter, 'incorrect');
                    removeClass(lastLetter, 'correct');
                }
            }

        }
    }

    if (currentWord.getBoundingClientRect().top>265){
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop ||'0px');
        words.style.marginTop = margin - 30 + 'px';
        // alert('move up')
    }



    // Update cursor position properly
    // const nextLetter = document.querySelector('.letter.current');
    // const nextWord = document.querySelector('.word.current');
    // const cursor = document.getElementById('cursor');
    //
    // if (cursor && (nextLetter || nextWord)) {
    //     const rect = (nextLetter || nextWord).getBoundingClientRect();
    //     if (rect) {
    //         cursor.style.top = rect.top + (nextLetter ? -2 : 2) + 'px';
    //         cursor.style.left = rect[nextLetter ? 'left' : 'right'] + 'px';
    //     }
    // }

    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    const targetElement = nextLetter || nextWord;
    if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        cursor.style.top = rect.top + (nextLetter ? -2 : 2) + 'px';
        cursor.style.left = rect[nextLetter ? 'left' : 'right'] + 'px';
    }



})





newGame();
