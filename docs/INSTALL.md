# New install — HA Green, start to finish

Roughly 20 minutes on a box that's already on the network.

## 1. Back up first

Settings → System → Backups → **Create backup**. Name it `pre-projectmikey`.
Under a minute, and it is the difference between a mistake and a disaster.

## 2. Audit what's actually controllable

Developer Tools → States. Count the lights, covers, locks, climate and sensors.
A house with three smart plugs will not look like the screenshots, and that is a
day-one conversation with the customer, not a post-build one.

Note the entity IDs as you go — you'll need them in step 5.

## 3. Install the card

HACS → three dots → Custom repositories → paste the repo URL, type **Dashboard**
→ Download. See the README for the private-repo token note.

Verify: Settings → Dashboards → three dots → Resources. You should see
`/hacsfiles/projectmikey-dashboard/pm-home.js` as a **JavaScript module**.

## 4. Create the dashboard

Settings → Dashboards → **Add dashboard** → New dashboard from scratch.
Title `Home`, icon `mdi:home-variant`, URL `pm-home`.

Open it → pencil → three dots → **Raw configuration editor**. Delete
everything and paste the template from `tools/dashboard-template.yaml`.

## 5. Map the pages to real entities

Replace the entity IDs with the ones from step 2. One page per room. The card
picks the icon, colour and status line itself, so there is nothing else to
configure.

Keep pages to 8–10 tiles. Past that the customer scrolls, and scrolling on a
page that also swipes sideways is where dashboards start to feel awkward.

## 6. Pick a palette

Show them `docs/lineup.png` on your laptop and let them choose. Set `palette:`
in the raw editor. Leave `theme: sun` alone.

## 7. Kiosk (optional)

If you want it full-screen with no Home Assistant chrome, install `kiosk-mode`
from HACS and add to the top of the raw config:

```yaml
kiosk_mode:
  hide_header: true
  hide_sidebar: true
```

**Know what this costs.** The customer can no longer reach Settings from that
dashboard — there is no sidebar and no menu button. Leave them a second,
non-kiosk dashboard, or show them that `<their-url>/config/dashboard` reaches
Settings directly. Don't hand over a box they can't get out of.

## 8. Set it as their default

Their phone: Home Assistant app → Settings → Companion App → Navigation →
set the default dashboard.

The app restores the **last page viewed**, not the default — so navigate to the
new dashboard once on their handset before you leave, or it'll open wherever
they were last.

## 9. Walk it on the customer's own phone

- Both orientations, edge to edge, no grey borders
- Swipe hard through every page with a thumb that lands on a card
- Tap a light on and off
- Press and hold a light — the more-info dialog should open

Those four are the ones that only show up on real hardware.

## Manual install (no HACS)

1. Copy `dist/pm-home.js` to `/config/www/pm/pm-home.js`
2. Settings → Dashboards → three dots → Resources → Add
   `/local/pm/pm-home.js?v=1` as a **JavaScript module**
3. Bump `?v=` every time you replace the file, or browsers keep serving the
   cached copy. The path is the cache key.
