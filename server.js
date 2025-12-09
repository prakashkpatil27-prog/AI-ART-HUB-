import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: prompt })
            }
        );

        const buffer = await response.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        res.json({
            image: `data:image/png;base64,${base64Image}`
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Image generation failed" });
    }
});

app.get("/", (req, res) => {
    res.send("Image Generator API is running...");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));
