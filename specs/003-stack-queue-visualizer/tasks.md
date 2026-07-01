# 003 — Stack & Queue Visualizer: Tasks

Implementation order: **Stack first, then Queue** reusing the shared pieces.

## Phase A — Shared architecture + Stack

- [ ] Create `lib/algorithms/linear-structure.js` with shared primitives:
      `makeItem`/`makeItems`, the `step()` helper, and the Step model.
- [ ] Add the **stack** builders: `buildPushSteps`, `buildPopSteps`,
      `buildPeekSteps` (with underflow; optional capacity → overflow).
- [ ] Create `lib/dsa/stack-content.js` (operations metadata, complexity rows,
      concept, representation, backend use cases, common mistakes, interview
      questions, practice prompts) following `array-content.js`.
- [ ] Build the shared `LinearStructureVisualizer` (`kind="stack" | "queue"`),
      `"use client"`, using `useReducer` + the Step model:
      operation selector, value input, **Run** (generate steps),
      `PlaybackControls` (previous/next/reset), step indicator, and the
      operation-aware explanation/pseudocode/JavaScript/complexity panels.
- [ ] Build `StructureTrack`/`StructureCell` with Framer Motion — vertical
      column + "top" label for the stack; accessible cells (aria-labels +
      non-color state cues).
- [ ] Wire validation/error states (empty value, underflow, optional overflow).
- [ ] Create `app/dsa/stack/page.js` composing the twelve-part template with
      `<LinearStructureVisualizer kind="stack" />`.
- [ ] Flip the `stack` catalog entry to `status: "available"`.
- [ ] `npm run lint` + `npm run build`; verify Stack against acceptance criteria.

## Phase B — Queue (reusing shared pieces)

- [ ] Add the **queue** builders to `linear-structure.js`: `buildEnqueueSteps`,
      `buildDequeueSteps`, `buildFrontSteps`, `buildRearSteps` (with underflow;
      optional capacity → overflow).
- [ ] Create `lib/dsa/queue-content.js` following the same shape as the stack
      content module.
- [ ] Extend `LinearStructureVisualizer` for `kind="queue"`: horizontal row
      layout, "front"/"rear" labels, and the queue operation set. No structural
      changes to the reducer or Step model.
- [ ] Create `app/dsa/queue/page.js` composing the twelve-part template with
      `<LinearStructureVisualizer kind="queue" />`.
- [ ] Flip the `queue` catalog entry to `status: "available"`.
- [ ] `npm run lint` + `npm run build`; verify Queue against acceptance criteria.

## Notes

- No new packages. JavaScript only. No `<canvas>`.
- Shared: component, reducer, Step model, item primitives, `VisualizerShell`,
  `PlaybackControls`. Separate: per-topic content modules and routes.
