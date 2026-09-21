# Product AR

AR-first static launcher for Atlas, PitBoss, SureLoc 150 and SureLoc 1000. Select a model before opening AR.

## Assets

Copied from `../3D Web/`, with the same display orientations as that project's viewer:

- Atlas: `N150_web_2.glb`
- PitBoss: `PitBoss_150_Visor_3D.glb`
- SureLoc 150: `SureLoc150_Web_3D.glb`
- SureLoc 1000: `SureLoc1000_WEB_3D.glb`

## AR paths

- Android: WebXR, with Scene Viewer fallback. Scene Viewer loads the original GLB, so display orientation adjustments may differ.
- iPhone/iPad: AR Quick Look generates USDZ from the selected GLB; the old `N150AT_WEB.usdz` is no longer referenced.
- Placement: horizontal surface (`ar-placement="floor"`).
- Scale: fixed at the asset's encoded scale (`ar-scale="fixed"`). Physical dimensions of the new exports have not been independently verified.

The existing QR code points to `https://domensan.github.io/n150-ar/`.

Run the selector check with `node --test tests/selector.test.cjs`. Device AR must be checked on a compatible phone.
