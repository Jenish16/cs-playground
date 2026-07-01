# 004 — Linked List Visualizer: Design

## Component Tree
```
LinkedListVisualizerPage (/dsa/linked-list)
  VisualizerShell title="Linked List"
    controls: op select (insert head/tail/after, delete, search) + inputs
    canvas:   head label → <ListNode>→<Pointer>→ ... → null
    footer:   contextual complexity note
```

## State
```js
{
  nodes: { id: string, value: number }[], // order represents links head→tail
  cursorId: string | null,                // node currently visited (traverse/search)
  highlightId: string | null,             // node just inserted/found
  message: string | null,
}
```

## Modeling Pointers
- The list is modeled as an ordered array of `{id, value}`; visual `next`
  arrows are derived from order. This keeps logic simple while the UI still
  tells the "pointer" story via arrows + rewire highlighting.
- Stable ids drive Framer Motion layout animations on insert/delete.

## Animations
- Traverse/search: a moving highlight (cursor) steps id→id with a small delay;
  optionally driven by `PlaybackControls` (step/play/speed).
- Insert: new node scales in; adjacent pointer arrow animates to the new target.
- Delete: node scales out; the predecessor's arrow re-points past it.

## Complexity Notes
- insert at head: O(1)
- insert at tail / after index / delete at index: O(n) to reach the position
- search / traverse: O(n)

## Reuse
- `VisualizerShell` frame + message area.
- `PlaybackControls` for step-through traversal (shared primitive).
