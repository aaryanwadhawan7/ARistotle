from ultralytics import YOLO
import numpy as np

model = YOLO("yolov8n.pt")

def detect_objects(frame):
    results = model(frame, verbose=False)
    detections = []

    for result in results:
        for box in result.boxes:
            label = model.names[int(box.cls)]
            confidence = float(box.conf)
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            if confidence > 0.45:
                detections.append({
                    "label": label,
                    "box": (x1, y1, x2, y2),
                    "confidence": confidence
                })

    return detections