# Local hand tracking runtime

WASM and loader files copied from the pinned `@mediapipe/tasks-vision@0.10.32` npm package (Apache-2.0).

The classic hand worker is built from `src/hand-worker.ts` by `npm run build:hand-worker`; this is required because the MediaPipe runtime loads its WASM glue with `importScripts()`. No CDN is used at runtime.

The model at `public/models/hand_landmarker.task` is the official float16 version 1 asset from:
https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task

Files are served from this website's own origin, using its base path. Camera images are never sent to the source URLs or any remote service.
