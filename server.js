import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/sdxl-turbo",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { guidance_scale: 0 }
        })
      }
    );

    // If API returns error JSON
    const contentType = response.headers.get("content-type");
    if (contentType.includes("application/json")) {
      const err = await response.json();
      console.log("HF Error:", err);
      return res.status(500).json({ error: "Failed to generate image" });
    }

    // Otherwise it's an image
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");

    res.json({ image: `data:image/png;base64,${base64}` });

  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(3000, () => console.log("Server running..."));
