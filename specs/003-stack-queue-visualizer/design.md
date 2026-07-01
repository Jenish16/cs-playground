# 003 — Stack & Queue Visualizer: Design

## Two Topics, One Shared Architecture

Stack (`/dsa/stack`) and Queue (`/dsa/queue`) are separate DSA topics (spec 001)
that share a single step-driven visualizer parameterized by `kind`. Each topic
page embeds the shared component and supplies its own twelve-part content.

```
app/dsa/stack/page.js  -> <LinearStructureVisualizer kind="stack" />
app/dsa/queue/page.js  -> <LinearStructureVisualizer kind="queue" />
```

The shared pieces (component, playback reducer, Step model, item primitives) are
written once; the per-topic *content* lives in separate modules so each topic
reads as its own subject.

## Page Composition (twelve-part template)

Both topic pages follow the spec 001 twelve-part structure, exactly as the Array
topic page does. Only the `kind`, header text, and content module differ.

```
<Container>
  <PageHeader eyebrow="DSA · Stack"  title="Stack"
              description="LIFO: push, pop, and peek at a single open end —
                           and where backend systems rely on it." />
                                            // (queue header is FIFO-specific)

  ConceptPanel            // 1. Concept (LIFO vs FIFO intuition)
  RepresentationPanel     // 2. Internal representation (linear cells, open end[s])
  OperationsList          // 3. Operations overview (covered by the selector)

  <LinearStructureVisualizer kind="..." />   // 4. Step-by-step interactive viz

  PseudocodePanel         // 5. Pseudocode (per selected operation)
  CodeExamplePanel        // 6. JavaScript example (per operation)
  ComplexityPanel         // 7 + 8. Time & space complexity table
  BackendUseCases         // 9. Backend use cases
  CommonMistakes          // 10. Common mistakes
  InterviewQuestions      // 11. Interview questions
  PracticePrompts         // 12. Practice prompts
</Container>
```

As in spec 002, the explanation / pseudocode / JavaScript / complexity panels are
**operation-aware** and rendered by the visualizer (which owns the selected
operation); the remaining panels are static content from the topic's content
module.

## Component Tree (shared visualizer)

```
LinearStructureVisualizer ("use client", kind: "stack" | "queue")
  VisualizerShell title={kind === "stack" ? "Stack Visualizer" : "Queue Visualizer"}
    controls:
      OperationSelector   // kind-specific ops (push/pop/peek | enqueue/dequeue/front/rear)
      OperationInputs     // value input, per operation's `needs`
      RunButton           // "Run" — builds the step list (FR6: generate steps)
      PlaybackControls    // previous step, next step, reset (auto-play optional)
    canvas:
      StructureTrack      // Framer Motion layout group
        StructureCell[]   // value + end label + state styling
                          //   stack: vertical column, "top" marker
                          //   queue: horizontal row, "front"/"rear" markers
    message:              // validation/underflow/overflow OR current-step description
    footer:
      StepIndicator       // "Step k of n"
      "All operations O(1)" + LIFO/FIFO reminder
  (page-level panels consume the topic content module)
```

## Step Model (pure data — shared with the spec 002 pattern)

Operations are **pure functions** that take the current items + inputs and return
an ordered list of steps. Playback indexes into the list, which makes
previous-step / next-step / reset trivial and deterministic. This mirrors
`lib/algorithms/array.js`.

```js
// An "item" is { id, value }. Stable ids let Framer Motion animate enter/exit
// at the correct end via AnimatePresence.

// A single step describes the structure state and what to emphasize.
{
  items:       { id, value }[]   // snapshot of the structure AT this step
  highlight:   string[]          // ids to emphasize (peek/front/rear/compare)
  entering:    string | null     // id of a cell animating in (push/enqueue)
  exiting:     string | null     // id of a cell animating out (pop/dequeue)
  description: string            // human-readable "what this step does"
  status:      "info" | "success" | "error"   // error = underflow/overflow
}
```

### Shared module: `lib/algorithms/linear-structure.js`

```js
makeItem(value) / makeItems(values)      // stable-id item factory (shared)
step(items, options)                     // step builder helper (shared)

// Stack builders (top = end of the items array):
buildPushSteps(items, value, capacity?)  // announce + append new top; overflow if full
buildPopSteps(items)                     // mark top exiting, then removed; underflow if empty
buildPeekSteps(items)                    // highlight top; underflow if empty

// Queue builders (front = index 0, rear = end of the items array):
buildEnqueueSteps(items, value, capacity?) // announce + append at rear; overflow if full
buildDequeueSteps(items)                   // mark front exiting, then advance; underflow if empty
buildFrontSteps(items)                     // highlight front; underflow if empty
buildRearSteps(items)                      // highlight rear; underflow if empty
```

These builders carry **no React/DOM dependency** and are independently testable,
exactly like the array builders. `capacity` is an optional argument; when omitted
the structure is unbounded and overflow steps are never produced.

## Playback State (React `useReducer`)

Mirrors the spec 002 reducer so behavior is consistent across visualizers.

```js
state = {
  kind: "stack" | "queue",   // fixed per topic page
  base: Item[],              // structure as last "committed" / reset target
  operation: string,         // active op key for this kind
  inputs: { value: string },
  capacity: number | null,   // optional bound; null = unbounded
  steps: Step[],             // built when an operation runs; [] when idle
  cursor: number,            // current step index (0..n-1), -1 when idle
  isPlaying: boolean,        // for optional auto-play
  speed: number,             // ms per step (optional)
  error: string | null,      // validation / underflow / overflow message
}

actions:
  SET_OPERATION, SET_INPUT, RUN (validate + build steps),
  STEP_FORWARD, STEP_BACKWARD, RESET, COMMIT (fold a mutating op into base),
  // optional: PLAY_PAUSE, TICK, SET_SPEED, SET_CAPACITY
```

- The rendered structure is `steps[cursor].items` while a run is active, else
  `base`.
- Mutating ops (push/pop/enqueue/dequeue) fold their final step into `base`
  (via `COMMIT` or on run completion) so subsequent operations build on the
  result; read-only ops (peek/front/rear) never mutate `base`.
- `RESET` restores `base` to the default sample and clears `steps`/`cursor`.

## Visual Language (div + Framer Motion)

- `StructureCell` is a Framer Motion item **keyed by stable id**, not index, so
  enter/exit animate at the correct end (`layout` + AnimatePresence).
- **Stack:** vertical column; the **top** is visually highest; a "top" label/arrow
  marks the open end. Push animates a cell in at the top; pop animates the top out.
- **Queue:** horizontal row; a "front" marker on the left (next to leave) and a
  "rear" marker on the right (most recently added). Enqueue animates a cell in at
  the rear; dequeue animates the front out and the rest advance left.
- Read-only ops (peek/front/rear) **highlight** the relevant end cell without
  removing it.
- Cell states use **non-color cues in addition to color** (ring presence, weight,
  opacity) and carry `aria-label`s, matching the Array Visualizer (NFR8).
- No `<canvas>`; everything is divs + transforms for clarity and accessibility.

## Validation & Error Rules

- Push / Enqueue: value must be a valid number; else error, no change.
- Pop / Dequeue / Peek / Front / Rear on an **empty** structure: build a single
  **underflow** error step (`status: "error"`), no mutation.
- Push / Enqueue at **capacity** (if enabled): build a single **overflow** error
  step, no mutation.
- Errors set `state.error`, render in the `aria-live` message region, and either
  build no steps or build a single descriptive error step.

## Panel Content — Stack (per operation)

| Operation | Time | Space | Pseudocode focus | Backend tie-in |
|-----------|------|-------|------------------|----------------|
| Push | O(1) | O(1) | `items[top++] = v` | call frame entry, undo-stack record |
| Pop  | O(1) | O(1) | `return items[--top]` | undo, returning from a function call |
| Peek | O(1) | O(1) | `return items[top]` | inspect current parser/DFS state |

LIFO backend framing: function call stack, undo/redo, parsing (bracket matching),
DFS traversal, expression evaluation (operator/operand stacks).

## Panel Content — Queue (per operation)

| Operation | Time | Space | Pseudocode focus | Backend tie-in |
|-----------|------|-------|------------------|----------------|
| Enqueue | O(1) | O(1) | `items[rear++] = v` | submit a job, buffer a request |
| Dequeue | O(1) | O(1) | `return items[front++]` | worker pulls next task, deliver message |
| Front | O(1) | O(1) | `return items[front]` | inspect next-to-process item |
| Rear  | O(1) | O(1) | `return items[rear]` | inspect most recently buffered item |

FIFO backend framing: job queues, message queues, request buffering, rate
limiting (bounded queue + backpressure), BFS traversal, worker task processing.

### Common Mistakes (content seeds)

**Stack**
- Popping/peeking without checking for empty (underflow).
- Confusing LIFO with FIFO — assuming the oldest item comes out first.
- Forgetting an unbounded stack can overflow real memory (deep recursion).

**Queue**
- Dequeuing an empty queue (underflow) or assuming order is preserved across
  priorities (that's a heap, not a queue).
- Implementing a queue on a plain array with O(n) front removal (shifting) and
  calling it O(1) — a real queue uses two pointers / a ring buffer.
- Ignoring overflow / backpressure on bounded queues, causing unbounded memory.

### Interview Questions (content seeds)

**Stack**
- How would you implement a stack with O(1) push/pop, and why is it O(1)?
- How do you evaluate an arithmetic expression using stacks?
- Where does the call stack overflow, and how does it relate to recursion depth?

**Queue**
- How do you implement an O(1) queue without shifting elements?
- When do you choose a queue over a stack, and a priority queue over a plain queue?
- How does a bounded queue enable backpressure and rate limiting?

### Practice Prompts (content seeds)

**Stack**
- Validate balanced brackets in a string using a stack.
- Implement an undo/redo history with two stacks.
- Evaluate a postfix (RPN) expression.

**Queue**
- Implement a queue using two stacks (and analyze amortized cost).
- Simulate a fixed-rate request limiter with a bounded queue.
- Run a BFS level-order traversal using a queue.

## Reuse & Extensibility

- `VisualizerShell` + `PlaybackControls` are inherited from spec 000.
- The pure step-builder + `useReducer` pattern is inherited from spec 002; this
  spec extends it to two-ended structures and read-only "inspect" operations.
- Adding Queue after Stack = add the queue builders + queue content module + the
  `/dsa/queue` page; the shared component, reducer, and Step model are unchanged
  (the only branch is `kind` for layout/labels and the operation set).
- Catalog entries `stack` and `queue` flip to `status: "available"` as each
  topic ships.
