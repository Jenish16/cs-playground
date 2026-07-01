# 005 — Sorting Visualizer: Requirements

## Summary
An interactive visualizer that animates classic sorting algorithms step by
step, highlighting comparisons and swaps.

## Goals
- Show *how* each algorithm orders data, not just the result.
- Let learners control playback (play/pause/step/speed) to study each move.

## Functional Requirements
- FR1: Render values as a bar chart (height = value).
- FR2: Algorithms (initial): Bubble Sort, Selection Sort, Insertion Sort.
- FR3: Generate a precomputed list of steps; each step describes indices being
  compared/swapped and the array state.
- FR4: Playback via shared `PlaybackControls`: play, pause, step forward,
  reset, and adjustable speed.
- FR5: Visually distinguish: comparing (highlight), swapping (accent), and
  sorted/locked positions.
- FR6: Controls to randomize the dataset and choose size (within a safe range).
- FR7: Show the algorithm's best/average/worst time complexity.

## Non-Functional Requirements
- NFR1: Built on shared `VisualizerShell` + `PlaybackControls`.
- NFR2: Step model is pure data so playback is deterministic and reversible to
  start (reset).
- NFR3: Smooth at array sizes up to ~30 bars.

## Out of Scope
- Merge/quick/heap sort (future additions once the step model is proven).
- Sorting stability comparisons, sound.

## Route
`/dsa/sorting`
