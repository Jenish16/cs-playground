# 002 — Array Visualizer: Requirements

## Summary

An interactive, **backend- and interview-focused** Array Visualizer. It shows
how arrays store elements in contiguous indexed slots, how common operations
mutate them, and — crucially — *why* each operation has the time/space cost it
does. Every concept is tied back to real backend usage (response lists,
pagination, batch buffers) so the learning is practical, not purely academic.

This visualizer is the v1 vertical slice for the DSA module (spec 001). It is the
first topic to fully implement the twelve-part topic page structure.

## What It Teaches

1. **Array indexing** — elements live at contiguous integer indices `0..n-1`.
2. **Access by index** — O(1) random access and why it's constant time.
3. **Insert at end** — O(1) amortized append.
4. **Insert at position** — O(n) due to shifting (described in v1, built later).
5. **Delete from position** — O(n) due to shifting.
6. **Linear search** — O(n) scan; the baseline search.
7. **Binary search intro** — O(log n) on sorted data (described in v1, built later).
8. **Time complexity** for each operation.
9. **Space complexity** for each operation.
10. **Backend use cases**:
    - in-memory collections
    - response lists
    - pagination
    - batch processing buffers
    - config arrays
    - request payload processing

## V1 Operations (fully implemented)

1. **Access by index** — highlight the cell at index `i`; no mutation.
2. **Insert at end** — append a value; cell animates in at the tail.
3. **Delete from index** — remove the value at index `i`; following cells shift left.
4. **Linear search** — scan left→right, highlighting each compared cell until a
   match or end-of-array.

## Mentioned but NOT implemented in v1

These appear in the explanation/complexity content and the operation list (as
disabled or "coming soon"), but their interactive behavior is deferred:

- **Insert at position** — O(n) shift right of subsequent elements.
- **Binary search** — O(log n) on sorted data; halving the search space.

## Functional Requirements

- FR1: Render the array as a row of indexed cells (value + index label).
- FR2: Provide an operation selector listing v1 ops (enabled) and deferred ops
  (visible but disabled with a "coming soon" hint).
- FR3: Provide input controls appropriate to the selected operation (index
  and/or value), with validation.
- FR4: Each operation produces an ordered list of **steps**; the UI plays them
  via step-forward, step-backward, reset, auto-play, and a speed slider.
- FR5: Show a **current step indicator** (e.g. "Step 2 of 5") and a short
  description of what the current step is doing.
- FR6: Access/linear-search highlight cells without mutating data; insert/delete
  mutate and animate the shift.
- FR7: Reset restores a default sample array and clears step state.
- FR8: Validation/error state: out-of-bounds index, empty value, or invalid
  input shows a gentle inline message and performs no mutation.
- FR9: Panels are always present for the selected operation: **explanation**,
  **pseudocode**, **complexity** (time + space), and **backend use cases**.

## Non-Functional Requirements

- NFR1: Built on the shared `VisualizerShell` + `PlaybackControls` (spec 000).
- NFR2: **Keep v1 simple and stable.** Prefer clarity over feature breadth.
- NFR3: Use **React state** (e.g. `useReducer`/`useState`); no external state lib.
- NFR4: **Div-based visualization with Framer Motion.** No `<canvas>`.
- NFR5: Animations should read as "shifting"; movement explains the cost.
- NFR6: Works for arrays up to ~20 elements without layout breakage.
- NFR7: Accessible: controls are keyboard-operable; step description uses an
  `aria-live` region; cells convey state via more than color alone.

## Constraints

- No backend, no database, no authentication.
- No new packages unless strictly required (current deps: Next.js, Tailwind,
  shadcn/ui, Framer Motion, lucide-react).
- JavaScript (no TypeScript).

## Out of Scope (v1)

- Multi-dimensional / typed arrays.
- Sorting (spec 005).
- Interactive insert-at-position and binary search (described only).
- Persisting arrays between sessions.

## Route

`/dsa/array`
