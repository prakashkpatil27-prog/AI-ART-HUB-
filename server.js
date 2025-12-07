import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024"
    });

    const image_base64 = result.data[0].b64_json;

    return res.json({
      success: true,
      image: "data:image/png;base64," + image_base64,
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Image generation failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));