const framesContainer = document.getElementById('framesContainer');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const textInput = document.getElementById('textInput');

let selectedFrame = null;
let frameImage = new Image();
let frameX = 0;
let frameY = 0;
let frameWidth = 200;
let frameHeight = 200;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let offsetX = 0;
let offsetY = 0;

// List of frame image filenames (user should add PNGs in assets/frames/)
const frameFiles = [
  'frame1.png',
  'frame2.png',
  'frame3.png'
];

// Load frame thumbnails in the selection container
function loadFrameThumbnails() {
  frameFiles.forEach(file => {
    const img = document.createElement('img');
    img.src = 'assets/frames/' + file;
    img.alt = file;
    img.className = 'cursor-pointer border border-gray-300 rounded hover:border-blue-500 transition';
    img.style.width = '100%';
    img.addEventListener('click', () => {
      selectFrame(file);
    });
    framesContainer.appendChild(img);
  });
}

// Select a frame and load it
function selectFrame(filename) {
  selectedFrame = filename;
  frameImage.src = 'assets/frames/' + filename;
  frameImage.onload = () => {
    // Reset frame position and size
    frameWidth = frameImage.width;
    frameHeight = frameImage.height;
    frameX = (canvas.width - frameWidth) / 2;
    frameY = (canvas.height - frameHeight) / 2;
    drawOverlay();
  };
}

// Draw the photo, frame overlay, and text on canvas
function drawOverlay() {
  if (!canvas || !context) return;
  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Draw base image (from camera.js)
  if (window.currentImage) {
    context.putImageData(window.currentImage, 0, 0);
  }
  // Draw frame overlay
  if (frameImage && selectedFrame) {
    context.drawImage(frameImage, frameX, frameY, frameWidth, frameHeight);
  }
  // Draw text overlay
  const text = textInput.value;
  if (text) {
    context.font = '30px Arial';
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.textAlign = 'center';
    const x = canvas.width / 2;
    const y = canvas.height - 40;
    context.strokeText(text, x, y);
    context.fillText(text, x, y);
  }
}

// Mouse event handlers for dragging frame
canvas.addEventListener('mousedown', (e) => {
  if (!selectedFrame) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  if (
    mouseX >= frameX &&
    mouseX <= frameX + frameWidth &&
    mouseY >= frameY &&
    mouseY <= frameY + frameHeight
  ) {
    isDragging = true;
    dragStartX = mouseX;
    dragStartY = mouseY;
    offsetX = mouseX - frameX;
    offsetY = mouseY - frameY;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  frameX = mouseX - offsetX;
  frameY = mouseY - offsetY;
  drawOverlay();
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

// Initialize frame thumbnails on page load
loadFrameThumbnails();

// Expose drawOverlay to camera.js
window.drawOverlay = drawOverlay;
