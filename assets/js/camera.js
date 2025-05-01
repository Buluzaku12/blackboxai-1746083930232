const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const uploadInput = document.getElementById('uploadInput');

const downloadBtn = document.getElementById('downloadBtn');
const textInput = document.getElementById('textInput');
const deleteBtn = document.createElement('button');
deleteBtn.id = 'deleteBtn';
deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Hapus Foto';
deleteBtn.className = 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ml-4';
deleteBtn.disabled = true;

const controlsDiv = captureBtn.parentElement;
controlsDiv.appendChild(deleteBtn);

let stream = null;
let context = canvas.getContext('2d');
let currentImage = null;

// Access webcam and stream to video element
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
  } catch (err) {
    alert('Tidak dapat mengakses kamera: ' + err.message);
  }
}

// Capture current frame from video to canvas
function capturePhoto() {
  if (!stream) return;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  currentImage = context.getImageData(0, 0, canvas.width, canvas.height);
  canvas.classList.remove('hidden');
  video.classList.add('hidden');
  downloadBtn.disabled = false;
  deleteBtn.disabled = false;
  drawOverlay();
}

// Load uploaded image to canvas
function loadUploadedPhoto(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
      currentImage = context.getImageData(0, 0, canvas.width, canvas.height);
      canvas.classList.remove('hidden');
      video.classList.add('hidden');
      downloadBtn.disabled = false;
      deleteBtn.disabled = false;
      drawOverlay();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// Download canvas image as PNG
function downloadPhoto() {
  const link = document.createElement('a');
  link.download = 'photobooth.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Delete photo and reset to video preview
function deletePhoto() {
  currentImage = null;
  canvas.classList.add('hidden');
  video.classList.remove('hidden');
  downloadBtn.disabled = true;
  deleteBtn.disabled = true;
  drawOverlay();
}

// Draw overlay and text on canvas (to be implemented in editor.js)
function drawOverlay() {
  // This function will be overwritten by editor.js
}

captureBtn.addEventListener('click', capturePhoto);
uploadInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    loadUploadedPhoto(e.target.files[0]);
  }
});
downloadBtn.addEventListener('click', downloadPhoto);
deleteBtn.addEventListener('click', deletePhoto);
textInput.addEventListener('input', () => {
  drawOverlay();
});

startCamera();

