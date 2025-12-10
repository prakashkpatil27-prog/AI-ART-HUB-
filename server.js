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

    // 🔥 Auto Detect Image Type (IMPORTANT)
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
