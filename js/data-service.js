

// data-service.js
export class DataService {
    static quotesFilePath ="/assets/quotes_categorized.json";
    static wordsFilePath ="/assets/google-10000-english.txt";


    static CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    static async fetchQuotes() {
        try {
            const response = await fetch(this.quotesFilePath);
            const data = await response.json();
            console.log(data);

            return (data)
            // return data.map(quote => quote.text?.trim()).filter(text => text && text.length > 0);
        } catch (error) {
            console.error('Failed to fetch quotes:', error);
            return [];
        }
    }

    static async loadLocalWords() {
        try {
            console.log('start loading words');

            const response = await fetch(this.wordsFilePath);
            const text = await response.text();

            return text.split(/\s+/).filter(word => word.length > 0);
        } catch (error) {
            console.error('Failed to load local words:', error);
            return [];
        }
    }

    static quotesStorageKey = 'quotesCache';
    static wordsStorageKey = 'wordsCache';

    static async fetchData() {
        // this.clearCache()
        const quotesCache = localStorage.getItem(this.quotesStorageKey);
        const wordsCache = localStorage.getItem(this.wordsStorageKey);

        // Only fetch if either cache is missing
        if (!quotesCache || !wordsCache) {
            console.log('Fetching data from files...');
            try {
                const quotes = await this.fetchQuotes();
                const words = await this.loadLocalWords();
                localStorage.setItem(this.quotesStorageKey, JSON.stringify(quotes));
                localStorage.setItem(this.wordsStorageKey, JSON.stringify(words));
                console.log('Data fetched and cached.');
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        } else {
            console.log('Data already cached. Skipping fetch.');
        }
    }





    // Get words list
    static getWordsFromStorage() {
        const data = localStorage.getItem(this.wordsStorageKey);
        return data ? JSON.parse(data) : [];
    }

    // Get raw quotes list
    static getQuotesFromStorage() {
        const data = localStorage.getItem(this.quotesStorageKey);
        return data ? JSON.parse(data) : [];
    }

    static clearCache() {
        localStorage.removeItem(this.quotesStorageKey);
        localStorage.removeItem(this.wordsStorageKey);
    }

    // static async getQuotes(quoteAPI) {
    //     try {
    //         const response = await fetch(quoteAPI);
    //         const data = await response.json();
    //         return data; // this will be an array of quotes
    //     } catch (error) {
    //         console.error('Failed to fetch quotes:', error);
    //     }
    // }

}
