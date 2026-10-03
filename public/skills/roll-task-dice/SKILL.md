---
name: roll-task-dice
description: Roll a Star Trek Adventures 2e d20 task pool — Target Number, Difficulty, Focus, complication range, assists, Momentum/Threat bonus dice, and rerolls.
---

# Roll an STA 2e Task Pool

Use this skill when someone wants to resolve a Star Trek Adventures Second Edition task with the 2d20 system, or wants to understand how 2d20.space rolls dice.

## The 2d20 task resolution rules

1. The gamemaster sets a **Target Number (TN)** (usually Attribute + Discipline, 7–19) and a **Difficulty** (0–5, the number of successes needed).
2. Roll **2d20** by default (up to 5 dice with bonus dice from Momentum or Threat).
3. Each die that rolls **equal to or under the TN** scores **1 success**.
4. A natural **1** is a **critical success** worth **2 successes**.
5. A natural **20** (or any roll at/above the **complication range**, default 20) scores a **complication** — the task may succeed but something goes wrong.
6. **Focus**: if the character has a relevant Focus and rolls equal to or under their Discipline score, that die scores **2 successes**.
7. **Momentum**: each success beyond the Difficulty generates 1 Momentum (group pool, max 6). Momentum can buy bonus dice before a roll (1 die per Momentum, up to 3 dice) or create advantages.
8. **Threat**: the gamemaster's pool. Players can give the GM Threat to buy bonus dice the same way.
9. **Reroll**: unspent Determination (or some Talents) allows rerolling dice.

## Using 2d20.space

Open https://2d20.space/ and set: number of dice (2–5), Target Number, Difficulty, Focus on/off with Discipline value, complication range, assists, and Momentum/Threat bonus dice. Press roll. The roller shows per-die results, total successes, complications, and keeps a stardate-stamped roll history. Dice use `crypto.getRandomValues` — cryptographically secure randomness.

## Replicating a roll yourself

For each d20: `success = roll <= TN` (1 success, or 2 if roll == 1, or 2 if Focus applies and roll <= Discipline). `complication = roll >= complicationRange`. Sum successes, compare to Difficulty; excess successes become Momentum.
