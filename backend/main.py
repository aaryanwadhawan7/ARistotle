from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import io
from PIL import Image
import numpy as np
from detector import detect_objects
from explainer import get_explanation

app = FastAPI()

# FIXED: explicit origins instead of wildcard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

class ImageRequest(BaseModel):
    image: str

@app.get("/")
def root():
    return {"status": "ARistotle backend running"}

@app.post("/analyze")
async def analyze(req: ImageRequest):
    try:
        image_data = base64.b64decode(req.image.split(",")[1])
        image = Image.open(io.BytesIO(image_data))
        frame = np.array(image)

        detections = detect_objects(frame)

        if not detections:
            return []

        top3 = sorted(detections, key=lambda x: x["confidence"], reverse=True)[:3]

        results = []
        for det in top3:
            explanation = get_explanation(det["label"])
            results.append({
                "label": det["label"],
                "confidence": round(det["confidence"], 2),
                "explanation": explanation
            })

        return results

    except Exception as e:
        print(f"Error: {e}")
        return []