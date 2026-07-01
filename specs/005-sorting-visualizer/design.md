# 005 — Sorting Visualizer: Design

## Component Tree
```
SortingVisualizerPage (/dsa/sorting)
  VisualizerShell title="Sorting"
    controls: algorithm select + size + randomize + <PlaybackControls/>
    canvas:   <BarChart> of values with per-bar state styling
    footer:   complexity table for the selected algorithm
```

## Step Model (pure data)
Algorithms are generators that, given an input array, return an ordered list of
steps. Playback just indexes into this list.

```js
// step shape
{
  array: number[],         // snapshot after this step
  comparing: [i, j] | null,
  swapped: [i, j] | null,
  sorted: number[],        // indices locked as final
}
```

```js
export function bubbleSortSteps(input) { /* returns Step[] */ }
export function selectionSortSteps(input) { /* returns Step[] */ }
export function insertionSortSteps(input) { /* returns Step[] */ }
```

## Playback State
```js
{
  steps: Step[],
  index: number,           // current step
  isPlaying: boolean,
  speed: number,           // ms per step
}
```
- A timer advances `index` while `isPlaying`; reaching the end auto-pauses.
- `PlaybackControls` (shared) maps to play/pause, step, reset, speed.

## Bar Styling by State
- default, comparing (highlight ring), swapped (accent fill), sorted (success).
- Heights normalized to the canvas; values can be shown on/under bars.

## Complexity Table
Per algorithm: best / average / worst time, plus space. Rendered in the footer.

## Reuse
- `VisualizerShell` frame + `PlaybackControls` primitive (both from spec 000).
- Step generators live in `lib/algorithms/sorting.js` (pure, unit-testable).
