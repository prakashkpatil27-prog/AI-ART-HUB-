import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate-image", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-image-1",
                prompt: prompt,
                size: "1024x1024"
            })
        });

        const data = await response.json();
        res.json({ image: data.data[0].url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Image generation failed" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

{
  "name": "ai-art-hub-backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "node-fetch": "^3.3.2"
  }
}
OPENAI_API_KEY=तुम्हारी_API_KEY
