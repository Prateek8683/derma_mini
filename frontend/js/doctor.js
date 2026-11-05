/* ==========================================================================
   Derma.co | Dermatologist Directory & Consultation Prep (js/doctor.js)
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const doctorsGrid = document.getElementById("doctors-directory-grid");
    if (doctorsGrid && window.DOCTORS) {
      doctorsGrid.innerHTML = "";
      window.DOCTORS.forEach((doc) => {
        const card = document.createElement("article");
        card.className = "card tilt-card reveal visible";
        card.innerHTML = `
          <div class="img-slot" style="height:210px;margin-bottom:1.1rem;">
            <img src="${doc.image}" alt="${doc.name}" width="380" height="220" loading="lazy" onerror="this.style.opacity='0'" />
          </div>
          <span class="badge">${doc.location}</span>
          <h3 class="mt-1">${doc.name}</h3>
          <p style="color:var(--primary);font-weight:600;font-size:0.9rem;margin-top:0.25rem;">${doc.specialty}</p>
          <p class="mt-1">${doc.bio}</p>
        `;
        doctorsGrid.appendChild(card);
      });
    }

    const consultForm = document.getElementById("doctor-consult-form");
    const statusBox = document.getElementById("consult-form-status");

    if (consultForm && statusBox) {
      consultForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameVal = (document.getElementById("consult-name")?.value || "").trim();
        const emailVal = (document.getElementById("consult-email")?.value || "").trim();
        const concernVal = (document.getElementById("consult-concern")?.value || "").trim();

        if (!nameVal || !emailVal || !concernVal) {
          statusBox.classList.remove("hidden");
          statusBox.textContent = "Please fill in your name, email, and primary question before testing the demo form.";
          return;
        }

        statusBox.classList.remove("hidden");
        statusBox.textContent =
          "Demo Consultation Request Validated! Because this is a local frontend showcase, no personal or medical information was sent over the network. For real care, please contact a licensed dermatologist in your area.";
        consultForm.reset();
      });
    }
  });
})();
