# 002 — Array Visualizer: Tasks

## Pure logic (no React)
- [ ] Create `lib/algorithms/array.js` with the `Step` shape documented.
- [ ] Implement `buildAccessSteps(array, index)`.
- [ ] Implement `buildInsertEndSteps(array, value)`.
- [ ] Implement `buildDeleteSteps(array, index)` (shift-left snapshot).
- [ ] Implement `buildLinearSearchSteps(array, target)` (per-comparison steps).
- [ ] Declare (not implement) `buildInsertAtSteps`, `buildBinarySearchSteps`.

## Visualizer component (`ArrayVisualizer`, "use client")
- [ ] Reducer + state shape (operation, inputs, steps, cursor, isPlaying, speed, error).
- [ ] `ArrayCell` (value + index label, stable id key, state styling).
- [ ] `ArrayTrack` (Framer Motion layout group; animate insert/delete shift).
- [ ] `OperationSelector` (v1 ops enabled; insert-at-position + binary search disabled).
- [ ] `OperationInputs` (index / value / target per operation) with validation.
- [ ] Wire `PlaybackControls`: step forward, step backward, reset, auto-play, speed.
- [ ] Current-step indicator + step description (aria-live message region).
- [ ] Validation/error state for out-of-bounds / invalid input.

## Topic page (`app/dsa/array/page.js`)
- [ ] Compose the twelve-part template (PageHeader + content panels + visualizer).
- [ ] Operation-aware Explanation, Pseudocode, Complexity, Backend-use-case panels.
- [ ] Author Arrays content: concept, representation, common mistakes,
      interview questions, practice prompts.

## Shared content panels (build here, reuse later)
- [ ] `ComplexityTable` (operation → time → space).
- [ ] `CodeBlock` (labeled JS / pseudocode).
- [ ] `InfoList` (use cases / mistakes / questions / prompts).

## Verification
- [ ] Arrays card already `available` in catalog; confirm `/dsa/array` resolves.
- [ ] `npm run lint` passes; `npm run build` succeeds.
- [ ] Verify against acceptance-criteria.md.

## Deferred (later version)
- [ ] Implement insert-at-position (O(n) shift right) + enable in selector.
- [ ] Implement binary search (requires sorted array mode) + enable in selector.
