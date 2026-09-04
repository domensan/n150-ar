# N150 AR

AR-first, static launcher for placing the N150AT nozzle on a horizontal surface at its encoded physical scale.

## AR paths

- Android: WebXR, with Scene Viewer fallback.
- iPhone/iPad: AR Quick Look using `N150AT_WEB.usdz`.
- Placement: horizontal surface (`ar-placement="floor"`).
- Scale: fixed at 100% (`ar-scale="fixed"`).

The QR code is only a launcher and should point to:

`https://domensan.github.io/n150-ar/`

## Verified asset scale

The source GLB uses meters and contains no node scale factors. Its evaluated world-space bounding box is:

- X: 0.130810 m (130.81 mm)
- Y: 0.411493 m (411.49 mm)
- Z: 0.165972 m (165.97 mm)

The USDZ declares `metersPerUnit = 1` and `upAxis = "Y"`.

Confirm these dimensions against an engineering measurement of the physical product before printing the production QR.
