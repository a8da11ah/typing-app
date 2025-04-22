// config.js
export const CONFIG = {
    GAME_DURATION: 10 * 1000,
    WORDS_PER_GAME: 50,
    MAX_TOP_POSITION: 265,
    MARGIN_ADJUSTMENT: 30,
    DATA_SOURCES: {
        LOCAL_WORDS: 'data/words.txt',
        QUOTES_API: 'https://api.quotable.io/quotes/random?limit=5'
    },
    FALLBACK_WORDS: ["default", "words", "array"] // Keep basic fallback
};
