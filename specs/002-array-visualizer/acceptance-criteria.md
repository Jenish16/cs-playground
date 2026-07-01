# 002 — Array Visualizer: Acceptance Criteria

## Visualization
- [ ] The array renders as a row of div-based cells with values and index labels.
- [ ] Cells animate with Framer Motion (no `<canvas>` is used).
- [ ] Insert at end animates a new cell in at the tail.
- [ ] Delete from index animates the removed cell out and shifts following cells left.
- [ ] Access and linear search highlight cells without mutating the array.

## V1 Operations
- [ ] **Access by index** highlights cell `i` and shows its value; no mutation.
- [ ] **Insert at end** appends a valid value.
- [ ] **Delete from index** removes the value at a valid index.
- [ ] **Linear search** steps through comparisons and reports found index or "not found".

## Insert at Position & Binary Search (now implemented)
- [ ] **Insert at position** shifts elements from the target index right and writes
      the value; index may be `0..length` (length appends at the tail).
- [ ] **Binary search** halves the search window each step, dimming discarded cells,
      and reports the found index or "not found".
- [ ] Binary search requires a sorted array; a "Sort ascending" control sorts the
      base array, and running binary search on unsorted data shows an inline message.

## Playback & Controls
- [ ] Operation selector switches the active operation.
- [ ] Input controls match the operation (index and/or value/target).
- [ ] Step forward and step backward move exactly one step.
- [ ] Auto-play advances steps and pauses at the final step.
- [ ] Speed slider changes the auto-play pace.
- [ ] Reset restores the default array and clears step state.
- [ ] A current-step indicator shows "Step k of n" with a step description.

## Panels
- [ ] Explanation, pseudocode, complexity (time + space), and backend-use-case
      panels are present and reflect the selected operation.
- [ ] Backend use cases cover in-memory collections, response lists, pagination,
      batch buffers, config arrays, and request payload processing.

## Validation
- [ ] Out-of-bounds index shows an inline message and makes no change.
- [ ] Empty/invalid value or target shows an inline message and builds no steps.

## Quality & Constraints
- [ ] Built on shared `VisualizerShell` + `PlaybackControls`.
- [ ] Uses React state only (no external state library); no new packages.
- [ ] No backend, database, or authentication.
- [ ] `npm run lint` passes and `npm run build` succeeds.

## This Step
- [ ] **No implementation was done** — only spec files under
      `specs/002-array-visualizer/` were created or updated.
