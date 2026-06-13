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
