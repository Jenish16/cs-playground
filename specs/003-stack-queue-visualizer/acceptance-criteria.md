# 003 — Stack & Queue Visualizer: Acceptance Criteria

## Topics, Routes & Shared Architecture
- [ ] Stack and Queue exist as **separate** catalog entries/topics (spec 001),
      backed by **one shared** visualizer component.
- [ ] `/dsa/stack` renders the shared visualizer with `kind="stack"`.
- [ ] `/dsa/queue` renders the shared visualizer with `kind="queue"`.
- [ ] Each route has a **topic-specific page header** (Stack = LIFO framing;
      Queue = FIFO framing) and follows the twelve-part topic page template.
- [ ] The spec folder is **not** renamed.

## Visualization
- [ ] Items render as div-based **container blocks** (no `<canvas>`).
- [ ] Stack renders as a **vertical column** with the **top** clearly labeled.
- [ ] Queue renders as a **horizontal row** with **front** and **rear** labeled.
- [ ] Cells animate with Framer Motion: entry at the correct end, exit from the
      correct end.

## Stack Operations
- [ ] **Push** adds a valid value at the top (LIFO).
- [ ] **Pop** removes the top value; the cell animates out.
- [ ] **Peek** highlights the top value without removing it.
- [ ] **Underflow:** pop/peek on an empty stack shows a message and changes nothing.
- [ ] **Overflow (if capacity enabled):** push beyond capacity shows a message and
      changes nothing; if capacity is deferred, the overflow concept is still
      described in the panels.

## Queue Operations
- [ ] **Enqueue** adds a valid value at the rear (FIFO).
- [ ] **Dequeue** removes the front value; the cell animates out and the rest advance.
- [ ] **Front** highlights the front value without removing it.
- [ ] **Rear** highlights the rear value without removing it.
- [ ] **Underflow:** dequeue/front/rear on an empty queue shows a message and
      changes nothing.
- [ ] **Overflow (if capacity enabled):** enqueue beyond capacity shows a message
      and changes nothing; if deferred, the concept is still described.

## Playback & Controls
- [ ] Operation selector switches the active operation for the current `kind`.
- [ ] A **value input** appears for operations that need a value (push, enqueue).
- [ ] **Generate steps** ("Run") builds the step list for the selected operation.
- [ ] **Previous step** and **Next step** move exactly one step.
- [ ] **Reset** restores the default sample structure and clears step state.
- [ ] A current-step indicator shows "Step k of n" with a step description.

## Panels
- [ ] Explanation, pseudocode, complexity (time + space), and backend-use-case
      panels are present and reflect the selected operation.
- [ ] All operations are shown as **O(1)** time; space is O(n) total / O(1) aux.
- [ ] Stack backend cases cover: function call stack, undo/redo, parsing, DFS,
      expression evaluation.
- [ ] Queue backend cases cover: job queues, message queues, request buffering,
      rate limiting, BFS, worker task processing.

## Validation & Error States
- [ ] Empty/invalid value for push/enqueue shows an inline message and builds
      no mutation.
- [ ] Underflow (and overflow, if capacity enabled) shows a gentle inline message
      via the `aria-live` region and performs no mutation.

## Accessibility
- [ ] Controls are keyboard-operable.
- [ ] The step description is announced via an `aria-live` region.
- [ ] Cells convey state via more than color alone and carry descriptive labels.

## Quality & Constraints
- [ ] Built on the shared `VisualizerShell` + `PlaybackControls`.
- [ ] Uses the pure step-builder pattern (spec 002); React state only; no new
      packages.
- [ ] No backend, database, or authentication.
- [ ] `npm run lint` passes and `npm run build` succeeds.

## Implementation Order
- [ ] **Stack is implemented first**; **Queue reuses** the shared component,
      reducer, Step model, and item primitives.
