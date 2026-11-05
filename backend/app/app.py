import json
import os
from io import BytesIO

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image


app = FastAPI(title="Derma.co | Local Skin Classifier API", version="3.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "skin_classifier.keras")
LABELS_PATH = os.path.join(BASE_DIR, "class_names.json")
IMAGE_SIZE = (224, 224)

classifier_model = None
class_names = []


@app.on_event("startup")
def load_models():
    global classifier_model, class_names

    if not os.path.exists(MODEL_PATH):
        print(f"Warning: trained model nahi mila: {MODEL_PATH}")
        return

    try:
        classifier_model = tf.keras.models.load_model(MODEL_PATH)
        print(f"Local classifier load ho gaya: {MODEL_PATH}")
    except Exception as exc:
        print(f"Model load error: {exc}")
        return

    if os.path.exists(LABELS_PATH):
        with open(LABELS_PATH, encoding="utf-8") as labels_file:
            class_names = json.load(labels_file)
    print(f"Labels load ho gaye: {len(class_names)} classes")


def prepare_image(image: Image.Image) -> np.ndarray:
    image = image.convert("RGB").resize(IMAGE_SIZE)
    return np.asarray(image, dtype=np.float32)[np.newaxis, ...]


@app.get("/")
def home():
    return {
        "status": "online",
        "message": "Local dataset-trained skin classifier is running.",
        "classifier_loaded": classifier_model is not None,
        "class_count": len(class_names),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if classifier_model is None:
        raise HTTPException(
            status_code=500,
            detail="Local model load nahi hua. Pehle extract_embeddings.py run karke train karein.",
        )

    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image file mili hai.")

        image = Image.open(BytesIO(image_bytes))
        probabilities = classifier_model.predict(prepare_image(image), verbose=0)[0]
        predicted_class_idx = int(np.argmax(probabilities))
        predicted_label = (
            class_names[predicted_class_idx]
            if predicted_class_idx < len(class_names)
            else str(predicted_class_idx)
        )

        return {
            "status": "success",
            "condition": predicted_label,
            "class_index": predicted_class_idx,
            "confidence_percentage": round(float(probabilities[predicted_class_idx] * 100), 2),
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {exc}")
