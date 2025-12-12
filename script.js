const API_KEY = "YOUR_API_KEY_HERE";  // ← यहाँ अपनी API key डालो

async function generateImage() {
    const prompt = document.getElementById("promptInput").value;
    const style = document.getElementById("styleSelect").value;
    const size = document.getElementById("sizeSelect").value;

    const loader = document.getElementById("loader");
    const error = document.getElementById("error");
    const img = document.getElementById("generatedImage");
    const downloadBtn = document.getElementById("downloadBtn");

    error.style.display = "none";
    img.style.display = "none";
    downloadBtn.style.display = "none";
    loader.style.display = "block";

    try {
        const start = await fetch("https://aihorde.net/api/v2/generate/async", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": API_KEY
            },
            body: JSON.stringify({
                prompt: `${prompt}, ${style} style`,
                params: { width: Number(size), height: Number(size) }
            })
        });

        const startData = await start.json();
        const id = startData.id;

        let result;
        while (true) {
            await new Promise(r => setTimeout(r, 3000));

            const check = await fetch(`https://aihorde.net/api/v2/generate/async/${id}`);
            result = await check.json();

            if (result.done) break;
        }

        loader.style.display = "none";

        const base64 = result.generations[0].img;
        img.src = "data:image/png;base64," + base64;
        img.style.display = "block";
        downloadBtn.style.display = "block";

    } catch (err) {
        loader.style.display = "none";
        error.innerText = "⚠ Error generating image!";
        error.style.display = "block";
    }
}


function downloadImage() {
    const img = document.getElementById("generatedImage").src;
    const a = document.createElement("a");
    a.href = img;
    a.download = "ai-image.png";
    a.click();
}
