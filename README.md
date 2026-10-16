# Product AR

Static 3D/AR viewer with a shared page and a catalog in `products.json`.

## Category links

- `/` and `/?category=nozzles`: Atlas, PitBoss, SureLoc 150, SureLoc 1000.
- `/?category=check-valves`: R800CV. The selector is hidden for a single product.
- `/?category=receivers`: R150S.
- `/?category=vents`: V150F (filtered) and V150 (standard).
- Unknown categories show an error rather than unrelated products.

The existing printed QR points to `https://domensan.github.io/n150-ar/` and remains the nozzles entry point. After deployment, the Check valves URL will be `https://domensan.github.io/n150-ar/?category=check-valves`. Its final QR should be generated after phone validation.

## Structure

- `index.html`, `styles.css`, `app.js`: shared viewer and AR controls.
- `products.json`: category names and product IDs, names, model paths and orientations.
- `models/check-valves/r800cv.glb`: new production asset.
- Existing nozzle GLBs remain at their original paths.

Add a GLB and its catalog entry to add a product. Publish only the web files and their model assets; source `.blend`, STEP and intermediate glTF files are working assets, not viewer dependencies.

## R800CV export

Exported from `FFS_R800CV.blend` using Blender 5.2.1. The original file was not saved or modified. Only the product mesh was exported, excluding the camera and light. All four original materials are retained.

The mesh's world transform was applied, followed by a 180-degree X rotation to match the catalog presentation. Its base was moved to zero and its horizontal bounds centered. No scaling was applied. Blender's GLB export converts Z-up to Y-up; orientation is baked into the geometry, so the viewer uses `0deg 0deg 0deg`.

Exported dimensions: **69.596 × 181.779 × 76.200 mm** (GLB X/Y/Z). Source scale is 1 meter per Blender unit. This agrees with the catalog's rounded 182 mm height and 76.2 mm width.

## AR

- Interactive 3D is available without AR support.
- Android: WebXR with Scene Viewer fallback.
- iPhone/iPad: Quick Look, with USDZ generated from the selected GLB.
- Horizontal placement, fixed source scale.
- Existing nozzles retain their previous viewer orientation corrections; Scene Viewer may render those original files differently. R800CV has its correction baked in.
- Loading failures and unsupported AR have distinct messages.

## Validation

Run `node --test tests/selector.test.cjs`.

For local preview, run `python3 -m http.server 8015 --bind 127.0.0.1` and open `http://127.0.0.1:8015/?category=check-valves`.

Automated checks cover category routing, legacy links, model switching, load failures, AR retry, and exported GLB dimensions. Desktop Chrome verified that R800CV and the legacy Atlas page load, including the mobile-width layout. Actual AR placement and appearance still need testing on compatible iPhone/Android devices over HTTPS after deployment.

## R150S receiver

`models/receivers/r150s.glb` is exported from `FFS_R150S.blend`, preserving its source scale and materials. The original Blender file remains unchanged. The assembly is rotated 90 degrees around Blender X, with its base grounded and horizontal bounds centered. The receiver is presented upright with the threaded end down. Dimensions in GLB X/Y/Z: **69.850 × 114.300 × 63.373 mm**. These are source-file dimensions, not a new physical measurement.

Category URL: `https://domensan.github.io/n150-ar/?category=receivers`. Device AR still requires phone validation.

## Fuel Vents

`models/vents/v150f.glb` and `v150.glb` are exported from the corresponding `FFS_V150F.blend` and `FFS_V150.blend` files. Original Blender files remain unchanged. Both models retain their material assignments, are centered horizontally, and stand upright with the stem down and the lowest point at ground level.

- **V150F:** source coordinates contain millimeter values despite a scene scale of 1 meter. Export applies a uniform 0.001 unit conversion; no rotation is needed in Blender. GLB X/Y/Z dimensions: **282.985 × 271.782 × 91.840 mm**.
- **V150:** original meter scale retained; a 90-degree Blender X rotation makes it upright. GLB X/Y/Z dimensions: **88.265 × 252.224 × 109.652 mm**.

These dimensions include the full stem and are not independent physical measurements. Category URL: `https://domensan.github.io/n150-ar/?category=vents`. Select either vent before opening AR. Actual AR placement still requires phone validation.

V150F uses Draco geometry compression (level 6, 16-bit position quantization), reducing the GLB from about 26 MB to 2.8 MB. Browser-decoded dimensions differ from source bounds by less than 0.002 mm. Both vents and switching between them were verified in Chrome at mobile viewport width.
