---
name: track-momentum-threat
description: Track the Momentum and Threat economy around STA 2e rolls — how bonus dice are bought and how Momentum is generated from extra successes.
---

# Track Momentum and Threat

Use this skill when helping a Star Trek Adventures 2e group manage the Momentum/Threat economy around task rolls.

## The economy

- **Momentum** is the players' shared pool (maximum 6). It starts at 2 at the beginning of a session.
- Rolling **more successes than the Difficulty** banks 1 Momentum per extra success.
- Before a roll, players may spend **1 Momentum per bonus die** (up to 3 bonus dice on a single roll).
- Momentum can also be spent to: create an Advantage (2), obtain information (1), or keep the initiative (2).
- **Threat** is the gamemaster's pool. It grows when players buy bonus dice with Threat instead of Momentum, when complications occur, or when the GM accepts player-offered Threat.
- The GM spends Threat to raise Difficulty, introduce complications, and empower NPCs.

## Using 2d20.space

The roller at https://2d20.space/ supports Momentum and Threat bonus dice directly: set the "Momentum dice" and "Threat dice" counts before rolling. These add to the dice pool and are included in the success total, matching the official rules.

## Practical tracking

Keep two running totals. After each roll: `momentum += max(0, successes - difficulty)` (cap 6). When players buy dice: `momentum -= dice_bought` or `threat += dice_bought`. Complications add 1 Threat each at the GM's discretion.
