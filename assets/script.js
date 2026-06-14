/* Xinhui Ye — shared interactions
   Progressive enhancement: everything works as plain HTML if JS is off. */

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Mobile menu overlay ------------------------------------------ */
  const overlay = document.querySelector(".nav-overlay");
  const openBtn = document.querySelector("[data-menu-open]");
  const closeBtn = document.querySelector("[data-menu-close]");

  const setMenu = (open) => {
    if (!overlay) return;
    overlay.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  openBtn && openBtn.addEventListener("click", () => setMenu(true));
  closeBtn && closeBtn.addEventListener("click", () => setMenu(false));
  overlay &&
    overlay.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setMenu(false))
    );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---- Nav: ghost width + scroll shadow ----------------------------- */
  // Mirror each link's text into data-text so the CSS ::after ghost can
  // reserve the bold width and the bar stays steady on hover.
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.dataset.text = a.textContent.trim();
  });

  // Flat at the top, floating shadow once scrolled.
  const siteNav = document.querySelector(".site-nav");
  if (siteNav) {
    const onScroll = () =>
      siteNav.classList.toggle("is-scrolled", window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Accordion (Education / Work lists) --------------------------- */
  document.querySelectorAll(".accordion-head").forEach((head) => {
    head.addEventListener("click", () => {
      const row = head.closest(".accordion-row");
      row.classList.toggle("is-open");
      head.setAttribute("aria-expanded", row.classList.contains("is-open"));
    });
  });

  /* ---- Carousels (horizontal scroll with circular controls) --------- */
  document.querySelectorAll("[data-carousel]").forEach((wrap) => {
    const track = wrap.querySelector("[data-carousel-track]");
    const prev = wrap.querySelector("[data-carousel-prev]");
    const next = wrap.querySelector("[data-carousel-next]");
    if (!track) return;
    const step = () => Math.max(track.clientWidth * 0.8, 280);
    prev && prev.addEventListener("click", () =>
      track.scrollBy({ left: -step(), behavior: "smooth" })
    );
    next && next.addEventListener("click", () =>
      track.scrollBy({ left: step(), behavior: "smooth" })
    );

    // Fade the partially-visible edge cards to signal there's more to scroll.
    const FADE = 64; // px
    const updateFade = () => {
      const atStart = track.scrollLeft <= 1;
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      let stops = atStart ? "#000 0" : `transparent 0, #000 ${FADE}px`;
      stops += atEnd
        ? ", #000 100%"
        : `, #000 calc(100% - ${FADE}px), transparent 100%`;
      const mask = `linear-gradient(to right, ${stops})`;
      track.style.webkitMaskImage = mask;
      track.style.maskImage = mask;
    };
    updateFade();
    track.addEventListener("scroll", updateFade, { passive: true });
    window.addEventListener("resize", updateFade);
  });

  /* ---- Back to top -------------------------------------------------- */
  // #top points at the sticky nav, which is always "in view", so the native
  // anchor jump does nothing. Scroll the window manually instead.
  document.querySelectorAll(".back-to-top").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ---- Contact form (no backend yet) -------------------------------- */
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO: wire this up to a real form handler / email service.
      alert("Thanks for reaching out! (Form submission is not yet connected.)");
      form.reset();
    });
  });
});
