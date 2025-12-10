import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;

// TEST Route
app.get("/", (req, res) => {
    res.send("AI Image Generator Server is Running...");
});

// MAIN API
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

    const contentType = response.headers.get("content-type") || "image/png";
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Image = buffer.toString("base64");

    res.json({
      image: `data:${contentType};base64,${base64Image}`
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// PORT (Render uses this automatically)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
