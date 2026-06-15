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
    // Paged carousels advance by exactly one full view of cards (here: 2).
    const paged = wrap.hasAttribute("data-carousel-page");
    const step = () => {
      if (paged) {
        const card = track.firstElementChild;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const cardW = card ? card.getBoundingClientRect().width : track.clientWidth / 2;
        return (cardW + gap) * 2;
      }
      return Math.max(track.clientWidth * 0.8, 280);
    };
    prev && prev.addEventListener("click", () =>
      track.scrollBy({ left: -step(), behavior: "smooth" })
    );
    next && next.addEventListener("click", () =>
      track.scrollBy({ left: step(), behavior: "smooth" })
    );
  });

  /* ---- Certificate flip cards --------------------------------------- */
  // Click / tap (or Enter / Space, since the card is a <button>) flips it
  // to show the back; flipping again returns to the front.
  document.querySelectorAll(".cert-flip:not(.cert-flip--static)").forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", flipped);
    });
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

  /* ---- Craft gallery lightbox --------------------------------------- */
  // Click any thumbnail to open it full-size; handles images and videos.
  // Prev/next (buttons or arrow keys) step through every thumb in order.
  const box = document.querySelector("[data-lightbox]");
  if (box) {
    const stage = box.querySelector("[data-lightbox-stage]");
    // Videos have their own in-place controls (pause/play + fullscreen),
    // so only photos open in the lightbox.
    const thumbs = Array.from(document.querySelectorAll(".thumb:not(.thumb--video)"));
    let i = 0;

    const show = (n) => {
      i = (n + thumbs.length) % thumbs.length;
      const media = thumbs[i].querySelector("img, video");
      stage.innerHTML = "";
      if (media.tagName === "VIDEO") {
        const v = document.createElement("video");
        v.src = media.currentSrc || media.querySelector("source").src;
        v.controls = true;
        v.autoplay = true;
        v.loop = true;
        v.playsInline = true;
        stage.appendChild(v);
      } else {
        const img = document.createElement("img");
        img.src = media.src;
        img.alt = media.alt;
        stage.appendChild(img);
      }
    };
    const open = (n) => {
      show(n);
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
    };
    const close = () => {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
      stage.innerHTML = "";
    };

    thumbs.forEach((t, n) => t.addEventListener("click", () => open(n)));
    box.querySelector("[data-lightbox-close]").addEventListener("click", close);
    box.querySelector("[data-lightbox-prev]").addEventListener("click", () => show(i - 1));
    box.querySelector("[data-lightbox-next]").addEventListener("click", () => show(i + 1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(i - 1);
      if (e.key === "ArrowRight") show(i + 1);
    });
  }

  /* ---- Craft video controls (pause/play + fullscreen) --------------- */
  // Videos autoplay muted, so the toggle starts on "pause"; pausing flips it
  // to "play". The second button opens the clip full screen for a bigger view.
  document.querySelectorAll(".thumb--video").forEach((wrap) => {
    const video = wrap.querySelector("video");
    const toggle = wrap.querySelector("[data-video-toggle]");
    const fsBtn = wrap.querySelector("[data-video-fs]");
    if (!video) return;

    const syncIcon = () => {
      toggle.classList.toggle("is-paused", video.paused);
      toggle.setAttribute("aria-label", video.paused ? "Play" : "Pause");
    };
    toggle &&
      toggle.addEventListener("click", () => {
        if (video.paused) video.play();
        else video.pause();
      });
    video.addEventListener("play", syncIcon);
    video.addEventListener("pause", syncIcon);
    syncIcon();

    fsBtn &&
      fsBtn.addEventListener("click", () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen(); // iOS Safari
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
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
