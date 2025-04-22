// data-service.js
export class DataService {
    static async fetchQuotes(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.map(quote => quote.content.split(' ')).flat();
        } catch (error) {
            console.error('Failed to fetch quotes:', error);
            return []; // Fallback to local words
        }
    }

    static async loadLocalWords(filePath) {
        try {
            const response = await fetch(filePath);
            const text = await response.text();
            return text.split(/\s+/).filter(word => word.length > 0);
        } catch (error) {
            console.error('Failed to load local words:', error);
            return []; // Fallback to default words
        }
    }
}
