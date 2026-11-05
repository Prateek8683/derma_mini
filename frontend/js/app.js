/* ==========================================================================
   Derma.co | Global Interactions, 3D Animations & Page Renderers (js/app.js)
   ========================================================================== */

(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
     1. BUTTON RIPPLE EFFECT
     -------------------------------------------------------------------------- */
  function initRipples() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn || btn.disabled || prefersReducedMotion) return;

      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "btn-ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 620);
    });
  }

  /* --------------------------------------------------------------------------
     2. 3D HERO MOUSE PARALLAX
     -------------------------------------------------------------------------- */
  function initHero3D() {
    const stage = document.querySelector(".hero-3d-stage");
    const rig = document.querySelector(".hero-3d-rig");
    if (!stage || !rig || prefersReducedMotion) return;

    stage.addEventListener("mousemove", (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotY = x * 16;
      const rotX = -y * 16;
      rig.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    stage.addEventListener("mouseleave", () => {
      rig.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }

  /* --------------------------------------------------------------------------
     3. 3D TILT EFFECT ON CARDS (.tilt-card)
     -------------------------------------------------------------------------- */
  function bindTiltCards(root = document) {
    if (prefersReducedMotion) return;
    const cards = root.querySelectorAll(".tilt-card:not([data-tilt-bound])");

    cards.forEach((card) => {
      card.setAttribute("data-tilt-bound", "true");
      let glare = card.querySelector(".card-glare");
      if (!glare) {
        glare = document.createElement("div");
        glare.className = "card-glare";
        card.appendChild(glare);
      }

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotY = (px - 0.5) * 10;
        const rotX = (0.5 - py) * 10;

        card.classList.add("tilt-active");
        card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
        glare.style.background = `radial-gradient(circle at ${(px * 100).toFixed(0)}% ${(py * 100).toFixed(0)}%, rgba(232, 245, 241, 0.65), transparent 65%)`;
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("tilt-active");
        card.style.transform = "";
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. INTERSECTION OBSERVER SCROLL REVEAL
     -------------------------------------------------------------------------- */
  function observeReveals(root = document) {
    const els = root.querySelectorAll(".reveal:not(.visible)");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     5. AMBIENT SOFT PARTICLE CANVAS (Pauses when hidden)
     -------------------------------------------------------------------------- */
  function initAmbientCanvas() {
    if (prefersReducedMotion) return;
    const canvas = document.getElementById("ambient-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -0.15 - Math.random() * 0.25,
      isCoral: Math.random() > 0.65
    }));

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    function draw() {
      if (document.hidden) {
        requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isCoral ? "rgba(243, 168, 155, 0.35)" : "rgba(23, 107, 103, 0.18)";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* --------------------------------------------------------------------------
     6. FAQ ACCORDION RENDERER
     -------------------------------------------------------------------------- */
  function initFAQ() {
    const container = document.getElementById("faq-list");
    if (!container || !window.FAQS) return;

    container.innerHTML = "";
    window.FAQS.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "faq-item reveal";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "faq-trigger";
      btn.setAttribute("aria-expanded", "false");
      btn.id = `faq-btn-${index}`;
      btn.setAttribute("aria-controls", `faq-panel-${index}`);

      const qSpan = document.createElement("span");
      qSpan.textContent = item.q;

      const iconSpan = document.createElement("span");
      iconSpan.className = "faq-icon";
      iconSpan.setAttribute("aria-hidden", "true");
      iconSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

      btn.appendChild(qSpan);
      btn.appendChild(iconSpan);

      const panel = document.createElement("div");
      panel.className = "faq-panel";
      panel.id = `faq-panel-${index}`;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", btn.id);

      const inner = document.createElement("div");
      inner.className = "faq-panel-inner";
      inner.textContent = item.a;
      panel.appendChild(inner);

      btn.addEventListener("click", () => {
        const isOpen = wrapper.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
        panel.style.maxHeight = isOpen ? `${inner.scrollHeight + 24}px` : "0px";
      });

      wrapper.appendChild(btn);
      wrapper.appendChild(panel);
      container.appendChild(wrapper);
    });
  }

  /* --------------------------------------------------------------------------
     7. HOME PAGE CONDITIONS PREVIEW
     -------------------------------------------------------------------------- */
  function initHomeConditionsPreview() {
    const previewContainer = document.getElementById("home-conditions-preview");
    if (!previewContainer || !window.CONDITIONS) return;

    const sample = window.CONDITIONS.slice(0, 6);
    previewContainer.innerHTML = "";
    sample.forEach((c) => {
      const card = document.createElement("article");
      card.className = "card tilt-card reveal";
      card.innerHTML = `
        <span class="badge">${c.category}</span>
        <h3 class="mt-1">${c.name}</h3>
        <p class="mt-1">${c.shortDesc}</p>
        <div class="mt-2">
          <a href="conditions.html#${c.id}" class="btn btn-secondary btn-sm">Read Guide &rarr;</a>
        </div>
      `;
      previewContainer.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     8. CONDITIONS DIRECTORY PAGE (conditions.html)
     -------------------------------------------------------------------------- */
  function initConditionsPage() {
    const grid = document.getElementById("conditions-directory-grid");
    if (!grid || !window.CONDITIONS) return;

    const searchInput = document.getElementById("condition-search");
    const chips = document.querySelectorAll("[data-cond-cat]");
    const countLabel = document.getElementById("conditions-count");
    let activeCategory = "all";

    function renderList() {
      const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
      grid.innerHTML = "";

      const filtered = window.CONDITIONS.filter((c) => {
        const matchesCat = activeCategory === "all" || c.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch =
          !query ||
          c.name.toLowerCase().includes(query) ||
          c.shortDesc.toLowerCase().includes(query) ||
          c.signs.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query);
        return matchesCat && matchesSearch;
      });

      if (countLabel) {
        countLabel.textContent = `Showing ${filtered.length} of ${window.CONDITIONS.length} conditions`;
      }

      if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.className = "card text-center";
        empty.style.gridColumn = "1 / -1";
        empty.innerHTML = `<h3>No matching skin conditions found</h3><p class="mt-1">Try clearing your search or selecting "All Categories". Always consult a dermatologist for unfamiliar spots.</p>`;
        grid.appendChild(empty);
        return;
      }

      filtered.forEach((c) => {
        const card = document.createElement("article");
        card.className = "card tilt-card reveal visible";
        card.id = c.id;

        const badgeClass = c.urgentNotice ? "badge badge-warn" : "badge";
        const urgentHTML = c.urgentNotice
          ? `<div class="disclaimer-banner mt-2" style="padding:0.75rem 1rem;font-size:0.86rem;">
               <strong>Prompt Dermatologist Evaluation Advised:</strong> ${c.seeDoctor}
             </div>`
          : "";

        card.innerHTML = `
          <div class="flex-between">
            <span class="${badgeClass}">${c.category}</span>
            ${c.urgentNotice ? `<span class="badge badge-warn">Priority Medical Check</span>` : ""}
          </div>
          <h3 class="mt-1">${c.name}</h3>
          <p class="mt-1">${c.shortDesc}</p>
          <details class="mt-2" style="border-top:1px solid var(--border);padding-top:0.85rem;">
            <summary style="cursor:pointer;font-weight:700;color:var(--primary);">View Signs, Care Tips & When to See a Doctor</summary>
            <div class="mt-1" style="font-size:0.92rem;">
              <p><strong>Common Visual Signs:</strong> ${c.signs}</p>
              <p class="mt-1"><strong>General Care Tips:</strong> ${c.careTips}</p>
              <p class="mt-1"><strong>When to See a Doctor:</strong> ${c.seeDoctor}</p>
            </div>
          </details>
          ${urgentHTML}
        `;
        grid.appendChild(card);
      });

      bindTiltCards(grid);

      // Highlight hash target if navigated via #anchor
      if (window.location.hash) {
        const targetEl = document.querySelector(window.location.hash);
        if (targetEl) {
          const detailsEl = targetEl.querySelector("details");
          if (detailsEl) detailsEl.open = true;
        }
      }
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((ch) => ch.classList.remove("active"));
        chip.classList.add("active");
        activeCategory = chip.getAttribute("data-cond-cat") || "all";
        renderList();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", renderList);
    }

    renderList();
  }

  /* --------------------------------------------------------------------------
     9. GUIDES PAGE (guides.html)
     -------------------------------------------------------------------------- */
  function initGuidesPage() {
    const grid = document.getElementById("guides-grid");
    if (!grid || !window.GUIDES) return;

    const chips = document.querySelectorAll("[data-guide-cat]");
    let activeCat = "all";

    function renderGuides() {
      grid.innerHTML = "";
      const items = window.GUIDES.filter(
        (g) => activeCat === "all" || g.category.toLowerCase() === activeCat.toLowerCase()
      );

      items.forEach((g) => {
        const card = document.createElement("article");
        card.className = "card tilt-card reveal visible";
        card.innerHTML = `
          <div class="img-slot" style="height:190px;margin-bottom:1.1rem;">
            <img src="${g.image}" alt="${g.title}" width="400" height="220" loading="lazy" onerror="this.style.opacity='0'" />
          </div>
          <div class="flex-between">
            <span class="badge">${g.category}</span>
            <small style="color:var(--text-muted);font-weight:600;">${g.readTime}</small>
          </div>
          <h3 class="mt-1">${g.title}</h3>
          <p class="mt-1">${g.summary}</p>
          <div class="mt-2">
            <a href="scan.html" class="btn btn-secondary btn-sm">Try Skin Scan &rarr;</a>
          </div>
        `;
        grid.appendChild(card);
      });
      bindTiltCards(grid);
    }

    chips.forEach((c) => {
      c.addEventListener("click", () => {
        chips.forEach((ch) => ch.classList.remove("active"));
        c.classList.add("active");
        activeCat = c.getAttribute("data-guide-cat") || "all";
        renderGuides();
      });
    });

    renderGuides();
  }

  /* --------------------------------------------------------------------------
     10. PRICING PAGE (pricing.html)
     -------------------------------------------------------------------------- */
  function initPricingPage() {
    const grid = document.getElementById("pricing-cards-grid");
    if (!grid || !window.PRICING_PLANS) return;

    const toggleBtn = document.getElementById("billing-toggle-btn");
    let isYearly = false;

    function renderPlans() {
      grid.innerHTML = "";
      window.PRICING_PLANS.forEach((p) => {
        const price = isYearly ? p.yearlyPrice : p.monthlyPrice;
        const card = document.createElement("article");
        card.className = "card tilt-card reveal visible";
        if (p.highlighted) {
          card.style.borderColor = "var(--primary)";
          card.style.borderWidth = "2px";
        }

        const featuresList = p.features
          .map((f) => `<li style="margin-bottom:0.45rem;">&#10003; ${f}</li>`)
          .join("");

        card.innerHTML = `
          <div class="flex-between">
            <span class="badge ${p.highlighted ? "badge-coral" : ""}">${p.badge}</span>
            <small style="color:var(--text-muted)">Demo Placeholder</small>
          </div>
          <h3 class="mt-1">${p.name}</h3>
          <div class="mt-1" style="font-size:2.4rem;font-weight:700;font-family:var(--font-heading);color:var(--primary);">
            ${price} <span style="font-size:0.9rem;color:var(--text-muted);font-weight:500;">${isYearly ? "/mo (billed yearly)" : p.period}</span>
          </div>
          <p class="mt-1">${p.description}</p>
          <ul style="list-style:none;margin:1.25rem 0;color:var(--text-muted);font-size:0.94rem;">
            ${featuresList}
          </ul>
          <a href="${p.ctaLink}" class="btn ${p.highlighted ? "btn-primary" : "btn-secondary"}" style="width:100%;">${p.ctaText}</a>
        `;
        grid.appendChild(card);
      });
      bindTiltCards(grid);
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        isYearly = !isYearly;
        toggleBtn.textContent = isYearly
          ? "Billing Mode: Annual Demo (20% Off) — Click for Monthly"
          : "Billing Mode: Monthly Demo — Click for Annual (20% Off)";
        renderPlans();
      });
    }

    renderPlans();
  }

  /* --------------------------------------------------------------------------
     11. CONTACT & AUTH DEMO FORMS
     -------------------------------------------------------------------------- */
  function initDemoForms() {
    const contactForm = document.getElementById("demo-contact-form");
    const contactStatus = document.getElementById("contact-form-status");
    if (contactForm && contactStatus) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        contactStatus.classList.remove("hidden");
        contactStatus.textContent =
          "Thank you! This is a frontend demo form — your message was validated locally and no personal data was transmitted.";
        contactForm.reset();
      });
    }

    // Auth Tabs
    const tabLogin = document.getElementById("tab-login");
    const tabSignup = document.getElementById("tab-signup");
    const panelLogin = document.getElementById("panel-login");
    const panelSignup = document.getElementById("panel-signup");
    const authStatus = document.getElementById("auth-demo-status");

    if (tabLogin && tabSignup && panelLogin && panelSignup) {
      tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        panelLogin.classList.remove("hidden");
        panelSignup.classList.add("hidden");
      });

      tabSignup.addEventListener("click", () => {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        panelSignup.classList.remove("hidden");
        panelLogin.classList.add("hidden");
      });

      [panelLogin, panelSignup].forEach((form) => {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          if (authStatus) {
            authStatus.classList.remove("hidden");
            authStatus.textContent =
              "Demo Notice: Authentication UI is a frontend showcase only. No passwords or tokens are stored or sent.";
          }
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initRipples();
    initHero3D();
    initAmbientCanvas();
    initFAQ();
    initHomeConditionsPreview();
    initConditionsPage();
    initGuidesPage();
    initPricingPage();
    initDemoForms();
    bindTiltCards();
    observeReveals();
  });
})();
