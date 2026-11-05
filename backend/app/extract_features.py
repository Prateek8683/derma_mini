"""Local image preprocessing helper used by the dataset-trained classifier."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image


IMAGE_SIZE = (224, 224)


def prepare_image(image_path: str | Path) -> np.ndarray:
    """Load a local image in the same format used by the Keras classifier."""
    with Image.open(image_path) as image:
        image = image.convert("RGB").resize(IMAGE_SIZE)
        return np.asarray(image, dtype=np.float32)[np.newaxis, ...]
