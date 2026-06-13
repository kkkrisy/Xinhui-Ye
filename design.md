---
name: Jess Hill
description: Editorial author-and-journalist brand built on deep-indigo color blocking, warm cream and peach canvases, a coral signal accent, and a bold-grotesque / transitional-serif type pairing.
colors:
  surface: "#FFFEF9"
  surface-container-lowest: "#FFFFFF"
  surface-container: "#FFEFD6"
  surface-container-high: "#F2F1ED"
  surface-variant: "#FFEFD6"
  background: "#FFFEF9"
  on-background: "#2E2E38"
  on-surface: "#2E2E38"
  on-surface-body: "#45454D"
  on-surface-variant: "#76767A"
  outline: "#76767A"
  outline-variant: "#F2F1ED"
  inverse-surface: "#333462"
  inverse-on-surface: "#FFEFD6"
  primary: "#333462"
  on-primary: "#FFEFD6"
  primary-container: "#3E3F7F"
  on-primary-container: "#FFEFD6"
  secondary: "#FC9073"
  on-secondary: "#333462"
  secondary-alt: "#FF9574" # uncertain - verify on live site (coral reads ~#FC9073 in logo, ~#FF9574 in footer heading; likely one gradient token)
  tertiary: "#9EE2D3"
  on-tertiary: "#333462"
  input-surface: "#E2E2E2"
typography:
  display-xl:
    fontFamily: "Söhne, 'Neue Haas Grotesk', Arial, sans-serif" # uncertain - verify on live site (heavy grotesque sans)
    fontSize: 80px # approximate from desktop screenshots
    fontWeight: "800"
    lineHeight: 84px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: "Söhne, 'Neue Haas Grotesk', Arial, sans-serif" # uncertain - verify on live site
    fontSize: 56px # approximate
    fontWeight: "800"
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: "Söhne, 'Neue Haas Grotesk', Arial, sans-serif" # uncertain - verify on live site
    fontSize: 40px # approximate
    fontWeight: "700"
    lineHeight: 46px
    letterSpacing: -0.01em
  nav-link:
    fontFamily: "Söhne, 'Neue Haas Grotesk', Arial, sans-serif" # uncertain - verify on live site
    fontSize: 44px # approximate (full-screen menu)
    fontWeight: "700"
    lineHeight: 52px
    letterSpacing: -0.01em
  quote-lg:
    fontFamily: "Spectral, Georgia, serif" # uncertain - verify on live site (transitional serif)
    fontSize: 30px # approximate
    fontWeight: "400"
    lineHeight: 40px
  title-serif:
    fontFamily: "Spectral, Georgia, serif" # uncertain - verify on live site
    fontSize: 22px # approximate
    fontWeight: "500"
    lineHeight: 30px
  body-lg:
    fontFamily: "Spectral, Georgia, serif" # uncertain - verify on live site
    fontSize: 17px # approximate
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: "Spectral, Georgia, serif" # uncertain - verify on live site
    fontSize: 16px # approximate
    fontWeight: "400"
    lineHeight: 26px
  label-caps:
    fontFamily: "Söhne, 'Neue Haas Grotesk', Arial, sans-serif" # uncertain - verify on live site
    fontSize: 12px # approximate
    fontWeight: "700"
    lineHeight: 16px
    letterSpacing: 0.08em
  button-label:
    fontFamily: "Söhne, 'Neue Haas Grotesk', Arial, sans-serif" # uncertain - verify on live site
    fontSize: 13px # approximate
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 4px # uncertain - verify on live site
  md: 8px # uncertain - verify on live site
  lg: 16px # uncertain - verify on live site
  full: 9999px
spacing:
  unit: 8px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  2xl: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-label}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 0 28px
  button-primary-container:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.button-label}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 0 28px
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.button-label}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 0 24px
  button-outline-on-dark:
    backgroundColor: transparent
    textColor: "{colors.inverse-on-surface}"
    typography: "{typography.button-label}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 0 24px
  menu-pill:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.button-label}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0 20px
  pill-toggle:
    backgroundColor: "{colors.input-surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0 18px
  section-label:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.label-caps}"
  nav-link:
    backgroundColor: transparent
    textColor: "{colors.inverse-on-surface}"
    typography: "{typography.nav-link}"
  input-underline:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "0px"
    height: 44px
    padding: 8px 0
  card-media:
    backgroundColor: "{colors.surface-container-high}"
    rounded: "0px"
  hero-panel-dark:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-on-surface}"
    padding: 96px
  section-panel-peach:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    padding: 96px
  back-to-top:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.inverse-on-surface}"
    typography: "{typography.button-label}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0 16px
---

## Brand & Style

This is the personal brand of an award-winning Australian author and journalist whose work covers power, coercive control and social change. The visual identity is **editorial and activist**: serious enough to carry heavy subject matter, but warm and human rather than clinical. The personality reads as confident, literary and direct.

The system is built on **full-bleed color blocking** rather than cards-on-a-canvas. Long pages alternate between three flat fields — a warm near-white (`#FFFEF9`), a soft peach (`#FFEFD6`), and a deep indigo (`#333462`) — with content stacking edge to edge inside each band. A single coral accent (`#FC9073`) acts as the brand "signal", reserved almost entirely for the wordmark and the recurring "How Do You Smash a Ghost?" Substack prompt. A mint pill (`#9EE2D3`) supplies one small, deliberate pop in the navigation.

Type does the heavy lifting: oversized **bold-grotesque** display headings set the journalistic tone, while a **transitional serif** carries body copy and pull-quotes, lending the gravitas of a broadsheet or literary essay. The overall feel is flat, print-like and high-contrast — depth comes from color and scale, not shadow.

## Colors

The palette is a four-field system — two light grounds, one dark ground, and three accents — kept deliberately small.

- **Surface / Background (`#FFFEF9`):** The warm off-white default ground for most reading sections. Softer than pure white; pure white (`#FFFFFF`) appears only inside media and form fills.
- **Surface Container (`#FFEFD6`):** A soft peach panel used to set narrative sections apart (the Backstory, Cats, "Upcoming Events" bands). It is the primary tool for sectioning a long page.
- **Surface Container High (`#F2F1ED`):** A barely-there warm grey for hairline dividers and neutral media placeholders.
- **Inverse Surface (`#333462`):** The signature deep indigo. Used full-bleed for the hero, the recurring Substack/footer block, and feature CTAs. Carries cream text.
- **Primary (`#333462`):** The same indigo doubles as the high-emphasis action color — solid primary buttons (Submit, Contact to Hire) and large headings on light grounds. **On-primary** text is cream (`#FFEFD6`).
- **Primary Container (`#3E3F7F`):** A lighter indigo for buttons that sit *inside* the dark indigo panels (Go to Substack, Back to Top), so they separate from the field behind them.
- **Secondary (`#FC9073`):** Coral — the brand signal. Reserved for the wordmark and the "How Do You Smash a Ghost?" headline. Use sparingly; it loses meaning if spread across general UI. A slightly warmer `#FF9574` appears in the footer instance and is treated as the same token (likely one gradient).
- **Tertiary (`#9EE2D3`):** Mint. A single accent for the MENU pill. One pop per screen, maximum.
- **On-surface (`#2E2E38`)** for headings and **On-surface-body (`#45454D`)** for paragraph text; **On-surface-variant (`#76767A`)** for metadata, captions, dates and small labels.
- **Outline (`#76767A`)** for input borders and pill outlines; **Outline-variant (`#F2F1ED`)** for the thin rules that separate list rows.

## Typography

A two-family pairing carries the entire system.

- **Display & UI — bold grotesque sans (family uncertain; verify on live site).** Used for every large heading, the full-screen navigation links, small uppercase section labels and button text. Display sizes are very large, very heavy (700–800), with tight tracking and tight leading so multi-line titles ("The Story So Far", "Beyond The Headlines") read as solid blocks.
- **Reading & editorial — transitional serif (family uncertain; verify on live site).** Used for body paragraphs, serif subheads ("Your Details", "Invite Jess Hill To Speak") and the large regular-weight pull-quotes drawn from press. The serif signals literary, long-form credibility.
- **Section labels (`label-caps`):** Small, bold, uppercase, letter-spaced grotesque (e.g. RECENT CAREER, AWARDS, DIRECTOR:, EMAIL:). They anchor the left margin and act as eyebrow labels above serif or display content.
- **Hierarchy by scale, not weight:** Contrast between display and body is created chiefly through dramatic size jumps and the sans/serif switch, not through many intermediate weights.

> Font sizes in the tokens are approximate, read from desktop screenshots; confirm exact values and the two font families against the live site before shipping.

## Layout & Spacing

The layout is a single-column editorial flow on an 8px base grid, organized by full-width horizontal bands.

- **Color-blocked sections:** Each major section is a full-bleed band in one of the three ground colors. Transitions between bands are abrupt and hard-edged — there is no overlap, gradient or shadow between them.
- **Left-margin eyebrow labels:** Uppercase section labels sit in the far-left column, with the section's heading and content set to their right — a consistent two-part rhythm down the page.
- **Generous vertical rhythm:** Sections use large top/bottom padding (≈96px on desktop) so each band breathes; content groups inside use 24–40px gaps.
- **Asymmetric heroes:** Page heroes pair an oversized left-aligned display title with a single supporting image or short serif standfirst on the right.
- **Media galleries & carousels:** Horizontal, swipeable rows (awards, backstory timeline, testimonials) with circular prev/next controls and dot indicators.

## Elevation & Depth

This system is intentionally **flat**. There is effectively no drop-shadow language.

- **Depth through color, not shadow:** Separation between regions is achieved by switching ground color (cream → peach → indigo), not by lifting elements onto cards.
- **Hairline dividers:** Within a single ground, list rows are separated by 1px `outline-variant` (`#F2F1ED`) rules rather than containers.
- **Print-like flatness:** Buttons, pills and images sit directly on their ground with no elevation. Treat the page like a printed editorial spread; if you reach for a shadow, switch to a color band or a divider instead.

## Shapes

Two shape registers only: **fully round interactive elements** and **sharp-cornered media/structure**.

- **Pills (`rounded.full`):** Every button, toggle and control is a full pill — primary CTAs, outline buttons, the MENU pill, the contact radio pills, Back to Top. This is the dominant shape motif.
- **Sharp media (`0px`):** Images, video thumbnails, the book cover and full-bleed panels use square corners. Keep photography and structural panels hard-edged.
- **Small radii (`sm`/`md`/`lg`):** Defined for incidental surfaces but rarely seen in source; prefer pill-or-square before using an intermediate radius.

## Components

### Buttons

Primary actions are solid indigo pills with cream uppercase labels (`button-primary`). When a button sits inside a dark indigo band, use the lighter `button-primary-container` (`#3E3F7F`) fill so it reads against the field. Secondary/tertiary actions are **outline pills** — transparent fill with a 1px border — in the on-ground text color (`button-outline` on light, `button-outline-on-dark` on indigo). Coral is never a button fill.

### Navigation

A persistent wordmark (coral) sits top-left with a MENU control top-right. Open navigation is a full-screen indigo overlay with large cream grotesque links (`nav-link`), a mint CLOSE/MENU pill, and the Substack prompt + social links anchored bottom-left.

### Menu & Toggle Pills

The MENU pill is the lone mint element (`menu-pill`, navy text on `#9EE2D3`). Form category selectors are neutral grey pills (`pill-toggle`, `#E2E2E2`) that presumably fill or outline in indigo when active.

### Forms

Inputs are **underline-only** fields — transparent background, single bottom border, label as placeholder (`input-underline`). Radio reasons render as grey pills. Submit is a solid indigo primary pill. Keep forms airy and label-light.

### Media & Cards

Images are sharp-cornered and flat (`card-media`), captioned beneath in `on-surface-variant` with a small uppercase date stamp. Galleries scroll horizontally with circular arrow controls.

### Recurring Brand Block

The "How Do You Smash a Ghost?" Substack block is a fixed motif: indigo ground, coral headline, short serif/sans description, and a `primary-container` "Go to Substack" pill. It recurs in the footer of most pages and should stay visually identical wherever it appears.

## Do's and Don'ts

**Do**
- Do build pages as full-bleed color bands, alternating cream, peach and indigo to chunk long content.
- Do pair bold-grotesque display headings with serif body copy — the sans/serif contrast is the core of the identity.
- Do reserve coral (`#FC9073`) for the wordmark and the Substack prompt; treat it as a signal, not a utility color.
- Do make every interactive control a full pill, and keep all imagery sharp-cornered.
- Do use the far-left uppercase eyebrow label above each section's heading.
- Do separate list rows with 1px `#F2F1ED` hairlines rather than cards.

**Don't**
- Don't add drop shadows, glows or raised cards — depth is color-blocking, not elevation.
- Don't use coral as a button fill or spread it across general UI; don't pair white text on coral.
- Don't round image corners or square off buttons — that inverts the shape system.
- Don't introduce a third type family or rely on many intermediate weights; let scale and sans/serif carry hierarchy.
- Don't place the lighter indigo (`#3E3F7F`) buttons on light grounds — they're for use inside dark indigo bands; use solid `primary` on light grounds.
- Don't add more than one mint accent per screen.

## Agent Prompt Guide

When generating UI in this system:

1. **Pick a ground first.** Choose cream (`#FFFEF9`) for reading, peach (`#FFEFD6`) to set a narrative section apart, or indigo (`#333462`) for heroes, CTAs and the Substack block. Lay the page out as a vertical stack of these full-width bands.
2. **Label, then headline, then body.** Lead each section with a small uppercase grotesque eyebrow (`label-caps`) in the left margin, a large grotesque heading (`headline-lg`/`display-lg`), then serif body (`body-lg`).
3. **Match text color to ground.** On light grounds use `on-surface` (`#2E2E38`) headings and `on-surface-body` (`#45454D`) paragraphs; on indigo use cream (`#FFEFD6`).
4. **Buttons are pills.** Solid `primary` on light grounds, `primary-container` when inside indigo, outline pills for secondary actions. Uppercase, letter-spaced labels.
5. **Spend accents carefully.** Coral only for the wordmark / Substack headline; mint only for the menu pill. Everything else is indigo, cream, peach and greys.
6. **Stay flat.** No shadows. Separate with color bands or `#F2F1ED` hairlines. Keep all photography square-cornered.
7. **Verify before shipping:** confirm the two font families and exact type sizes on the live site, and confirm the coral token (`#FC9073` vs `#FF9574`) — these are marked uncertain.
