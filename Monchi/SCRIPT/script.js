const landingPage = document.getElementById("landingPage");
const mainApp = document.getElementById("mainApp");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const snapBtn = document.getElementById("snap");
const downloadBtn = document.getElementById("downloadBtn");
const gallery = document.getElementById("gallery");
const countdownEl = document.getElementById("countdown");
const dateInput = document.getElementById("customDateText");
const filterSelect = document.getElementById("filter");

let shots = [];

// Initialize Label
const now = new Date();
dateInput.value = `Monchii• ${now.toLocaleDateString()}`;

function setMode(mode) {
document.getElementById("mainBody").setAttribute("data-bs-theme", mode);
}

function startApp() {
const temp = document.getElementById("templateChoice").value;
const colors = { white: "#ffffff", pink: "#ffeef4", dark: "#1a1a1a" };
gallery.style.backgroundColor = colors[temp];

landingPage.classList.add("d-none");
mainApp.classList.remove("d-none");

navigator.mediaDevices
.getUserMedia({ video: true })
.then((stream) => {
video.srcObject = stream;
})
.catch((err) => alert("Camera permission is required."));
}

snapBtn.addEventListener("click", async () => {
  const numShots = parseInt(document.getElementById("shotCount").value);
  shots = [];
  gallery.innerHTML = "";
  snapBtn.disabled = true;
  downloadBtn.classList.add("d-none");

  for (let i = 0; i < numShots; i++) {
    await runCountdown(3);
    const data = capture();
    shots.push(data);
    const img = document.createElement("img");
    img.src = data;
    gallery.appendChild(img);
  }

  snapBtn.disabled = false;
  renderFinal();
});

function runCountdown(s) {
  return new Promise((resolve) => {
    let c = s;
    countdownEl.innerText = c;
    let t = setInterval(() => {
      if (--c <= 0) {
        clearInterval(t);
        countdownEl.innerText = "📸";
        setTimeout(() => (countdownEl.innerText = ""), 400);
        resolve();
      } else {
        countdownEl.innerText = c;
      }
    }, 1000);
  });
}

function capture() {
  canvas.width = 600;
  canvas.height = 450;
  const ctx = canvas.getContext("2d");
  ctx.filter = filterSelect.value;
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, 600, 450);
  return canvas.toDataURL("image/png");
}

function renderFinal() {
  const temp = document.getElementById("templateChoice").value;
  const finalCanvas = document.createElement("canvas");
  const ctx = finalCanvas.getContext("2d");
  const w = 400,
    h = 300,
    p = 25;
  const n = shots.length;

  finalCanvas.width = w + p * 2;
  finalCanvas.height = h * n + p * (n + 1) + 70;

  const bgColors = { white: "#ffffff", pink: "#ffeef4", dark: "#1a1a1a" };
  const textColors = { white: "#666", pink: "#d63384", dark: "#ffffff" };

  ctx.fillStyle = bgColors[temp];
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  let loaded = 0;
  shots.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, p, p + i * (h + p), w, h);
      if (++loaded === n) {
        ctx.fillStyle = textColors[temp];
        ctx.font = "bold 20px Inter, Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          dateInput.value,
          finalCanvas.width / 2,
          finalCanvas.height - 30,
        );

        downloadBtn.classList.remove("d-none");
        downloadBtn.onclick = () => {
          const a = document.createElement("a");
          a.download = `Trenred-${Date.now()}.png`;
          a.href = finalCanvas.toDataURL();
          a.click();
        };
      }
    };
  });
}
