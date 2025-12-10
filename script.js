const API_URL = "https://image-generator-backend-mzo1.onrender.com/generate";

async function generateImage() {
  const prompt = document.getElementById("promptInput").value;
  const loader = document.getElementById("loader");
  const error = document.getElementById("error");
  const img = document.getElementById("generatedImage");
  const downloadBtn = document.getElementById("downloadBtn");

  error.style.display = "none";
  img.style.display = "none";
  downloadBtn.style.display = "none";

  if (!prompt.trim()) {
    error.innerText = "⚠ Prompt cannot be empty!";
    error.style.display = "block";
    return;
  }

  loader.style.display = "block";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    loader.style.display = "none";

    if (data.image) {
      img.src = data.image;
      img.style.display = "block";
      downloadBtn.style.display = "inline-block";
    } else {
      error.innerText = "⚠ Failed to generate image!";
      error.style.display = "block";
    }

  } catch {
    loader.style.display = "none";
    error.innerText = "⚠ Server Error!";
    error.style.display = "block";
  }
}

function downloadImage() {
  const img = document.getElementById("generatedImage").src;
  const link = document.createElement("a");
  link.href = img;
  link.download = "generated_image.png";
  link.click();
}
