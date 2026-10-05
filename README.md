# RTC Foundation — Website

A static website for the Rita_Tia_Chichi (RTC) Foundation. Plain HTML/CSS/JS —
no build step, no backend, no database.

## Files

```
index.html           Landing page
inspiration.html      "Our Inspiration" — the story behind the foundation's name
styles.css             All styles, shared by both pages
script.js               Mobile nav, reduced-motion video swap, mailto sign-up form
assets/img/            Logo, icon, hero photo, tribute video poster
assets/video/          Animated logo mark (nav + footer) and the "our story" video
```

## Previewing locally

Just open `index.html` in a browser, or serve the folder so relative paths and
autoplay behave exactly like production:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Replacing the placeholder assets

The `assets/img/logo.png`, `assets/img/icon.png`, and `assets/video/hero-animation.mp4` /
`.webm` in this repo were generated from the brand PDF and the draft animation you shared —
they're usable as-is, but drop in final production files whenever you have them, at the same
paths:

- `assets/img/logo.png` — horizontal lockup, transparent background
- `assets/img/icon.png` — icon mark only, transparent background (used as favicon)
- `assets/img/icon-white.png` — the same icon mark recolored solid white, alpha preserved. Used
  as the large, faint (14% opacity) watermark in the hero's bottom-right corner. If you replace
  `icon.png`, regenerate this too: `ffmpeg -i icon.png -vf "format=rgba,lut=r=255:g=255:b=255" icon-white.png`
- `assets/img/hero-poster.jpg` — a still frame shown while the nav logo video loads, and shown
  in its place for visitors with "reduce motion" turned on
- `assets/img/hero-photo.jpg` — the full-bleed hero background photo. Swap for a real photo of
  the communities RTC serves whenever you have one you have usage rights to (get consent for any
  identifiable photo of a child, per standard safeguarding practice) — update the `alt` text in
  `index.html` to match, and re-check `object-position` on `.hero-photo` in `styles.css` so the
  new photo's focal point still sits clear of the text
- `assets/img/hero-child-cutout.png` — no longer used on the page (left over from an earlier hero
  layout); safe to delete, or keep if you want it for another section later
- `assets/video/hero-animation.mp4` and `.webm` — the animated logo mark, played small (36px in
  the nav, 32px in the footer). Ideally kept under ~5–8MB combined so the page stays fast on
  mobile data. If you re-export from source, compress with something like:

  ```bash
  ffmpeg -i source.mov -an -vf "scale=960:-2" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart assets/video/hero-animation.mp4
  ffmpeg -i source.mov -an -vf "scale=960:-2" -c:v libvpx-vp9 -crf 30 -b:v 0 -pix_fmt yuv420p assets/video/hero-animation.webm
  ```

- `assets/video/our-story.mp4` and `.webm`, `assets/img/our-story-poster.jpg` — the "hear from
  us" video in the About section on the landing page. This one keeps its audio (`controls`, no
  `autoplay`/`muted`) since it's meant to be watched deliberately, not played as background
  motion. Re-export the same way as above but drop the `-an` flag to keep the audio track, and
  add `-c:a aac -b:a 128k` (mp4) / `-c:a libopus -b:a 96k` (webm).
- `assets/img/tribute-tia.jpg`, `tribute-rita.jpg`, `tribute-chichi.jpg` — the photos on the
  tribute cards in `inspiration.html`, cropped square and centered on each face (letterbox bars
  from the originals removed). To swap one out, replace the file at the same path and same
  ~400×400 square, face-centered crop — the CSS displays it in a circle via `.tribute-photo`.

## Deploying for free

### GitHub Pages

1. Create a new GitHub repo and push this folder to it.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch", pick the `main`
   branch and `/ (root)` folder, then save.
4. GitHub gives you a URL like `https://yourusername.github.io/repo-name/` within a minute or two.
5. (Optional) Add a custom domain under Settings → Pages → Custom domain.

### Netlify — connected to GitHub (recommended for this repo)

This repo already lives at `github.com/rtcfoundation23/RTC-website`, so the git-connected
method is the better fit: every `git push` to `main` auto-redeploys the live site, no manual
re-upload step. `netlify.toml` in this repo already tells Netlify there's no build step —
just publish the root folder as-is.

1. Go to [app.netlify.com](https://app.netlify.com) and sign in (or create a free account) —
   signing in with the `rtcfoundation23` GitHub account makes the next step one click.
2. **Add new site → Import an existing project → Deploy with GitHub**, authorize Netlify to
   access GitHub if asked, then pick the `RTC-website` repo.
3. Netlify reads `netlify.toml` automatically — leave the build command blank and publish
   directory as `.` (both should already be filled in correctly). Click **Deploy**.
4. Netlify gives you a free `*.netlify.app` URL within about a minute. From then on, every push
   to `main` redeploys automatically — no need to touch Netlify again for routine content edits.
5. (Optional) Add a custom domain for free under **Site settings → Domain management**.

### Netlify — manual drag-and-drop (no GitHub account needed)

Quicker for a one-off deploy, but you'd have to re-drag the folder by hand after every future
change instead of it happening automatically on push.

1. Go to [app.netlify.com](https://app.netlify.com) and sign in.
2. Drag and drop this project folder onto the "Sites" page (Netlify's manual deploy drop zone).
3. Netlify gives you a free `*.netlify.app` URL immediately.

Both options are free for a static site like this one and need no ongoing maintenance.

## Swapping the sign-up form for a Google Form

Right now the "Get Involved" form (`#signupForm` in `index.html`) has no backend — submitting it
opens the visitor's email app with their details pre-filled (see `script.js`). If you outgrow
that and want responses collected automatically:

1. Create a Google Form with the same fields (Name, Email/Phone, Area of interest, Message).
2. Get its embed URL: in the Form editor, **Send → Embed `<>`** and copy the `src` URL.
3. In `index.html`, replace the `<form id="signupForm">...</form>` block with:

   ```html
   <iframe
     src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"
     width="100%"
     height="900"
     frameborder="0"
   >
     Loading…
   </iframe>
   ```

4. Remove (or leave harmlessly unused) the sign-up form handling in `script.js`.

## Donation details

The "Support Our Work" section (`#donate` in `index.html`) shows the foundation's GCB Bank
account, MTN MoMo number, and MoMo Pay ID, each with a one-tap Copy button. Every "Donate"
button on the site (nav, the phone-size pill beside the hamburger, and the Inspiration page)
points at it.

**To change a payment detail, edit it in exactly one place:** the text inside the matching
`<dd class="donate-number">` in `index.html`. The Copy buttons read the number straight from
that element, so there's no second copy to keep in sync. After any change, double-check every
digit against the foundation's official donation graphic — a typo here sends someone's money
to the wrong account.

There's no card/online payment processing (this is a static site). If you ever want one, a
hosted payment link (e.g. Paystack or Flutterwave payment pages) can be added as a fourth card
in the same grid without any backend.

## Updating content

Everything is in `index.html` (and `inspiration.html`) — there's no CMS or database. Edit the
text directly and redeploy (push to GitHub, or re-drag the folder onto Netlify). The copy is
intentionally written to avoid dates or one-off events, so it shouldn't need frequent updates;
anything time-sensitive belongs on the social media accounts linked in the footer instead.

The footer's Instagram, X/Twitter, LinkedIn, and YouTube links are live (no Facebook — the
foundation doesn't have one). If that changes, add a `<li><a href="...">Facebook</a></li>` back
into the `.footer-links` list in both `index.html` and `inspiration.html`.
