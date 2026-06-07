# ARistotle — AI-Powered AR Object Explainer

**Visionary Hackathon 2.0 | Open Innovation Track**

> Point your camera at any real-world object.  
> ARistotle identifies it using AI and overlays an explanation — instantly, in your browser.

---

## What It Does

ARistotle turns your webcam into an intelligent AR lens. Every 3.5 seconds it:

1. Captures a frame from your live camera feed
2. Detects objects using YOLOv8 (runs locally — no cloud, no lag)
3. Generates a 2-sentence explanation using LLaMA 3 via Groq API
4. Displays the result as a floating AR card over the real world

No app download. No setup for the end user. Just open a URL.

---

## Live Demo

| | Link |
|---|---|
| **Frontend** | https://aristotle-ar.netlify.app |
| **Backend API** | https://aristotle-backend.onrender.com |
| **GitHub** | https://github.com/aaryanwadhawan7/ARistotle-ar |

---

## 🏗️ Architecture

```
Browser (AR.js + A-Frame)
        │
        │  JPEG frame → base64 → POST /analyze (every 3.5s)
        ▼
FastAPI Backend (Python)
        │
        ├── YOLOv8s  ──→  object labels + confidence scores
        └── LangChain ──→  LLaMA 3 (Groq) ──→  explanation text
        │
        └── JSON response: [{label, confidence, explanation}]
        │
        ▼
Browser renders floating cards over live camera feed
```

---

## 🛠️ Tech Stack

| Layer | Tool | Reason |
|---|---|---|
| AR Layer | AR.js + A-Frame | Browser-based AR, zero installation |
| Object Detection | YOLOv8s (Ultralytics) | Fast, accurate, 80 classes, runs locally |
| AI Explanations | LLaMA 3 via Groq | Sub-500ms inference, free tier |
| LLM Framework | LangChain | Clean LLM abstraction + caching |
| Backend | FastAPI + Python | Async, high performance API |
| Frontend Deploy | Netlify | Instant deploy, free CDN |
| Backend Deploy | Render | Free Python hosting |

---

## Key Design Decisions

**Why AR.js over ARCore/ARKit?**  
AR.js runs in any browser — judges can open it on any device, no install needed. Maximum accessibility.

**Why run YOLOv8 locally on the server?**  
Zero per-request cost, no external API latency for detection. Only the LLM explanation calls an external service.

**Why cache LLM responses?**  
Same object shouldn't trigger a new API call every 3.5s. In-memory cache reduces Groq calls by ~90% in a demo session, keeping it fast and within free tier limits.

**Why base64 JPEG at 65% quality?**  
Smallest payload that still gives YOLO enough detail. Reduces bandwidth and backend processing time.

---

## Real-World Use Cases

| Sector | Example |
|---|---|
| **Education** | Point at lab equipment → instant explanation for students |
| **Healthcare** | Point at medical devices → safe usage information |
| **Retail** | Point at products → specifications and alternatives |
| **Accessibility** | Point at unfamiliar objects → instant context for users with cognitive disabilities |

---

## Run It Locally

### Prerequisites
- Python 3.9+
- Webcam
- Free Groq API key from [console.groq.com](https://console.groq.com)

### Setup

```bash
# Clone
git clone https://github.com/aaryanwadhawan7/ARistotle-ar.git
cd ARistotle-ar

# Install backend dependencies
pip install fastapi uvicorn ultralytics langchain-groq langchain python-dotenv pillow python-multipart numpy

# Add API key
echo "GROQ_API_KEY=your_key_here" > .env

# Terminal 1 — start backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 — serve frontend
cd frontend
python -m http.server 3000
```

Open `http://localhost:3000` → allow camera → point at any object.

---

## 📁 Project Structure

```
ARistotle-ar/
├── backend/
│   ├── main.py          # FastAPI server + /analyze endpoint
│   ├── detector.py      # YOLOv8 object detection logic
│   ├── explainer.py     # LangChain + Groq LLM integration
│   └── requirements.txt
├── frontend/
│   └── index.html       # AR.js scene + UI + API calls
├── .env                 # API keys (not committed)
├── .gitignore
└── README.md
```

---

## Scoring Matrix Alignment

| Criteria | How ARistotle addresses it |
|---|---|
| **Novelty (25)** | First browser-based AR tool combining real-time YOLO detection with LLM explanations — no equivalent exists in the AR.js ecosystem |
| **Usability (25)** | Opens in any browser, zero install, works on mobile and desktop, smooth 3.5s refresh cycle |
| **Innovation (25)** | Solves real problems across education, healthcare, retail, and accessibility without changing any code |
| **Documentation (25)** | Full README, architecture diagram, setup guide, design decision rationale |

---

## Built By

**Aaryan Wadhawan**  
B.Tech Computer Science (Cyber Security), VIT Bhopal  
[LinkedIn](https://linkedin.com/in/aaryan-wadhawan1410) · [GitHub](https://github.com/aaryanwadhawan7)

---

*Built for Visionary Hackathon 2.0 — June 2026*