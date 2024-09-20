import { configDotenv } from "dotenv"
import axios from "axios";
import { db } from "../../firebase.js";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

configDotenv({
    path: '../../../.env.production'
})

const secretKey = process.env.EDEN_AI_API_KEY;
const URL = process.env.EDEN_API_URL;
// console.log(URL);

const options = (description) => ({
    method: "POST",
    url: URL,
    headers: {
        authorization: secretKey,
    },
    data: {
        providers: "openai/gpt-4",
        text: `Analyze the following paragraph and extract only the specific keywords 
        that summarize the main points, such as product types, fraud type, actions,
         and e- commerce - related terms.Return the keywords as an array of objects,
          where each object contains a keyword field: \n\n "${description}"`,
        chatbot_global_action: "Act as an assistant",
        previous_history: [],
        temperature: 0.5,
        max_tokens: 150,
    },
});

export default async function analyzeEvidence(description) {
    try {
        // Make the API request
        const response = await axios.request(options(description));
        const data = response.data;

        // Extract the generated_text
        const { generated_text } = data["openai/gpt-4"];
        console.log(generated_text);

        // Parse the JSON
        let parsedKeywords;
        try {
            parsedKeywords = JSON.parse(generated_text);
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            throw new Error("Invalid JSON format in generated_text");
        }

        // Reference to the Firestore document
        const docRef = doc(db, "trends", "ooAMrXEo13ZZdqnXPOrN");

        // Update the Firestore document
        try {
            // Flatten array and use arrayUnion for each keyword
            await updateDoc(docRef, {
                trendingKeywords: arrayUnion(...parsedKeywords.map(item => item.keyword))
            });
            console.log("Document updated successfully");
        } catch (updateError) {
            console.error("Error updating document:", updateError);
            throw new Error("Failed to update Firestore document");
        }

        // return data;
    } catch (error) {
        console.error("Error in the function:", error);
        throw new Error("Failed to analyze evidence");
    }
}

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const generativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = generativeAI.getGenerativeModel({
//     model: 'gemini-1.5-flash'
// })

// export default async function analyzeEvidence(description) {
//     try {
//         const prompt = `Analyze the following evidence description for fraud and extract keywords:\n\n"${description}"\n\nKeywords:`;
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         return response.text().trim();
//     } catch (error) {
//         console.error(error);
//         throw new Error("Failed to analyze evidence");
//     }
// }


/*
const data = {
    "openai/gpt-4": {
        "generated_text": "[\n  {\"keyword\": \"European users\"},\n  {\"keyword\": \"site\"},\n  {\"keyword\": \"access\"},\n  {\"keyword\": \"admin panel\"},\n  {\"keyword\": \"shopping cart\"},\n  {\"keyword\": \"unauthorized credentials\"},\n  {\"keyword\": \"suspicious behavior\"},\n  {\"keyword\": \"potential security breach\"},\n  {\"keyword\": \"fraudulent activity\"}\n]",
        "message": [
            {
                "role": "user",
                "message": "Analyze the following paragraph and extract only the specific keywords that summarize the main points, such as product types, fraud type, actions, and e- commerce - related terms.Return the keywords as an array of objects, where each object contains a keyword field: \n\n \"One of the European users came to my site and is trying to access the admin panel and the shopping cart using unauthorized credentials. This behavior is suspicious and could indicate a potential security breach or fraudulent activity.\"",
                "tools": null,
                "tool_calls": null
            },
            {
                "role": "assistant",
                "message": "[\n  {\"keyword\": \"European users\"},\n  {\"keyword\": \"site\"},\n  {\"keyword\": \"access\"},\n  {\"keyword\": \"admin panel\"},\n  {\"keyword\": \"shopping cart\"},\n  {\"keyword\": \"unauthorized credentials\"},\n  {\"keyword\": \"suspicious behavior\"},\n  {\"keyword\": \"potential security breach\"},\n  {\"keyword\": \"fraudulent activity\"}\n]",
                "tools": null,
                "tool_calls": []
            }
        ],
        "status": "success",
        "cost": 0.01116
    }
};

const { generated_text } = data["openai/gpt-4"];

// Parse the JSON string to an actual array of objects
const parsedKeywords = JSON.parse(generated_text);

const addData = async () => {
    try {
        // Add data to Firestore
        const docRef = await addDoc(collection(db, "trends"), {
            trendingKeywords: parsedKeywords, // Store the array of objects directly
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error.message);
    }
}

addData();
*/