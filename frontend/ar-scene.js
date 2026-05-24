async function captureAndAnalyze() {
  // Get the video element AR.js is using
  const video = document.querySelector('video');
  
  // Draw current frame onto a canvas
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  
  // Convert frame to base64 image
  const imageData = canvas.toDataURL('image/jpeg', 0.7);
  
  // Send to Python backend
  const response = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData })
  });
  
  const result = await response.json();
  // result = { label: "laptop", explanation: "A laptop is..." }
  
  // Update the AR text overlay
  const arText = document.querySelector('#ar-explanation');
  arText.setAttribute('value', `${result.label}\n${result.explanation}`);
}

// Analyze every 3 seconds
setInterval(captureAndAnalyze, 3000);