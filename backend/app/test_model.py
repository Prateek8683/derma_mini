"""Verify that the locally trained classifier and labels can be loaded."""

import json
from pathlib import Path

import tensorflow as tf


BASE_DIR = Path(__file__).resolve().parent
model = tf.keras.models.load_model(BASE_DIR / "skin_classifier.keras")
labels = json.loads((BASE_DIR / "class_names.json").read_text(encoding="utf-8"))

if model.output_shape[-1] != len(labels):
    raise ValueError("Model output class count and class_names.json do not match.")

print(f"Local model verified: {len(labels)} classes")
