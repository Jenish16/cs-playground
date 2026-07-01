# 000 — Product Vision: Design

## Architecture Overview

A static Next.js App Router site. All rendering is client/static; there is no
server data layer in v1. Content (domains, modules, topics) is defined as plain
JS data and imported where needed. The design must accommodate **many
backend-focused domains**, not just DSA.

```
src/
  app/                       # routes (App Router)
    layout.js                # root layout = app shell (nav + footer)
    page.js                  # home page (modules grouped by domain)
    dsa/page.js              # DSA module landing
    dsa/array/page.js        # Array Visualizer (v1, spec 002)
    <module>/<topic>/page.js # future topic/visualizer routes
  components/
    layout/                  # Navbar, Footer, Container, PageHeader
    visualizers/             # shared visualization primitives
    <module>/                # module-specific cards/components (e.g. dsa/)
    ui/                      # shadcn/ui primitives (generated)
  lib/
    modules.js               # catalog of modules/domains (extensible)
    dsa-modules.js           # DSA topic catalog (single source of truth)
    utils.js                 # cn() helper
specs/                       # spec-driven workflow docs (one folder per feature)
```

> v1 only builds the DSA route tree. The folder convention above is the target
> shape so future modules slot in without core changes.

## 5. Navigation Model

Four navigation levels, from broad to specific:

1. **Home page** (`/`)
   - Intro + value proposition (backend-focused, interactive).
   - Modules grouped by engineering domain (DSA, OS, Networking, Databases,
     Data Engineering, Distributed Systems, Backend Architecture, JVM/GC,
     Cloud/DevOps, AI Engineering).
   - Available modules link out; planned modules show "Coming soon."

2. **Module landing pages** (e.g. `/dsa`)
   - Describe the domain and list its topics as cards.
   - Available topics link to their topic page; planned topics are dimmed.

3. **Topic pages** (e.g. `/dsa/array`)
   - The learning unit. Houses the visualizer plus supporting content
     (see "Topic Page Anatomy" below).

4. **Interactive visualizer pages**
   - In v1 the visualizer is embedded directly in the topic page. The
     `VisualizerShell` primitive provides the consistent interactive frame.

### Topic Page Anatomy

Every topic page — across every domain — follows the same structure so the
learning experience is predictable:

1. **Concept explanation** — what it is and why it matters (engineering framing).
2. **Interactive visualization** — the core, built on `VisualizerShell`.
3. **Step-by-step execution** — drive state forward/back via `PlaybackControls`
   (where the topic has a meaningful sequence).
4. **Pseudocode or architecture flow** — algorithm pseudocode (DSA) or a
   component/sequence flow (systems topics).
5. **Real-world backend example** — the system this maps to (Postgres, Kafka,
   Kubernetes, JVM, an LLM agent, etc.).
6. **Common mistakes** — pitfalls and misconceptions engineers hit in practice.
7. **Complexity or tradeoff analysis** — Big-O for algorithms; tradeoff tables
   (consistency vs availability, throughput vs latency, cost vs durability) for
   systems topics.
8. **Practice questions** — a few prompts to check understanding / interview prep.

Not every section applies equally to every topic (e.g. systems topics emphasize
tradeoffs over Big-O), but the anatomy is the default template.

## Design System

- Tailwind v4 with CSS variables from shadcn (radix-nova style).
- Light + dark color tokens defined in `globals.css`.
- Typography: Geist Sans (UI) + Geist Mono (code/values/state).
- Components composed from shadcn/ui primitives (Button, Card, Badge, Tabs, etc.).

## Shared Component Strategy

- `layout/*` owns page chrome and consistent page structure (Container,
  PageHeader, Navbar, Footer).
- `visualizers/*` owns the reusable interaction model every visualizer reuses:
  - `VisualizerShell` — titled canvas + controls slot + message region + footer
    (e.g. complexity/tradeoff notes).
  - `PlaybackControls` — play/pause, step, reset, speed.
- A new visualizer focuses only on its **data model** and **how a step is
  drawn** — chrome and controls are inherited.

This matters more for the backend modules than for DSA: a TCP handshake, a Raft
election, a GC cycle, and an agent loop are all "stepped state machines" that
can reuse the same shell + playback vocabulary.

## Catalog & Extensibility

- `lib/modules.js` (future) describes the **domains/modules** shown on the home
  page. Each entry carries title, description, icon, status, and href.
- `lib/dsa-modules.js` is the **DSA topic catalog** and the single source of
  truth for `/dsa`.
- Adding a new module/domain = add a catalog entry + a route folder + reuse the
  visualizer primitives. **No core changes required.**
- Topic metadata (title/description) is read from the catalog by both the
  landing page and the topic route, so it never drifts.

## Out of Scope for the Design (v1)

No server data layer, no persistence, no auth, no CMS. All content is in-repo
data and components. These constraints keep v1 shippable as a static site while
preserving the extension points needed for later backend modules.
