# Product AR

Static 3D/AR viewer with a shared page and a catalog in `products.json`.

## Category links

- `/` and `/?category=nozzles`: Atlas N150, Atlas N800, Atticus 1200, PitBoss, SureLoc 150, SureLoc 1000.
- `/?category=check-valves`: R800CV. The selector is hidden for a single product.
- `/?category=receivers`: R150S.
- `/?category=vents`: V150F (filtered) and V150 (standard).
- `/?category=pressureless`: PLA1000-M VLCE, PLA1000-M SV, PLA86 and PLA80.
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

## Pressureless

`models/pressureless/pla80.glb` and `pla1000-m-sv.glb` are exported from `FFS_PLA80.blend` and `FFS_PLA1000-M_SV.blend`. Both retain their source meter scale and materials; originals were not saved or modified. Only meshes are exported, with horizontal bounds centered and the lowest point at ground level.

- **PLA80:** removes the root assembly tilt, then rotates 90 degrees around Blender X to present the assembly upright. Full-assembly GLB X/Y/Z dimensions: **101.343 × 349.485 × 88.900 mm**.
- **PLA1000-M SV:** rotates 90 degrees around Blender X. GLB X/Y/Z dimensions: **76.200 × 184.063 × 69.723 mm**. Display name follows the user's filename/name; the source mesh is internally named `PLA1000-M SV Defeature`.

Category URL: `https://domensan.github.io/n150-ar/?category=pressureless`. Source dimensions are not independently measured physical dimensions. Actual AR placement requires phone validation.

### PLA1000 update (2026-10-19)

The user corrected the SV name to PLA1000-M SV. Re-exporting `FFS_PLA1000-M_SV.blend` produced a byte-identical GLB to the previous SV export; only its catalog ID, display name and asset filename changed.

`FFS_PLA1000-M_VLCE.blend` adds PLA1000-M VLCE to the same Pressureless selector. The exported assembly retains source meter scale and materials, is rotated 90 degrees about Blender X, centered horizontally and grounded. GLB X/Y/Z dimensions: **74.676 × 383.517 × 73.660 mm**. Original Blender files remain unchanged. The Pressureless URL and all existing category QR codes remain valid.

## Pressureless systems

`/?category=pressureless-systems` displays the complete assembly from `FFS_PRESSURELESS_SYSTEMS_V2.blend`, separate from the Pressureless component selector. The original file is unchanged. Export preserves the existing upright orientation, meter scale and materials; mesh world transforms are baked and the overall assembly is centered horizontally and grounded. GLB X/Y/Z dimensions: **1118.143 × 960.205 × 452.173 mm**.

This source is a static assembled demonstration, not an operating animation. It contains no animated object transforms, constraints or modifiers; the only action is a single material keyframe at frame 26. No flow or mechanism animation was invented. Mobile AR still needs device validation. Existing category QR codes remain unchanged; this new category has its own URL.

## Atlas N800 V2

Nozzles includes Atlas N800 from `FFS_ATLAS_N800V2.blend`. The existing Atlas is labeled Atlas N150 to distinguish them and remains the initial selection. The original files are unchanged. Export preserves meter scale and visible assembly materials, rotates -90 degrees around Blender Z, centers horizontally and grounds the nozzle. Hidden source components remain excluded. Four tiny detached root meshes (`N800AT Body Mod068`, `121`, `146`, `149`) are excluded; they extended bounds below the actual nozzle. GLB X/Y/Z dimensions: **419.140 × 175.899 × 130.810 mm**. Category URL and QR remain unchanged. Phone AR validation is pending.

## Atticus 1200

Nozzles includes Atticus 1200 from `FFS_ATTICUS_1200.blend` (root assembly `N300ATT`). The original file is unchanged. Export preserves meter scale and materials, rotates -90 degrees around Blender Z, then -30 degrees around Blender Y, centers horizontally and grounds the nozzle. The 23 hidden source components are excluded; the internal cam `fnt-cam-4_fnt-cahtm-4` is included. The source models the coupler axis 30 degrees above horizontal; the Y rotation levels it so the nozzle points like Atlas N800: coupler horizontal toward -X, handle up, inlet angled down. Draco compression (level 6, 16-bit positions) keeps the GLB at about 3.4 MB. GLB X/Y/Z dimensions: **386.772 × 226.493 × 130.810 mm**. These are source-file dimensions, not physical measurements. Category URL is unchanged; product URL is `?category=nozzles&product=atticus-1200`. Phone AR validation is pending.

## PLA86

Pressureless includes PLA86 from `FFS_PLA86.blend`, after PLA1000-M VLCE and PLA1000-M SV and before PLA80. The original file is unchanged. Only the 36 meshes of the `PLA86 HVSC` assembly are exported; the two backdrop planes, camera and lights are excluded. Export removes the assembly's root tilt and rotates 90 degrees around Blender X so it stands upright like PLA80: hex head up, side port facing the viewer, valve down. Meter scale and materials are preserved, horizontal bounds are centered and the lowest point is grounded. The source's only action is a material keyframe; no animation is exported. GLB X/Y/Z dimensions: **101.343 × 325.563 × 88.900 mm**. These are source-file dimensions, not physical measurements. Product URL: `?category=pressureless&product=pla86`. Phone AR validation is pending.
