"""Train the skin-condition classifier on the consolidated local dataset.

No pretrained or downloaded model is used: the MobileNetV2 backbone is created
with ``weights=None`` and learns only from the folders in DATASET_DIR.

Improvements over the legacy trainer (extract_embeddings.py):
  - class_weight balancing for the 13-class imbalance (8.4k vs 2k images)
  - CSV training log (training_log.csv)
  - final per-class precision/recall + confusion matrix report

Outputs (same paths the API already reads):
  app/skin_classifier.keras + app/class_names.json
"""

from __future__ import annotations

import json
import os
from pathlib import Path

import numpy as np
import tensorflow as tf


# ================= CONFIGURATION =================
PROJECT_DIR = Path(__file__).resolve().parent
DATASET_DIR = Path(
    os.environ.get("DERMA_DATASET_DIR", str(PROJECT_DIR / "app" / "dataset"))
)
OUTPUT_DIR = Path(os.environ.get("DERMA_OUTPUT_DIR", str(PROJECT_DIR / "app")))
IMAGE_SIZE = (224, 224)
BATCH_SIZE = int(os.environ.get("DERMA_BATCH_SIZE", "32"))
EPOCHS = int(os.environ.get("DERMA_EPOCHS", "20"))
VALIDATION_SPLIT = 0.2
SEED = 42
# =================================================


def configure_accelerator() -> None:
    """Use an available NVIDIA GPU safely and speed up compatible GPUs."""
    gpus = tf.config.list_physical_devices("GPU")
    if not gpus:
        print("WARNING: TensorFlow GPU nahi dekh pa raha; CPU par training hogi.")
        return

    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)

    # RTX GPUs accelerate float16 matrix operations. Keep the output layer in
    # float32 below so loss/probability calculations remain numerically stable.
    tf.keras.mixed_precision.set_global_policy("mixed_float16")
    print(f"GPU training active: {len(gpus)} GPU(s) found: {gpus}")
    print("Mixed precision active (mixed_float16).")


def find_classes(dataset_dir: Path) -> list[str]:
    if not dataset_dir.is_dir():
        raise FileNotFoundError(f"Dataset folder nahi mila: {dataset_dir}")

    classes = sorted(
        folder.name
        for folder in dataset_dir.iterdir()
        if folder.is_dir() and not folder.name.startswith(".")
    )
    if len(classes) < 2:
        raise ValueError(
            "Training ke liye dataset mein kam se kam 2 class folders chahiye."
        )
    return classes


def compute_class_weights(
    dataset_dir: Path, class_names: list[str]
) -> tuple[dict[int, float], dict[str, int]]:
    """Inverse-frequency weights so rare classes are not ignored by the loss."""
    counts = {
        name: sum(1 for f in (dataset_dir / name).iterdir() if f.is_file())
        for name in class_names
    }
    total = sum(counts.values())
    n_classes = len(class_names)
    weights = {
        idx: total / (n_classes * counts[name]) for idx, name in enumerate(class_names)
    }
    return weights, counts


def build_model(num_classes: int) -> tf.keras.Model:
    # weights=None is deliberate: no external pretrained weights are used.
    inputs = tf.keras.Input(shape=(*IMAGE_SIZE, 3), name="image")
    x = tf.keras.layers.RandomFlip("horizontal")(inputs)
    x = tf.keras.layers.RandomRotation(0.08)(x)
    x = tf.keras.layers.RandomZoom(0.1)(x)
    x = tf.keras.layers.Rescaling(1.0 / 127.5, offset=-1)(x)

    backbone = tf.keras.applications.MobileNetV2(
        include_top=False,
        weights=None,
        input_shape=(*IMAGE_SIZE, 3),
    )
    x = backbone(x, training=True)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(
        num_classes, activation="softmax", dtype="float32", name="class"
    )(x)
    return tf.keras.Model(inputs, outputs, name="local_skin_classifier")


def report_per_class(
    y_true: np.ndarray, y_pred: np.ndarray, class_names: list[str]
) -> None:
    n = len(class_names)
    confusion = np.zeros((n, n), dtype=int)
    for t, p in zip(y_true, y_pred):
        confusion[t, p] += 1

    short = [name[:14] for name in class_names]
    width = max(14, max(len(s) for s in short))

    print(f"\n{'class':<{width}}  {'n':>6}  {'prec':>6}  {'recall':>7}")
    for i, name in enumerate(class_names):
        support = confusion[i].sum()
        precision = (
            confusion[i, i] / confusion[:, i].sum() if confusion[:, i].sum() else 0.0
        )
        recall = confusion[i, i] / support if support else 0.0
        print(
            f"{short[i]:<{width}}  {support:>6}  {precision:>6.2f}  {recall:>7.2f}"
        )

    print("\nConfusion matrix (rows = sach ka label, cols = prediction):")
    header = " " * (width + 2) + " ".join(f"{i % 10}" for i in range(n))
    print(header)
    for i in range(n):
        row = " ".join(f"{confusion[i, j]:>2}" for j in range(n))
        print(f"{short[i]:<{width}}  {row}")


def main() -> None:
    tf.random.set_seed(SEED)
    configure_accelerator()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    class_names = find_classes(DATASET_DIR)
    class_weights, counts = compute_class_weights(DATASET_DIR, class_names)

    print(f"Dataset: {DATASET_DIR}")
    print(f"Classes ({len(class_names)}): {class_names}")
    print("External/pretrained model use nahi ho raha; model scratch se train hoga.")
    print("Class weights (imbalance balance ke liye):")
    for idx, name in enumerate(class_names):
        print(
            f"  {idx:>2}  {name:<24} {counts[name]:>6} images  weight={class_weights[idx]:.2f}"
        )

    train_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_DIR,
        class_names=class_names,
        validation_split=VALIDATION_SPLIT,
        subset="training",
        seed=SEED,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="int",
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        DATASET_DIR,
        class_names=class_names,
        validation_split=VALIDATION_SPLIT,
        subset="validation",
        seed=SEED,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="int",
    )

    autotune = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(autotune)
    val_ds = val_ds.prefetch(autotune)

    model = build_model(len(class_names))
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=4, restore_best_weights=True
        ),
        tf.keras.callbacks.ModelCheckpoint(
            OUTPUT_DIR / "skin_classifier.keras",
            monitor="val_accuracy",
            save_best_only=True,
        ),
        tf.keras.callbacks.CSVLogger(OUTPUT_DIR / "training_log.csv", append=False),
    ]
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks,
        class_weight=class_weights,
        shuffle=False,
    )

    (OUTPUT_DIR / "class_names.json").write_text(
        json.dumps(class_names, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"\nModel saved: {OUTPUT_DIR / 'skin_classifier.keras'}")
    print(f"Class labels saved: {OUTPUT_DIR / 'class_names.json'}")
    print(f"Training log saved: {OUTPUT_DIR / 'training_log.csv'}")

    print("\nFinal validation evaluation...")
    y_true = np.concatenate([y.numpy().reshape(-1) for _, y in val_ds])
    probs = model.predict(val_ds, verbose=0)
    y_pred = probs.argmax(axis=1)
    overall = float((y_true == y_pred).mean())
    print(f"Overall validation accuracy: {overall * 100:.2f}%")
    report_per_class(y_true, y_pred, class_names)


if __name__ == "__main__":
    main()
