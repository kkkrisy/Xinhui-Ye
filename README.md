# Xinhui Ye — personal website

A static, multi-page site built from your wireframes and the visual system in `DESIGN.md`
(editorial color-blocking: deep indigo / warm cream / peach, bold-grotesque display + serif
body, flat surfaces, pill controls, sharp-cornered media).

## Files

```
index.html        About — "The Story So Far"  (landing page)
highlights.html   "Highlights Along the Way"  (6 highlights)
work.html         "Roles I've Held" + "Certificates I've gained"
craft.html        "Things I do When I'm Not Working" (gallery)
contact.html      "Want to get in touch?"
detail.html       Reusable detail template (single highlight / single work)
assets/styles.css Design tokens + components (one source of truth)
assets/script.js  Nav menu, accordions, carousel dots, form handling
assets/portrait.jpg Your photo (the only real image so far)
```

Open `index.html` in a browser, or drop the whole folder on any static host
(GitHub Pages, Netlify, Vercel, etc.). No build step.

## How to edit

- **Text & content** live directly in the `.html` files — just edit the words.
- **Colors, fonts, spacing** all live at the top of `assets/styles.css` as CSS variables.
- **Images:** every grey block is a placeholder. Replace by putting a real image inside the
  `.media` box, e.g. `<div class="media media--wide"><img src="assets/my-photo.jpg" alt="…"></div>`.
  Media stays sharp-cornered and fills its box automatically.

## ⚠️ Things to verify (I made a judgment call)

1. **Display font.** `DESIGN.md` specifies a *bold grotesque*, so I used **Archivo**. Your
   wireframe headings used a *rounded* face. To switch, change `--display` in `styles.css`
   to e.g. `'Fredoka'` or `'Baloo 2'` (and add it to the Google Fonts `@import` line). One edit.
2. **PhD years.** Your thesis bio says you began in 2018 and defended 14 Jan 2026; your CV
   says 2019–2025. I used **2018–2026** on the About page. Confirm which is right.
3. **After-school school name.** Your CV doesn't name it; an early wireframe said "SALTO
   international school". I left it generic ("after-school programs") with a flag. Add the name.
4. **"Two Talks at INTERACT · Brazil."** INTERACT is the IFIP HCI conference (matches your
   IFIP paper), but I couldn't confirm the *Brazil* venue or year — flagged in-page.
5. **Work roles set.** Your About page lists Coach ×2, Tutor, Vice Leader; the Work wireframe
   also shows "Design Researcher". I included all six. Confirm the list and order.

## ✏️ Placeholders to fill (marked in-page with coral dashed tags)

- **Social links** — LinkedIn, Google Scholar, Instagram all point to `#`. Add your URLs in the footer of each page.
- **Contact form** — no backend yet. To actually receive messages, point the `<form>` at a
  service like Formspree/Getform, or wire your own endpoint. Right now Submit just shows a note.
- **Images** — swap all placeholders for high-res photos (you mentioned doing this later).
- **Detail pages** — only one template (`detail.html`) exists, filled with "Defense Day".
  Duplicate it per highlight/role and relink the "Read more" buttons.
- **Dates/details** — RtD coach and 3D-modeling tutor need dates; skills list on Work is editable.

### Removing the edit markers
The coral dashed "EDIT ME / VERIFY" tags are the `.flag` spans. Delete them as you resolve each,
or hide them all at once by deleting the `.flag { … }` rule in `styles.css`.

## Notes on the design system
- Coral (`#FC9073`) is used **only** for the "Xinhui Ye" wordmark — the brand signal.
- Mint (`#9EE2D3`) appears only on the mobile MENU pill — one pop per screen.
- I did **not** include the "Substack" block from `DESIGN.md`; that was specific to that brand.
