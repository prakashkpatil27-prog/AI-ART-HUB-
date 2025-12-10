import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

const HF_API_KEY = process.env.HF_API_KEY;

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🔥 AI Image Generator Backend Running Successfully!");
});

// MAIN IMAGE GENERATOR
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required!" });
    }

    const response = await fetch(
      "https://router.huggingface.co/models/stabilityai/sdxl-turbo",
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

    const contentType = response.headers.get("content-type") || "";

    // 🛑 If huggingface returns JSON instead of image → error
    if (contentType.includes("application/json")) {
      const err = await response.json();
      console.log("HF API ERROR:", err);
      return res.status(500).json({
        error: "HF API returned an error",
        details: err,
      });
    }

    // 🖼 Convert returned image to base64
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");

    return res.json({
      image: `data:${contentType};base64,${base64}`,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Image generation failed" });
  }
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
