"""Train and predict with the local dataset-trained Keras classifier.

Run ``backend/extract_embeddings.py`` first. Despite the historical filename,
the training script now trains directly on images and does not create external
embeddings.
"""

import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "skin_classifier.keras"
LABELS_PATH = BASE_DIR / "class_names.json"
IMAGE_SIZE = (224, 224)


def predict_skin_condition(image_path: str | Path) -> tuple[str, float]:
    model = tf.keras.models.load_model(MODEL_PATH)
    class_names = json.loads(LABELS_PATH.read_text(encoding="utf-8"))
    with Image.open(image_path) as image:
        image = image.convert("RGB").resize(IMAGE_SIZE)
        batch = np.asarray(image, dtype=np.float32)[np.newaxis, ...]
    probabilities = model.predict(batch, verbose=0)[0]
    index = int(np.argmax(probabilities))
    return class_names[index], float(probabilities[index] * 100)


if __name__ == "__main__":
    print("Train ke liye backend/extract_embeddings.py run karein.")
