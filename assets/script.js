/* Xinhui Ye — shared interactions
   Progressive enhancement: everything works as plain HTML if JS is off. */

document.addEventListener("DOMContentLoaded", () => {
  /* Phone-sized viewport? The mobile-only enhancements below (read-more
     clamps, dots, folding) key off this and re-apply if it changes. */
  const mobileMQ = window.matchMedia("(max-width: 760px)");
  const onMobileChange = (fn) => {
    if (mobileMQ.addEventListener) mobileMQ.addEventListener("change", fn);
    else if (mobileMQ.addListener) mobileMQ.addListener(fn);
  };

  /* ---- Mobile menu overlay ------------------------------------------ */
  const overlay = document.querySelector(".nav-overlay");
  const openBtn = document.querySelector("[data-menu-open]");
  const closeBtn = document.querySelector("[data-menu-close]");

  const setMenu = (open) => {
    if (!overlay) return;
    overlay.classList.toggle("is-open", open);
    overlay.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (openBtn) {
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      openBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  };
  /* One pill does both: it stays on top of the overlay and morphs
     (dashes → cross), so clicking it again closes the menu. */
  openBtn && openBtn.setAttribute("aria-expanded", "false");
  openBtn &&
    openBtn.addEventListener("click", () =>
      setMenu(!overlay.classList.contains("is-open"))
    );
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

  /* Dot indicators for any horizontal reel (phones): one dot per item,
     synced to the swipe. Built once; CSS keeps them hidden on desktop. */
  const buildDots = (host, track, items) => {
    if (items.length < 2) return;
    const dots = document.createElement("div");
    dots.className = "dots dots--auto";
    const buttons = items.map((item, n) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Go to item " + (n + 1));
      b.addEventListener("click", () =>
        track.scrollTo({ left: item.offsetLeft - track.offsetLeft, behavior: "smooth" })
      );
      dots.appendChild(b);
      return b;
    });
    // no host → the dots sit directly after the reel (display:none on desktop)
    if (host) host.appendChild(dots);
    else track.insertAdjacentElement("afterend", dots);

    let ticking = false;
    const syncDots = () => {
      ticking = false;
      let nearest = 0;
      let best = Infinity;
      items.forEach((item, n) => {
        const d = Math.abs(item.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (d < best) { best = d; nearest = n; }
      });
      // scrolled to the end → the last item is the one in view, even if it
      // couldn't travel all the way to the snap point
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll > 0 && track.scrollLeft >= maxScroll - 2) nearest = items.length - 1;
      buttons.forEach((b, n) => b.classList.toggle("is-active", n === nearest));
    };
    track.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(syncDots); }
    }, { passive: true });
    syncDots();
  };

  /* ---- Carousels (horizontal scroll with circular controls) --------- */
  document.querySelectorAll("[data-carousel]").forEach((wrap) => {
    const track = wrap.querySelector("[data-carousel-track]");
    const prev = wrap.querySelector("[data-carousel-prev]");
    const next = wrap.querySelector("[data-carousel-next]");
    if (!track) return;
    // Paged carousels advance by exactly one full view of cards
    // (2 on desktop, 1 on phones where a single card fills the view).
    const paged = wrap.hasAttribute("data-carousel-page");
    const step = () => {
      if (paged) {
        const card = track.firstElementChild;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const cardW = card ? card.getBoundingClientRect().width : track.clientWidth / 2;
        return (cardW + gap) * (mobileMQ.matches ? 1 : 2);
      }
      return Math.max(track.clientWidth * 0.8, 280);
    };
    prev && prev.addEventListener("click", () =>
      track.scrollBy({ left: -step(), behavior: "smooth" })
    );
    next && next.addEventListener("click", () =>
      track.scrollBy({ left: step(), behavior: "smooth" })
    );

    buildDots(wrap, track, Array.from(track.children));
  });

  /* Craft gallery reels (phones): dots under each swipeable group */
  document.querySelectorAll(".gallery-group").forEach((group) => {
    const grid = group.querySelector(".thumb-grid");
    if (grid) buildDots(group, grid, Array.from(grid.children));
  });

  /* Longitudinal reels (phones): the data-collection deck and the five
     pattern blocks swipe sideways. The patterns get wrapped in a reel
     container that is display:contents on desktop, so nothing changes
     there. Dots land right below each reel. */
  const deckStage = document.querySelector(".deck-stage");
  if (deckStage) buildDots(null, deckStage, Array.from(deckStage.children));
  const patternBlocks = Array.from(document.querySelectorAll(".photo-feature .pattern-block"));
  if (patternBlocks.length > 1) {
    const reel = document.createElement("div");
    reel.className = "pattern-reel";
    patternBlocks[0].insertAdjacentElement("beforebegin", reel);
    patternBlocks.forEach((b) => reel.appendChild(b));
    buildDots(null, reel, patternBlocks);
  }

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

    // Swipe left/right anywhere on the overlay steps through the photos.
    let touchX = 0, touchY = 0;
    box.addEventListener("touchstart", (e) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    box.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        show(dx < 0 ? i + 1 : i - 1);
      }
    }, { passive: true });
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

  /* ---- Contact form → Web3Forms → email ----------------------------- */
  // Submits via fetch so the visitor stays on the page; on success the form
  // is swapped for the thank-you panel. The access key lives in a hidden
  // field in contact.html.
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    const success = form.parentElement.querySelector("[data-contact-success]");
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      // The form carries `novalidate`, so enforce the required fields here and
      // surface the browser's native prompts instead of sending an empty form.
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Submission failed");
        form.hidden = true;
        if (success) success.hidden = false;
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        }
        alert(
          "Sorry, something went wrong sending your message. " +
            "Please email kristinyxh@gmail.com directly."
        );
      }
    });
  });

  /* ---- Thesis book flip (Defense page) -------------------------------
     Click / tap the cover (or Enter / Space) to flip it over and read the
     chapter list; flipping again returns to the front. Same interaction
     on every screen size. */
  document.querySelectorAll(".book-flip").forEach((flip) => {
    const toggleFlip = () => flip.classList.toggle("is-flipped");
    flip.addEventListener("click", toggleFlip);
    flip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleFlip(); }
    });
  });

  /* ---- Paper pile (INTERACT two-talks page) -------------------------
     Two paper cards piled up: one open, the other a peeking tab behind it.
     Clicking a card's tab brings that paper forward. Progressive: if this
     never runs, both cards stay fully expanded and readable. */
  const paperStack = document.querySelector("[data-paper-stack]");
  if (paperStack) {
    const cards = Array.from(paperStack.querySelectorAll(".paper-card"));
    if (cards.length === 2) {
      const activate = (card, userInitiated) => {
        cards.forEach((c) => {
          const isActive = c === card;
          c.classList.toggle("is-active", isActive);
          c.classList.toggle("is-peek", !isActive);
          const tab = c.querySelector(".paper-tab");
          if (tab) tab.setAttribute("aria-expanded", isActive ? "true" : "false");
        });
        if (userInitiated) card.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      /* Phones: the pile flattens into two tap-to-open papers (the first
         starts open), so the page stays short. Desktop keeps the tilted
         two-sheet pile. */
      const setHint = (card, open) => {
        const hint = card.querySelector(".paper-tab__hint");
        if (hint) {
          hint.firstChild.textContent = mobileMQ.matches
            ? (open ? "Tap to close" : "Tap to read")
            : "Bring forward to read";
        }
      };
      const setFolded = (card, open) => {
        card.classList.toggle("is-open", open);
        const tab = card.querySelector(".paper-tab");
        if (tab) tab.setAttribute("aria-expanded", open ? "true" : "false");
        setHint(card, open);
      };
      const applyMode = () => {
        if (mobileMQ.matches) {
          paperStack.classList.remove("is-piled");
          paperStack.classList.add("is-folded");
          // both papers start folded — the page opens compact
          cards.forEach((c) => {
            c.classList.remove("is-active", "is-peek");
            setFolded(c, false);
          });
        } else {
          paperStack.classList.remove("is-folded");
          paperStack.classList.add("is-piled");
          cards.forEach((c) => { c.classList.remove("is-open"); setHint(c, false); });
          activate(cards[0], false);
        }
      };
      applyMode();
      onMobileChange(applyMode);

      cards.forEach((c) => {
        // The whole card beneath is clickable (its exposed frame + tab); a
        // button in the tab keeps it keyboard-reachable and its click bubbles
        // here. In the pile, clicks inside the already-open card are ignored;
        // in the mobile fold, only the tab toggles its own paper.
        c.addEventListener("click", (e) => {
          if (paperStack.classList.contains("is-folded")) {
            if (e.target.closest(".paper-tab")) {
              const open = !c.classList.contains("is-open");
              setFolded(c, open);
              if (open) c.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
          }
          if (!c.classList.contains("is-active")) activate(c, true);
        });
      });
    }
  }

  /* ---- Takeaway CV (phones): essentials only -------------------------
     The card keeps just the photo, bio and contact; one "Download full CV"
     pill (the header Download is hidden on phones) opens the PDF in the
     browser's preview, which offers its own download / share — and reads
     far better than the stacked desktop columns would. */
  const cvShell = document.querySelector(".cv-shell");
  if (cvShell) {
    cvShell.classList.add("cv-collapsed");
    const cvLink = document.createElement("a");
    cvLink.className = "btn btn--primary btn--mint-hover cv-toggle";
    cvLink.textContent = "Download full CV";
    cvLink.href = "assets/Xinhui-Ye-CV.pdf";
    cvLink.target = "_blank";
    cvLink.rel = "noopener";
    const frame = cvShell.querySelector(".cv-frame") || cvShell;
    frame.appendChild(cvLink);
  }

  /* ---- Scroll-reveal (phones): sections rise in as you scroll -------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(
      [
        ".recent-item", "[data-carousel-page]", ".accordion-row", ".hl-item",
        ".photo-block:not(.pattern-block)", ".deck-track", ".pattern-reel",
        ".detail-split", ".detail-full",
        ".detail-prose", ".gallery-group", ".testimonials", ".cv-frame",
        ".contact-photo", ".paper-card", ".reveal-card", ".detail-figure",
        ".pull-quote", ".contact-grid form",
      ].join(", ")
    );
    let revealDone = false;
    const setupReveal = () => {
      if (revealDone || !mobileMQ.matches) return;
      revealDone = true;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );
      targets.forEach((el) => {
        el.classList.add("reveal-init");
        io.observe(el);
      });
    };
    setupReveal();
    onMobileChange(setupReveal);
  }

  /* ---- Coaching frames (phones): the two coaching sections swipe sideways
     as separate framed cards instead of stacking. On desktop .coach-frame
     stays a single shared box (CSS), so nothing changes there; the dots are
     hidden. */
  const coachFrame = document.querySelector(".coach-frame--swipe");
  if (coachFrame) buildDots(null, coachFrame, Array.from(coachFrame.children));

  /* ---- Mobile read-more (phones): clip long prose sections -----------
     On a detail page the first intro section stays full; every later prose
     section clips to a few lines with a "Read more" toggle, so the page stays
     short and scannable. Blocks that live inside their own interactive
     component (swipeable decks/reels, flip and paper cards, carousels, the
     pinboard) are left alone — those already fold themselves on phones.
     Progressive enhancement: with no JS everything shows fully and no toggle
     appears; on desktop the copy is never clipped. */
  const INTERACTIVE = ".pattern-block, .deck-track, .reveal-card, .paper-stack, " +
    ".coach-frame--swipe, [data-carousel], .testimonials, .gallery-group, .photo-scatter";
  const foldables = Array.from(
    document.querySelectorAll(".detail-blocks .block-copy, .detail-blocks .detail-text")
  ).filter((el) => !el.closest(INTERACTIVE));

  // Skip index 0 — that's the intro section, which is always left full.
  foldables.slice(1).forEach((block) => {
    const isHeading = (n) =>
      n.nodeType === 1 && n.matches(".title-serif, .block-title, h2, h3, h4");
    // Move everything except the heading(s) into a clip body; headings stay
    // visible as the section handle above the fold.
    const body = document.createElement("div");
    body.className = "clip-body";
    Array.from(block.childNodes).forEach((n) => {
      if (isHeading(n)) return;
      body.appendChild(n);
    });
    if (!body.textContent.trim()) return;   // heading-only block — nothing to clip
    block.appendChild(body);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "more-toggle";
    btn.textContent = "Read more";
    btn.setAttribute("aria-expanded", "false");
    block.appendChild(btn);

    const setOpen = (open) => {
      body.classList.toggle("is-open", open);
      body.classList.toggle("is-clipped", !open);
      btn.classList.toggle("is-open", open);
      btn.textContent = open ? "Read less" : "Read more";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    btn.addEventListener("click", () => setOpen(!body.classList.contains("is-open")));

    const applyClip = () => {
      if (mobileMQ.matches) {
        setOpen(false);                       // start clipped
        // Only fold when a meaningful amount is hidden (~2+ lines), so short
        // sections don't get a pointless toggle.
        const overflows = body.scrollHeight > body.clientHeight + 48;
        btn.style.display = overflows ? "" : "none";
        if (!overflows) body.classList.remove("is-clipped");
      } else {
        body.classList.remove("is-clipped", "is-open");
        btn.style.display = "none";
      }
    };
    applyClip();
    onMobileChange(applyClip);
  });

  /* ---- Observational deck (phones): picture-only cards ----------------
     Each data-collection card (weekly diary, board, group reflection) shows
     just its picture on phones; the whole caption — heading and copy — folds
     behind a "Read more" toggle so the swipe reel stays compact. On desktop
     the caption always shows and no toggle appears. */
  document.querySelectorAll(".deck-stage .deck-card").forEach((card) => {
    const col = card.querySelector(".deck-col");
    const grid = card.querySelector(".deck-grid") || card;
    if (!col) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "more-toggle deck-more";
    btn.textContent = "Read more";
    btn.setAttribute("aria-expanded", "false");
    grid.appendChild(btn);            // sits under the image; the caption slots between when open

    const setOpen = (open) => {
      col.classList.toggle("is-collapsed", !open);
      btn.classList.toggle("is-open", open);
      btn.textContent = open ? "Read less" : "Read more";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    btn.addEventListener("click", () => setOpen(col.classList.contains("is-collapsed")));

    const applyCollapse = () => {
      if (mobileMQ.matches) setOpen(false);         // phones: picture only, caption folded
      else { col.classList.remove("is-collapsed"); } // desktop: caption always shown (toggle hidden via CSS)
    };
    applyCollapse();
    onMobileChange(applyCollapse);
  });

  /* ---- Deter image/video saving ------------------------------------- */
  // Not bulletproof (screenshots, devtools and direct URLs still work), but
  // it blocks right-click "Save image as…" and click-drag saving.
  const blockMedia = (e) => {
    if (e.target.closest("img, video")) e.preventDefault();
  };
  document.addEventListener("contextmenu", blockMedia);
  document.addEventListener("dragstart", blockMedia);
});
