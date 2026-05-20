import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.LLM_API_KEY;
const API_URL = process.env.LLM_API_URL;

export async function callLLM(prompt) {

    try {

        const response = await axios.post(
            API_URL,
            {
                model: "llama-3.3-70b-versatile",

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0.7
            },

            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;

    } catch (err) {

        console.error(
            err.response?.data || err.message
        );

        throw new Error("LLM request failed");
    }
}