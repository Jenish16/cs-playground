# 002 — Array Visualizer: Design

## Page Composition (`/dsa/array`)

The Arrays topic page follows the spec 001 twelve-part template. The interactive
visualizer is part 4; the surrounding parts are content panels.

```
<Container>
  <PageHeader eyebrow="DSA · Arrays" title="Arrays"
              description="How arrays index, access, insert, delete, and search —
                           and where backend systems rely on them." />

  ConceptPanel            // 1. Concept explanation
  RepresentationPanel     // 2. Internal representation (contiguous indexed slots)
  OperationsList          // 3. Operations overview

  <ArrayVisualizer />     // 4. Step-by-step interactive visualization

  PseudocodePanel         // 5. Pseudocode (per selected operation)
  CodeExamplePanel        // 6. JavaScript example (per operation)
  ComplexityPanel         // 7 + 8. Time & space complexity table
  BackendUseCases         // 9. Backend use cases
  CommonMistakes          // 10. Common mistakes
  InterviewQuestions      // 11. Interview questions
  PracticePrompts         // 12. Practice prompts
</Container>
```

The explanation, pseudocode, complexity, and backend-use-case panels are
**operation-aware**: when the user selects an operation in the visualizer, these
panels update to describe that operation. (v1 may implement this as the
visualizer owning the selected operation and rendering the relevant panels
beneath it.)

## ArrayVisualizer Component Tree

```
ArrayVisualizer ("use client")
  VisualizerShell title="Array"
    controls:
      OperationSelector      // Access | Insert at end | Delete from index |
                             // Linear search | (Insert at position*) | (Binary search*)
      OperationInputs        // index and/or value, per operation
      RunButton              // builds the step list for the operation
      PlaybackControls       // step back, step forward, reset, auto-play, speed
    canvas:
      ArrayTrack             // Framer Motion layout group
        ArrayCell[]          // value + index label + state styling
    message:                 // validation/error OR current-step description
    footer:
      StepIndicator          // "Step k of n"
  (panels rendered by the page consume the selected operation)
```

\* deferred operations are listed but disabled in v1.

## Step Model (pure data — the core idea)

Operations are **pure functions** that take the current array + inputs and return
an ordered list of steps. Playback just indexes into this list, which makes
step-forward / step-backward / reset trivial and deterministic.

```js
// A single step describes the array state and what to emphasize.
{
  array: number[],          // snapshot of the array AT this step
  highlight: number[],      // indices to emphasize (compare/access/inserted)
  removing: number | null,  // index animating out (delete)
  inserting: number | null, // index animating in (insert)
  found: number | null,     // index of a search match, when applicable
  description: string,      // human-readable "what this step does"
  status: "info" | "success" | "error",
}

// Operation builders (pure, unit-testable):
buildAccessSteps(array, index)        // O(1): one highlight step
buildInsertEndSteps(array, value)     // O(1): append + highlight new tail
buildDeleteSteps(array, index)        // O(n): mark removing, then shift snapshot
buildLinearSearchSteps(array, target) // O(n): one step per comparison + result
```

Deferred builders (declared but not implemented in v1):
`buildInsertAtSteps`, `buildBinarySearchSteps`.

These builders live in a pure module (e.g. `lib/algorithms/array.js`) so they
carry no React/DOM dependency and can be tested independently.

## Playback State (React)

Use `useReducer` to keep transitions explicit:

```js
state = {
  base: number[],          // the array as last "committed" / reset target
  operation: "access" | "insertEnd" | "delete" | "linearSearch",
  inputs: { index: string, value: string, target: string },
  steps: Step[],           // built when an operation runs; [] when idle
  cursor: number,          // current step index (0..steps.length-1), -1 when idle
  isPlaying: boolean,
  speed: number,           // ms per step (maps to PlaybackControls)
  error: string | null,    // validation message
}

actions:
  SET_OPERATION, SET_INPUT, RUN (build steps + validate),
  STEP_FORWARD, STEP_BACKWARD, PLAY, PAUSE, TICK, RESET, SET_SPEED
```

- The rendered array is `steps[cursor].array` while a run is active, else `base`.
- Auto-play advances `cursor` on a timer until the last step, then pauses.
- `RESET` restores `base` to the default sample and clears `steps`/`cursor`.

## Visualization Details (div + Framer Motion)

- `ArrayCell` is a Framer Motion item **keyed by a stable id**, not by index, so
  delete/insert animate position changes (`layout`) rather than snapping.
- Cell states (driven by the current step): default, highlighted (access/compare),
  inserting (scale/fade in), removing (scale/fade out), found (success accent).
- Index labels render under each cell; the tail "insert here" affordance can be
  shown for insert-at-end.
- No `<canvas>`; everything is divs + transforms for clarity and accessibility.

## Validation Rules

- Access / Delete: index must be an integer in `[0, n-1]`; else error, no change.
- Insert at end: value must be a valid number; else error.
- Linear search: target must be a valid number.
- Errors set `state.error`, render in the message region, and build no steps.

## Panel Content (per operation)

| Operation | Time | Space | Pseudocode focus | Backend tie-in |
|-----------|------|-------|------------------|----------------|
| Access by index | O(1) | O(1) | `return arr[i]` | response list item lookup |
| Insert at end | O(1) amortized | O(1) | `arr[n] = v; n++` | batch buffer append, payload collection |
| Delete from index | O(n) | O(1) | shift left from `i+1` | removing an item from an in-memory list |
| Linear search | O(n) | O(1) | scan until match | unindexed lookup, small config arrays |
| Insert at position* | O(n) | O(1) | shift right from `i` | inserting into an ordered buffer |
| Binary search* | O(log n) | O(1) | halve `[lo, hi]` | pagination boundaries, sorted lookup |

\* described in panels, interactivity deferred to a later version.

### Common Mistakes (content seed)
- Treating array indexing as ordered/searchable without sorting.
- Forgetting insert/delete in the middle is O(n), causing accidental O(n²) loops.
- Off-by-one on bounds (`<= n` vs `< n`).
- Assuming binary search works on unsorted data.

### Interview Questions (content seed)
- Why is array access O(1) but linked-list access O(n)?
- When would you choose an array over a hashmap for lookups?
- How does dynamic-array resizing give amortized O(1) append?
- How do pagination offsets map to array indexing, and where does it break down at scale?

### Practice Prompts (content seed)
- Implement delete-at-index without using `Array.prototype.splice`.
- Given a sorted array, find the first index ≥ a threshold (binary search intuition).
- Count element frequencies in one pass (sets up the HashMap topic).

## Reuse & Extensibility

- `VisualizerShell` + `PlaybackControls` are inherited from spec 000.
- The pure step-builder pattern is the template later visualizers reuse
  (sorting, linked-list traversal, systems topics).
- Adding the deferred operations later = implement two more builders + enable
  them in the selector; no structural change.
