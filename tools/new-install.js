/* ---------------------------------------------------------------------------
 * ProjectMikey — build the dashboard on a fresh box.
 *
 * Saves you clicking through Settings → Dashboards → Raw editor.
 *
 * HOW TO RUN
 *   1. Open Home Assistant in a desktop browser, logged in as an admin.
 *   2. Open the browser console (F12 → Console).
 *   3. Edit PAGES and PALETTE below, paste the whole file in, press Enter.
 *
 * Safe to re-run: if the dashboard already exists it just rewrites its config.
 * ------------------------------------------------------------------------- */

const URL_PATH = 'pm-home';          // the dashboard's URL, must contain a hyphen
const TITLE    = 'Home';
const ICON     = 'mdi:home-variant';
const PALETTE  = 'glass-cool';       // glass-mono | glass-cool | glass-warm | glass-clay
const THEME    = 'sun';              // sun | light | dark | null to follow the device
const KIOSK    = true;               // needs kiosk-mode installed from HACS

const PAGES = [
  { name: 'Home', sections: [
    { title: 'Scenes',     items: ['scene.good_morning','scene.movie_night','scene.goodnight','scene.away'] },
    { title: 'Favourites', items: ['climate.thermostat','lock.front_door','light.ceiling','cover.living_blinds'] },
  ]},
  { name: 'Living Room', sections: [
    { items: ['light.ceiling','light.lamp','light.floor_lamp','cover.living_blinds','fan.living_fan','media_player.living_room_tv'] },
    { title: 'Sensors', items: ['sensor.living_room_temperature','sensor.living_room_humidity'] },
  ]},
  { name: 'Kitchen', sections: [
    { items: ['light.under_cabinet','light.island','switch.coffee_maker','cover.kitchen_blinds'] },
  ]},
  { name: 'Bedroom', sections: [
    { items: ['light.bedroom_ceiling','light.bedside','cover.bedroom_blinds','fan.bedroom_fan'] },
  ]},
  { name: 'Entry', sections: [
    { items: ['lock.front_door','light.hallway','binary_sensor.front_door','binary_sensor.doorbell'] },
  ]},
];

/* ------------------------------------------------------------------------ */

(async () => {
  const conn = (await window.hassConnection).conn;
  const hass = document.querySelector('home-assistant').hass;

  // Warn about entity IDs that don't exist on this box — the most common
  // install mistake, and silent if you don't check.
  const wanted = PAGES.flatMap(p => p.sections.flatMap(s => s.items));
  const missing = wanted.filter(id => !hass.states[id]);
  if (missing.length) {
    console.warn('%c These entities do not exist on this box: ', 'background:#FF9F0A;color:#000', missing);
    console.warn('Fix them in PAGES, or they will render as unavailable tiles.');
  }

  // Is the card actually registered?
  const res = await conn.sendMessagePromise({ type: 'lovelace/resources' });
  if (!res.some(r => /pm-home\.js/.test(r.url))) {
    console.error('%c pm-home.js is not a Lovelace resource. Install it from HACS first. ',
      'background:#FF453A;color:#fff');
    return;
  }

  const list = await conn.sendMessagePromise({ type: 'lovelace/dashboards/list' });
  if (!list.some(d => d.url_path === URL_PATH)) {
    await conn.sendMessagePromise({
      type: 'lovelace/dashboards/create',
      url_path: URL_PATH, title: TITLE, icon: ICON,
      mode: 'storage', show_in_sidebar: true, require_admin: false,
    });
    console.log('Created dashboard', URL_PATH);
  }

  const card = { type: 'custom:pm-home', palette: PALETTE, pages: PAGES };
  if (THEME) card.theme = THEME;

  const config = {
    views: [{ type: 'panel', title: TITLE, path: 'home', cards: [card] }],
  };
  if (KIOSK) config.kiosk_mode = { hide_header: true, hide_sidebar: true };

  await conn.sendMessagePromise({ type: 'lovelace/config/save', url_path: URL_PATH, config });

  console.log('%c Done. ', 'background:#30D158;color:#000',
    `Open /${URL_PATH}/home — ${PAGES.length} pages, ${wanted.length} tiles.`);
  if (KIOSK) console.log('Kiosk is on: no sidebar on that dashboard. Reach Settings at /config/dashboard');
})();
