// Pure step builders for linear container structures — Stack (this v1) and,
// later, Queue (see specs/003-stack-queue-visualizer). No React/DOM dependency:
// each builder takes the current items + inputs and returns an ordered list of
// steps. Playback just indexes into the list, exactly like lib/algorithms/array.js.
//
// An "item" is { id, value }. Stable ids let the UI animate enter/exit at the
// correct end via AnimatePresence.
//
// Step shape:
//   {
//     items:       { id, value }[]   // snapshot of the structure AT this step
//     highlight:   string[]          // ids to emphasize (peek/target end)
//     entering:    string | null     // id of an item animating in (push)
//     exiting:     string | null     // id of an item animating out (pop)
//     pseudoLine:  number | null     // active pseudocode line for this step
//     description: string            // human-readable "what this step does"
//     status:      "info" | "success" | "error"   // error = underflow/overflow
//   }
//
// For a stack, the TOP is the last element of `items` (index n-1).

let _idCounter = 0;

export function makeItem(value) {
  _idCounter += 1;
  return { id: `item-${_idCounter}`, value };
}

export function makeItems(values) {
  return values.map((value) => makeItem(value));
}

function step(items, options) {
  return {
    items: items.map((item) => ({ ...item })),
    highlight: options.highlight ?? [],
    entering: options.entering ?? null,
    exiting: options.exiting ?? null,
    pseudoLine: options.pseudoLine ?? null,
    description: options.description,
    status: options.status ?? "info",
  };
}

// --- Stack (LIFO) -----------------------------------------------------------
// Pseudocode line indices below match stackOperations[*].pseudocode in
// lib/dsa/stack-content.js. Keep them in sync.

// O(1): push a value onto the top. `capacity` is optional; when set and the
// stack is full, a single overflow step is produced and nothing is added.
export function buildPushSteps(items, value, capacity = null) {
  if (capacity != null && items.length >= capacity) {
    return [
      step(items, {
        pseudoLine: 0,
        description: `Overflow: the stack is at capacity (${capacity}), so ${value} can't be pushed.`,
        status: "error",
      }),
    ];
  }
  const newItem = makeItem(value);
  const next = [...items, newItem];
  return [
    step(items, {
      pseudoLine: 0,
      description: `Push ${value}: a new value always goes on top of the stack.`,
    }),
    step(next, {
      highlight: [newItem.id],
      entering: newItem.id,
      pseudoLine: 1,
      description: `Write ${value} into the top slot.`,
    }),
    step(next, {
      highlight: [newItem.id],
      pseudoLine: 2,
      description: `Advance the top pointer. Push touches only the top — O(1).`,
      status: "success",
    }),
  ];
}

// O(1): pop the top value. Underflow on an empty stack.
export function buildPopSteps(items) {
  if (items.length === 0) {
    return [
      step(items, {
        pseudoLine: 1,
        description: "Underflow: the stack is empty, so there is nothing to pop.",
        status: "error",
      }),
    ];
  }
  const top = items[items.length - 1];
  const next = items.slice(0, -1);
  return [
    step(items, {
      highlight: [top.id],
      pseudoLine: 0,
      description: `Pop looks at the top of the stack (${top.value}).`,
    }),
    step(items, {
      highlight: [top.id],
      exiting: top.id,
      pseudoLine: 2,
      description: `Move the top pointer down past ${top.value}.`,
    }),
    step(next, {
      pseudoLine: 3,
      description: `Return ${top.value}. Pop removes only the top — O(1).`,
      status: "success",
    }),
  ];
}

// O(1): read the top value without removing it. Underflow on an empty stack.
export function buildPeekSteps(items) {
  if (items.length === 0) {
    return [
      step(items, {
        pseudoLine: 1,
        description: "Underflow: the stack is empty, so there is nothing to peek.",
        status: "error",
      }),
    ];
  }
  const top = items[items.length - 1];
  return [
    step(items, {
      highlight: [top.id],
      pseudoLine: 0,
      description: "Peek looks at the top of the stack.",
    }),
    step(items, {
      highlight: [top.id],
      pseudoLine: 2,
      description: `Return ${top.value} without removing it. Peek is O(1).`,
      status: "success",
    }),
  ];
}

// --- Queue (FIFO) -----------------------------------------------------------
// Pseudocode line indices below match queueOperations[*].pseudocode in
// lib/dsa/queue-content.js. Keep them in sync.
//
// For a queue, the FRONT is the first element of `items` (index 0) and the
// REAR is the last (index n-1). Enqueue appends at the rear; dequeue removes
// from the front.

// O(1): enqueue a value at the rear. `capacity` is optional; when set and the
// queue is full, a single overflow step is produced and nothing is added.
export function buildEnqueueSteps(items, value, capacity = null) {
  if (capacity != null && items.length >= capacity) {
    return [
      step(items, {
        pseudoLine: 0,
        description: `Overflow: the queue is at capacity (${capacity}), so ${value} can't be enqueued.`,
        status: "error",
      }),
    ];
  }
  const newItem = makeItem(value);
  const next = [...items, newItem];
  return [
    step(items, {
      pseudoLine: 0,
      description: `Enqueue ${value}: a new value always joins at the rear of the queue.`,
    }),
    step(next, {
      highlight: [newItem.id],
      entering: newItem.id,
      pseudoLine: 1,
      description: `Write ${value} into the rear slot.`,
    }),
    step(next, {
      highlight: [newItem.id],
      pseudoLine: 2,
      description: `Advance the rear pointer. Enqueue touches only the rear — O(1).`,
      status: "success",
    }),
  ];
}

// O(1): dequeue the front value. Underflow on an empty queue.
export function buildDequeueSteps(items) {
  if (items.length === 0) {
    return [
      step(items, {
        pseudoLine: 1,
        description: "Underflow: the queue is empty, so there is nothing to dequeue.",
        status: "error",
      }),
    ];
  }
  const front = items[0];
  const next = items.slice(1);
  return [
    step(items, {
      highlight: [front.id],
      pseudoLine: 0,
      description: `Dequeue looks at the front of the queue (${front.value}).`,
    }),
    step(items, {
      highlight: [front.id],
      exiting: front.id,
      pseudoLine: 2,
      description: `Move the front pointer forward past ${front.value}.`,
    }),
    step(next, {
      pseudoLine: 3,
      description: `Return ${front.value}. Dequeue removes only the front — O(1).`,
      status: "success",
    }),
  ];
}

// O(1): read the front value without removing it. Underflow on an empty queue.
export function buildFrontSteps(items) {
  if (items.length === 0) {
    return [
      step(items, {
        pseudoLine: 1,
        description: "Underflow: the queue is empty, so there is nothing at the front.",
        status: "error",
      }),
    ];
  }
  const front = items[0];
  return [
    step(items, {
      highlight: [front.id],
      pseudoLine: 0,
      description: "Front looks at the first item in the queue.",
    }),
    step(items, {
      highlight: [front.id],
      pseudoLine: 2,
      description: `Return ${front.value} without removing it. Front is O(1).`,
      status: "success",
    }),
  ];
}
