# ARistotle — My Project Notes

### Architecture [BASIC OVERVIEW]
- AR.js + A-Frame [AR Layer]
- Backend [FastAPI]
- AR.js anchored the AI response as 3D text anchored to the object

## How The 3 Files Work Together
- index.html (Frontend) -> captures webcam frame every 3.5 seconds -> sends it as base64 image to Python backend
- main.py (Backend API) -> receives the image -> sends to detector.py → gets object names -> sends labels to explainer.py → gets AI text -> returns JSON response
- index.html receives JSON → updates the AR cards on screen

## Tech Stack Explained Simply
| Tool | What it does | Why I used it |
|---|---|---|
| AR.js | Makes browser camera show AR content | Official hackathon tool, no app install |
| A-Frame | HTML tags for 3D objects | Works with AR.js, easy syntax |
| YOLOv8 | Detects objects in images | Fast, accurate, free, runs locally |
| FastAPI | Python web server | Fast to build, auto-generates API docs |
| LangChain | Connects Python to AI models | Easy way to call LLaMA 3 |
| Groq API | Runs LLaMA 3 AI model | Free tier, extremely fast responses |
| base64 | Converts images to text | Only way to send image via JSON |

## What I Learned
- AR is just: webcam video + 3D canvas layered on top
- YOLO returns bounding boxes (x1,y1,x2,y2) and class labels
- base64 converts binary image bytes into a text string for API transfer
- CORS middleware is needed when frontend and backend run on different ports
- Caching API responses prevents repeated calls for same object
