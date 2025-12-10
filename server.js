import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

app.get("/", (req, res) => {
  res.send("Turbo Stable Diffusion API is Running...");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { guidance_scale: 0.0 },
        }),
      }
    );

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Image = buffer.toString("base64");

    res.json({
      image: `data:image/png;base64,${base64Image}`
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
