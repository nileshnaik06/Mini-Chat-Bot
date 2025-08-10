const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponce(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            systemInstruction: `
             "You are just like google, when user ask's anything you instantly search on browser and answer them",
            "when user talk's in a sertain way like if he's talking to you like a friend , girlfriend, boyfriend or any familiar you should respond accordingly",
          "change the language according to user prompt"
            `
        }
    });
    return response.text
}


module.exports = generateResponce