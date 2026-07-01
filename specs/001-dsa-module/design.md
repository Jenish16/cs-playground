# 001 — DSA Module: Design

## Routes

- `/dsa` — module landing (grid of topic cards).
- `/dsa/array` — Arrays topic page (v1, full implementation; spec 002).
- `/dsa/<slug>` — future topic pages (Stack, Queue, Linked List, HashMap, Heap,
  Trees, Graphs, Sorting, Searching), added per their own specs.

Routes are flat under `/dsa` (one segment per topic) so each topic is
independently buildable and bookmarkable.

## Catalog as Single Source of Truth

`src/lib/dsa-modules.js` exports an ordered array of topic entries. Both the home
page (module summary) and the DSA landing page read from it. Each topic page also
imports its own entry for page title/description so metadata never drifts.

```js
export const dsaTopics = [ /* entries per requirements data model */ ];
export function getDsaTopic(slug) { ... }
```

The catalog should be updated for this spec to:
- Treat **Stack** and **Queue** as two separate entries (slugs `stack`, `queue`)
  rather than the earlier combined `stack-queue`.
- Add the remaining topics: `hashmap`, `heap`, `trees`, `graphs`, `searching`.
- Mark **`array` as `status: "available"`** and all others as `"planned"`.
- Add a `backendAngle` field (one line) so cards can hint at the real-world use.

> Catalog changes are an implementation task (tasks.md), not part of this
> spec-writing step. This section defines the target shape.

## Module Landing Page Composition (`/dsa`)

```
<Container>
  <PageHeader
    eyebrow="Module"
    title="Data Structures & Algorithms"
    description="Backend- and interview-focused DSA: how structures work
                 internally, where backend systems use them, and how to reason
                 about complexity and tradeoffs." />
  <TopicGrid>            // grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
    {dsaTopics.map(t => <TopicCard ... />)}
  </TopicGrid>
</Container>
```

- `PageHeader` and `Container` are shared layout components (spec 000).
- `TopicCard` (already built) renders available vs. planned states; available
  topics wrap in a `<Link>`, planned topics are dimmed with a "Coming soon"
  badge and `aria-disabled`.

## Topic Page Composition (template for every topic)

Each topic page renders the twelve-part content structure (requirements
§"Topic Page Content Structure") using shared primitives:

```
<Container>
  <PageHeader eyebrow="DSA" title={topic.title} description={...} />

  <ConceptPanel>            // 1. Concept explanation
  <RepresentationPanel>     // 2. Internal representation
  <OperationsList>          // 3. Operations

  <VisualizerShell ...>     // 4. Step-by-step visual execution
    controls + canvas + message + footer
  </VisualizerShell>

  <PseudocodePanel>         // 5. Pseudocode
  <CodeExamplePanel>        // 6. JavaScript code example
  <ComplexityPanel>         // 7 + 8. Time & space complexity (table)
  <BackendUseCases>         // 9. Backend use cases
  <CommonMistakes>          // 10. Common mistakes
  <InterviewQuestions>      // 11. Interview questions
  <PracticePrompts>         // 12. Practice prompts
</Container>
```

- The interactive section (4) is the only part that requires a custom
  visualizer per topic; everything else is content rendered into shared
  presentational panels.
- v1 implements these panels concretely for the Arrays page. Later topics reuse
  the same panel components, so building topic N is mostly: write content data +
  a topic-specific visualizer.

## Suggested Shared Content Panels (built incrementally)

To keep topic pages consistent and cheap to add, these presentational
components are anticipated (created when first needed, starting with Arrays):

- `ComplexityTable` — operation → time (best/avg/worst) → space.
- `CodeBlock` — monospace JS/pseudocode with a label.
- `InfoList` — reusable list panel for use cases / mistakes / questions / prompts.

These are not built in this step; they are the intended structure so later
topics drop in without redesign.

## Difficulty Mapping (for badges)

- Beginner: Arrays, Stack, Queue, Searching.
- Intermediate: Linked List, HashMap, Heap, Sorting.
- Advanced: Trees, Graphs.

## Complexity Reference (per topic, summary)

Used to seed each topic's `ComplexityPanel` when built:

- **Arrays** — access/update O(1); insert/delete at index O(n); linear search
  O(n); binary search O(log n) on sorted data. Space O(n).
- **Stack / Queue** — push/pop/enqueue/dequeue/peek O(1). Space O(n).
- **Linked List** — insert/delete at head O(1); access/search/insert-at-index
  O(n). Space O(n).
- **HashMap** — average O(1) get/put/delete; worst O(n) (collisions/rehash).
  Space O(n).
- **Heap** — insert/extract O(log n); peek O(1); build-heap O(n). Space O(n).
- **Trees (BST)** — search/insert/delete O(log n) balanced, O(n) worst;
  traversal O(n). Space O(n).
- **Graphs** — BFS/DFS O(V + E). Space O(V).
- **Sorting** — bubble/selection/insertion O(n²); merge O(n log n) stable;
  quick O(n log n) avg, O(n²) worst. Space: merge O(n), quick O(log n).
- **Searching** — linear O(n); binary O(log n) on sorted data.

## States

- available: full color, hover elevation, clickable (Arrays in v1).
- planned: reduced opacity, "Coming soon" badge, `aria-disabled`, no link.

## Extensibility

Adding/upgrading a topic = (1) edit its catalog entry status, (2) create the
route page using the topic-page template + shared panels, (3) implement the
topic-specific visualizer. No changes to the landing page, catalog reader, or
shell are needed.
