const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponce(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
    });
    return response.text
}


module.exports = generateResponce