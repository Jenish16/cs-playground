// Content for the Queue topic page (see specs/001-dsa-module twelve-part
// template + specs/003-stack-queue-visualizer). Plain data so the page and the
// visualizer stay presentational. Mirrors the shape of stack-content.js.
//
// NOTE: each operation's `pseudocode` is authored line-by-line so the visualizer
// can highlight the active line per step. The line indices referenced by the
// builders in lib/algorithms/linear-structure.js must match these lines.

export const DEFAULT_QUEUE = [10, 20, 30]; // 10 is the front, 30 is the rear

export const queueOperations = {
  enqueue: {
    key: "enqueue",
    label: "Enqueue",
    enabled: true,
    needs: ["value"],
    time: "O(1)",
    space: "O(1)",
    explanation:
      "Enqueue adds a value to the rear of the queue — the only end where items join. The rear pointer moves forward by one and the new value lands in that slot. Nothing already in line moves, so it's constant time. (A bounded queue can overflow once it hits its capacity.)",
    pseudocode: `enqueue(queue, value):
  queue[rear] = value
  rear = rear + 1`,
    code: `function enqueue(queue, value) {
  queue.push(value); // amortized O(1)
  return queue;
}`,
    backend:
      "Adding a job to the back of a work queue, or buffering an incoming request until a worker is free.",
  },
  dequeue: {
    key: "dequeue",
    label: "Dequeue",
    enabled: true,
    needs: [],
    time: "O(1)",
    space: "O(1)",
    explanation:
      "Dequeue removes and returns the value at the front — the item that has waited longest. The front pointer moves forward; the next item becomes the new front. Because only the front is touched, it's constant time. Dequeuing an empty queue is an underflow.",
    pseudocode: `dequeue(queue):
  if front == rear: underflow
  front = front + 1
  return queue[front - 1]`,
    code: `function dequeue(queue) {
  if (queue.length === 0) throw new Error("underflow");
  return queue.shift(); // O(1) with a head pointer
}`,
    backend:
      "Pulling the next job off a work queue to process it, or delivering the oldest buffered message first.",
  },
  front: {
    key: "front",
    label: "Front",
    enabled: true,
    needs: [],
    time: "O(1)",
    space: "O(1)",
    explanation:
      "Front (or peek) reads the value at the front without removing it. It's a single indexed read, so it's constant time. Like dequeue, checking the front of an empty queue is an underflow.",
    pseudocode: `front(queue):
  if front == rear: underflow
  return queue[front]`,
    code: `function front(queue) {
  if (queue.length === 0) throw new Error("underflow");
  return queue[0]; // O(1)
}`,
    backend:
      "Inspecting the next job a worker will pick up, or checking the oldest pending request without consuming it.",
  },
};

// Order used by the operation selector.
export const operationOrder = ["enqueue", "dequeue", "front"];

export const complexityRows = [
  { operation: "Enqueue", time: "O(1)", space: "O(1)" },
  { operation: "Dequeue", time: "O(1)", space: "O(1)" },
  { operation: "Front", time: "O(1)", space: "O(1)" },
];

// Shown beneath the complexity table: per-operation space is O(1) auxiliary,
// while the queue itself holds n elements.
export const spaceNote =
  "Each operation uses O(1) auxiliary space. Total storage is O(n) — the queue holds all n elements.";

export const concept =
  "A queue is a linear, first-in-first-out (FIFO) collection: the first value you put in is the first one you take out. Items join at one end called the rear and leave from the other end called the front — like a line at a checkout. You can enqueue at the rear, dequeue from the front, or read the front, but you can't reach into the middle.";

export const representation =
  "Picture a line of people waiting their turn. New arrivals join the back (rear) and the person at the head (front) is served next; nobody cuts in. Internally a queue is usually an array (or linked list) plus two indices — 'front' marks who's served next and 'rear' marks the next free slot. Enqueue writes at rear and advances it; dequeue reads at front and advances it. Because only the ends move, every operation is O(1).";

export const backendUseCases = [
  { term: "Job queues", detail: "background tasks line up and workers process them oldest-first" },
  { term: "Message queues", detail: "Kafka, SQS, RabbitMQ deliver messages in arrival order between services" },
  { term: "Request buffering", detail: "incoming requests wait in line when the server is briefly saturated" },
  { term: "Rate limiting", detail: "a queue smooths bursts into a steady, fair processing rate" },
  { term: "Breadth-first search (BFS)", detail: "a queue holds the frontier so a graph or tree is explored level by level" },
  { term: "Worker task processing", detail: "a thread or worker pool pulls the next task off a shared FIFO queue" },
];

export const commonMistakes = [
  "Dequeuing or reading the front without checking for empty first — that's an underflow.",
  "Confusing FIFO with LIFO: a queue returns the oldest item, not the newest (that's a stack).",
  "Using array shift() naively in a hot loop — it's O(n) unless you track a head pointer or use a ring buffer.",
  "Reaching into the middle of a queue; only the front and rear are valid targets.",
];

export const interviewQuestions = [
  "Why are enqueue, dequeue, and front all O(1)?",
  "How would you implement a queue with a fixed-size array (circular/ring buffer)?",
  "Why does BFS use a queue while DFS uses a stack?",
  "How would you implement a queue using two stacks, and what's the amortized cost?",
];

export const practicePrompts = [
  "Implement a queue using two stacks.",
  "Build a circular (ring buffer) queue with a fixed capacity.",
  "Use a queue to perform a level-order (BFS) traversal of a tree.",
];
