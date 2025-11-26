import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.post("/generate-image", async (req, res) => {
    const { prompt } = req.body;

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

    const result = await response.json();
    const imageUrl = result.data[0].url;

    res.json({ imageUrl });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
