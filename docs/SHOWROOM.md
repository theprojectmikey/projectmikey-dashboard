# Showroom

`packages/showroom.yaml` is a self-contained set of ~32 simulated devices across
five rooms: lights, covers, fans, a lock, a thermostat, switches, motion and
door sensors, temperature and humidity, plus four scenes.

**What it's for.** Demoing to a customer before their hardware exists, and
filling out a half-finished install so the dashboard doesn't look empty.

## Install

1. Copy `showroom.yaml` to `/config/packages/showroom.yaml`
2. Make sure `configuration.yaml` has:
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```
3. Restart Home Assistant.

## Remove

Delete the file and restart. That's the whole uninstall.

Every helper it creates is prefixed `sr_`, and the file touches nothing outside
itself, so removing it can't take real entities with it.

## Before handover

**Take it off.** A customer finding `light.island` in their house that isn't a
real light will not read as a demo, it will read as a bug. Delete the file,
restart, then fix the entity IDs in the dashboard config to point at their
actual hardware.
