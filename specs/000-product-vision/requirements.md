# 000 — Product Vision: Requirements

## 1. Product Purpose

Computer Science Playground (CS Playground) is an **interactive learning
platform for backend-heavy computer science concepts**. It helps engineers
understand *how systems actually work internally* — not just memorize
definitions.

Most resources explain backend topics as static text and diagrams. CS Playground
instead lets learners **watch and drive** the internal state of a system as it
executes: see a TCP handshake progress packet by packet, watch a B+ tree split
on insert, step through a Raft leader election, or trace an AI agent's
planner → tool-call → memory loop.

The product is deliberately **backend-focused**. It spans core CS, backend
engineering, distributed systems, data engineering, and modern AI engineering.
The goal is depth of mental model: after using a visualizer, a learner should be
able to reason about tradeoffs, failure modes, and edge cases — the things that
separate junior from senior engineers.

### What success looks like
- A learner can explain *why* a system behaves the way it does, not just *what*
  it does.
- A learner can reason about failure cases (timeouts, partitions, contention,
  GC pauses) because they have seen them animated.
- A learner connects theory to real backend systems they use daily (Postgres,
  Kafka, Kubernetes, the JVM, LLM agents).

## 2. Target Users

- **Backend developers** deepening their understanding of the systems they build on.
- **Full-stack developers** who want stronger backend depth.
- **Tech leads** who need crisp mental models to make and explain design decisions.
- **Engineers preparing for senior-level interviews** (system design + fundamentals).
- **Engineers learning system design, distributed systems, and AI agent
  architecture** from first principles.

These users are technical. Explanations should be **practical and
engineering-oriented**, assume programming maturity, and avoid hand-waving.

## 3. Core Learning Principles

These principles govern every module and every visualizer:

1. **Visual-first learning** — lead with an interactive visualization; text
   supports the visual, not the other way around.
2. **Step-by-step execution** — let learners advance one step at a time and
   replay, so cause and effect are observable.
3. **Internal system state visibility** — surface the hidden state (buffers,
   pointers, queues, heaps, partitions, agent memory) that explains behavior.
4. **Theory connected with real-world backend examples** — every concept maps to
   a system engineers actually use (e.g. WAL → Postgres, partitioning → Kafka).
5. **Compare tradeoffs, not just definitions** — present alternatives side by
   side (e.g. ETL vs ELT, monolith vs microservices, at-least-once vs
   exactly-once) and make the cost of each explicit.
6. **Show failure cases and edge cases** — deadlocks, partitions, split-brain,
   stop-the-world pauses, dropped messages, hallucinated tool calls.
7. **Keep explanations practical and engineering-oriented** — favor "how would
   you design/operate/debug this" over academic formalism.

## 4. Modules Planned (Roadmap)

Modules are organized by engineering domain. Only DSA (specifically the Array
Visualizer) is in scope for v1; everything else is roadmap and will be specced
in its own folder when built.

### A. Data Structures and Algorithms
Arrays · Stack · Queue · Linked List · Trees · Graphs · HashMap · Heap ·
Sorting · Searching

### B. Operating Systems
Process scheduling · Threads · Context switching · Memory management · Paging ·
Virtual memory · Deadlocks · Locks, mutexes, semaphores

### C. Networking
DNS · TCP handshake · TLS · HTTP/1.1 · HTTP/2 · HTTP/3 · REST · gRPC ·
WebSocket · Load balancing · Reverse proxy

### D. Databases
Indexing · B+ Trees · Query execution · Transactions · Isolation levels ·
Locks · Replication · Sharding · WAL · Query optimization

### E. Data Engineering
Batch processing · Stream processing · ETL vs ELT · Kafka fundamentals ·
Consumer groups · Partitioning · Event ordering · Backpressure ·
Data lake concepts · Data warehouse concepts · CDC ·
Exactly-once vs at-least-once processing

### F. Distributed Systems
CAP theorem · Consensus · Leader election · Replication · Quorum ·
Consistent hashing · Rate limiting · Circuit breakers · Idempotency ·
Eventual consistency · Saga pattern · Outbox pattern

### G. Backend Architecture
Monolith · Modular monolith · Microservices · API Gateway · Service discovery ·
Message queues · Caching · Background jobs · Observability ·
Authentication and authorization

### H. JVM and Garbage Collection
JVM memory model · Heap · Stack · Eden space · Survivor space · Old generation ·
G1GC · ZGC · Object allocation · Stop-the-world pauses

### I. Cloud and DevOps
Containers · Docker lifecycle · Kubernetes basics · Pods · Services ·
Deployments · Ingress · Autoscaling · CI/CD · Logs, metrics, traces

### J. AI Engineering and Multi-Agent Architecture
LLM basics · Prompt chaining · Tool calling · RAG · Embeddings ·
Vector databases · Agent loop · Planner-executor architecture ·
Multi-agent collaboration · Memory in agents · Evaluation of AI outputs ·
Guardrails · Human-in-the-loop systems ·
AI coding agent architecture (similar to Claude Code)

## 5. Functional Requirements (platform level)

- FR1: Provide a global app shell (navigation + footer) shared by all pages.
- FR2: Provide a home page introducing the platform and listing modules by domain.
- FR3: Provide module landing pages that list a module's topics.
- FR4: Provide topic pages with a consistent anatomy (see design.md §Topic Page).
- FR5: Provide interactive visualizer pages reachable via clean, bookmarkable routes.
- FR6: Topics not yet built render as "Coming soon" and are clearly non-clickable.
- FR7: Visualizers share a common shell and playback vocabulary
  (play/pause/step/reset/speed) so the interaction model is consistent across
  every domain.

## 6. Non-Functional Requirements

- NFR1: **Engineering-oriented UX** — dense enough for senior engineers, clear
  enough for a motivated learner; no jargon walls, no fluff.
- NFR2: **Visual clarity** — motion explains rather than decorates; internal
  state is legible.
- NFR3: **Accessibility** — keyboard-operable controls, sufficient contrast.
- NFR4: **Performance** — static generation; visualizations run client-side and
  stay smooth for typical input sizes.
- NFR5: **Maintainability & extensibility** — reusable components and a
  data-driven module/topic catalog so new domains (OS, Networking, Databases,
  Data Engineering, Distributed Systems, JVM, DevOps, AI Agents) can be added
  without touching the core.

## 7. Non-Goals for v1

The following are explicitly **out of scope for version 1**:

- No authentication.
- No database.
- No user progress tracking.
- No paid courses.
- No admin panel.
- No CMS.
- No backend API (unless a later module strictly requires it).
- No React internals module for now.
- No heavy UI / visual-design documentation for now.

## 8. Version 1 Scope

Version 1 proves the platform pattern with a single complete vertical slice:

1. Build the **base product shell** (navigation, footer, layout, shared
   visualization primitives).
2. Build the **DSA module landing page**.
3. Build the **Array Visualizer** fully (per spec 002).
4. Show **other DSA topics as "Coming soon."**
5. Keep the platform **extensible for backend-focused modules later** — the
   catalog and visualizer primitives must support domains beyond DSA without
   rework.

Everything in §4 beyond the Array Visualizer is roadmap, not v1.

## 9. Constraints

- Stack: Next.js (App Router), JavaScript (no TypeScript), Tailwind CSS,
  shadcn/ui, Framer Motion, lucide-react.
- Frontend-only static site; no backend or database in v1.
- No additional large dependencies without explicit approval.
- Spec-driven workflow: features are specified before implementation.
