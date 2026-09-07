/* ===========================================================================
 * ProjectMikey Home — a Home Assistant dashboard, written from scratch.
 *
 * One file. No dependencies, no build step, no framework. Everything that
 * moves is either native browser behaviour or a CSS transition, because the
 * fastest way to make an interface feel cheap is to animate it in JavaScript.
 *
 * The page-to-page swipe is CSS scroll-snap, not a gesture handler. That
 * matters: the browser's own compositor drives it, so you get real momentum,
 * real rubber-banding at the ends, and 120Hz on a ProMotion iPhone. A JS
 * gesture handler cannot match that, and it is exactly where hand-rolled
 * dashboards start feeling finicky.
 *
 * Icons are drawn here rather than imported. Every glyph sits on the same
 * 24-unit grid at the same 1.6 stroke weight with round caps and joins, so
 * they read as one family at the large sizes this interface uses.
 * =========================================================================== */

const ICONS = {
  /* --- rooms & navigation ------------------------------------------------ */
  home:     'M3 10.6 12 3l9 7.6M5.6 9.4V19.5a1.5 1.5 0 0 0 1.5 1.5h9.8a1.5 1.5 0 0 0 1.5-1.5V9.4',
  sofa:     'M5 11.5V8.6A2.6 2.6 0 0 1 7.6 6h8.8A2.6 2.6 0 0 1 19 8.6v2.9M3.6 11.5h16.8a1.4 1.4 0 0 1 1.4 1.4v3.6H2.2v-3.6a1.4 1.4 0 0 1 1.4-1.4ZM4.8 16.5V19M19.2 16.5V19',
  bed:      'M3 19.8V9.4M21 19.8v-6M3 13.8h18M3 17.6h18M6.2 10.2h4.6a1.3 1.3 0 0 1 1.3 1.3v2.3H4.9v-2.3a1.3 1.3 0 0 1 1.3-1.3Z',
  teddy:    'M8.4 6.2a2.1 2.1 0 1 0-2.6 3M15.6 6.2a2.1 2.1 0 1 1 2.6 3M12 5.2a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM9.8 11.3h.01M14.2 11.3h.01M9.9 14.6a3 3 0 0 0 4.2 0',
  kitchen:  'M7.5 3v7.5M10.6 3v7.5M9 10.5V21M15.4 3c1.7 0 2.9 2.2 2.9 5s-1.2 4-2.9 4V21',
  entry:    'M6.5 3.5h9.6a1.4 1.4 0 0 1 1.4 1.4V21H6.5ZM4 21h16M13.6 12.4h.01',

  /* --- lights ------------------------------------------------------------ */
  bulb:     'M12 3.8a5.9 5.9 0 0 0-3.4 10.7v2.1h6.8v-2.1A5.9 5.9 0 0 0 12 3.8ZM9.5 19.2h5M10.6 21.4h2.8',
  ceiling:  'M12 2.8v2.6M5.4 14.2 12 5.4l6.6 8.8ZM5.4 14.2h13.2M9.2 17.8h5.6M10.4 20.6h3.2',
  lamp:     'M8.2 4.2h7.6l2.7 8.2H5.5ZM12 12.4V19M8.6 20.8h6.8a.9.9 0 0 0 0-1.8H8.6a.9.9 0 0 0 0 1.8Z',
  strip:    'M4.4 8.6h15.2a1.7 1.7 0 0 1 1.7 1.7v1.8a1.7 1.7 0 0 1-1.7 1.7H4.4a1.7 1.7 0 0 1-1.7-1.7v-1.8a1.7 1.7 0 0 1 1.7-1.7ZM7.6 16.4v1.9M12 16.4v2.6M16.4 16.4v1.9',

  /* --- power ------------------------------------------------------------- */
  plug:     'M9 3v5.2M15 3v5.2M6.6 8.2h10.8v2.9a5.4 5.4 0 0 1-10.8 0ZM12 16.5V21',
  toggle:   'M6.4 4.6h11.2A1.8 1.8 0 0 1 19.4 6.4v11.2a1.8 1.8 0 0 1-1.8 1.8H6.4a1.8 1.8 0 0 1-1.8-1.8V6.4a1.8 1.8 0 0 1 1.8-1.8ZM9.4 8.6h5.2v6.8H9.4Z',
  coffee:   'M5.2 8.4h11v5.8a4.4 4.4 0 0 1-4.4 4.4H9.6a4.4 4.4 0 0 1-4.4-4.4ZM16.2 9.8h1.6a2.6 2.6 0 0 1 0 5.2h-1.6M8.4 5.4V3.4M11.6 5.4V3.4M14.8 5.4V3.4M4 21h13.4',
  humid:    'M12 3.6s5.6 6.4 5.6 9.9a5.6 5.6 0 1 1-11.2 0C6.4 10 12 3.6 12 3.6ZM9.4 13.6a2.6 2.6 0 0 0 2.6 2.6',

  /* --- covers & climate -------------------------------------------------- */
  fan:      '<circle cx="12" cy="12" r="1.7"/><path d="M12 9.5c-1.9-.4-3-1.6-3-3.2 0-1.6 1.2-2.8 2.9-2.8s2.9 1.3 2.9 2.9c0 1.5-1 2.6-2.8 3.1Z"/><path d="M12 9.5c-1.9-.4-3-1.6-3-3.2 0-1.6 1.2-2.8 2.9-2.8s2.9 1.3 2.9 2.9c0 1.5-1 2.6-2.8 3.1Z" transform="rotate(120 12 12)"/><path d="M12 9.5c-1.9-.4-3-1.6-3-3.2 0-1.6 1.2-2.8 2.9-2.8s2.9 1.3 2.9 2.9c0 1.5-1 2.6-2.8 3.1Z" transform="rotate(240 12 12)"/>',
  blind:    'M4 3.6h16v3.2H4ZM5.6 9.6h12.8M5.6 12.6h12.8M5.6 15.6h12.8M12 18.2v2.4M10.4 20.6h3.2',
  thermo:   'M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2ZM12 12l3.4-3.8M12 12h.01',
  temp:     'M14.2 13.9V6.1a2.2 2.2 0 1 0-4.4 0v7.8a4.7 4.7 0 1 0 4.4 0ZM12 16.4v-6',

  /* --- security ---------------------------------------------------------- */
  lock:     'M6.6 10.4h10.8a1.2 1.2 0 0 1 1.2 1.2v7.6a1.2 1.2 0 0 1-1.2 1.2H6.6a1.2 1.2 0 0 1-1.2-1.2v-7.6a1.2 1.2 0 0 1 1.2-1.2ZM8.6 10.4V7.8a3.4 3.4 0 0 1 6.8 0v2.6M12 14.4v2.6',
  unlock:   'M6.6 10.4h10.8a1.2 1.2 0 0 1 1.2 1.2v7.6a1.2 1.2 0 0 1-1.2 1.2H6.6a1.2 1.2 0 0 1-1.2-1.2v-7.6a1.2 1.2 0 0 1 1.2-1.2ZM8.6 10.4V7.8a3.4 3.4 0 0 1 6.6-1.1M12 14.4v2.6',
  door:     'M6.6 3.5h9.6a1.4 1.4 0 0 1 1.4 1.4V21H6.6ZM4 21h16M13.8 12.4h.01',
  motion:   'M10 4.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM10 8.6v4.6l-2.6 6.4M10 13.2l2.8 6.4M6.6 10.6 10 9.4l3.4 1.2M17 8.4a6.2 6.2 0 0 1 0 7.6M20 5.9a10 10 0 0 1 0 12.6',
  bell:     'M12 3.4a5.8 5.8 0 0 0-5.8 5.8c0 5.2-2.1 6.8-2.1 6.8h15.8s-2.1-1.6-2.1-6.8A5.8 5.8 0 0 0 12 3.4ZM10.1 19.2a2.1 2.1 0 0 0 3.8 0',

  /* --- media ------------------------------------------------------------- */
  tv:       'M3.6 5.4h16.8a1.3 1.3 0 0 1 1.3 1.3v9.6a1.3 1.3 0 0 1-1.3 1.3H3.6a1.3 1.3 0 0 1-1.3-1.3V6.7a1.3 1.3 0 0 1 1.3-1.3ZM8.4 20.8h7.2',
  speaker:  'M7 2.8h10a1.4 1.4 0 0 1 1.4 1.4v15.6a1.4 1.4 0 0 1-1.4 1.4H7a1.4 1.4 0 0 1-1.4-1.4V4.2A1.4 1.4 0 0 1 7 2.8ZM12 12.4a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8ZM12 6.4h.01',
  camera:   'M3.6 7.4h10.6a1.6 1.6 0 0 1 1.6 1.6v6a1.6 1.6 0 0 1-1.6 1.6H3.6A1.6 1.6 0 0 1 2 15V9a1.6 1.6 0 0 1 1.6-1.6Zm13.2 3.1 4.4-2.7v8.4l-4.4-2.7Z',

  /* --- scenes ------------------------------------------------------------ */
  sunrise:  'M12 3.4v3M5.9 9.5 8 11.6M18.1 9.5 16 11.6M7.4 17.4a4.6 4.6 0 0 1 9.2 0M2.8 17.4h2.2M19 17.4h2.2M3.6 20.8h16.8',
  moon:     'M20.4 14.8A8.8 8.8 0 1 1 9.6 3.6a7.2 7.2 0 0 0 10.8 11.2Z',
  movie:    'M3.4 9.4h17.2v10.2a1.2 1.2 0 0 1-1.2 1.2H4.6a1.2 1.2 0 0 1-1.2-1.2ZM3.4 9.4 4.8 4.2l16.1 1.4-.7 3.8M9.2 4.9l-1 4.3M14.4 5.3l-1 4.1',
  away:     'M14.4 3.6h3.8a1.3 1.3 0 0 1 1.3 1.3v14.2a1.3 1.3 0 0 1-1.3 1.3h-3.8M4.6 12h9.2M10.4 8.4 14 12l-3.6 3.6',

  /* --- utility ----------------------------------------------------------- */
  chevron:  'm9.5 5.5 6.5 6.5-6.5 6.5',
  dots:     'M12 5.4h.01M12 12h.01M12 18.6h.01',
};

/* --------------------------------------------------------------------------
 * Design tokens.
 *
 * Two palettes, one structure. Light follows Apple Home: a warm ground, white
 * tiles, colour only where something is on. Dark is near-black with raised
 * translucent surfaces. An "on" tile inverts to a high-contrast surface in
 * both — that inversion, not a glow or a border, is how state reads at a
 * glance from across a room.
 * ------------------------------------------------------------------------ */
const CSS = `
:host {
  --pm-ease: cubic-bezier(.32,.72,0,1);
  --pm-tile-r: 22px;
  --pm-icon-r: 16px;
  --pm-gap: 12px;
  --pm-pad: clamp(16px, 4vw, 28px);
  --pm-max: 1180px;
  --pm-tile-h: clamp(108px, 8.5vw + 78px, 140px);
  --pm-icon-box: clamp(48px, 3vw + 38px, 60px);
  --pm-icon: clamp(28px, 1.8vw + 22px, 34px);

  --c-light:  #FFB340;
  --c-switch: #FFC53D;
  --c-cover:  #64D2FF;
  --c-fan:    #40C8E0;
  --c-lock:   #30D158;
  --c-climate:#FF9F0A;
  --c-media:  #7D7AFF;
  --c-alert:  #FF453A;
  --c-scene:  #BF7BFF;
  --c-sensor: #98989F;

  display: block; position: relative; height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}

/* light */
:host {
  --ground: radial-gradient(120% 70% at 12% 0%, #EAF0FF 0%, rgba(255,255,255,0) 58%),
            radial-gradient(90% 55% at 92% 8%, #FBEAFF 0%, rgba(255,255,255,0) 54%),
            linear-gradient(180deg, #F7F7FB 0%, #EFEFF4 100%);
  --surface: rgba(255,255,255,.72);
  --surface-on: #FFFFFF;
  --text: #1C1C1E;
  --text-2: rgba(60,60,67,.60);
  --text-on: #1C1C1E;
  --text-on-2: rgba(60,60,67,.55);
  --icon-rest-bg: rgba(120,120,128,.16);
  --icon-rest-fg: rgba(60,60,67,.55);
  --shadow: 0 1px 2px rgba(0,0,0,.05), 0 8px 22px rgba(0,0,0,.07);
  --shadow-on: 0 2px 4px rgba(0,0,0,.07), 0 12px 30px rgba(0,0,0,.11);
  --dot: rgba(60,60,67,.26);
  --dot-on: rgba(60,60,67,.75);
}
:host([data-theme="dark"]) {
  --ground: radial-gradient(120% 70% at 12% 0%, #16203A 0%, rgba(0,0,0,0) 60%),
            radial-gradient(90% 55% at 92% 8%, #241A33 0%, rgba(0,0,0,0) 56%),
            linear-gradient(180deg, #0C0D11 0%, #000000 78%);
  --surface: rgba(118,118,128,.16);
  --surface-on: #F2F2F7;
  --text: #F2F2F7;
  --text-2: rgba(235,235,245,.58);
  --text-on: #1C1C1E;
  --text-on-2: rgba(60,60,67,.55);
  --icon-rest-bg: rgba(120,120,128,.24);
  --icon-rest-fg: rgba(235,235,245,.62);
  --shadow: none;
  --shadow-on: 0 2px 6px rgba(0,0,0,.4), 0 14px 34px rgba(0,0,0,.34);
  --dot: rgba(235,235,245,.28);
  --dot-on: rgba(235,235,245,.85);
}


/* ------------------------------------------------------------------------
 * Palettes. The ground is the only thing that changes; tiles, type and the
 * accent map stay put, so every palette is the same dashboard in a
 * different room light. Set with the palette key in the card config.
 * ---------------------------------------------------------------------- */

/* Porcelain — near-white, the most neutral. Apple's own default light. */
:host([data-palette="porcelain"]:not([data-theme="dark"])) {
  --ground: radial-gradient(110% 60% at 15% 0%, #FFFFFF 0%, rgba(255,255,255,0) 62%),
            linear-gradient(180deg, #FBFBFD 0%, #EFF0F3 100%);
  --surface: rgba(255,255,255,.80);
}
:host([data-palette="porcelain"][data-theme="dark"]) {
  --ground: linear-gradient(180deg, #0E0F12 0%, #000000 80%);
}

/* Linen — warm paper. Reads soft and domestic under lamp light. */
:host([data-palette="linen"]:not([data-theme="dark"])) {
  --ground: radial-gradient(120% 70% at 12% 0%, #FFF8EC 0%, rgba(255,255,255,0) 58%),
            radial-gradient(90% 55% at 92% 8%, #FDF1E4 0%, rgba(255,255,255,0) 54%),
            linear-gradient(180deg, #FBF8F2 0%, #F1EBE1 100%);
  --surface: rgba(255,255,255,.76);
  --text-2: rgba(72,64,54,.62);
}
:host([data-palette="linen"][data-theme="dark"]) {
  --ground: radial-gradient(120% 70% at 12% 0%, #241C12 0%, rgba(0,0,0,0) 60%),
            linear-gradient(180deg, #12100C 0%, #000000 78%);
}

/* Mist — cool pale blue-grey. The calmest of the set. */
:host([data-palette="mist"]:not([data-theme="dark"])) {
  --ground: radial-gradient(120% 70% at 14% 0%, #E8F2F8 0%, rgba(255,255,255,0) 60%),
            radial-gradient(85% 50% at 90% 6%, #EEF1FA 0%, rgba(255,255,255,0) 55%),
            linear-gradient(180deg, #F6F9FB 0%, #E7EEF3 100%);
  --surface: rgba(255,255,255,.78);
  --text-2: rgba(56,64,72,.60);
}
:host([data-palette="mist"][data-theme="dark"]) {
  --ground: radial-gradient(120% 70% at 12% 0%, #101C26 0%, rgba(0,0,0,0) 60%),
            linear-gradient(180deg, #0A0E12 0%, #000000 78%);
}

/* Sage — pale green. Quiet, a little organic. */
:host([data-palette="sage"]:not([data-theme="dark"])) {
  --ground: radial-gradient(120% 70% at 12% 0%, #ECF5EE 0%, rgba(255,255,255,0) 58%),
            radial-gradient(85% 50% at 90% 8%, #F4F7EC 0%, rgba(255,255,255,0) 55%),
            linear-gradient(180deg, #F7FAF6 0%, #E7EFE8 100%);
  --surface: rgba(255,255,255,.78);
  --text-2: rgba(58,68,60,.60);
}
:host([data-palette="sage"][data-theme="dark"]) {
  --ground: radial-gradient(120% 70% at 12% 0%, #121F17 0%, rgba(0,0,0,0) 60%),
            linear-gradient(180deg, #0A0E0B 0%, #000000 78%);
}

/* Sand — warm taupe. The most "hotel lobby" of the five. */
:host([data-palette="sand"]:not([data-theme="dark"])) {
  --ground: radial-gradient(120% 70% at 12% 0%, #FBF3E7 0%, rgba(255,255,255,0) 58%),
            linear-gradient(180deg, #FAF6EF 0%, #EBE2D5 100%);
  --surface: rgba(255,255,255,.74);
  --text-2: rgba(74,64,52,.62);
}
:host([data-palette="sand"][data-theme="dark"]) {
  --ground: radial-gradient(120% 70% at 12% 0%, #221B12 0%, rgba(0,0,0,0) 60%),
            linear-gradient(180deg, #100D09 0%, #000000 78%);
}


/* ------------------------------------------------------------------------
 * Glass. The ground stops being a flat wash and becomes a soft out-of-focus
 * field of colour; the tiles stop being opaque cards and become frosted
 * panes that pick that colour up. Built from colour rather than a photograph
 * so it weighs nothing, never bands, and has no cache to bust.
 * ---------------------------------------------------------------------- */

/* --- grounds --- */
:host([data-palette="glass-warm"]:not([data-theme="dark"])) {
  --ground: radial-gradient(58% 42% at 16% 10%, #FFD3A6 0%, rgba(255,211,166,0) 62%),
            radial-gradient(52% 38% at 86% 8%,  #FFC2D2 0%, rgba(255,194,210,0) 60%),
            radial-gradient(72% 52% at 74% 78%, #FFE6BC 0%, rgba(255,230,188,0) 66%),
            radial-gradient(62% 46% at 8% 88%,  #E4D2FF 0%, rgba(228,210,255,0) 62%),
            linear-gradient(158deg, #FFF3E6 0%, #FDEBF1 54%, #F3EDFF 100%);
}
:host([data-palette="glass-warm"][data-theme="dark"]) {
  --ground: radial-gradient(58% 42% at 16% 10%, #5A2E12 0%, rgba(0,0,0,0) 62%),
            radial-gradient(52% 38% at 86% 8%,  #4A1730 0%, rgba(0,0,0,0) 60%),
            radial-gradient(72% 52% at 74% 80%, #402A10 0%, rgba(0,0,0,0) 66%),
            radial-gradient(62% 46% at 8% 88%,  #291A46 0%, rgba(0,0,0,0) 62%),
            linear-gradient(158deg, #14100C 0%, #0B0A0D 60%, #000000 100%);
}

:host([data-palette="glass-cool"]:not([data-theme="dark"])) {
  --ground: radial-gradient(58% 42% at 14% 10%, #B4DFFF 0%, rgba(180,223,255,0) 62%),
            radial-gradient(52% 38% at 86% 10%, #C8BEFF 0%, rgba(200,190,255,0) 60%),
            radial-gradient(72% 52% at 76% 80%, #AAEEE2 0%, rgba(170,238,226,0) 66%),
            radial-gradient(60% 44% at 8% 88%,  #D6E4FF 0%, rgba(214,228,255,0) 62%),
            linear-gradient(158deg, #ECF6FF 0%, #EFF0FF 50%, #E7F9F5 100%);
}
:host([data-palette="glass-cool"][data-theme="dark"]) {
  --ground: radial-gradient(58% 42% at 14% 10%, #10334F 0%, rgba(0,0,0,0) 62%),
            radial-gradient(52% 38% at 86% 10%, #241D4E 0%, rgba(0,0,0,0) 60%),
            radial-gradient(72% 52% at 76% 80%, #0B3B36 0%, rgba(0,0,0,0) 66%),
            radial-gradient(60% 44% at 8% 88%,  #16203D 0%, rgba(0,0,0,0) 62%),
            linear-gradient(158deg, #090F14 0%, #0A0A12 58%, #000000 100%);
}

/* Mono — black and white. No hue anywhere; the entity accents are the only
   colour on screen, which makes them read hard. */
:host([data-palette="glass-mono"]:not([data-theme="dark"])) {
  --ground: radial-gradient(58% 42% at 16% 10%, #FFFFFF 0%, rgba(255,255,255,0) 62%),
            radial-gradient(54% 40% at 84% 10%, #F3F3F4 0%, rgba(255,255,255,0) 60%),
            radial-gradient(70% 50% at 74% 82%, #E8E8EA 0%, rgba(255,255,255,0) 66%),
            linear-gradient(162deg, #FAFAFB 0%, #F0F0F2 55%, #E6E6E9 100%);
  --text-2: rgba(60,60,67,.60);
}
:host([data-palette="glass-mono"][data-theme="dark"]) {
  --ground: radial-gradient(58% 42% at 16% 10%, #212123 0%, rgba(0,0,0,0) 62%),
            radial-gradient(54% 40% at 84% 10%, #171719 0%, rgba(0,0,0,0) 60%),
            radial-gradient(70% 50% at 74% 82%, #111113 0%, rgba(0,0,0,0) 66%),
            linear-gradient(162deg, #0B0B0C 0%, #000000 72%);
}

/* Clay — warm brown. Tan and umber rather than peach; reads as leather and
   wood next to Warm's blush. */
:host([data-palette="glass-clay"]:not([data-theme="dark"])) {
  --ground: radial-gradient(58% 42% at 16% 10%, #EFD8B8 0%, rgba(239,216,184,0) 62%),
            radial-gradient(52% 38% at 86% 8%,  #E0BE9C 0%, rgba(224,190,156,0) 60%),
            radial-gradient(72% 52% at 74% 78%, #D9C3A4 0%, rgba(217,195,164,0) 66%),
            radial-gradient(62% 46% at 8% 88%,  #E7D6C2 0%, rgba(231,214,194,0) 62%),
            linear-gradient(158deg, #FAF2E7 0%, #F1E4D3 54%, #E6D6C0 100%);
  --text-2: rgba(78,64,50,.64);
}
:host([data-palette="glass-clay"][data-theme="dark"]) {
  --ground: radial-gradient(58% 42% at 16% 10%, #3C2A19 0%, rgba(0,0,0,0) 62%),
            radial-gradient(52% 38% at 86% 8%,  #2F2015 0%, rgba(0,0,0,0) 60%),
            radial-gradient(72% 52% at 74% 80%, #2A1F14 0%, rgba(0,0,0,0) 66%),
            radial-gradient(62% 46% at 8% 88%,  #221A11 0%, rgba(0,0,0,0) 62%),
            linear-gradient(158deg, #14100B 0%, #0A0806 60%, #000000 100%);
}

/* --- frosted panes ---
   Only applied where the browser can actually blur what is behind them.
   Without backdrop-filter the tiles stay translucent, which still reads as
   glass over a soft ground; it just doesn't refract. */
@supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  :host([data-palette^="glass"]:not([data-theme="dark"])) .tile {
    background: rgba(255,255,255,.44);
    -webkit-backdrop-filter: blur(22px) saturate(165%);
    backdrop-filter: blur(22px) saturate(165%);
    border: 1px solid rgba(255,255,255,.62);
    box-shadow: 0 1px 2px rgba(28,28,30,.05), 0 10px 28px rgba(28,28,30,.07);
  }
  :host([data-palette^="glass"]:not([data-theme="dark"])) .tile.on {
    background: rgba(255,255,255,.86);
    border-color: rgba(255,255,255,.92);
    box-shadow: 0 1px 2px rgba(28,28,30,.07), 0 14px 34px rgba(28,28,30,.12);
  }
  :host([data-palette^="glass"]:not([data-theme="dark"])) .tile .ic {
    background: rgba(255,255,255,.55);
  }

  :host([data-palette^="glass"][data-theme="dark"]) .tile {
    background: rgba(120,120,128,.20);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    backdrop-filter: blur(22px) saturate(150%);
    border: 1px solid rgba(255,255,255,.10);
    box-shadow: none;
  }
  :host([data-palette^="glass"][data-theme="dark"]) .tile.on {
    background: rgba(242,242,247,.94);
    border-color: rgba(255,255,255,.55);
  }
  :host([data-palette^="glass"][data-theme="dark"]) .tile .ic {
    background: rgba(255,255,255,.14);
  }
  /* the coloured chip on an active tile must stay solid, not frost */
  :host([data-palette^="glass"]) .tile.on .ic { background: var(--accent); }
}

/* Fallback and shared tweaks, blur or no blur. */
:host([data-palette^="glass"]:not([data-theme="dark"])) {
  --surface: rgba(255,255,255,.46);
  --surface-on: rgba(255,255,255,.86);
  --icon-rest-bg: rgba(255,255,255,.55);
}
:host([data-palette^="glass"][data-theme="dark"]) {
  --surface: rgba(120,120,128,.20);
  --surface-on: rgba(242,242,247,.94);
}

*, *::before, *::after { box-sizing: border-box; }

.root { position:absolute; inset:0; display:flex; flex-direction:column;
        background:var(--ground); color:var(--text); overflow:hidden;
        padding-left:env(safe-area-inset-left,0px); padding-right:env(safe-area-inset-right,0px); }

/* ---- header ---- */
.head { flex:0 0 auto; padding:calc(var(--pm-pad) + env(safe-area-inset-top,0px)) var(--pm-pad) 10px; }
.head > * , .page > * { max-width:var(--pm-max); margin-inline:auto; width:100%; }
.eyebrow { font-size:13px; font-weight:600; letter-spacing:.02em; color:var(--text-2); margin-bottom:2px; }
h1 { margin:0; font-size:clamp(30px,6.5vw,42px); line-height:1.05; font-weight:700; letter-spacing:-.025em; }

/* ---- pager: native scroll-snap, never a JS gesture handler ---- */
.pager {
  flex:1 1 auto; display:flex; overflow-x:auto; overflow-y:hidden;
  scroll-snap-type:x mandatory; overscroll-behavior-x:contain;
  scrollbar-width:none; -ms-overflow-style:none;
}
.pager::-webkit-scrollbar { display:none; }
.page {
  flex:0 0 100%; width:100%; scroll-snap-align:center; scroll-snap-stop:always;
  overflow-y:auto; overscroll-behavior-y:contain;
  padding:4px var(--pm-pad) calc(var(--pm-pad) + 8px);
  -webkit-overflow-scrolling:touch;
}
.page::-webkit-scrollbar { display:none; }

.sect { margin-block:18px 10px; font-size:15px; font-weight:600; letter-spacing:-.01em; color:var(--text-2); }
.sect:first-child { margin-top:4px; }
.grid { display:grid; gap:var(--pm-gap); grid-template-columns:repeat(auto-fill,minmax(clamp(150px,42vw,190px),1fr)); }

/* ---- tile ---- */
.tile {
  position:relative; min-height:var(--pm-tile-h); border-radius:var(--pm-tile-r);
  corner-shape: squircle;
  background:var(--surface); box-shadow:var(--shadow);
  padding:14px; display:flex; flex-direction:column; justify-content:space-between;
  cursor:pointer; user-select:none; touch-action:manipulation;
  transition:background .28s var(--pm-ease), box-shadow .28s var(--pm-ease), transform .18s var(--pm-ease);
  backdrop-filter:blur(20px) saturate(1.4); -webkit-backdrop-filter:blur(20px) saturate(1.4);
}
.tile:active { transform:scale(.965); }
.tile.on { background:var(--surface-on); box-shadow:var(--shadow-on); }
.tile .ic {
  width:var(--pm-icon-box); height:var(--pm-icon-box); border-radius:var(--pm-icon-r);
  corner-shape: squircle;
  display:grid; place-items:center; background:var(--icon-rest-bg); color:var(--icon-rest-fg);
  transition:background .28s var(--pm-ease), color .28s var(--pm-ease);
}
.tile.on .ic { background:var(--accent); color:#fff; }
.tile svg { width:var(--pm-icon); height:var(--pm-icon); display:block; }
.tile .txt { min-width:0; }
.nm { font-size:15px; font-weight:600; letter-spacing:-.01em; line-height:1.25; color:var(--text);
      overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
.st:empty { display:none; }
.st { font-size:13.5px; line-height:1.3; color:var(--text-2); margin-top:1px;
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tile.on .nm { color:var(--text-on); }
.tile.on .st { color:var(--text-on-2); }

/* ---- dots ---- */
.dots { flex:0 0 auto; display:flex; gap:7px; justify-content:center; align-items:center;
        padding:10px 0 calc(12px + env(safe-area-inset-bottom,0px)); }
.dot { width:7px; height:7px; border-radius:99px; background:var(--dot);
       transition:width .34s var(--pm-ease), background .34s var(--pm-ease); }
.dot.sel { width:22px; background:var(--dot-on); }

/* Short viewports: a phone in landscape, or a small split-screen pane. */
@media (max-height: 540px) {
  .head { padding-top:calc(12px + env(safe-area-inset-top,0px)); padding-bottom:2px; }
  h1 { font-size:clamp(24px,4.2vw,30px); }
  .eyebrow { font-size:12px; }
  :host { --pm-tile-h: clamp(96px, 6vw + 70px, 116px); }
  .dots { padding:6px 0 calc(8px + env(safe-area-inset-bottom,0px)); }
}

@media (prefers-reduced-motion: reduce) {
  .tile, .tile .ic, .dot { transition:none; }
  .pager { scroll-behavior:auto; }
}
`;

/* --------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------ */
const DOMAIN = e => (e || '').split('.')[0];
/* A glyph is normally one path. A few (the fan) are several, so anything
 * starting with '<' is inserted as-is and everything else is wrapped. */
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d && d[0] === '<' ? d : `<path d="${d}"/>`}</svg>`;

const ACCENT = {
  light: 'var(--c-light)', switch: 'var(--c-switch)', input_boolean: 'var(--c-switch)',
  cover: 'var(--c-cover)', fan: 'var(--c-fan)', lock: 'var(--c-lock)',
  climate: 'var(--c-climate)', media_player: 'var(--c-media)', scene: 'var(--c-scene)',
  script: 'var(--c-scene)', binary_sensor: 'var(--c-alert)', sensor: 'var(--c-sensor)',
};

/* Which glyph, when the config does not name one. Device class first, because
 * "binary_sensor" tells you nothing and "moisture" tells you everything. */
function pickIcon(id, st) {
  const d = DOMAIN(id), dc = st && st.attributes.device_class, n = (id + ' ' + ((st && st.attributes.friendly_name) || '')).toLowerCase();
  if (d === 'light') {
    if (/strip|led/.test(n)) return 'strip';
    if (/ceiling|overhead/.test(n)) return 'ceiling';
    if (/lamp|bedside|floor|night/.test(n)) return 'lamp';
    return 'bulb';
  }
  if (d === 'switch' || d === 'input_boolean') {
    if (/plug|outlet|socket/.test(n)) return 'plug';
    if (/coffee/.test(n)) return 'coffee';
    if (/humid/.test(n)) return 'humid';
    if (/monitor|camera/.test(n)) return 'camera';
    if (/light|lamp/.test(n)) return 'bulb';
    return 'toggle';
  }
  if (d === 'cover') return 'blind';
  if (d === 'fan') return 'fan';
  if (d === 'lock') return st && st.state === 'unlocked' ? 'unlock' : 'lock';
  if (d === 'climate') return 'thermo';
  if (d === 'media_player') return /tv/.test(n) ? 'tv' : 'speaker';
  if (d === 'camera') return 'camera';
  if (d === 'scene' || d === 'script') {
    if (/movie|film|cinema|tv/.test(n)) return 'movie';
    if (/morning|sunrise|wake/.test(n)) return 'sunrise';
    if (/night|sleep|bed/.test(n)) return 'moon';
    if (/away|leave|out/.test(n)) return 'away';
    return 'movie';
  }
  if (d === 'binary_sensor') {
    if (dc === 'motion' || dc === 'occupancy') return 'motion';
    if (dc === 'moisture') return 'humid';
    if (dc === 'door' || dc === 'garage_door') return 'door';
    return 'motion';
  }
  if (d === 'sensor') {
    if (dc === 'temperature') return 'temp';
    if (dc === 'humidity') return 'humid';
    return 'temp';
  }
  return 'toggle';
}

const pct = v => (v === undefined || v === null ? null : Math.round(v));

/* The line under the name. Short, human, and never the raw machine state. */
function stateText(id, st, hass) {
  if (!st) return 'Unavailable';
  const d = DOMAIN(id), s = st.state, a = st.attributes;
  if (d === 'scene' || d === 'script') return '';
  if (s === 'unavailable') return 'Unavailable';
  if (s === 'unknown') return '—';
  if (d === 'light') return s === 'on' ? (a.brightness ? `On · ${pct(a.brightness / 2.55)}%` : 'On') : 'Off';
  if (d === 'fan') return s === 'on' ? (a.percentage != null ? `On · ${pct(a.percentage)}%` : 'On') : 'Off';
  if (d === 'switch' || d === 'input_boolean') return s === 'on' ? 'On' : 'Off';
  if (d === 'cover') {
    const p = a.current_position;
    if (s === 'open') return p != null && p < 100 ? `Open · ${pct(p)}%` : 'Open';
    return p != null && p > 0 ? `Open · ${pct(p)}%` : 'Closed';
  }
  if (d === 'lock') return s === 'locked' ? 'Locked' : 'Unlocked';
  if (d === 'climate') {
    const t = a.temperature, u = (hass && hass.config && hass.config.unit_system && hass.config.unit_system.temperature) || '°';
    const mode = s.charAt(0).toUpperCase() + s.slice(1);
    return t != null ? `${mode} · ${t}${u}` : mode;
  }
  if (d === 'media_player') return s === 'playing' ? (a.media_title || 'Playing') : (s === 'off' ? 'Off' : s.charAt(0).toUpperCase() + s.slice(1));
  if (d === 'binary_sensor') {
    const dc = a.device_class;
    if (dc === 'door' || dc === 'window' || dc === 'garage_door') return s === 'on' ? 'Open' : 'Closed';
    if (dc === 'moisture') return s === 'on' ? 'Leak' : 'Dry';
    if (dc === 'motion' || dc === 'occupancy') return s === 'on' ? 'Detected' : 'Clear';
    return s === 'on' ? 'On' : 'Off';
  }
  if (d === 'sensor') return a.unit_of_measurement ? `${s}${a.unit_of_measurement.startsWith('°') ? '' : ' '}${a.unit_of_measurement}` : s;
  return s;
}

/* "On" means: worth showing as lit. Sensors are never lit — a temperature
 * reading is information, not a state you switched on. */
function isOn(id, st) {
  if (!st) return false;
  const d = DOMAIN(id), s = st.state;
  if (d === 'sensor' || d === 'scene' || d === 'script') return false;
  if (d === 'lock') return s === 'locked';
  if (d === 'cover') return s === 'open' || (st.attributes.current_position || 0) > 0;
  if (d === 'climate') return s !== 'off' && s !== 'unavailable';
  if (d === 'media_player') return s !== 'off' && s !== 'unavailable' && s !== 'idle';
  return s === 'on';
}

/* --------------------------------------------------------------------------
 * The card.
 *
 * The DOM is built once and then patched in place. Home Assistant hands a
 * card a fresh `hass` object on every single state change in the house, and
 * re-rendering a tree that often is how a dashboard starts dropping frames.
 * ------------------------------------------------------------------------ */
class PMHome extends HTMLElement {
  static getStubConfig() { return { pages: [{ name: 'Home', sections: [{ items: [] }] }] }; }

  setConfig(config) {
    if (!config || !Array.isArray(config.pages) || !config.pages.length) {
      throw new Error('pm-home: `pages` must be a non-empty list');
    }
    this._config = config;
    /* Palette names the ground only: porcelain | linen | mist | sage | sand.
       Anything else (or nothing) keeps the original. */
    const PAL = ['glass-mono', 'glass-cool', 'glass-warm', 'glass-clay',
                 'porcelain', 'linen', 'mist', 'sage', 'sand'];
    if (PAL.indexOf(config.palette) !== -1) this.setAttribute('data-palette', config.palette);
    else this.removeAttribute('data-palette');
    /* theme: 'light' or 'dark' pins the card; omit to follow the device. */
    /* theme: 'light' | 'dark' pins it, 'sun' follows sunrise/sunset from
       Home Assistant's own sun entity, omit to follow the device. */
    this._pin = ['light', 'dark', 'sun'].indexOf(config.theme) !== -1 ? config.theme : null;
    this._built = false;
    this._tiles = [];
    this._page = 0;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = '';
  }

  set hass(hass) {
    this._hass = hass;
    this._theme();
    if (!this._built) this._build();
    this._paint();
  }
  get hass() { return this._hass; }

  getCardSize() { return 12; }

  /* Follow Home Assistant, which is already following the device. */
  _theme() {
    const t = this._hass && this._hass.themes;
    let v;
    if (this._pin === 'light' || this._pin === 'dark') {
      v = this._pin;
    } else if (this._pin === 'sun') {
      /* The house knows what time it is. No device setting can disagree. */
      const sun = this._hass && this._hass.states && this._hass.states['sun.sun'];
      v = (sun && sun.state === 'below_horizon') ? 'dark' : 'light';
    } else {
      const dark = t && typeof t.darkMode === 'boolean'
        ? t.darkMode
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      v = dark ? 'dark' : 'light';
    }
    if (this.getAttribute('data-theme') !== v) this.setAttribute('data-theme', v);
  }

  _build() {
    const cfg = this._config;
    const root = document.createElement('div');
    root.className = 'root';
    root.innerHTML =
      '<div class="head"><div class="eyebrow"></div><h1></h1></div>' +
      '<div class="pager"></div>' +
      '<div class="dots"></div>';

    const style = document.createElement('style');
    style.textContent = CSS;
    this.shadowRoot.append(style, root);

    this._eyebrow = root.querySelector('.eyebrow');
    this._title = root.querySelector('h1');
    this._pager = root.querySelector('.pager');
    this._dotsEl = root.querySelector('.dots');

    cfg.pages.forEach((page, pi) => {
      const pEl = document.createElement('div');
      pEl.className = 'page';
      (page.sections || []).forEach(sec => {
        if (sec.title) {
          const h = document.createElement('div');
          h.className = 'sect';
          h.textContent = sec.title;
          pEl.appendChild(h);
        }
        const grid = document.createElement('div');
        grid.className = 'grid';
        (sec.items || []).forEach(item => grid.appendChild(this._tile(item)));
        pEl.appendChild(grid);
      });
      this._pager.appendChild(pEl);

      const dot = document.createElement('div');
      dot.className = 'dot' + (pi === 0 ? ' sel' : '');
      dot.addEventListener('click', () => this._goto(pi));
      this._dotsEl.appendChild(dot);
    });

    if (cfg.pages.length < 2) this._dotsEl.style.display = 'none';
    this._watchPages();
    this._built = true;
    this._onResize = () => { clearTimeout(this._rzT); this._rzT = setTimeout(() => this._bleed(), 120); };
    window.addEventListener('resize', this._onResize, { passive: true });
    window.addEventListener('orientationchange', this._onResize, { passive: true });
    this._setPage(0);
  }

  _tile(item) {
    const spec = typeof item === 'string' ? { entity: item } : item;
    const el = document.createElement('div');
    el.className = 'tile';
    el.innerHTML = '<div class="ic"></div><div class="txt"><div class="nm"></div><div class="st"></div></div>';
    const rec = {
      id: spec.entity, spec, el,
      ic: el.querySelector('.ic'), nm: el.querySelector('.nm'), st: el.querySelector('.st'),
      icon: null, on: null, text: null, name: null,
    };
    this._tiles.push(rec);

    /* Tap acts. Press and hold opens Home Assistant's own detail dialog —
     * no point rebuilding a colour picker that already exists and works. */
    /* A tap is a tap only if the finger stayed put. Any drift past a few
       pixels, or a scroll starting anywhere on the pager, means the person
       is swiping between pages and this tile must stay out of the way. */
    let timer = null, held = false, moved = false, sx = 0, sy = 0, pid = null;
    const SLOP = 9;
    const start = e => {
      held = false; moved = false; pid = e.pointerId; sx = e.clientX; sy = e.clientY;
      clearTimeout(timer);
      timer = setTimeout(() => { if (!moved) { held = true; this._more(rec.id); } }, 480);
    };
    const track = e => {
      if (moved || e.pointerId !== pid) return;
      if (Math.abs(e.clientX - sx) > SLOP || Math.abs(e.clientY - sy) > SLOP) {
        moved = true; clearTimeout(timer);
      }
    };
    const stop = () => { clearTimeout(timer); moved = true; };
    el.addEventListener('pointerdown', start);
    el.addEventListener('pointermove', track, { passive: true });
    el.addEventListener('pointerup', e => {
      clearTimeout(timer);
      const scrolling = performance.now() - (this._scrolledAt || 0) < 160;
      if (!held && !moved && !scrolling) { e.preventDefault(); this._act(rec.id); }
      held = false; moved = false; pid = null;
    });
    el.addEventListener('pointercancel', stop);
    el.addEventListener('pointerleave', stop);
    el.addEventListener('contextmenu', e => e.preventDefault());
    return el;
  }

  _more(id) {
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId: id }, bubbles: true, composed: true,
    }));
  }

  _act(id) {
    const hass = this._hass, st = hass.states[id], d = DOMAIN(id);
    if (!st || st.state === 'unavailable') return this._more(id);
    if (d === 'sensor' || d === 'binary_sensor' || d === 'climate' || d === 'media_player') return this._more(id);
    if (d === 'scene') return hass.callService('scene', 'turn_on', { entity_id: id });
    if (d === 'script') return hass.callService('script', 'turn_on', { entity_id: id });
    if (d === 'lock') return hass.callService('lock', st.state === 'locked' ? 'unlock' : 'lock', { entity_id: id });
    if (d === 'cover') {
      const open = st.state === 'open' || (st.attributes.current_position || 0) > 0;
      return hass.callService('cover', open ? 'close_cover' : 'open_cover', { entity_id: id });
    }
    return hass.callService('homeassistant', 'toggle', { entity_id: id });
  }

  /* Which page is on screen, decided by the browser rather than by tracking
   * scroll offsets ourselves. Survives rotation, resize and split view. */
  _watchPages() {
    this._pager.addEventListener('scroll', () => { this._scrolledAt = performance.now(); }, { passive: true });
    const pages = [...this._pager.children];
    if (!('IntersectionObserver' in window)) return;
    this._io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting && en.intersectionRatio > 0.55) {
          this._setPage(pages.indexOf(en.target));
        }
      });
    }, { root: this._pager, threshold: [0.55, 0.9] });
    pages.forEach(p => this._io.observe(p));
  }

  _goto(i) {
    const p = this._pager.children[i];
    if (p) this._pager.scrollTo({ left: p.offsetLeft, behavior: 'smooth' });
  }

  _setPage(i) {
    if (i < 0 || i === this._page && this._titleSet) return;
    this._page = i;
    this._titleSet = true;
    [...this._dotsEl.children].forEach((d, n) => d.classList.toggle('sel', n === i));
    this._paintHead();
  }

  _paintHead() {
    const page = this._config.pages[this._page];
    if (!page) return;
    if (this._title.textContent !== (page.name || '')) this._title.textContent = page.name || '';
    let line = page.subtitle || '';
    if (!line && this._hass) {
      const ids = (page.sections || []).flatMap(s => (s.items || []).map(i => typeof i === 'string' ? i : i.entity));
      const live = ids.filter(id => ['light', 'switch', 'fan', 'input_boolean'].includes(DOMAIN(id)));
      const on = live.filter(id => { const s = this._hass.states[id]; return s && s.state === 'on'; }).length;
      line = live.length ? (on ? `${on} on` : 'All off') : `${ids.length} ${ids.length === 1 ? 'item' : 'items'}`;
    }
    if (this._eyebrow.textContent !== line) this._eyebrow.textContent = line;
  }

  _paint() {
    const hass = this._hass;
    for (const t of this._tiles) {
      const st = hass.states[t.id];
      const name = t.spec.name || (st && st.attributes.friendly_name) || t.id;
      const icon = t.spec.icon || pickIcon(t.id, st);
      const on = isOn(t.id, st);
      const text = stateText(t.id, st, hass);

      if (icon !== t.icon) { t.ic.innerHTML = svg(ICONS[icon] || ICONS.toggle); t.icon = icon; }
      if (name !== t.name) { t.nm.textContent = name; t.name = name; }
      if (text !== t.text) { t.st.textContent = text; t.text = text; }
      if (on !== t.on) {
        t.el.classList.toggle('on', on);
        t.el.style.setProperty('--accent', ACCENT[DOMAIN(t.id)] || 'var(--c-switch)');
        t.on = on;
      }
      const dead = !st || st.state === 'unavailable';
      if (t.dead !== dead) { t.el.style.opacity = dead ? '.45' : ''; t.dead = dead; }
    }
    this._paintHead();
  }

  connectedCallback() { this._bleed(); }

  disconnectedCallback() {
    if (this._io) this._io.disconnect();
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('orientationchange', this._onResize);
    }
  }

  /* Home Assistant pads its view container by the device safe-area insets,
     so on a notched phone the dashboard sits inside a grey frame. Kiosk mode
     hides the header but not that padding. We zero the insets on the
     containers above us and take responsibility for them ourselves (see the
     env() padding on .root), so the surface runs edge to edge. */
  _bleed() {
    const TARGETS = ['hui-card', 'hui-view', 'hui-panel-view', 'hui-view-container'];
    let n = this;
    for (let i = 0; i < 14 && n; i++) {
      n = n.parentNode;
      if (n && n.host) n = n.host;
      if (!n || n.nodeType !== 1) break;
      if (n.localName === 'ha-panel-lovelace') break;
      if (TARGETS.indexOf(n.localName) !== -1) {
        n.style.setProperty('--safe-area-inset-top', '0px');
        n.style.setProperty('--safe-area-inset-right', '0px');
        n.style.setProperty('--safe-area-inset-bottom', '0px');
        n.style.setProperty('--safe-area-inset-left', '0px');
        n.style.setProperty('padding-left', '0', 'important');
        n.style.setProperty('padding-right', '0', 'important');
        n.style.setProperty('padding-bottom', '0', 'important');
        n.style.setProperty('margin', '0', 'important');
      }
    }
  }
}

customElements.define('pm-home', PMHome);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'pm-home',
  name: 'ProjectMikey Home',
  description: 'Sliding room pages with large tiles. No dependencies.',
});
console.info('%c PM-HOME %c built from scratch ', 'background:#0A84FF;color:#fff;border-radius:3px 0 0 3px;padding:2px 6px', 'background:#1c1c1e;color:#fff;border-radius:0 3px 3px 0;padding:2px 6px');
