/* ==========================================================================
   Derma.co | Shared Layout Injection (js/layout.js)
   Injects identical Navbar & Footer on every page and highlights active link.
   ========================================================================== */

(function () {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  const navItems = [
    { label: "Home", href: "index.html" },
    { label: "How It Works", href: "how-it-works.html" },
    { label: "Conditions", href: "conditions.html" },
    { label: "Guides", href: "guides.html" },
    { label: "Doctor", href: "doctor.html" },
    { label: "Pricing", href: "pricing.html" },
    { label: "About", href: "about.html" },
    { label: "FAQ", href: "index.html#faq-section" },
    { label: "Contact", href: "contact.html" }
  ];

  function buildHeaderHTML() {
    const linksHTML = navItems
      .map((item) => {
        const isActive =
          (currentPath === "" && item.href === "index.html") ||
          currentPath === item.href;
        return `<li><a href="${item.href}" class="${isActive ? "active" : ""}">${item.label}</a></li>`;
      })
      .join("");

    return `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <canvas id="ambient-canvas" aria-hidden="true"></canvas>
      <header class="site-header" id="site-header">
        <div class="container nav-bar">
          <a href="index.html" class="brand-logo" aria-label="Derma.co Home">
            <span class="logo-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
            </span>
            <span>Derma.co</span>
            <span class="brand-badge">AI Screening Aid</span>
          </a>

          <nav aria-label="Primary Navigation">
            <ul class="nav-links" id="nav-links">
              ${linksHTML}
            </ul>
          </nav>

          <div class="nav-actions">
            <a href="auth.html" class="btn btn-ghost btn-sm">Login</a>
            <a href="scan.html" class="btn btn-primary btn-sm">Start Skin Scan</a>
            <button type="button" class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-links">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  function buildFooterHTML() {
    return `
      <div class="wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
      <footer class="site-footer">
        <div class="container">
          <div class="disclaimer-banner mb-2" role="note" aria-label="Medical Disclaimer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Important Medical Disclaimer:</strong> Derma.co and the Derma-Scan feature provide AI-assisted informational screening only. Results are not a medical diagnosis, do not guarantee accuracy, and cannot rule out skin cancer or other serious conditions. Always consult a qualified dermatologist or healthcare professional for medical evaluation.
            </div>
          </div>

          <div class="footer-grid mt-3">
            <div>
              <a href="index.html" class="brand-logo">
                <span class="logo-mark" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                </span>
                <span>Derma.co</span>
              </a>
              <p class="mt-2">
                A calm, educational first step in exploring skin health. Upload a photo for AI-assisted screening and explore dermatologist-informed guides.
              </p>
            </div>

            <div>
              <h4>Explore</h4>
              <ul class="footer-links mt-1">
                <li><a href="scan.html">Derma-Scan Tool</a></li>
                <li><a href="how-it-works.html">How It Works</a></li>
                <li><a href="conditions.html">Skin Conditions (37)</a></li>
                <li><a href="guides.html">Skincare Guides</a></li>
                <li><a href="pricing.html">Pricing (Demo)</a></li>
              </ul>
            </div>

            <div>
              <h4>Care & Company</h4>
              <ul class="footer-links mt-1">
                <li><a href="doctor.html">Find a Dermatologist</a></li>
                <li><a href="about.html">About Derma.co</a></li>
                <li><a href="contact.html">Contact Us</a></li>
                <li><a href="auth.html">Account Demo</a></li>
              </ul>
            </div>

            <div>
              <h4>Contact (Placeholder)</h4>
              <ul class="footer-links mt-1">
                <li>Email: hello@derma-co.example</li>
                <li>Support: +91 (000) 000-0000</li>
                <li>Location: Sector 62, NCR (Demo Office)</li>
                <li class="mt-1"><a href="privacy.html">Privacy Policy</a> &bull; <a href="terms.html">Terms of Use</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <span>&copy; ${new Date().getFullYear()} Derma.co (Derma-Scan Project). Educational & Screening Aid Only.</span>
            <span><a href="privacy.html">Privacy Policy</a> &nbsp;|&nbsp; <a href="terms.html">Terms & Medical Disclaimer</a></span>
          </div>
        </div>
      </footer>
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const mainEl = document.querySelector("main");
    if (mainEl && !mainEl.id) {
      mainEl.id = "main-content";
    }

    document.body.insertAdjacentHTML("afterbegin", buildHeaderHTML());
    document.body.insertAdjacentHTML("beforeend", buildFooterHTML());

    // Mobile Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    // Header scroll state
    const header = document.getElementById("site-header");
    window.addEventListener(
      "scroll",
      () => {
        if (!header) return;
        if (window.scrollY > 24) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      },
      { passive: true }
    );
  });
})();
