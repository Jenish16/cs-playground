# 004 — Linked List Visualizer: Requirements

## Summary
An interactive visualizer for a singly linked list, emphasizing nodes connected
by pointers and how traversal/insertion/deletion relink them.

## Goals
- Show that nodes are not contiguous; they are connected by `next` pointers.
- Make pointer rewiring during insert/delete explicit and visible.

## Functional Requirements
- FR1: Render nodes as boxes (value + next-pointer arrow) connected head→tail.
- FR2: Show a `head` label; show `null` at the tail's next pointer.
- FR3: Operations: insert at head, insert at tail, insert after index,
  delete at index, search by value, traverse.
- FR4: Traverse/search animate a pointer moving node by node.
- FR5: Insert/delete animate node creation/removal and pointer rewiring.
- FR6: Guard rails for invalid index / empty list with inline messages.
- FR7: Display relevant complexity (e.g. insert-at-head O(1), search O(n)).

## Non-Functional Requirements
- NFR1: Built on shared `VisualizerShell` (+ optional `PlaybackControls` for
  step-through traversal).
- NFR2: Arrows clearly indicate direction; pointer changes are highlighted.
- NFR3: Readable up to ~10 nodes.

## Out of Scope
- Doubly / circular linked lists (future).

## Route
`/dsa/linked-list`
