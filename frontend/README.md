# Derma.co — Derma-Scan Frontend & FastAPI Integration Guide

Welcome to **Derma.co**, a complete, multi-page, vanilla HTML5/CSS3/JS frontend for the **Derma-Scan** AI-assisted skin screening web application.

---

## 1. Running the FastAPI Backend Locally

Inside your `backend/app/` directory (where `app.py`, `skin_classifier.keras`, and `class_names.json` live), run:

```bash
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```
*(If your main FastAPI file is named `main.py`, replace `app:app` with `main:app`.)*

Verify the backend is alive by visiting `http://127.0.0.1:8000/` or `http://127.0.0.1:8000/docs`.

---

## 2. Serving the Frontend Locally

Open a second terminal inside `derma-scan/frontend/` and start a local static server on port `5500`:

```bash
cd derma-scan/frontend
python -m http.server 5500
```

Then open **`http://127.0.0.1:5500/index.html`** (or `http://localhost:5500/index.html`) in your browser.

---

## 3. FastAPI CORS Configuration (`localhost` vs `127.0.0.1`)

Browsers treat `http://127.0.0.1:5500` and `http://localhost:5500` as **two completely different origins**. Ensure your FastAPI `app.py` includes `CORSMiddleware` listing both origins (or `["*"]` during local development without credentials):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

---

## 4. Production Deployment Notes

- **Local API:** The frontend is configured to use `http://127.0.0.1:8000`, matching `uvicorn app:app --reload --host 127.0.0.1 --port 8000`. Update `API_BASE_URL` in `js/data.js` if the backend URL changes.
- **No Frontend Secrets:** Never place private API keys or database credentials inside any frontend `.js` or `.html` file.

---

## 5. Troubleshooting Common Issues

| Issue / Symptom | Cause & Fix |
| :--- | :--- |
| **CORS policy blocked request** | Ensure both `http://127.0.0.1:5500` and `http://localhost:5500` are in FastAPI's `allow_origins`. |
| **`Failed to fetch` / Network error** | Backend is not running on port `8000`, or `API_BASE_URL` points to the wrong port. |
| **`422 Unprocessable Entity`** | FastAPI expects the multipart field name to be **`file`**. `js/scan.js` uses `formData.append("file", selectedFile)` and leaves `Content-Type` unset so the browser generates the boundary automatically. |
| **`413 Payload Too Large`** | The image exceeds the server or frontend size limit (default 10 MB in `js/data.js`). |
| **Live Camera not starting** | `navigator.mediaDevices.getUserMedia` requires a secure context (`https://`, `http://localhost`, or `http://127.0.0.1`). Opening via `file://` or an insecure LAN IP blocks camera access. |
| **Changes to JS/CSS not appearing** | Hard-refresh your browser (`Ctrl + Shift + R` on Windows) to bypass cached static assets. |
