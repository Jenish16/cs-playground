# 001 — DSA Module: Tasks

## Done (foundation)
- [x] Create `lib/dsa-modules.js` catalog with initial topics.
- [x] Build `/dsa` landing page using `PageHeader` + topic grid.
- [x] Implement `TopicCard` (available vs. planned states).
- [x] Map lucide icon names to components.
- [x] Link DSA module from the home page.

## V1 — Arrays (current)
- [ ] Update catalog: split `stack-queue` into `stack` + `queue`; add `hashmap`,
      `heap`, `trees`, `graphs`, `searching`; add `backendAngle` field.
- [ ] Mark `array` as `status: "available"`; all other topics `"planned"`.
- [ ] Update the `/dsa` page header copy to state the backend/interview focus.
- [ ] Build the Arrays topic page (`/dsa/array`) using the twelve-part template.
- [ ] Author Arrays content: concept, representation, operations, pseudocode, JS
      example, complexity, backend use cases, common mistakes, interview
      questions, practice prompts.
- [ ] Build the Array Visualizer (spec 002): access by index, insert at end,
      delete from index, linear search, step-by-step execution, explanation +
      pseudocode + complexity panels.
- [ ] Verify against acceptance-criteria.md.

## Shared Content Panels (build as Arrays needs them)
- [ ] `ComplexityTable` (operation → time → space).
- [ ] `CodeBlock` (labeled JS / pseudocode).
- [ ] `InfoList` (use cases / mistakes / questions / prompts).

## Phase 2 — Remaining Topics (each its own spec + build)
- [ ] Stack (LIFO; call stack, undo, parsing, DFS).
- [ ] Queue (FIFO; job/message queues, buffering, rate limiting).
- [ ] Linked List (LRU cache internals, memory-efficient insert/delete).
- [ ] HashMap (caching, dedup, frequency counters; collisions, rehashing).
- [ ] Heap / Priority Queue (scheduling, top-K, priority jobs).
- [ ] Trees / BST (DB indexes, filesystem, expression trees).
- [ ] Graphs (dependency graphs, routing, permissions; BFS/DFS).
- [ ] Sorting (merge/quick + learning sorts; ranking, log ordering).
- [ ] Searching (binary search, search-space reduction; pagination boundaries).

> Out of scope for DSA v1: auth, progress tracking, backend API, database, admin
> panel, advanced graph algorithms, advanced DP, competitive-programming features.
