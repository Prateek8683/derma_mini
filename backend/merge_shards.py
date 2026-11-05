"""Deprecated compatibility entry point for the retired embedding workflow."""

raise SystemExit(
    "Embedding shards are no longer used. Run `python extract_embeddings.py` "
    "to train directly on backend/app/dataset."
)
