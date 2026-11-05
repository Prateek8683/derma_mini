#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if [[ ! -f venv-gpu/bin/activate ]]; then
  echo "Missing venv-gpu. Run ./setup_wsl_gpu.sh first."
  exit 1
fi

source venv-gpu/bin/activate

GPU_COUNT="$(python -c 'import tensorflow as tf; print(len(tf.config.list_physical_devices("GPU")))' )"
if [[ "$GPU_COUNT" -lt 1 ]]; then
  echo "No TensorFlow GPU detected. Stop: install the WSL CUDA environment first."
  exit 1
fi

echo "TensorFlow GPU devices: $GPU_COUNT"
python extract_embeddings.py

echo "Training complete. Model saved as app/skin_classifier.keras"