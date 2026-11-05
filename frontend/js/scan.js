/* ==========================================================================
   Derma.co | Derma-Scan Engine (js/scan.js)
   Strictly adheres to the FastAPI `/predict` contract and safety guidelines.
   ========================================================================== */

const API_BASE_URL =
  (window.DERMA_CONFIG && window.DERMA_CONFIG.API_BASE_URL) ||
  "http://127.0.0.1:8000";
const MAX_FILE_SIZE_BYTES =
  (window.DERMA_CONFIG && window.DERMA_CONFIG.MAX_FILE_SIZE_BYTES) ||
  10 * 1024 * 1024; // 10 MB
const REQUEST_TIMEOUT_MS =
  (window.DERMA_CONFIG && window.DERMA_CONFIG.REQUEST_TIMEOUT_MS) ||
  60000; // 60s

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

(function () {
  let selectedFile = null;
  let currentObjectUrl = null;
  let mediaStream = null;
  let activeAbortController = null;
  let currentRequestId = 0;
  let isAnalyzing = false;

  // DOM Elements
  const dropzone = document.getElementById("scan-dropzone");
  const fileInput = document.getElementById("scan-file-input");
  const mobileCameraInput = document.getElementById("scan-mobile-camera-input");
  const btnBrowseFile = document.getElementById("btn-browse-file");
  const btnMobileCapture = document.getElementById("btn-mobile-capture");

  // Live Camera Elements
  const btnStartCamera = document.getElementById("btn-start-camera");
  const btnCapturePhoto = document.getElementById("btn-capture-photo");
  const btnStopCamera = document.getElementById("btn-stop-camera");
  const cameraContainer = document.getElementById("camera-live-container");
  const cameraVideo = document.getElementById("camera-video");
  const cameraCanvas = document.getElementById("camera-capture-canvas");

  // Preview Elements
  const previewContainer = document.getElementById("image-preview-container");
  const previewMediaWrap = document.getElementById("preview-media-wrap");
  const previewImage = document.getElementById("scan-preview-image");
  const fileNameEl = document.getElementById("preview-file-name");
  const fileSizeEl = document.getElementById("preview-file-size");
  const btnRemoveImage = document.getElementById("btn-remove-image");

  // Consent & Submit
  const consentCheckbox = document.getElementById("scan-consent-checkbox");
  const btnAnalyze = document.getElementById("btn-analyze-image");

  // Loading & Error
  const loadingPanel = document.getElementById("scan-loading-panel");
  const errorBox = document.getElementById("scan-error-box");
  const errorText = document.getElementById("scan-error-text");
  const btnRetry = document.getElementById("btn-retry-scan");

  // Results Panel
  const resultPanel = document.getElementById("scan-result-panel");
  const resultLabelEl = document.getElementById("result-condition-label");
  const resultConfidenceText = document.getElementById("result-confidence-text");
  const resultConfidenceFill = document.getElementById("result-confidence-fill");
  const resultPreviewImg = document.getElementById("result-preview-image");
  const resultGuideLink = document.getElementById("result-condition-guide-link");
  const btnResetScan = document.getElementById("btn-reset-scan");

  /* --------------------------------------------------------------------------
     Utility Helpers
     -------------------------------------------------------------------------- */
  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }

  function revokeCurrentUrl() {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
  }

  function updateAnalyzeButtonState() {
    if (!btnAnalyze) return;
    const hasValidFile = Boolean(selectedFile);
    const hasConsent = Boolean(consentCheckbox && consentCheckbox.checked);
    btnAnalyze.disabled = !hasValidFile || !hasConsent || isAnalyzing;
  }

  function clearError() {
    if (!errorBox || !errorText) return;
    errorBox.classList.add("hidden");
    errorText.textContent = "";
    if (btnRetry) btnRetry.classList.add("hidden");
  }

  function showError(message, allowRetry = false) {
    if (!errorBox || !errorText) return;
    errorText.textContent = message;
    errorBox.classList.remove("hidden");
    if (btnRetry) {
      if (allowRetry && selectedFile) {
        btnRetry.classList.remove("hidden");
      } else {
        btnRetry.classList.add("hidden");
      }
    }
  }

  /* --------------------------------------------------------------------------
     Camera Stream Handling (Only starts on explicit button click)
     -------------------------------------------------------------------------- */
  function stopCameraStream() {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
    if (cameraVideo) {
      cameraVideo.srcObject = null;
    }
    if (cameraContainer) {
      cameraContainer.classList.add("hidden");
    }
    if (btnStartCamera) {
      btnStartCamera.classList.remove("hidden");
    }
  }

  async function startCameraStream() {
    clearError();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showError(
        "Your browser does not support live camera access, or this page is not served over HTTPS/localhost. Please use the 'Upload Image' button instead."
      );
      return;
    }

    try {
      stopCameraStream();
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      if (cameraVideo) {
        cameraVideo.srcObject = mediaStream;
        await cameraVideo.play();
      }
      if (cameraContainer) {
        cameraContainer.classList.remove("hidden");
      }
      if (btnStartCamera) {
        btnStartCamera.classList.add("hidden");
      }
    } catch (err) {
      if (err && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        showError(
          "Camera permission was denied. Please allow camera access in your browser settings or upload an image file directly."
        );
      } else if (err && err.name === "NotFoundError") {
        showError("No camera device was detected. Please upload an image file instead.");
      } else {
        showError("Unable to start the camera. Please use the file upload option.");
      }
    }
  }

  function capturePhotoFromStream() {
    if (!mediaStream || !cameraVideo || !cameraCanvas) return;

    const width = cameraVideo.videoWidth || 640;
    const height = cameraVideo.videoHeight || 480;
    cameraCanvas.width = width;
    cameraCanvas.height = height;

    const ctx = cameraCanvas.getContext("2d");
    ctx.drawImage(cameraVideo, 0, 0, width, height);

    cameraCanvas.toBlob(
      (blob) => {
        stopCameraStream();
        if (!blob) {
          showError("Could not capture a photo frame from the camera. Please try again.");
          return;
        }
        const capturedFile = new File([blob], `dermascan-capture-${Date.now()}.jpg`, {
          type: "image/jpeg"
        });
        handleFileSelection(capturedFile);
      },
      "image/jpeg",
      0.92
    );
  }

  window.addEventListener("beforeunload", stopCameraStream);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopCameraStream();
  });

  /* --------------------------------------------------------------------------
     File Validation & Preview
     -------------------------------------------------------------------------- */
  function validateFile(file) {
    if (!file) {
      return { valid: false, error: "No image file was selected. Please choose a clear skin photo." };
    }
    if (file.size === 0) {
      return { valid: false, error: "The selected file appears to be empty (0 bytes). Please choose a valid image." };
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: "Unsupported image format. Please select a JPEG (.jpg/.jpeg), PNG (.png), or WebP (.webp) file."
      };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `This image (${formatBytes(file.size)}) exceeds the ${formatBytes(MAX_FILE_SIZE_BYTES)} maximum size limit. Please choose a smaller photo.`
      };
    }
    return { valid: true };
  }

  function handleFileSelection(file) {
    clearError();
    if (resultPanel) resultPanel.classList.add("hidden");

    const check = validateFile(file);
    if (!check.valid) {
      removeSelectedImage(false);
      showError(check.error, false);
      return;
    }

    revokeCurrentUrl();
    selectedFile = file;
    currentObjectUrl = URL.createObjectURL(file);

    if (previewImage) {
      previewImage.src = currentObjectUrl;
    }
    if (fileNameEl) {
      fileNameEl.textContent = file.name;
    }
    if (fileSizeEl) {
      fileSizeEl.textContent = formatBytes(file.size);
    }
    if (previewContainer) {
      previewContainer.classList.remove("hidden");
    }

    // Reset file inputs so selecting the exact same file later still triggers 'change'
    if (fileInput) fileInput.value = "";
    if (mobileCameraInput) mobileCameraInput.value = "";

    updateAnalyzeButtonState();
  }

  function removeSelectedImage(clearAlerts = true) {
    if (activeAbortController) {
      activeAbortController.abort();
      activeAbortController = null;
    }
    isAnalyzing = false;
    selectedFile = null;
    revokeCurrentUrl();

    if (previewImage) previewImage.removeAttribute("src");
    if (resultPreviewImg) resultPreviewImg.removeAttribute("src");
    if (previewContainer) previewContainer.classList.add("hidden");
    if (loadingPanel) loadingPanel.classList.add("hidden");
    if (previewMediaWrap) previewMediaWrap.classList.remove("scanning-active");
    if (fileInput) fileInput.value = "";
    if (mobileCameraInput) mobileCameraInput.value = "";

    if (clearAlerts) clearError();
    updateAnalyzeButtonState();
  }

  /* --------------------------------------------------------------------------
     Label Resolution & Condition Guide Matching
     -------------------------------------------------------------------------- */
  function resolveConditionLabel(apiData) {
    // 1. If backend returns a non-empty condition string, use it directly
    if (typeof apiData.condition === "string" && apiData.condition.trim().length > 0) {
      return apiData.condition.trim();
    }

    // 2. Otherwise check CLASS_LABELS mapping in data.js
    const idx = apiData.class_index;
    if (
      window.CLASS_LABELS &&
      Object.prototype.hasOwnProperty.call(window.CLASS_LABELS, idx) &&
      typeof window.CLASS_LABELS[idx] === "string" &&
      window.CLASS_LABELS[idx].trim().length > 0
    ) {
      return window.CLASS_LABELS[idx].trim();
    }

    // 3. Fallback: NEVER invent a medical label
    return `Model Class ${idx}`;
  }

  function findMatchingConditionEntry(label) {
    if (!window.CONDITIONS || !label) return null;
    const normalized = label.toLowerCase().replace(/[_-]+/g, " ").trim();

    return (
      window.CONDITIONS.find((c) => {
        const nameNorm = c.name.toLowerCase();
        if (nameNorm === normalized || normalized.includes(nameNorm) || nameNorm.includes(normalized)) {
          return true;
        }
        if (Array.isArray(c.aliases)) {
          return c.aliases.some((al) => al.toLowerCase() === normalized);
        }
        return false;
      }) || null
    );
  }

  /* --------------------------------------------------------------------------
     API Submission (`POST http://127.0.0.1:8000/predict`)
     -------------------------------------------------------------------------- */
  async function submitImageForAnalysis() {
    clearError();

    if (!selectedFile) {
      showError("Please select or capture a valid skin image before analyzing.");
      return;
    }
    if (!consentCheckbox || !consentCheckbox.checked) {
      showError("Please confirm the screening consent checkbox before submitting your image.");
      return;
    }
    if (isAnalyzing) return;

    // Abort any stale request
    if (activeAbortController) {
      activeAbortController.abort();
    }

    const requestId = ++currentRequestId;
    activeAbortController = new AbortController();
    isAnalyzing = true;
    updateAnalyzeButtonState();

    if (resultPanel) resultPanel.classList.add("hidden");
    if (loadingPanel) loadingPanel.classList.remove("hidden");
    if (previewMediaWrap) previewMediaWrap.classList.add("scanning-active");

    const timeoutId = setTimeout(() => {
      if (activeAbortController) {
        activeAbortController.abort("TIMEOUT");
      }
    }, REQUEST_TIMEOUT_MS);

    try {
      const formData = new FormData();
      // Strictly required field name: "file"
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
        signal: activeAbortController.signal
        // Note: Do NOT set Content-Type manually so browser generates multipart boundary
      });

      clearTimeout(timeoutId);

      // Ignore stale response
      if (requestId !== currentRequestId) return;

      let data = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw {
          type: "INVALID_JSON",
          message: "The screening service returned an unreadable response (invalid JSON). Please try again."
        };
      }

      if (!response.ok) {
        const serverDetail =
          data && typeof data.detail === "string"
            ? data.detail
            : `HTTP status ${response.status}`;
        throw {
          type: "HTTP_ERROR",
          message: `The screening service reported an error (${serverDetail}). Please verify the backend model is loaded and try again.`
        };
      }

      // Strict Response Contract Validation
      const isSuccess = data && data.status === "success";
      const conf = data ? Number(data.confidence_percentage) : NaN;
      const validConf = Number.isFinite(conf) && conf >= 0 && conf <= 100;

      const hasConditionStr =
        data && typeof data.condition === "string" && data.condition.trim().length > 0;
      const hasValidClassIdx =
        data &&
        data.class_index !== undefined &&
        data.class_index !== null &&
        Number.isInteger(Number(data.class_index)) &&
        Number(data.class_index) >= 0;

      if (!isSuccess || !validConf || (!hasConditionStr && !hasValidClassIdx)) {
        throw {
          type: "MALFORMED_RESPONSE",
          message:
            "The backend returned an unexpected response format. Expected status 'success', a valid confidence_percentage (0–100), and class_index or condition."
        };
      }

      renderScreeningResult({
        condition: hasConditionStr ? data.condition.trim() : null,
        class_index: hasValidClassIdx ? Number(data.class_index) : null,
        confidence_percentage: conf
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (requestId !== currentRequestId) return;

      if (err && err.name === "AbortError") {
        showError(
          "The analysis request timed out after 60 seconds. The model may still be warming up—please try again.",
          true
        );
      } else if (err && (err.type === "INVALID_JSON" || err.type === "HTTP_ERROR" || err.type === "MALFORMED_RESPONSE")) {
        showError(err.message, true);
      } else {
        showError(
          "We couldn't connect to the screening service. Please ensure the backend is running at " +
            API_BASE_URL +
            " and try again.",
          true
        );
      }
    } finally {
      if (requestId === currentRequestId) {
        isAnalyzing = false;
        activeAbortController = null;
        if (loadingPanel) loadingPanel.classList.add("hidden");
        if (previewMediaWrap) previewMediaWrap.classList.remove("scanning-active");
        updateAnalyzeButtonState();
      }
    }
  }

  /* --------------------------------------------------------------------------
     Render Results Safely (textContent only, animated confidence bar)
     -------------------------------------------------------------------------- */
  function renderScreeningResult(validatedData) {
    if (!resultPanel) return;

    const displayLabel = resolveConditionLabel(validatedData);
    const roundedConf = validatedData.confidence_percentage.toFixed(2);

    if (resultLabelEl) {
      resultLabelEl.textContent = displayLabel;
    }
    if (resultConfidenceText) {
      resultConfidenceText.textContent = `${roundedConf}%`;
    }
    if (resultPreviewImg && currentObjectUrl) {
      resultPreviewImg.src = currentObjectUrl;
    }

    // Condition Guide Link Matching
    const matchedCondition = findMatchingConditionEntry(displayLabel);
    if (resultGuideLink) {
      if (matchedCondition) {
        resultGuideLink.href = `conditions.html#${matchedCondition.id}`;
        resultGuideLink.textContent = `Learn more about ${matchedCondition.name}`;
        resultGuideLink.classList.remove("hidden");
      } else {
        resultGuideLink.href = "conditions.html";
        resultGuideLink.textContent = "Browse Skin Conditions Library";
        resultGuideLink.classList.remove("hidden");
      }
    }

    if (resultConfidenceFill) {
      resultConfidenceFill.style.width = "0%";
    }

    resultPanel.classList.remove("hidden");
    resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });

    requestAnimationFrame(() => {
      setTimeout(() => {
        if (resultConfidenceFill) {
          resultConfidenceFill.style.width = `${Math.min(100, Math.max(0, validatedData.confidence_percentage))}%`;
        }
      }, 60);
    });
  }

  /* --------------------------------------------------------------------------
     Event Listeners Wiring
     -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    if (!dropzone) return;

    // Browse Button & Dropzone click
    if (btnBrowseFile && fileInput) {
      btnBrowseFile.addEventListener("click", (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    dropzone.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("input")) return;
      if (fileInput) fileInput.click();
    });

    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (fileInput) fileInput.click();
      }
    });

    if (btnMobileCapture && mobileCameraInput) {
      btnMobileCapture.addEventListener("click", (e) => {
        e.stopPropagation();
        mobileCameraInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) handleFileSelection(file);
      });
    }

    if (mobileCameraInput) {
      mobileCameraInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) handleFileSelection(file);
      });
    }

    // Drag & Drop Events
    ["dragenter", "dragover"].forEach((evtName) => {
      dropzone.addEventListener(evtName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("drag-over");
      });
    });

    ["dragleave", "drop"].forEach((evtName) => {
      dropzone.addEventListener(evtName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("drag-over");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelection(files[0]);
      }
    });

    // Live Camera Controls
    if (btnStartCamera) {
      btnStartCamera.addEventListener("click", startCameraStream);
    }
    if (btnCapturePhoto) {
      btnCapturePhoto.addEventListener("click", capturePhotoFromStream);
    }
    if (btnStopCamera) {
      btnStopCamera.addEventListener("click", stopCameraStream);
    }

    // Remove Image & Reset Scan
    if (btnRemoveImage) {
      btnRemoveImage.addEventListener("click", () => removeSelectedImage(true));
    }
    if (btnResetScan) {
      btnResetScan.addEventListener("click", () => {
        if (resultPanel) resultPanel.classList.add("hidden");
        if (consentCheckbox) consentCheckbox.checked = false;
        removeSelectedImage(true);
        dropzone.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    // Consent & Submit
    if (consentCheckbox) {
      consentCheckbox.addEventListener("change", updateAnalyzeButtonState);
    }
    if (btnAnalyze) {
      btnAnalyze.addEventListener("click", submitImageForAnalysis);
    }
    if (btnRetry) {
      btnRetry.addEventListener("click", submitImageForAnalysis);
    }
  });
})();


  // Added automatic frame capture / burst feature from live video stream
  function startAutoBurstCapture() {
    if (burstInterval) clearInterval(burstInterval);
    burstCount = 0;
    
    // Show a small notice or status for auto-capturing frames
    const wrap = document.getElementById("preview-media-wrap");
    
    burstInterval = setInterval(() => {
      if (!mediaStream || !cameraVideo || !cameraCanvas) {
        clearInterval(burstInterval);
        return;
      }
      burstCount++;
      
      const width = cameraVideo.videoWidth || 640;
      const height = cameraVideo.videoHeight || 480;
      if (width > 0 && height > 0) {
        cameraCanvas.width = width;
        cameraCanvas.height = height;
        const ctx = cameraCanvas.getContext("2d");
        // Apply mirror transform on canvas capture if needed
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(cameraVideo, 0, 0, width, height);
        
        // Every few frames or on target, we can also auto-trigger or let user capture best frame
      }
      
      if (burstCount >= 10) {
        clearInterval(burstInterval);
      }
    }, 500); // 2 frames per second / burst simulation
  }
