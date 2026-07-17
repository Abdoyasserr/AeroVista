/* ============================================================
   AeroVista Cairo Residence — Main Script
   Edit the configuration below to update your apartment info.
   ============================================================ */

const apartmentConfig = {
  apartmentName: "AeroVista Cairo Residence",
  ownerName: "Moussa Mostafa",
  phoneNumber: "+201020414058",
  whatsappNumber: "201020414058",
  email: "your-email@example.com",
  city: "Cairo, Egypt",
  googleMapsUrl: "https://www.google.com/maps?q=Rich+House,+Huckstep,+El+Nozha,+Cairo+Governorate+4473221&ftid=0x145816ee6d97e5bd:0x5b5d3a5c066825a2&entry=gps&shh=CAE&lucs=,94297699,94231188,94280568,47071704,94218641,94282134,100813464,94286869,100820242&g_ep=CAISEjI2LjI4LjAuOTQyOTUxNTM4MBgAIIgnKlMsOTQyOTc2OTksOTQyMzExODgsOTQyODA1NjgsNDcwNzE3MDQsOTQyMTg2NDEsOTQyODIxMzQsMTAwODEzNDY0LDk0Mjg2ODY5LDEwMDgyMDI0MkICRUc%3D&skid=aec95b4c-45b5-4dd9-973f-a8e10e88c8e7&g_st=iw",
};

/* ---- Helpers ---- */

function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function safeEl(id) { return document.getElementById(id); }

/* ============================================================
   Populate dynamic content from config
   ============================================================ */
(function populateConfig() {
  const c = apartmentConfig;

  const setHref = (el, href) => { if (el) el.href = href; };
  const setText = (el, text) => { if (el) el.textContent = text; };

  // Footer contact info
  setText(safeEl("footerOwner"), c.ownerName);
  const footerPhone = safeEl("footerPhone");
  if (footerPhone) { footerPhone.textContent = c.phoneNumber.replace(/(\+\d{2})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4"); footerPhone.href = "tel:" + c.phoneNumber; }
  const footerWA = safeEl("footerWhatsapp");
  if (footerWA) { footerWA.textContent = c.phoneNumber.replace(/(\+\d{2})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4"); footerWA.href = "https://wa.me/" + c.whatsappNumber; }
  const footerEmail = safeEl("footerEmail");
  if (footerEmail) { footerEmail.textContent = c.email; footerEmail.href = "mailto:" + c.email; }
  setText(safeEl("footerCity"), c.city);

  // Logo text
  const logo = $(".logo-text");
  if (logo) logo.textContent = c.apartmentName;

  // CTA buttons
  setHref(safeEl("ctaWhatsapp"), "https://wa.me/" + c.whatsappNumber);
  setHref(safeEl("ctaCall"), "tel:" + c.phoneNumber);

  // Floating buttons
  setHref(safeEl("floatWhatsapp"), "https://wa.me/" + c.whatsappNumber);
  setHref(safeEl("floatPhone"), "tel:" + c.phoneNumber);

  // Google Maps
  setHref(safeEl("mapsBtn"), c.googleMapsUrl);

  // Footer year
  const yearEl = safeEl("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ============================================================
   Navigation — scroll background & mobile toggle
   ============================================================ */
(function navigation() {
  const navbar = safeEl("navbar");
  const toggle = safeEl("navToggle");
  const menu = safeEl("navMenu");
  if (!navbar || !toggle || !menu) return;

  // Scroll effect
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 60);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Close on link click
  $$(".nav-link", menu).forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
})();

/* ============================================================
   Active nav link based on scroll position
   ============================================================ */
(function activeNav() {
  const sections = $$("section[id]");
  const navLinks = $$(".nav-link");
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle("active", l.getAttribute("href") === "#" + id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   Parallax hero background
   ============================================================ */
(function parallax() {
  const bg = $(".hero-bg");
  if (!bg) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      bg.style.transform = "translateY(" + (window.scrollY * 0.35) + "px)";
      ticking = false;
    });
  }, { passive: true });
})();

/* ============================================================
   Scroll reveal (IntersectionObserver)
   ============================================================ */
(function scrollReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   Gallery lightbox
   ============================================================ */
(function lightbox() {
  const lightboxEl = safeEl("lightbox");
  const imgEl = safeEl("lightboxImg");
  const captionEl = safeEl("lightboxCaption");
  if (!lightboxEl || !imgEl) return;

  const items = $$(".gallery-item");
  let currentIndex = 0;
  let previousFocus = null;
  const focusableSelector = "button, [href], [tabindex]";

  function getFullSrc(thumb) {
    return thumb.src;
  }

  function show(index) {
    currentIndex = index;
    const item = items[index];
    if (!item) return;
    const img = $("img", item);
    const label = $(".gallery-overlay span", item);
    imgEl.src = getFullSrc(img);
    imgEl.alt = img.alt;
    if (captionEl) captionEl.textContent = label ? label.textContent : "";
    lightboxEl.classList.add("active");
    lightboxEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Trap focus
    const close = $(".lightbox-close", lightboxEl);
    if (close) close.focus();
  }

  function hide() {
    lightboxEl.classList.remove("active");
    lightboxEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (previousFocus) previousFocus.focus();
  }

  function next() { show((currentIndex + 1) % items.length); }
  function prev() { show((currentIndex - 1 + items.length) % items.length); }

  // Open
  items.forEach((item, i) => {
    item.addEventListener("click", () => { previousFocus = document.activeElement; show(i); });
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("keydown", e => { if (e.key === "Enter") { previousFocus = document.activeElement; show(i); } });
  });

  // Controls
  $(".lightbox-close", lightboxEl)?.addEventListener("click", hide);
  $(".lightbox-next", lightboxEl)?.addEventListener("click", next);
  $(".lightbox-prev", lightboxEl)?.addEventListener("click", prev);

  // Keyboard
  document.addEventListener("keydown", e => {
    if (!lightboxEl.classList.contains("active")) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    // Trap focus inside lightbox
    if (e.key === "Tab") {
      const focusable = $$(focusableSelector, lightboxEl);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Close on backdrop
  lightboxEl.addEventListener("click", e => { if (e.target === lightboxEl) hide(); });
})();

/* ============================================================
   Back to top
   ============================================================ */
(function backToTop() {
  const btn = safeEl("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ============================================================
   Contact form → WhatsApp message
   ============================================================ */
(function contactForm() {
  const form = safeEl("contactForm");
  if (!form) return;

  function showError(id, msg) {
    const el = safeEl(id);
    const input = safeEl(id.replace("Error", ""));
    if (el) el.textContent = msg;
    if (input) input.classList.toggle("invalid", !!msg);
  }

  function clearErrors() {
    $$(".form-error", form).forEach(e => (e.textContent = ""));
    $$("input.invalid, textarea.invalid", form).forEach(e => e.classList.remove("invalid"));
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    clearErrors();

    const name = safeEl("guestName")?.value.trim();
    const contact = safeEl("guestContact")?.value.trim();
    const arrival = safeEl("arrivalDate")?.value;
    const departure = safeEl("departureDate")?.value;
    const guests = safeEl("numGuests")?.value;
    const message = safeEl("guestMessage")?.value.trim();

    let valid = true;

    if (!name) { showError("guestNameError", "Please enter your full name."); valid = false; }
    if (!contact) { showError("guestContactError", "Please enter your email or phone."); valid = false; }
    if (!arrival) { showError("arrivalDateError", "Please select an arrival date."); valid = false; }
    if (!departure) { showError("departureDateError", "Please select a departure date."); valid = false; }
    if (arrival && departure && arrival >= departure) { showError("departureDateError", "Departure must be after arrival."); valid = false; }
    if (!guests || guests < 1) { showError("numGuestsError", "Please enter number of guests."); valid = false; }

    if (!valid) return;

    const text =
      `Hello, I'm interested in renting *${apartmentConfig.apartmentName}*.\n\n` +
      `*Name:* ${name}\n` +
      `*Contact:* ${contact}\n` +
      `*Arrival:* ${arrival}\n` +
      `*Departure:* ${departure}\n` +
      `*Guests:* ${guests}\n` +
      (message ? `*Message:* ${message}\n` : "") +
      `\nPlease let me know about availability and pricing. Thank you!`;

    const url = "https://wa.me/" + apartmentConfig.whatsappNumber + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener");
    location.reload();
  });
})();
