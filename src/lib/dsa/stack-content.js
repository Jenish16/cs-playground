// Content for the Stack topic page (see specs/001-dsa-module twelve-part
// template + specs/003-stack-queue-visualizer). Plain data so the page and the
// visualizer stay presentational. Mirrors the shape of array-content.js.
//
// NOTE: each operation's `pseudocode` is authored line-by-line so the visualizer
// can highlight the active line per step. The line indices referenced by the
// builders in lib/algorithms/linear-structure.js must match these lines.

export const DEFAULT_STACK = [10, 20, 30]; // 30 is the top

export const stackOperations = {
  push: {
    key: "push",
    label: "Push",
    enabled: true,
    needs: ["value"],
    time: "O(1)",
    space: "O(1)",
    explanation:
      "Push adds a value to the top of the stack — the only end you can touch. The top pointer moves up by one and the new value lands in that slot. Nothing else moves, so it's constant time. (A bounded stack can overflow once it hits its capacity.)",
    pseudocode: `push(stack, value):
  stack[top] = value
  top = top + 1`,
    code: `function push(stack, value) {
  stack.push(value); // amortized O(1)
  return stack;
}`,
    backend:
      "Recording a frame when a function is called, or pushing a state onto an undo history before applying a change.",
  },
  pop: {
    key: "pop",
    label: "Pop",
    enabled: true,
    needs: [],
    time: "O(1)",
    space: "O(1)",
    explanation:
      "Pop removes and returns the value at the top. The top pointer moves down by one; the element below becomes the new top. Because only the top is touched, it's constant time. Popping an empty stack is an underflow.",
    pseudocode: `pop(stack):
  if top == 0: underflow
  top = top - 1
  return stack[top]`,
    code: `function pop(stack) {
  if (stack.length === 0) throw new Error("underflow");
  return stack.pop(); // O(1)
}`,
    backend:
      "Returning from a function (popping its call frame), or undoing the most recent action by popping the undo stack.",
  },
  peek: {
    key: "peek",
    label: "Peek",
    enabled: true,
    needs: [],
    time: "O(1)",
    space: "O(1)",
    explanation:
      "Peek (or top) reads the value at the top without removing it. It's a single indexed read, so it's constant time. Like pop, peeking an empty stack is an underflow.",
    pseudocode: `peek(stack):
  if top == 0: underflow
  return stack[top - 1]`,
    code: `function peek(stack) {
  if (stack.length === 0) throw new Error("underflow");
  return stack[stack.length - 1]; // O(1)
}`,
    backend:
      "Inspecting the current parser or DFS state, or checking what the next undo would revert without committing to it.",
  },
};

// Order used by the operation selector.
export const operationOrder = ["push", "pop", "peek"];

export const complexityRows = [
  { operation: "Push", time: "O(1)", space: "O(1)" },
  { operation: "Pop", time: "O(1)", space: "O(1)" },
  { operation: "Peek", time: "O(1)", space: "O(1)" },
];

// Shown beneath the complexity table: per-operation space is O(1) auxiliary,
// while the stack itself holds n elements.
export const spaceNote =
  "Each operation uses O(1) auxiliary space. Total storage is O(n) — the stack holds all n elements.";

export const concept =
  "A stack is a linear, last-in-first-out (LIFO) collection: the last value you put in is the first one you take out. All activity happens at a single open end called the top — you can push a value on, pop the top off, or peek at it, but you can't reach into the middle.";

export const representation =
  "Picture a pile of plates. New plates go on top and you remove from the top; the bottom plate leaves last. Internally a stack is usually just an array (or linked list) plus a 'top' index that marks the next free slot. Push writes at top and increments it; pop decrements it and reads. Because only the top moves, every operation is O(1).";

export const backendUseCases = [
  { term: "Function call stack", detail: "each call pushes a frame; returning pops it — the runtime's own LIFO" },
  { term: "Undo / redo", detail: "push each action; undo pops the most recent, redo pushes it back" },
  { term: "Parsing", detail: "matching brackets, tags, or tokens by pushing openers and popping on close" },
  { term: "Depth-first search (DFS)", detail: "an explicit stack replaces recursion to walk a graph or tree deep-first" },
  { term: "Expression evaluation", detail: "operator and operand stacks evaluate or convert arithmetic expressions" },
];

export const commonMistakes = [
  "Popping or peeking without checking for empty first — that's an underflow.",
  "Confusing LIFO with FIFO: a stack returns the newest item, not the oldest (that's a queue).",
  "Forgetting an unbounded stack can exhaust memory — deep recursion overflows the call stack.",
  "Reaching into the middle of a stack; only the top is a valid target.",
];

export const interviewQuestions = [
  "Why are push, pop, and peek all O(1)?",
  "How would you evaluate or convert an arithmetic expression using stacks?",
  "How does the call stack relate to recursion depth, and when does it overflow?",
  "How would you implement a queue using two stacks, and what's the amortized cost?",
];

export const practicePrompts = [
  "Validate that brackets in a string are balanced using a single stack.",
  "Implement undo/redo with two stacks.",
  "Evaluate a postfix (reverse Polish notation) expression.",
];
