from ultralytics import YOLO
import numpy as np
import cv2

model = None

# Objects to ignore — they appear constantly and add no value
IGNORE = {"person"}

def detect_objects(frame):
    global model
    
    h, w = frame.shape[:2]
    if w < 800:
        frame = cv2.resize(frame, (800, int(h * 800 / w)))

    # Run detection twice — normal + horizontally flipped
    # Merge results for better coverage
    results_normal   = model(frame, verbose=False, conf=0.28)[0]
    results_flipped  = model(cv2.flip(frame, 1), verbose=False, conf=0.28)[0]

    seen   = {}  

    for result in [results_normal, results_flipped]:
        for box in result.boxes:
            label      = model.names[int(box.cls)]
            confidence = float(box.conf)
            x1,y1,x2,y2 = map(int, box.xyxy[0])
            area       = (x2 - x1) * (y2 - y1)

            if label in IGNORE:
                continue

            # Keep only the highest confidence per label
            if label not in seen or confidence > seen[label]["confidence"]:
                seen[label] = {
                    "label"      : label,
                    "confidence" : confidence,
                    "area"       : area,
                    "box"        : (x1, y1, x2, y2)
                }

    # If nothing found after ignoring persons, include persons
    if not seen:
        for result in [results_normal]:
            for box in result.boxes:
                label      = model.names[int(box.cls)]
                confidence = float(box.conf)
                x1,y1,x2,y2 = map(int, box.xyxy[0])
                area       = (x2-x1)*(y2-y1)
                if label not in seen or confidence > seen[label]["confidence"]:
                    seen[label] = {
                        "label"      : label,
                        "confidence" : confidence,
                        "area"       : area,
                        "box"        : (x1,y1,x2,y2)
                    }

    # Sort by area — biggest object wins
    detections = sorted(seen.values(), key=lambda x: x["area"], reverse=True)
    return detections[:2]