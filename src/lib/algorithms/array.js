// Pure step builders for the Array Visualizer (see specs/002-array-visualizer).
// No React/DOM dependency — each builder takes the current cells + inputs and
// returns an ordered list of steps. Playback just indexes into the list.
//
// A "cell" is { id, value }. Stable ids let the UI animate inserts/deletes via
// AnimatePresence: a cell that disappears between consecutive steps animates
// out; one that appears animates in.
//
// Step shape:
//   {
//     cells:       { id, value }[]   // snapshot of the array AT this step
//     highlight:   string[]          // cell ids to emphasize (access/compare/inserted)
//     inserting:   string | null     // id of a cell animating in
//     removing:    string | null     // id of a cell animating out
//     found:       string | null     // id of a search match, when applicable
//     window:      string[] | null   // ids still "in play" (binary search range)
//     description: string            // human-readable "what this step does"
//     status:      "info" | "success" | "error"
//   }

let _idCounter = 0;

export function makeCell(value) {
  _idCounter += 1;
  return { id: `cell-${_idCounter}`, value };
}

export function makeCells(values) {
  return values.map((value) => makeCell(value));
}

function step(cells, options) {
  return {
    cells: cells.map((cell) => ({ ...cell })),
    highlight: options.highlight ?? [],
    inserting: options.inserting ?? null,
    removing: options.removing ?? null,
    found: options.found ?? null,
    window: options.window ?? null,
    description: options.description,
    status: options.status ?? "info",
  };
}

// O(1): direct jump to the slot at `index`. No mutation.
export function buildAccessSteps(cells, index) {
  const target = cells[index];
  return [
    step(cells, {
      highlight: [target.id],
      description: `Access index ${index}: the array computes the slot address directly and returns ${target.value}. No scanning — O(1).`,
      status: "success",
    }),
  ];
}

// O(1) amortized: append a new value at the tail.
export function buildInsertEndSteps(cells, value) {
  const newCell = makeCell(value);
  const next = [...cells, newCell];
  return [
    step(cells, {
      description: `Insert ${value} at the end — the next free slot is index ${cells.length}.`,
    }),
    step(next, {
      highlight: [newCell.id],
      inserting: newCell.id,
      description: `Wrote ${value} at index ${cells.length}. Appending to the end touches no other element — O(1) amortized.`,
      status: "success",
    }),
  ];
}

// O(n): remove the value at `index`; following elements shift left.
export function buildDeleteSteps(cells, index) {
  const removed = cells[index];
  const next = cells.filter((_, i) => i !== index);
  const shifted = next.slice(index).map((cell) => cell.id);
  return [
    step(cells, {
      highlight: [removed.id],
      removing: removed.id,
      description: `Delete index ${index} (value ${removed.value}).`,
    }),
    step(next, {
      highlight: shifted,
      description:
        shifted.length > 0
          ? `Removed. Every element after index ${index} shifts one slot left to close the gap — O(n).`
          : `Removed the last element. Nothing to shift here, but deleting from the middle would be O(n).`,
      status: "success",
    }),
  ];
}

// O(n): scan left to right comparing each element with `target`.
export function buildLinearSearchSteps(cells, target) {
  const steps = [];
  for (let i = 0; i < cells.length; i += 1) {
    const match = cells[i].value === target;
    steps.push(
      step(cells, {
        highlight: [cells[i].id],
        found: match ? cells[i].id : null,
        description: match
          ? `Compare index ${i}: ${cells[i].value} === ${target}. Match found at index ${i}.`
          : `Compare index ${i}: ${cells[i].value} !== ${target}. Keep scanning.`,
        status: match ? "success" : "info",
      })
    );
    if (match) return steps;
  }
  steps.push(
    step(cells, {
      description: `Scanned all ${cells.length} elements without finding ${target}. Linear search is O(n) and can't do better on unsorted data.`,
      status: "error",
    })
  );
  return steps;
}

// O(n): insert at an arbitrary position. Elements from `index` onward shift one
// slot right to free the target slot, then the value is written. `index` may be
// in 0..length (length appends at the tail).
export function buildInsertAtSteps(cells, index, value) {
  const newCell = makeCell(value);
  const next = [...cells.slice(0, index), newCell, ...cells.slice(index)];
  const shifted = cells.slice(index).map((cell) => cell.id);
  return [
    step(cells, {
      highlight: shifted,
      description:
        shifted.length > 0
          ? `Insert ${value} at index ${index}: every element from index ${index} onward shifts one slot right to make room — O(n).`
          : `Insert ${value} at index ${index} (the tail) — there is nothing after it to shift.`,
    }),
    step(next, {
      highlight: [newCell.id],
      inserting: newCell.id,
      description: `Wrote ${value} into the freed slot at index ${index}.`,
      status: "success",
    }),
  ];
}

// Ascending check — binary search is only valid on sorted data.
export function isSorted(cells) {
  for (let i = 1; i < cells.length; i += 1) {
    if (cells[i - 1].value > cells[i].value) return false;
  }
  return true;
}

// O(log n): halve the search window each step. Assumes `cells` is sorted
// ascending (the caller guards this). `window` marks the indices still in play
// so the UI can dim everything that's been discarded.
export function buildBinarySearchSteps(cells, target) {
  const steps = [];
  let lo = 0;
  let hi = cells.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const midCell = cells[mid];
    const windowIds = cells.slice(lo, hi + 1).map((cell) => cell.id);
    const match = midCell.value === target;
    const goRight = midCell.value < target;
    steps.push(
      step(cells, {
        highlight: [midCell.id],
        window: windowIds,
        found: match ? midCell.id : null,
        description: match
          ? `Check the middle, index ${mid}: ${midCell.value} === ${target}. Found at index ${mid} — O(log n).`
          : goRight
          ? `Check the middle, index ${mid}: ${midCell.value} < ${target}. Discard the left half; search indices ${mid + 1}…${hi}.`
          : `Check the middle, index ${mid}: ${midCell.value} > ${target}. Discard the right half; search indices ${lo}…${mid - 1}.`,
        status: match ? "success" : "info",
      })
    );
    if (match) return steps;
    if (goRight) lo = mid + 1;
    else hi = mid - 1;
  }
  steps.push(
    step(cells, {
      window: [],
      description: `The search window is empty — ${target} is not in the array. Even so, binary search ruled it out in O(log n) comparisons.`,
      status: "error",
    })
  );
  return steps;
}
