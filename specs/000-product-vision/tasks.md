# 000 — Product Vision: Tasks

## Phase 0 — Foundation (done)
- [x] Define spec folder structure (000–005).
- [x] Write the backend-focused product vision spec.
- [x] Build app shell (root layout with Navbar + Footer).
- [x] Build shared layout components (Container, PageHeader).
- [x] Build home page with module grid.
- [x] Build DSA module landing page.
- [x] Create shared visualization primitives (VisualizerShell, PlaybackControls).
- [x] Establish `lib/dsa-modules.js` topic catalog.

## Phase 1 — Version 1 Vertical Slice (current)
- [ ] Build the Array Visualizer fully (spec 002).
- [ ] Implement the topic page anatomy for the Array topic (concept, viz,
      step-by-step, pseudocode, real-world example, common mistakes, complexity,
      practice questions).
- [ ] Keep other DSA topics as "Coming soon."
- [ ] Confirm the catalog + visualizer primitives are domain-agnostic enough to
      support backend modules later.

## Phase 2 — Remaining DSA Topics
- [ ] Stack & Queue (spec 003), Linked List (spec 004), Sorting (spec 005).
- [ ] Trees, Graphs, HashMap, Heap, Searching (new specs as built).

## Phase 3 — Backend Domains (roadmap, each gets its own spec folder)
- [ ] B. Operating Systems
- [ ] C. Networking
- [ ] D. Databases
- [ ] E. Data Engineering
- [ ] F. Distributed Systems
- [ ] G. Backend Architecture
- [ ] H. JVM and Garbage Collection
- [ ] I. Cloud and DevOps
- [ ] J. AI Engineering and Multi-Agent Architecture

## Cross-Cutting (later)
- [ ] Generalize the catalog into `lib/modules.js` for multi-domain home page.
- [ ] Dark mode toggle.
- [ ] Tradeoff-table and architecture-flow primitives for systems topics.
- [ ] Stepped-state-machine helper shared by systems/AI visualizers.

> Out of scope for v1 (see requirements §7): auth, database, progress tracking,
> paid courses, admin panel, CMS, backend API, React internals, design docs.
