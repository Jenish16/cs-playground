# 001 — DSA Module: Requirements

## Summary

The DSA module is the first learning module in CS Playground. It teaches data
structures and algorithms in a **backend- and interview-focused** way: not as
abstract academic exercises, but as the building blocks of real backend systems.

Every topic answers three questions:
1. **How does it work internally?** (representation + operations)
2. **Where is it used in backend systems?** (concrete real-world mappings)
3. **How do I reason about its time/space complexity and tradeoffs?**

## Purpose & Learning Outcomes

The DSA module should help learners get better at:

- **Backend engineering** — recognize which structure fits a problem (job queue
  vs. priority queue, hashmap cache vs. sorted index) and why.
- **Senior engineer interviews** — fluent recall of operations, complexity, and
  tradeoffs, plus the ability to explain choices out loud.
- **System design fundamentals** — connect structures to the systems built on
  them (LRU caches, DB indexes, message queues, dependency graphs).
- **Writing better production code** — choose efficient structures and avoid
  accidental O(n²) or unbounded-memory patterns.
- **Understanding performance tradeoffs** — compare options on time, space, and
  operational cost rather than memorizing single definitions.

## Target Users

Backend developers, full-stack developers seeking backend depth, tech leads, and
engineers preparing for senior-level interviews (see spec 000 for full profiles).
Explanations assume programming maturity and stay practical and
engineering-oriented.

## Scope — Planned Topics

The module covers ten topics. Each will eventually become a full topic page +
visualizer (see "Topic Page Content Structure"). Only **Arrays** is fully built
in v1; the rest are **Coming soon**.

| # | Topic | Route | v1 Status |
|---|-------|-------|-----------|
| 1 | Arrays | `/dsa/array` | **Implemented (v1)** |
| 2 | Stack | `/dsa/stack` | Coming soon |
| 3 | Queue | `/dsa/queue` | Coming soon |
| 4 | Linked List | `/dsa/linked-list` | Coming soon |
| 5 | HashMap | `/dsa/hashmap` | Coming soon |
| 6 | Heap / Priority Queue | `/dsa/heap` | Coming soon |
| 7 | Trees | `/dsa/trees` | Coming soon |
| 8 | Graphs | `/dsa/graphs` | Coming soon |
| 9 | Sorting | `/dsa/sorting` | Coming soon |
| 10 | Searching | `/dsa/searching` | Coming soon |

> Note: the earlier scaffolding bundled Stack + Queue into one
> `stack-queue` route. This spec treats them as **two distinct topics** (Stack,
> Queue) per the module definition; the catalog should be updated accordingly
> when these topics are built.

### Topic Coverage Detail

Each topic must cover the following concepts and backend examples.

#### 1. Arrays
- Concepts: indexing, access, insert, delete, linear search, binary search intro.
- Backend examples: in-memory lists, response collections, pagination, batch
  processing buffers.

#### 2. Stack
- Concepts: LIFO, push, pop, peek, underflow.
- Backend examples: function call stack, undo operations, parsing, DFS.

#### 3. Queue
- Concepts: FIFO, enqueue, dequeue, front, rear.
- Backend examples: job queues, message queues, request buffering, rate limiting.

#### 4. Linked List
- Concepts: node structure, head, tail, insert, delete, traversal.
- Backend examples: LRU cache internals, memory-efficient insert/delete, queues.

#### 5. HashMap
- Concepts: key-value storage, hash function, buckets, collision, rehashing.
- Backend examples: caching, lookup tables, request deduplication, frequency
  counters.

#### 6. Heap / Priority Queue
- Concepts: min heap, max heap, insert, extract, heapify.
- Backend examples: task scheduling, top-K problems, priority-based jobs, rate
  limit queues.

#### 7. Trees
- Concepts: binary tree, BST, traversals, balanced tree intro.
- Backend examples: database indexes, filesystem hierarchy, expression trees.

#### 8. Graphs
- Concepts: nodes, edges, directed/undirected graphs, BFS, DFS, shortest path
  intro.
- Backend examples: service dependency graphs, network routing, recommendation
  systems, permission graphs.

#### 9. Sorting
- Concepts: bubble sort (learning only), selection sort, insertion sort, merge
  sort, quick sort.
- Backend examples: sorting API responses, ranking systems, log ordering, batch
  processing.

#### 10. Searching
- Concepts: linear search, binary search, search space reduction.
- Backend examples: sorted data lookup, pagination boundaries, threshold
  finding, config/rule matching.

## Topic Page Content Structure

Every DSA topic page follows this consistent twelve-part structure so the
learning experience is predictable and interview-ready:

1. **Concept explanation** — what it is and the intuition behind it.
2. **Internal representation** — how it's actually laid out in memory/structure.
3. **Operations** — the supported operations and how each mutates state.
4. **Step-by-step visual execution** — interactive, driven by the visualizer.
5. **Pseudocode** — language-agnostic algorithm description.
6. **JavaScript code example** — runnable-style reference implementation.
7. **Time complexity** — per operation, with best/average/worst where relevant.
8. **Space complexity** — auxiliary and total.
9. **Backend use cases** — the real systems this maps to.
10. **Common mistakes** — pitfalls engineers hit in production and interviews.
11. **Interview questions** — representative questions for senior-level prep.
12. **Practice prompts** — hands-on exercises to reinforce the concept.

## Functional Requirements

- FR1: `/dsa` renders a grid of topic cards built from `lib/dsa-modules.js`.
- FR2: Each card shows: title, one-line description, an icon, and a difficulty
  badge (Beginner / Intermediate / Advanced).
- FR3: **Arrays** links to its fully implemented topic page; all other topics
  render a "Coming soon" state and are not clickable.
- FR4: A page header explains the backend/interview focus of the DSA module.
- FR5: Each topic page that exists follows the twelve-part content structure.
- FR6: Back navigation to Home is available via the app shell.

## Non-Functional Requirements

- NFR1: The topic catalog is the single source of truth (no duplicated lists).
- NFR2: Cards are responsive: 1 column on mobile, 2–3 on larger screens.
- NFR3: Adding/upgrading a topic requires only a catalog edit + its route.
- NFR4: Specs are detailed enough that each topic can be implemented
  **independently** in a later step.

## Version 1 Scope

- Fully implement **only Arrays** (topic page + Array Visualizer, see spec 002).
- Show Stack, Queue, Linked List, Sorting, HashMap, Heap, Trees, Graphs, and
  Searching as **Coming soon**.
- The architecture must allow each topic to become a full visualizer later
  without core changes.

### Array Visualizer v1 Scope
- Access by index.
- Insert at end.
- Delete from index.
- Linear search.
- Explanation panel.
- Pseudocode panel.
- Complexity panel.
- Step-by-step execution.

## Out of Scope for DSA v1

- Authentication.
- User progress tracking.
- Backend API.
- Database.
- Admin panel.
- Advanced graph algorithms (e.g. Dijkstra/A* internals, max-flow).
- Advanced dynamic programming.
- Competitive programming platform features (submissions, judging, leaderboards).

## Data Model (catalog entry)

```js
{
  slug: "array",
  title: "Arrays",
  shortDescription: "Indexing, access, insert/delete, and linear search.",
  backendAngle: "In-memory lists, response collections, pagination, batch buffers.",
  icon: "Grid3x3",          // lucide-react icon name
  difficulty: "Beginner",   // Beginner | Intermediate | Advanced
  status: "available",      // available | planned
  href: "/dsa/array",
}
```

## Dependencies

- Shared layout components (spec 000).
- Shared visualization primitives (spec 000) consumed by each topic visualizer.
- Array Visualizer implementation detail lives in spec 002.
