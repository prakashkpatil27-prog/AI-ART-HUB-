import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;

// Stable Diffusion Model (तुम चाहे तो मॉडल बदल सकते हो)
const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required!" });
    }

    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    res.json({
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Image generation failed!" });
  }
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
