export function safeParseJSON(text) {

    try {
        const cleaned = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        return JSON.parse(cleaned);

    } catch (err) {

        console.error("JSON Parse Error:", err);

        return {
            raw: text
        };
    }
}