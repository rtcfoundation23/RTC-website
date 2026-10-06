# Handoff — RTC Foundation website

This file exists so a new Claude Code session, opened in this folder, can pick up work on
this site without re-deriving context. Read this first, then `README.md` for the
deploy/asset-replacement mechanics. Once you've absorbed this, it's fine to delete this file
(or leave it — it won't affect the site either way, it's not linked from anywhere).

## What this is

A static marketing/tribute website for **RTC Foundation** (Rita_Tia_Chichi Foundation), a
Ghana-based health charity (Kumasi, Ashanti Region) working on road traffic accidents, cancer,
and neurological disease. Plain HTML/CSS/JS — no build step, no framework, no backend, no
database. Deployed on **Netlify**. This folder is a git repo (`git init` already run) with
**no commits yet** — everything is currently untracked. That's the first thing to sort out if
the user asks you to deploy or push.

## The origin story (important — this shapes all the copy)

**"RTC" is not just an acronym for the three focus areas — it's literally three people's
names.** Rita, Tia, and Chichi were classmates at KSMD (KNUST School of Medicine and
Dentistry), training together to become doctors. During their clinical years, the founders'
class lost all three — Tia to a road traffic accident, Rita to cancer, Chichi to a
neurological illness. The class founded this foundation in their memory, and the three focus
areas (Road Traffic Accidents / Cancer / Neurological Disease) map directly onto how each of
them died. The logo mark (brain + cancer ribbon + exclamation mark) is a direct visual
reference to this.

This is documented properly on `inspiration.html` ("Our Inspiration" in the nav). **Treat this
content carefully** — it's a memorial for real, named, deceased people. Don't invent details
about them, don't change the tone to something flippant, and if asked to add more biographical
detail, prefer asking the user for it over inventing it. The tribute photos
(`assets/img/tribute-*.jpg`) are real cropped photos of the three people, confirmed by the user
after an initial name/photo mismatch was caught and corrected — if new photos ever come in,
double-check the name-to-face mapping explicitly with the user before publishing; getting this
wrong is the kind of mistake that can't be gracefully undone.

## Files

```
index.html            Landing page (hero, about, focus, activities, membership, signup, partners)
inspiration.html       "Our Inspiration" — the Rita/Tia/Chichi tribute page
styles.css              All styles, shared by both pages
script.js                Mobile nav, reduced-motion video swap, mailto sign-up form
assets/img/             Logo, icon (+ white variant), hero photo, tribute photos, video posters
assets/video/           Animated logo mark (nav+footer) and the "our story" video (About section)
README.md               Deploy instructions + asset-replacement notes (read this too)
```

## Brand basics

- Colors: navy `#23409c`, cyan `#0fe7ec`, near-black ink `#020202`, off-white `#f7f9fc`, white.
- Fonts: Poppins (600/700, display/headings) + Inter (body), loaded from Google Fonts.
- Logo: brain (neurological) + cancer ribbon + exclamation mark (road danger), navy/cyan
  gradient. `logo.png` (horizontal lockup) and `icon.png` (mark only) were extracted from a
  brand PDF via chroma-keying a JPEG page render — they work but aren't vector-crisp. Swap for
  true transparent originals if the user ever provides them (see README).
- Voice: warm, plain-spoken, evergreen (the original brief explicitly said: no dates, no
  one-off event references, nothing that goes stale — time-sensitive stuff belongs on social
  media, which is linked in the footer).

## How the hero got to its current state (read this before "improving" it again)

The hero went through many iterations in the same session that produced this codebase. If you're
asked to change it again, know what's already been tried and rejected, so you don't loop back
into a discarded approach without realizing it:

1. **Video as literal full-bleed background, text overlaid directly on it** — rejected: the
   video's logo animation is large relative to any crop, so it always ended up visually
   colliding with the headline no matter how the crop was positioned.
2. **Split-screen (text panel | video panel)** — worked, but the user found the plain-white
   result "boring."
3. **Video full-bleed at low opacity as a watermark, text overlaid** — legibility was fine but
   still felt flat.
4. **Video recolored navy/blue via `sepia+hue-rotate` filter, full navy gradient background** —
   visually bold but the user felt it looked "clumsy"/"terrible" combined with text.
5. **Current approach**: a real photograph (child in Ghana, natural background) as the
   full-bleed hero image, with a two-layer dark scrim gradient (heavier over the text on the
   left, easing off toward the photo's focal point) for guaranteed contrast, white/cyan text,
   and a large (~14% opacity) white icon-mark watermark ghosted into the bottom-right corner for
   visual interest without competing with anything. **This is the version the user was happy
   with.** The animated logo video was moved out of the hero entirely — it now lives small in
   the nav (top-left, 36px) and footer (72px), both looping/autoplaying/muted, both using
   `mix-blend-mode: multiply` so the video's white background disappears into the surrounding
   light background instead of showing as a box.

If asked to touch the hero again, preview actual rendered frames (not just one screenshot) —
several past regressions only showed up on specific animation frames or specific viewport
widths, not the first thing rendered.

## Technical gotchas worth knowing

- **`[hidden]` attribute vs `display:block` specificity bug**: several elements (the
  reduced-motion fallback `<img class="logo-still">`, `<img id="heroStill">` historically) use
  the `hidden` attribute to toggle visibility via JS. If you ever write a rule like
  `.some-class { display: block; }` that matches such an element, it silently overrides the
  browser's built-in `[hidden] { display: none }` (equal specificity, author stylesheet wins),
  leaving the "hidden" element permanently visible. This bit the project twice already. The
  fix pattern in use: always pair such a rule with `.logo-still[hidden] { display: none; }`
  (higher specificity, wins regardless of source order). Follow this pattern for any new
  video/still toggle pairs.
- **`mix-blend-mode: multiply` for logo-on-light-background blending**: used on `.nav-brand
  .logo-video` and `.footer-brand .logo-video`. Multiply makes a white background "disappear"
  into whatever's actually behind it (self-matching, no need to know the exact background
  color), while dark line art stays visible. This only works cleanly against light/white
  backgrounds — don't reuse it against a dark or photo background (tried a similar hue-rotate
  recolor trick against a navy background earlier; it was fragile and got scrapped).
- **`.site-header` must stay fully opaque**: it used to be `rgba(255,255,255,0.92)` with
  `backdrop-filter: blur()`. Because the header sits directly over the hero's darkest corner on
  every page load, that 8% translucency let the hero's dark scrim bleed through, which then
  visibly threw off the multiply-blended logo. Keep it as a solid `var(--white)` unless you
  re-verify the blend against every background the header can sit over.
- **`.hero-actions` button color overrides must stay scoped to `.hero`**: `.hero-actions
  .btn-primary`/`.btn-outline` are overridden to white-filled/white-outline for the dark photo
  hero. `.hero-actions` as a class is reused on `inspiration.html`'s closing CTA (light
  background) — an unscoped override there made a button render white-on-white (invisible).
  Current selectors are correctly scoped as `.hero .hero-actions .btn-*`. If you add another
  `.hero-actions` block elsewhere, don't let it inherit hero-specific colors.
- **Focus rings**: default `:focus-visible` outline is navy (`--navy`), which is invisible on
  the hero's dark scrim — `.hero :focus-visible { outline-color: var(--cyan); }` handles that.
  If you add other dark-background sections, replicate this.
- **`hero-child-cutout.png`** in `assets/img/` is an orphaned asset from an earlier hero
  layout (a background-removed cutout photo of the same child used as the hero photo now). Not
  referenced anywhere. Safe to delete, or leave it — the user's call, previously flagged and
  never addressed either way.

## Content/structural notes

- Both `index.html` and `inspiration.html` duplicate the nav and footer markup (no templating
  since this is a zero-build static site). If you edit nav links, footer links, or the
  logo-video markup, **update both files**.
- Nav includes an "Our Inspiration" link (`inspiration.html`) with `aria-current="page"` styling
  already wired up for when you're on that page.
- Footer social links: Instagram, X/Twitter, LinkedIn, YouTube are live (canonical URLs, tracking
  params stripped from what the user originally pasted). **Facebook is still `href="#"`** —
  no URL was ever provided. Contact email is `rtcfoundation23@gmail.com` (used in the footer
  mailto link and in the sign-up form's mailto submission in `script.js`).
- The "Get Involved" sign-up form has no backend — it builds a `mailto:` link client-side. A
  comment in the HTML shows exactly how to swap in a Google Form iframe later if they outgrow
  this.
- The About section's video (`assets/video/our-story.*`) is a real video from an RTC
  Foundation anniversary event — it plays **with sound and visible controls**, not
  autoplay/muted (deliberately different from the decorative logo videos in nav/footer).

- The About section has a **second video**, `assets/video/rtc-intro.mp4` (poster
  `assets/img/rtc-intro-poster.jpg`): the class's medical-school intro covering mission, vision
  and backstory (~3 min, 640x352, compressed 24MB to 12MB). It sits after the vision paragraph in a
  `<figure class="about-video about-video--wide">` (640px max, vs 420px for the square one). mp4
  only, `preload="none"`, with sound and controls. No captions yet; add a WebVTT `<track>` if the
  user supplies a transcript. The end credit card names the videographer, not RTC.

## Performance + logo blend work (latest)

- **Why the footer logo sometimes looked like a video in a box:** the animation's "white" background
  wasn't pure white (grey haze + noise) and the baseline line runs edge to edge, so wherever the
  `mix-blend-mode: multiply` didn't apply (some browsers don't blend hardware-decoded video), a
  faint rectangle showed against the off-white footer. Fixed at the source: the clip was re-encoded
  at 640x360 with a `curves` filter that clips near-white to exactly 255 (verified in-browser: every
  decoded frame's background is 255,255,255), with explicit bt709/tv colour tags, **and** the footer
  background is now pure white. Multiply is kept as a third layer. Recipe is in the README.
- **Speed:** self-hosted fonts (removed Google Fonts), responsive `srcset` for the hero photo,
  footer logo lazy-starts via IntersectionObserver (also pauses off-screen), About videos
  `preload="none"`, long cache headers in `netlify.toml`. Page weight on first load dropped to roughly
  120KB of new transfers on a phone (fonts 64KB, CSS 25KB, hero 32KB, nav animation ~130KB).
- The `[data-lazy]` footer video is not `autoplay` in HTML on purpose; `script.js` starts it. Keep
  that attribute pair if you touch the footer markup in either page.

## Donations (added after the original handoff)

- `index.html#donate` ("Support Our Work", navy band between "What We Do" and "Who Can Join")
  holds the real payment details: GCB Bank PLC (account name Rita Tia Chichi Foundation LGB,
  6271180002409), MTN MoMo (0538859526), MoMo Pay ID 183451, transcribed from the foundation's
  own "Donation Avenue" graphic and re-verified digit by digit. **Never edit these from memory** —
  confirm against the official graphic or the user.
- Copy buttons read the number from the sibling `.donate-number` text (single source of truth;
  logic in `script.js`). Tested via stubbed clipboard for both the Clipboard API and the
  `execCommand` fallback; a genuine trusted-click test on a phone is still worth doing once live.
- All Donate buttons route there. On phones the nav shows a compact Donate pill beside the
  hamburger (`.nav-donate-mobile`) and hides the in-menu duplicate (`.nav-menu-donate`) — that
  markup is duplicated in `inspiration.html` too, and uses `index.html#donate` as the target.
- The hero's buttons were deliberately left alone ("Get Involved" + "Find us on social media").

## Known outstanding items (not yet resolved, not necessarily urgent)

- **Patrons are intentionally NOT on the site.** Two named patrons were added and then removed
  because neither had confirmed accepting that role. The section is a plain "Partners" section
  again (heading, lede, and list all say partners only). Don't re-add any named patron, or a
  "Patrons" heading, until the user says each person has confirmed.

- Facebook footer link needs a real URL.
- `hero-child-cutout.png` — orphaned, unresolved whether to delete.
- `logo.png`/`icon.png` are chroma-keyed from a PDF page render, not true vector/transparent
  originals — fine quality-wise but could be crisper if the user ever has real source files.
- The hero/nav/footer animation (`assets/video/hero-animation.*`) was described by the user as
  a **draft** early in the project ("I'll drop the real files in before deploying") — it may
  still be a placeholder rather than final. Worth confirming before launch.
- Git repo here has no commits yet — nothing has been pushed to GitHub or connected to Netlify
  from this session's side. If the user says it's "hosted on Netlify" already, that likely
  happened via Netlify's drag-and-drop deploy (per the README's instructions) rather than a
  git-connected deploy — worth asking which, since that changes how future updates should ship.

## Working style notes from this project

- The user iterates visually and directly — expect a lot of "try X", look at it, "no, do Y
  instead." Preview changes in the actual browser before declaring something done; several
  bugs in this project were only caught by watching the animation through multiple frames or
  testing at multiple viewport widths, not from reading the CSS.
- The user asked, more than once, to be given 2-3 concrete options with tradeoffs for
  subjective design calls rather than a single unilateral choice — that pattern landed well
  each time it was used (see `AskUserQuestion`-style option sets in this session's transcript
  if you have access to it).
- For anything touching the Rita/Tia/Chichi content specifically: slow down, confirm facts,
  don't guess.
