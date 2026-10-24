# NOAH — A small interactive world

An English personal website for Junzhe Cai, built with Vite, TypeScript, CSS and SVG-like CSS objects. A small framework-free implementation keeps the core experience lightweight; MediaPipe is loaded only after opting in to hand interaction.

## Run locally

For the included production build, double-click **Start Preview.cmd** on Windows, then open **http://127.0.0.1:4173**. Node.js is required; no dependency installation is needed for this preview. Keep its terminal open while browsing. `node scripts/preview.mjs` does the same on other platforms. This serves the bundled `dist/` build; rebuild after editing source.

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. To build and serve the production version:

```sh
npm run build
npm run preview
```

Do not open `dist/index.html` using a file URL: JavaScript modules and camera access need an HTTP server (localhost) or HTTPS.

## Content and photos

- `src/main.ts`: English copy, section composition and basic interaction.
- `src/style.css` and `src/refinements.css`: colors, typography, spacing, breakpoints and movement. All text gently drifts vertically with translucent ink; reduced-motion disables the drift.
- `src/art-direction.css`: translucent art typography and the three-dimensional table scene. Headings use Cormorant Garamond with local serif fallbacks.
- `src/tennis3d.ts`: actual Three.js table, sphere, paddles, lighting and shadows. Rendering pauses off-screen and while idle; the 3D module is loaded separately.
- `src/ball-physics.ts`: motion in metres and seconds, fixed substeps, gravity (9.81 m/s²), velocity-dependent air resistance, tabletop and net collision, and a restitution coefficient of 0.86. Paddle impacts provide prescribed impulses; the return ends in damped bounces on the table. This is a lightweight interactive simulation, not a full spin or fluid-dynamics model.
- `src/scene-table.ts`: layered CSS 3D fallback for devices without WebGL. The home page has typography and subtle orbit lines; no instrument or photographs.
- `src/media.ts`: the single source for photo paths, descriptions and order.
- `src/hands.ts`: camera lifecycle, gesture filtering and action events.
- `src/hand-worker.ts`: hand detection runs off the UI thread. `src/hand-model.ts` starts the classic worker; `vite.hand-worker.config.ts` bundles it. The worker loads WASM glue via `importScripts`, which requires a classic worker rather than an ES module worker.
- `public/assets/violin`: supplied photos 1–2, unchanged.
- `public/assets/travel`: the four original travel photographs plus `travel-5.jpg`, the added street-to-sea photograph, unchanged.
- `public/assets/music/nabi-1.jpg`: supplied photo 7, unchanged.
- `public/assets/music/joker-xue-1.jpg` and `joker-xue-2.jpg`: supplied photos 8–9, unchanged.

Replace a file at its existing path, or update its entry in `src/media.ts`. Change `alt` to describe the replacement and `label` to set its caption. No dates, venues, destinations, achievements or other biographical facts have been inferred. English site text does not alter lettering already present inside the original photographs.

The reusable `photo()` renderer provides descriptive labels, enlargement and loading-error fallback. Add classes through its second argument to change framing. `.photo img` controls fitting; the travel and music frames use `contain` to preserve the full image. `.enlarge` controls the zoom affordance. Originals are kept intact; CSS supplies the visual treatments.

## Explore

- Scroll naturally or use navigation and chapter dots.
- Up/down or Page Up/Page Down changes chapters; Home/End jumps to the first/last chapter. These shortcuts do not interrupt dialogs, text inputs or artist tabs.
- Click, tap, Enter or Space on the near paddle to play a rally. New hits are ignored until the current rally finishes.
- The 3D ball first bounces on the far half, receives a return, bounces on the near half and settles with progressively smaller rebounds. Contact shadows and a short squash/recovery give the landing a tactile appearance. Unsupported WebGL falls back to the simpler CSS interaction.
- Travel supports previous/next, photo indicators, horizontal swipes or drags, and left/right keys.
- Select Nabi or Joker Xue in Music. Joker Xue includes two photos. Artist tabs support arrow keys, Home and End.
- Click any main gallery photo to enlarge it; close using the button, Escape or the surrounding backdrop. Focus returns to the original image.
- System reduced-motion preferences disable decorative motion and shorten the rally feedback.

## Optional hand interaction

Hand settings are directly on the **home page**, under **Explore with a wave**. The floating **Hand interaction** button returns you to these settings. You can first click **Check compatibility (no camera)** to load the model and run inference on a synthetic blank frame without requesting camera access. Then click **Enable Hand Interaction**: the model initializes before camera permission is requested. Frames are processed locally by a classic Web Worker and are never uploaded or saved. The pinned MediaPipe WASM files and official hand model are bundled in `public/vendor/mediapipe` and `public/models` and are served from this website, so model startup does not depend on Google or CDN access. Google Fonts still needs a connection; system fonts are provided as fallbacks.

Use one visible hand with good lighting. Up/down changes chapters; left/right browses photos, or hits the ball in Play. The preview and horizontal coordinates are mirrored together. Positions are smoothed, bounded and tested over a short history; thresholds, cooldown and a stable-hand rearming condition reduce false repeats. Detection runs at a maximum of 20 frames per second in the worker, with only one inference pending at a time. Choose Balanced, Responsive (default), or Extra responsive on the home page; the selection applies immediately without restarting the camera. Responsive uses a 0.10 normalized movement threshold, 450 ms cooldown, less smoothing delay and a 90 ms stable-hand rearm. Thresholds are centralized in `src/swipe.ts`.

Disable the feature to stop all camera tracks and terminate the worker. It also stops on page hide or when the tab becomes hidden. Leaving the home page keeps interaction running so it can control the website. Return to the home-page settings to disable it.

The local worker, WASM, model initialization and inference have passed the browser compatibility check without camera access. Known limit: physical camera permission, live tracking, recognition accuracy, and mirrored swipe directions have **not** been validated with a real hand on this device. Test these in a recent Chrome or Edge on localhost or HTTPS before accepting the optional feature. Allow/deny camera permission, wave in each direction, disable, and check that the camera indicator turns off. No audio or video files are needed for the photo-based music section.

## Verification

Gesture regression tests (Node.js 22.18+): `node --experimental-strip-types --test tests/swipe.test.mjs`. Small waves, jitter rejection, no repeated actions for one wave, fast rearming and hand loss are covered.

Physics regression tests (Node.js 22.18+): `node --experimental-strip-types --test tests/physics.test.mjs`. Checks cover far/near tabletop landings, net collision, energy loss, variable frame intervals, no table penetration and repeated serves.

- TypeScript checks and Vite production build passed.
- Desktop browser: repeated paddle clicks, travel navigation, artist selection, both Joker Xue photos, enlarged photo open/close verified; no console errors during those checks.
- Mobile viewport (390 × 844): visual inspection and document-width checks passed, no horizontal overflow. A real touch device remains useful for final swipe acceptance.
- Reduced-motion behavior and camera cleanup/error paths are implemented; physical camera behavior remains to be accepted as described above.

## GitHub Pages preparation — no deployment performed

The project uses relative Vite base `./`, relative media paths and hash navigation, so it can be served from a repository subdirectory without inventing a repository name. Build and inspect `dist/` before publishing. The hand worker, bundled JavaScript and all ten images are included in the build; the optional model/WASM and classic worker are bundled local assets.

After approving the local version, choose the actual GitHub repository and confirm permission to upload the personal photographs. A Pages workflow should check out that repository, set up Node.js 22, run `npm ci` and `npm run build`, upload `dist` with `actions/upload-pages-artifact`, and deploy with `actions/deploy-pages` using `pages: write` and `id-token: write`. Use the real repository default branch and the GitHub Pages environment. Verify paths, HTTPS camera access and local model loading at the resulting URL. No repository, commit, push, source upload or deployment has been created for this delivery.
