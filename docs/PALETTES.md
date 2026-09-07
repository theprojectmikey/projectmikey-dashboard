# Palettes

Set with `palette:` in the card config. Each has a matched dark version; the
card switches between them per `theme:`.

## The lineup — glass

Frosted tiles over an out-of-focus field of colour. The tiles blur what's
behind them, so each one picks up the colour it's sitting over.

| Value | Name | Reads as |
|---|---|---|
| `glass-mono` | Mono | Black and white. No hue anywhere, so the entity accent colours are the only colour on screen and they hit hard. The safe pick. |
| `glass-cool` | Cool | Blue, lilac, seafoam. Calm and modern. The best all-rounder. |
| `glass-warm` | Warm | Peach, rose, amber. The most personality; photographs best. Off-tiles separate least from the ground, so slightly soft on a wall display seen from across a room. |
| `glass-clay` | Clay | Tan, umber, wood. Warm without being pink — pairs with timber, brick and leather rooms. |

The background is built from colour, not a photograph: nothing to load, no
banding at any size, no cache to bust, and no recompositing a large image on
every page swipe.

**One cost to know about.** Frosted tiles use `backdrop-filter`, so the device
re-blurs what's behind every tile on every frame while pages move. Modern
phones handle it. On an older tablet, watch the swipe — if it stutters, use a
flat palette instead. They look nearly identical at rest.

## Flat alternatives

No blurring, no `backdrop-filter`, cheapest to render.

| Value | Reads as |
|---|---|
| `porcelain` | Near-white, most neutral |
| `linen` | Warm paper |
| `mist` | Cool pale blue |
| `sage` | Pale green |
| `sand` | Warm taupe |

Omit `palette:` entirely for the original built-in look (a soft blue-and-violet
wash, light and dark).

## Adding one

Palettes are pure CSS in `part2.js`'s stylesheet — two blocks per palette, one
for light and one for dark, each setting `--ground`. Add the name to the `PAL`
array in the card's `setConfig` and it becomes selectable. Nothing else.
