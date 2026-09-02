# Pixel asset pipeline

The runtime world is owned by PixiJS v8 and its placement data lives in
`src/components/canvas/pixi/maps/portfolio-world.json`, which can be opened in
Tiled Map Editor.

## Aseprite conventions

- Work on a 16 px grid; characters use a 24×48 or 32×48 frame.
- Use tags named `idle`, `walk`, `interact`, and `special`.
- Keep a stable pivot at the character's feet.
- Export transparent PNG sprite sheets without resampling.

## TexturePacker conventions

- Framework: `PixiJS` / JSON Hash.
- Texture format: PNG-8 or lossless WebP with transparency.
- Scale mode: nearest-neighbor; no rotation; 2 px extrusion and padding.
- Stable frame names: `category/entity/action_00`.
- Publish the generated atlas under `public/assets/pixi/`.

Load the atlas through `TextureAtlasStore`. Tiled objects can then receive a
`frame` or `animation` custom property without changing React or camera code.
