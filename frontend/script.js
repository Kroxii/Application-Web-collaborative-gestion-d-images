const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const statusMsg = document.getElementById('upload-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];


  if (!file) {
    return showStatus('Veuillez sélectionner un fichier.', 'error');
  }

  
  if (file.size > 3 * 1024 * 1024) {
    return showStatus('Le fichier ne doit pas dépasser 3 Mo.', 'error');
  }

  
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  if (!allowedTypes.includes(file.type)) {
    return showStatus('Format de fichier non autorisé (PDF, PNG, JPG uniquement).', 'error');
  }

  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Erreur serveur');

    showStatus('Fichier uploadé avec succès !', 'success');
    form.reset();
  } catch (err) {
    console.error(err);
    showStatus('Échec de l\'upload. Veuillez réessayer.', 'error');
  }
});

function showStatus(message, type) {
  statusMsg.textContent = message;
  statusMsg.className = 'upload-status ' + type;
}





















//Section signature feat
const canvas = document.getElementById("signature-canvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mouseout", endDraw);


canvas.addEventListener("touchstart", startDrawTouch);
canvas.addEventListener("touchmove", drawTouch);
canvas.addEventListener("touchend", endDraw);

function startDraw(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
  if (!isDrawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function endDraw() {
  isDrawing = false;
}

function startDrawTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  isDrawing = true;
}

function drawTouch(e) {
  e.preventDefault();
  if (!isDrawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
}

document.getElementById("clear-btn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("save-btn").addEventListener("click", () => {
  const base64Signature = canvas.toDataURL("image/png");

  
  fetch("http://localhost:3000/api/upload-signature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      filename: "facture1.pdf", 
      signature: base64Signature
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Signature envoyée !");
    })
    .catch(err => {
      console.error("Erreur envoi signature :", err);
    });
}); 