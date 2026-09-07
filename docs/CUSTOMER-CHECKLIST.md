# Per-customer checklist

Print this. Tick it on site.

## Before you go

- [ ] HA Green flashed, on the network, Home Assistant onboarded
- [ ] Backup taken and named `pre-projectmikey`
- [ ] HACS installed and authenticated
- [ ] Card installed from the custom repository
- [ ] Data-capable USB extension and a powered USB 2.0 hub in the bag
      (Zigbee and Z-Wave sticks fail on charge-only cables often enough that
      it should never be a surprise)

## On site

- [ ] All their hardware paired and showing up in Developer Tools → States
- [ ] Entities named the way the customer talks about them — "Ceiling", not
      "0x00124b0022f1c3 light 1". This is what they see every day.
- [ ] Every entity assigned to an **area**. The dashboard doesn't need it, but
      voice control and HA's own auto-dashboards do.
- [ ] Dashboard created, pages mapped to their real entity IDs
- [ ] Palette chosen by the customer, not by you
- [ ] `theme: sun` set
- [ ] Showroom package removed if it was ever installed
- [ ] Kiosk decided — and if kiosk is on, they know how to reach Settings

## Test on their hardware, not yours

- [ ] Portrait and landscape, edge to edge, no grey borders
- [ ] Swipe hard through every page, thumb landing on cards — no accidental toggles
- [ ] Tap a light on, tap it off
- [ ] Press and hold — more-info opens
- [ ] Wall tablet, if there is one: readable from across the room
- [ ] Come back after dark, or set `sun.sun` manually, and check the night look

## Handover

- [ ] Their phone opens the dashboard — navigate to it once on their handset
- [ ] Second non-kiosk dashboard exists, or they know the Settings URL
- [ ] Final backup taken, named `post-projectmikey`
- [ ] They've toggled something themselves while you watched
