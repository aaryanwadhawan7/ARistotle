const BACKEND = 'http://127.0.0.1:8000';

let busy = false;

const statusEl = document.getElementById('status-chip');
const cardsEl  = document.getElementById('cards');
const countEl  = document.getElementById('panel-count');

// Returns styling based on how confident the AI is
function getColors(confidence) {
  if (confidence >= 0.78) {
    return {
      stripe : '#4ade80',
      badge  : 'rgba(74,222,128,0.1)',
      border : 'rgba(74,222,128,0.2)',
      text   : '#4ade80',
      bar    : '#4ade80'
    };
  }
  if (confidence >= 0.55) {
    return {
      stripe : '#fbbf24',
      badge  : 'rgba(251,191,36,0.1)',
      border : 'rgba(251,191,36,0.2)',
      text   : '#fbbf24',
      bar    : '#fbbf24'
    };
  }
  return {
    stripe : '#f87171',
    badge  : 'rgba(248,113,113,0.1)',
    border : 'rgba(248,113,113,0.2)',
    text   : '#f87171',
    bar    : '#f87171'
  };
}

function setStatus(message, color) {
  statusEl.textContent = message;
  statusEl.style.color = color || 'rgba(255,255,255,0.4)';
}

function buildCard(item) {
  const pct    = Math.round(item.confidence * 100);
  const colors = getColors(item.confidence);
  const name   = item.label.charAt(0).toUpperCase() + item.label.slice(1);

  return `
    <div class="result-card">
      <div class="card-stripe" style="background:${colors.stripe}"></div>
      <div class="card-body">
        <div class="card-top">
          <div class="card-name">${name}</div>
          <div class="card-conf-badge"
               style="background:${colors.badge};
                      border:1px solid ${colors.border};
                      color:${colors.text}">
            ${pct}%
          </div>
        </div>
        <div class="card-text">${item.explanation}</div>
        <div class="bar-row">
          <div class="bar-track">
            <div class="bar-fill" style="width:${pct}%;background:${colors.bar}"></div>
          </div>
          <span class="bar-pct">${pct}%</span>
        </div>
      </div>
    </div>`;
}

function renderCards(items) {
  if (!items || items.length === 0) {
    countEl.textContent = '';
    cardsEl.innerHTML = `
      <div class="result-card">
        <div class="card-stripe" style="background:#f87171"></div>
        <div class="card-body">
          <div class="card-top">
            <div class="card-name" style="color:rgba(255,255,255,0.6)">Nothing detected</div>
          </div>
          <div class="card-text">
            Move the camera closer to an object, or improve lighting and try again.
          </div>
          <div class="bar-row">
            <div class="bar-track">
              <div class="bar-fill" style="width:0%;background:#f87171"></div>
            </div>
          </div>
        </div>
      </div>`;
    return;
  }

  countEl.textContent = `${items.length} found`;
  cardsEl.innerHTML = items.map(buildCard).join('');
}

function captureFrame() {
  const video = document.querySelector('video');

  // video.readyState 2 = HAVE_CURRENT_DATA — safe to draw
  if (!video || video.readyState < 2) return null;

  const canvas = document.createElement('canvas');
  canvas.width  = 640;
  canvas.height = 480;
  canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);

  return canvas.toDataURL('image/jpeg', 0.65);
}

async function analyze() {
  if (busy) return;
  busy = true;

  const frame = captureFrame();
  if (!frame) {
    setStatus('Waiting for camera...');
    busy = false;
    return;
  }

  setStatus('Analyzing...', 'rgba(251,191,36,0.75)');

  try {
    const response = await fetch(`${BACKEND}/analyze`, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ image: frame })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data  = await response.json();
    const items = Array.isArray(data) ? data : [data];

    renderCards(items);

    const count = items.length;
    if (count > 0) {
      setStatus(
        `${count} object${count > 1 ? 's' : ''} identified`,
        'rgba(74,222,128,0.8)'
      );
    } else {
      setStatus('Nothing found — keep scanning', 'rgba(255,255,255,0.3)');
    }

  } catch (error) {
    // This block runs when fetch fails entirely (backend truly offline)
    console.error('Backend error:', error);
    setStatus('Backend offline — check terminal', 'rgba(248,113,113,0.8)');
    cardsEl.innerHTML = `
      <div class="result-card">
        <div class="card-stripe" style="background:#f87171"></div>
        <div class="card-body">
          <div class="card-top">
            <div class="card-name" style="color:#f87171">Cannot reach backend</div>
          </div>
          <div class="card-text">
            Make sure this command is running in your backend terminal:<br>
            <code style="color:#4ade80;font-size:11px;font-family:monospace">
              uvicorn main:app --reload --port 8000
            </code>
          </div>
          <div class="bar-row">
            <div class="bar-track">
              <div class="bar-fill" style="width:100%;background:#f87171"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  busy = false;
}

// Wait 2.5s for AR.js to initialize the camera before first analysis
setTimeout(() => {
  analyze();
  setInterval(analyze, 3500); // then repeat every 3.5 seconds
}, 2500);