#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
fi

uv python install 3.13

uv venv --python 3.13 venv-gpu
source venv-gpu/bin/activate
uv pip install --upgrade pip
uv pip install "tensorflow[and-cuda]" numpy pillow fastapi python-multipart uvicorn

python -c 'import tensorflow as tf; devices = tf.config.list_physical_devices("GPU"); print("TensorFlow GPUs:", devices); raise SystemExit(0 if devices else 1)'
echo "WSL GPU environment is ready. Run ./train_gpu.sh next."
