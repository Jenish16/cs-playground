// Content for the Arrays topic page (see specs/001-dsa-module twelve-part
// template + specs/002-array-visualizer). Plain data so the page and the
// visualizer stay presentational.

export const DEFAULT_ARRAY = [12, 5, 27, 8, 19, 3];

// Operation metadata. `enabled: false` operations are shown in the selector but
// not interactive in v1 (their content still renders so learners can read about
// them).
export const arrayOperations = {
  access: {
    key: "access",
    label: "Access by index",
    enabled: true,
    needs: ["index"],
    time: "O(1)",
    space: "O(1)",
    explanation:
      "Arrays store elements in one contiguous block, so the address of index i is just base + i × elementSize. The machine jumps straight there — no scanning, regardless of array size.",
    pseudocode: `function access(arr, i):
    return arr[i]   # constant-time address calculation`,
    code: `function access(arr, i) {
  return arr[i];
}`,
    backend:
      "Reading the nth item of an already-loaded response list, or grabbing a record from an in-memory buffer by its position.",
  },
  insertEnd: {
    key: "insertEnd",
    label: "Insert at end",
    enabled: true,
    needs: ["value"],
    time: "O(1) amortized",
    space: "O(1)",
    explanation:
      "Appending writes into the next free slot. Dynamic arrays occasionally double their capacity and copy everything (an O(n) resize), but averaged over many appends each one is O(1) — 'amortized' constant time.",
    pseudocode: `function pushBack(arr, v):
    arr[length] = v
    length = length + 1`,
    code: `function pushBack(arr, v) {
  arr.push(v); // amortized O(1)
  return arr;
}`,
    backend:
      "Accumulating rows in a batch-processing buffer, or collecting items into a list before flushing to a queue or database.",
  },
  delete: {
    key: "delete",
    label: "Delete from index",
    enabled: true,
    needs: ["index"],
    time: "O(n)",
    space: "O(1)",
    explanation:
      "Removing an element leaves a gap. To keep the slots contiguous, every element after it shifts one position left. Deleting near the front touches almost the whole array — O(n).",
    pseudocode: `function deleteAt(arr, i):
    for j from i to length - 2:
        arr[j] = arr[j + 1]
    length = length - 1`,
    code: `function deleteAt(arr, i) {
  arr.splice(i, 1); // shifts the tail left: O(n)
  return arr;
}`,
    backend:
      "Removing an item from an in-memory collection. At scale this is why you avoid mid-list deletes in hot paths and reach for a different structure.",
  },
  linearSearch: {
    key: "linearSearch",
    label: "Linear search",
    enabled: true,
    needs: ["target"],
    time: "O(n)",
    space: "O(1)",
    explanation:
      "With no ordering or index to exploit, the only option is to check each element in turn until you find a match or run out. Worst case you inspect every element — O(n).",
    pseudocode: `function linearSearch(arr, target):
    for i from 0 to length - 1:
        if arr[i] == target:
            return i
    return -1`,
    code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    backend:
      "Looking something up in a small, unindexed config array or feature-flag list. Fine when n is tiny; a hashmap or index wins as n grows.",
  },
  insertAt: {
    key: "insertAt",
    label: "Insert at position",
    enabled: true,
    needs: ["index", "value"],
    time: "O(n)",
    space: "O(1)",
    explanation:
      "Inserting in the middle is the mirror of deleting: every element from the target index onward shifts one slot right to make room before the new value is written.",
    pseudocode: `function insertAt(arr, i, v):
    for j from length down to i + 1:
        arr[j] = arr[j - 1]
    arr[i] = v
    length = length + 1`,
    code: `function insertAt(arr, i, v) {
  arr.splice(i, 0, v); // shifts the tail right: O(n)
  return arr;
}`,
    backend: "Inserting into an ordered in-memory buffer while preserving order.",
  },
  binarySearch: {
    key: "binarySearch",
    label: "Binary search",
    enabled: true,
    needs: ["target"],
    time: "O(log n)",
    space: "O(1)",
    explanation:
      "On a sorted array you can halve the search space each step: compare the middle element and discard the half that can't contain the target. Only works if the data is sorted.",
    pseudocode: `function binarySearch(arr, target):
    lo = 0; hi = length - 1
    while lo <= hi:
        mid = (lo + hi) / 2
        if arr[mid] == target: return mid
        if arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
    code: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    backend:
      "Finding pagination boundaries or the first record past a threshold in a sorted dataset.",
  },
};

// Order used by the operation selector.
export const operationOrder = [
  "access",
  "insertEnd",
  "delete",
  "linearSearch",
  "insertAt",
  "binarySearch",
];

export const complexityRows = [
  { operation: "Access by index", time: "O(1)", space: "O(1)" },
  { operation: "Insert at end", time: "O(1) amortized", space: "O(1)" },
  { operation: "Insert at position", time: "O(n)", space: "O(1)", note: "shift right" },
  { operation: "Delete from index", time: "O(n)", space: "O(1)", note: "shift left" },
  { operation: "Linear search", time: "O(n)", space: "O(1)", note: "unsorted" },
  { operation: "Binary search", time: "O(log n)", space: "O(1)", note: "sorted only" },
];

export const concept =
  "An array is an ordered, fixed-layout collection of elements stored back to back in memory and addressed by integer index (0 to n−1). That contiguous layout is the whole story: it makes index access instant, but makes inserting or removing in the middle expensive because elements have to shift.";

export const representation =
  "Picture one continuous strip of memory split into equal-size slots. The array only needs to know where the strip starts and how big each slot is; the slot for index i is found by arithmetic, not by following links. This is why arrays have excellent cache locality and why most languages back their dynamic lists with one.";

export const backendUseCases = [
  { term: "In-memory collections", detail: "the default container for a bounded set of items in a request handler" },
  { term: "Response lists", detail: "the ordered array of records you serialize into a JSON response" },
  { term: "Pagination", detail: "offset/limit maps directly onto array indexing and slicing" },
  { term: "Batch processing buffers", detail: "accumulate records, then flush the buffer in one go" },
  { term: "Config arrays", detail: "small ordered lists of rules, flags, or routes scanned linearly" },
  { term: "Request payload processing", detail: "iterating the array of items in an incoming payload" },
];

export const commonMistakes = [
  "Assuming you can binary-search an array that isn't sorted.",
  "Forgetting that insert/delete in the middle is O(n) — doing it inside a loop quietly becomes O(n²).",
  "Off-by-one errors on bounds: valid indices are 0 to n−1, so the guard is i < n, not i <= n.",
  "Treating array length as a lookup key — arrays answer 'what's at position i', not 'where is value v'.",
];

export const interviewQuestions = [
  "Why is array access O(1) but linked-list access O(n)?",
  "How does a dynamic array achieve amortized O(1) append despite occasional resizes?",
  "When would you pick an array over a hashmap, and vice versa?",
  "How do pagination offsets map to array indexing, and where does offset pagination break down at scale?",
];

export const practicePrompts = [
  "Implement delete-at-index without using Array.prototype.splice.",
  "Given a sorted array, return the first index whose value is ≥ a threshold (binary-search intuition).",
  "Count how many times each value appears in one pass (sets up the HashMap topic).",
];
