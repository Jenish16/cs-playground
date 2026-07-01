# 003 — Stack & Queue Visualizer: Requirements

## Reconciliation Note (important)

In the DSA module (spec 001), **Stack and Queue are two separate topics** with
their own catalog entries, pages, and routes:

- Stack → `/dsa/stack` (catalog slug `stack`)
- Queue → `/dsa/queue` (catalog slug `queue`)

They are **not** a single combined topic. However, they are close cousins — both
are **linear container structures** with O(1) ends and enter/exit animations — so
they **share one reusable visualization architecture** parameterized by a
`kind="stack" | "queue"` prop. This spec folder (`003-stack-queue-visualizer`)
covers that shared architecture and serves both topics.

> The folder name is kept for now (**not renamed**). The earlier combined
> `stack-queue` catalog entry/route has been replaced by separate `stack` and
> `queue` entries in `lib/dsa-modules.js`.

## Summary

Two **backend- and interview-focused** topic pages — Stack (LIFO) and Queue
(FIFO) — built on a single shared, step-driven visualizer. Each operation
produces an ordered list of steps the learner plays through, making *where*
elements enter and leave each structure, and *why* every operation is O(1),
immediately obvious. Every concept ties back to real backend usage (call stacks,
job queues, rate limiting) so the learning is practical, not academic.

These are the second and third topics to fully implement the spec 001 twelve-part
topic page structure, following the Array Visualizer (spec 002) as the template.

## What the Stack Topic Teaches

1. **LIFO** — last in, first out; the single open end ("top").
2. **Push** — add a value at the top.
3. **Pop** — remove and return the value at the top.
4. **Peek** — read the top value without removing it.
5. **Underflow** — popping/peeking an empty stack; handled as a gentle error.
6. **Max capacity / overflow** *(optional)* — a bounded stack rejects a push
   beyond capacity ("overflow").
7. **Time complexity** — push/pop/peek are all O(1).
8. **Space complexity** — O(n) total; O(1) auxiliary per operation.
9. **Backend use cases**:
   - function call stack
   - undo/redo operations
   - parsing (e.g. balanced brackets, tokens)
   - depth-first search (DFS)
   - expression evaluation

## What the Queue Topic Teaches

1. **FIFO** — first in, first out; two ends (enter at rear, leave at front).
2. **Enqueue** — add a value at the rear.
3. **Dequeue** — remove and return the value at the front.
4. **Front** — read the front value without removing it (the next to leave).
5. **Rear** — read the rear value without removing it (the most recently added).
6. **Underflow** — dequeuing/reading an empty queue; handled as a gentle error.
7. **Max capacity / overflow** *(optional)* — a bounded queue rejects an enqueue
   beyond capacity ("overflow"); motivates ring buffers / backpressure.
8. **Time complexity** — enqueue/dequeue/front/rear are all O(1).
9. **Space complexity** — O(n) total; O(1) auxiliary per operation.
10. **Backend use cases**:
    - job queues
    - message queues
    - request buffering
    - rate limiting
    - breadth-first search (BFS)
    - worker task processing

## V1 Operations (fully implemented)

**Stack** (`kind="stack"`):
1. **Push** — value enters at the top; the new cell animates in at the top.
2. **Pop** — the top cell animates out; underflow on an empty stack.
3. **Peek** — highlight the top cell; no mutation; underflow on an empty stack.

**Queue** (`kind="queue"`):
1. **Enqueue** — value enters at the rear; the new cell animates in at the rear.
2. **Dequeue** — the front cell animates out; the rest "advance"; underflow on empty.
3. **Front** — highlight the front cell; no mutation; underflow on empty.
4. **Rear** — highlight the rear cell; no mutation; underflow on empty.

## Optional: Max Capacity / Overflow

Capacity is an **optional** v1 feature. If included:
- An optional capacity limit is exposed (default: unbounded, or a small sample
  cap such as 6).
- Push/enqueue beyond capacity builds an **overflow** error step and performs no
  mutation, mirroring the underflow handling.
- The panels explain the backend relevance (bounded buffers, backpressure, ring
  buffers, dropped-message policies).

If capacity is deferred, the **overflow concept must still be described** in the
explanation/backend panels even though it is not interactive (mirrors how spec
002 described deferred operations).

## Functional Requirements

- FR1: A single visualizer component (`LinearStructureVisualizer`) renders either
  a **stack** or a **queue** based on a `kind` prop. Each topic page sets its kind.
- FR2: **Topic-specific page header** — `/dsa/stack` reads "Stack" (LIFO);
  `/dsa/queue` reads "Queue" (FIFO), each with its own description and eyebrow.
- FR3: **Visual container blocks** — items render as div cells: a **vertical
  column** for the stack (top at the top) and a **horizontal row** for the queue
  (front → rear), reinforcing each mental model.
- FR4: **Operation selector** lists the operations for the active `kind`
  (stack: push/pop/peek; queue: enqueue/dequeue/front/rear).
- FR5: **Value input** — a numeric input shown for operations that need a value
  (push, enqueue), driven by each operation's `needs`.
- FR6: **Generate steps button** ("Run") builds the ordered step list for the
  selected operation and validated input.
- FR7: Step playback via **Previous step**, **Next step**, and **Reset**, plus a
  **current-step indicator** ("Step k of n") and a short step description.
  (Auto-play and a speed slider are available via the shared `PlaybackControls`
  but optional, since stack/queue operations are short.)
- FR8: Animate insertion at the correct end and removal from the correct end;
  label the active end(s): "top" for stack; "front"/"rear" for queue.
- FR9: **Operation-aware panels** are always present for the selected operation:
  **explanation**, **pseudocode**, **complexity** (time + space), and **backend
  use cases**.
- FR10: **Validation / error states** — empty/invalid value, underflow
  (pop/dequeue/peek/front/rear on empty), and overflow (if capacity enabled) show
  a gentle inline message and perform no mutation.
- FR11: **Reset** restores the default sample structure and clears step state.

## Non-Functional Requirements

- NFR1: Built on the shared `VisualizerShell` + `PlaybackControls` (spec 000).
- NFR2: **Reuse the step-builder pattern from spec 002** — operations are pure
  functions returning ordered steps; playback indexes into the list.
- NFR3: Use **React state** (`useReducer`); no external state library.
- NFR4: **Div-based visualization with Framer Motion.** No `<canvas>`.
- NFR5: Stack renders vertically (top at top); queue renders horizontally
  (front to rear). Animations read as "enter at one end / leave at one end".
- NFR6: All operations are O(1); the UI states this clearly.
- NFR7: Works for structures up to ~12 elements without layout breakage.
- NFR8: Accessible: controls are keyboard-operable; the step description uses an
  `aria-live` region; cells convey state via more than color alone (matching the
  Array Visualizer's accessibility treatment).
- NFR9: **Shared where reasonable, separate where it matters** — the visualizer
  component, playback reducer, Step model, and item primitives are shared; the
  per-topic *content* (concept, operations, panels, backend cases) lives in
  separate content modules so each topic reads as its own subject.

## Constraints

- No backend, no database, no authentication.
- No new packages (current deps: Next.js, Tailwind, shadcn/ui, Framer Motion,
  lucide-react).
- JavaScript (no TypeScript).

## Out of Scope (v1)

- Priority queues (see Heap topic), double-ended queues (deques), and circular
  buffers as interactive structures (the overflow panel may *mention* ring
  buffers conceptually).
- Persisting structures between sessions.
- A combined side-by-side stack-vs-queue demo (the canonical entry points are the
  two separate topic routes).

## Routes

- Stack topic: `/dsa/stack` → shared visualizer with `kind="stack"`.
- Queue topic: `/dsa/queue` → shared visualizer with `kind="queue"`.

## Implementation Order

1. **Implement Stack first** — shared visualizer + reducer + Step model, the
   stack builders, the stack content module, and the `/dsa/stack` page.
2. **Then implement Queue** — reusing the shared visualizer, reducer, Step model,
   and primitives; add the queue builders, the queue content module, and the
   `/dsa/queue` page.
