from ultralytics import YOLO
import numpy as np

model = YOLO("yolov8s.pt")

def detect_objects(frame):
    results = model(frame, verbose=False)
    detections = []

    for result in results:
        for box in result.boxes:
            label      = model.names[int(box.cls)]
            confidence = float(box.conf)
            x1,y1,x2,y2 = map(int, box.xyxy[0])

            # Lower threshold — catch more objects
            if confidence > 0.30:
                area = (x2-x1)*(y2-y1)   # bigger object = higher priority
                detections.append({
                    "label"     : label,
                    "box"       : (x1,y1,x2,y2),
                    "confidence": confidence,
                    "area"      : area
                })

    # Sort by area (biggest first), then take top 2
    detections.sort(key=lambda x: x["area"], reverse=True)
    return detections[:2]