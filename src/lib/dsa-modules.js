// Single source of truth for the DSA topic catalog (see specs/001-dsa-module).
// Pages read from here so the topic list never drifts. Icons are referenced by
// lucide-react name (see icon.jsx) to keep this file plain, serializable data.
//
// Fields per topic:
//   slug             stable id + URL segment
//   title            display name
//   shortDescription one-line summary used on cards
//   backendAngle     where this shows up in real backend systems
//   icon             lucide-react icon name (see components/icon.jsx)
//   difficulty       Beginner | Intermediate | Advanced
//   status           available | planned   (planned => "Coming soon")
//   href             route to the topic page

export const dsaTopics = [
  {
    slug: "array",
    title: "Arrays",
    shortDescription: "Indexing, access, insert/delete, and linear search.",
    backendAngle: "In-memory lists, response collections, pagination, batch buffers.",
    icon: "Grid3x3",
    difficulty: "Beginner",
    status: "available",
    href: "/dsa/array",
  },
  {
    slug: "stack",
    title: "Stack",
    shortDescription: "LIFO push, pop, and peek — with underflow handling.",
    backendAngle: "Function call stack, undo operations, parsing, DFS.",
    icon: "Layers",
    difficulty: "Beginner",
    status: "available",
    href: "/dsa/stack",
  },
  {
    slug: "queue",
    title: "Queue",
    shortDescription: "FIFO enqueue/dequeue across front and rear.",
    backendAngle: "Job queues, message queues, request buffering, rate limiting.",
    icon: "ListEnd",
    difficulty: "Beginner",
    status: "available",
    href: "/dsa/queue",
  },
  {
    slug: "linked-list",
    title: "Linked List",
    shortDescription: "Nodes linked by pointers; insert, delete, and traverse.",
    backendAngle: "LRU cache internals, memory-efficient insert/delete, queues.",
    icon: "Link2",
    difficulty: "Intermediate",
    status: "planned",
    href: "/dsa/linked-list",
  },
  {
    slug: "hashmap",
    title: "HashMap",
    shortDescription: "Hashing, buckets, collisions, and rehashing.",
    backendAngle: "Caching, lookup tables, request deduplication, frequency counters.",
    icon: "Hash",
    difficulty: "Intermediate",
    status: "planned",
    href: "/dsa/hashmap",
  },
  {
    slug: "heap",
    title: "Heap / Priority Queue",
    shortDescription: "Min/max heaps: insert, extract, and heapify.",
    backendAngle: "Task scheduling, top-K problems, priority jobs, rate-limit queues.",
    icon: "ListTree",
    difficulty: "Intermediate",
    status: "planned",
    href: "/dsa/heap",
  },
  {
    slug: "trees",
    title: "Trees",
    shortDescription: "Binary trees, BST, traversals, and balancing intro.",
    backendAngle: "Database indexes, filesystem hierarchy, expression trees.",
    icon: "GitBranch",
    difficulty: "Advanced",
    status: "planned",
    href: "/dsa/trees",
  },
  {
    slug: "graphs",
    title: "Graphs",
    shortDescription: "Nodes, edges, BFS/DFS, and shortest-path intro.",
    backendAngle: "Service dependency graphs, routing, recommendations, permissions.",
    icon: "Network",
    difficulty: "Advanced",
    status: "planned",
    href: "/dsa/graphs",
  },
  {
    slug: "sorting",
    title: "Sorting",
    shortDescription: "Selection, insertion, merge, and quick sort (plus bubble).",
    backendAngle: "Sorting API responses, ranking systems, log ordering, batch jobs.",
    icon: "ArrowUpDown",
    difficulty: "Intermediate",
    status: "planned",
    href: "/dsa/sorting",
  },
  {
    slug: "searching",
    title: "Searching",
    shortDescription: "Linear vs. binary search and search-space reduction.",
    backendAngle: "Sorted-data lookup, pagination boundaries, thresholds, rule matching.",
    icon: "Search",
    difficulty: "Beginner",
    status: "planned",
    href: "/dsa/searching",
  },
];

export function getDsaTopic(slug) {
  return dsaTopics.find((topic) => topic.slug === slug) ?? null;
}

export const dsaModule = {
  slug: "dsa",
  title: "Data Structures & Algorithms",
  description:
    "Backend- and interview-focused DSA: how core structures work internally, where backend systems use them, and how to reason about complexity and tradeoffs.",
  href: "/dsa",
};
