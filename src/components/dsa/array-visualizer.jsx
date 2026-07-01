"use client";

import { useEffect, useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { VisualizerShell } from "@/components/visualizers/visualizer-shell";
import { PlaybackControls } from "@/components/visualizers/playback-controls";
import { CodeBlock } from "@/components/visualizers/code-block";
import { ComplexityTable } from "@/components/visualizers/complexity-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  arrayOperations,
  operationOrder,
  complexityRows,
  DEFAULT_ARRAY,
} from "@/lib/dsa/array-content";
import {
  makeCells,
  isSorted,
  buildAccessSteps,
  buildInsertEndSteps,
  buildInsertAtSteps,
  buildDeleteSteps,
  buildLinearSearchSteps,
  buildBinarySearchSteps,
} from "@/lib/algorithms/array";

// Maps an operation key to its pure step builder.
const builders = {
  access: (cells, inputs) => buildAccessSteps(cells, inputs.index),
  insertEnd: (cells, inputs) => buildInsertEndSteps(cells, inputs.value),
  insertAt: (cells, inputs) => buildInsertAtSteps(cells, inputs.index, inputs.value),
  delete: (cells, inputs) => buildDeleteSteps(cells, inputs.index),
  linearSearch: (cells, inputs) => buildLinearSearchSteps(cells, inputs.target),
  binarySearch: (cells, inputs) => buildBinarySearchSteps(cells, inputs.target),
};

// Operations that change the array; their final step becomes the new base.
const mutatingOps = new Set(["insertEnd", "insertAt", "delete"]);

const DEFAULT_INPUTS = { index: "", value: "", target: "" };

function initState() {
  return {
    base: makeCells(DEFAULT_ARRAY),
    operation: "access",
    inputs: { ...DEFAULT_INPUTS },
    steps: [],
    cursor: -1,
    isPlaying: false,
    speed: 600,
    error: null,
  };
}

// Validates the inputs an operation needs and returns parsed values or an error.
function validate(operation, inputs, length) {
  const op = arrayOperations[operation];
  const parsed = {};
  for (const need of op.needs) {
    const raw = inputs[need];
    if (raw === "" || raw === null || raw === undefined) {
      return { error: `Enter a ${need} to run ${op.label}.` };
    }
    const num = Number(raw);
    if (!Number.isFinite(num)) {
      return { error: `${need} must be a number.` };
    }
    if (need === "index") {
      // Insert-at may target the tail slot (index === length); other ops can't.
      const max = operation === "insertAt" ? length : length - 1;
      if (!Number.isInteger(num) || num < 0 || num > max) {
        if (operation === "insertAt") {
          return {
            error: `Index must be an integer between 0 and ${length} (use ${length} to append at the end).`,
          };
        }
        return {
          error:
            length === 0
              ? "The array is empty — nothing to index."
              : `Index must be an integer between 0 and ${length - 1}.`,
        };
      }
    }
    parsed[need] = num;
  }
  return { parsed };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_OPERATION":
      return {
        ...state,
        operation: action.operation,
        inputs: { ...DEFAULT_INPUTS },
        steps: [],
        cursor: -1,
        isPlaying: false,
        error: null,
      };

    case "SET_INPUT":
      return {
        ...state,
        inputs: { ...state.inputs, [action.field]: action.value },
        error: null,
      };

    case "RUN": {
      const { error, parsed } = validate(
        state.operation,
        state.inputs,
        state.base.length
      );
      if (error) return { ...state, error, steps: [], cursor: -1, isPlaying: false };
      if (state.operation === "binarySearch" && !isSorted(state.base)) {
        return {
          ...state,
          error: 'Binary search needs a sorted array — click "Sort ascending" first.',
          steps: [],
          cursor: -1,
          isPlaying: false,
        };
      }
      const steps = builders[state.operation](state.base, parsed);
      return {
        ...state,
        steps,
        cursor: 0,
        isPlaying: steps.length > 1,
        error: null,
      };
    }

    case "STEP_FORWARD": {
      if (state.cursor >= state.steps.length - 1) {
        return { ...state, isPlaying: false };
      }
      return { ...state, cursor: state.cursor + 1, isPlaying: false };
    }

    case "STEP_BACKWARD": {
      if (state.cursor <= 0) return state;
      return { ...state, cursor: state.cursor - 1, isPlaying: false };
    }

    case "TICK": {
      if (state.cursor >= state.steps.length - 1) {
        return { ...state, isPlaying: false };
      }
      return { ...state, cursor: state.cursor + 1 };
    }

    case "PLAY_PAUSE": {
      if (state.steps.length === 0) return state;
      // Replaying from the end restarts from the first step.
      if (!state.isPlaying && state.cursor >= state.steps.length - 1) {
        return { ...state, cursor: 0, isPlaying: state.steps.length > 1 };
      }
      return { ...state, isPlaying: !state.isPlaying };
    }

    case "COMMIT": {
      // Fold a completed mutating operation into the base array.
      const last = state.steps[state.steps.length - 1];
      return {
        ...state,
        base: last.cells.map((cell) => ({ ...cell })),
        steps: [],
        cursor: -1,
        isPlaying: false,
        inputs: { ...DEFAULT_INPUTS },
      };
    }

    case "SORT": {
      const sorted = [...state.base].sort((a, b) => a.value - b.value);
      return {
        ...state,
        base: sorted,
        steps: [],
        cursor: -1,
        isPlaying: false,
        error: null,
        inputs: { ...DEFAULT_INPUTS },
      };
    }

    case "RESET":
      return {
        ...initState(),
        operation: state.operation,
        speed: state.speed,
        base: makeCells(DEFAULT_ARRAY),
      };

    case "SET_SPEED":
      return { ...state, speed: action.speed };

    default:
      return state;
  }
}

const statusStyles = {
  info: "border-border bg-muted/40 text-muted-foreground",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  error: "border-destructive/40 bg-destructive/10 text-destructive",
};

// Human-readable state suffix used for screen-reader labels.
const stateLabels = {
  found: "search match",
  inserting: "just inserted",
  removing: "being removed",
  highlight: "active",
  out: "excluded from search",
};

function ArrayCell({ cell, index, state }) {
  const base =
    "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border text-sm font-medium font-mono";
  // Non-color cues (ring presence, weight, opacity) supplement hue so state is
  // distinguishable without relying on color alone (NFR7).
  const tone =
    state === "found"
      ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 ring-2 ring-emerald-500/60 font-semibold dark:text-emerald-300"
      : state === "inserting"
      ? "border-primary bg-primary/15 text-foreground ring-2 ring-primary/60"
      : state === "removing"
      ? "border-destructive bg-destructive/15 text-destructive ring-2 ring-destructive/60 line-through"
      : state === "highlight"
      ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/60 font-semibold"
      : state === "out"
      ? "border-border bg-background text-muted-foreground/40 opacity-40"
      : "border-border bg-background text-foreground";
  const suffix = stateLabels[state];
  return (
    <motion.div
      layout
      role="listitem"
      aria-label={`Index ${index}, value ${cell.value}${suffix ? `, ${suffix}` : ""}`}
      initial={{ opacity: 0, scale: 0.6, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6, y: 8 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      className={cn(base, tone)}
    >
      {cell.value}
    </motion.div>
  );
}

export function ArrayVisualizer() {
  const [state, dispatch] = useReducer(reducer, undefined, initState);
  const { base, operation, inputs, steps, cursor, isPlaying, speed, error } = state;

  const op = arrayOperations[operation];
  const hasRun = cursor >= 0 && steps.length > 0;
  const current = hasRun ? steps[cursor] : null;
  const atEnd = cursor >= steps.length - 1;
  const sorted = isSorted(base);

  // Playback timer.
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => dispatch({ type: "TICK" }), speed);
    return () => clearTimeout(timer);
  }, [isPlaying, cursor, speed]);

  // Cells shown: the current step's snapshot, or the base array before a run.
  const cells = current ? current.cells : base;
  const highlight = current ? new Set(current.highlight) : new Set();

  const windowSet = current && current.window ? new Set(current.window) : null;

  function cellState(cell) {
    if (!current) return "idle";
    if (current.found === cell.id) return "found";
    if (current.inserting === cell.id) return "inserting";
    if (current.removing === cell.id) return "removing";
    if (highlight.has(cell.id)) return "highlight";
    // Binary search: cells outside the live window are discarded — dim them.
    if (windowSet && !windowSet.has(cell.id)) return "out";
    return "idle";
  }

  const canCommit = hasRun && atEnd && mutatingOps.has(operation);

  const controls = (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {operationOrder.map((key) => {
          const entry = arrayOperations[key];
          const active = key === operation;
          return (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              disabled={!entry.enabled}
              onClick={() => dispatch({ type: "SET_OPERATION", operation: key })}
              title={entry.enabled ? entry.label : `${entry.label} — coming soon`}
            >
              {entry.label}
              {!entry.enabled ? " (soon)" : ""}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {op.needs.map((need) => (
          <label key={need} className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span className="capitalize">{need}</span>
            <Input
              type="number"
              className="w-28"
              value={inputs[need]}
              onChange={(e) =>
                dispatch({ type: "SET_INPUT", field: need, value: e.target.value })
              }
              placeholder={need}
            />
          </label>
        ))}
        <Button type="button" size="sm" onClick={() => dispatch({ type: "RUN" })}>
          Run {op.label}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => dispatch({ type: "SORT" })}
          disabled={sorted}
          title={sorted ? "Array is already sorted" : "Sort ascending (enables binary search)"}
        >
          Sort ascending
        </Button>
        {canCommit ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => dispatch({ type: "COMMIT" })}
          >
            Keep result
          </Button>
        ) : null}
      </div>

      <PlaybackControls
        isPlaying={isPlaying}
        onPlayPause={() => dispatch({ type: "PLAY_PAUSE" })}
        onStep={() => dispatch({ type: "STEP_FORWARD" })}
        onStepBack={() => dispatch({ type: "STEP_BACKWARD" })}
        onReset={() => dispatch({ type: "RESET" })}
        canStep={hasRun && !atEnd}
        canStepBack={hasRun && cursor > 0}
        canReset={true}
        speed={speed}
        onSpeedChange={(s) => dispatch({ type: "SET_SPEED", speed: s })}
      />
    </div>
  );

  const message = error
    ? error
    : current
    ? current.description
    : operation === "binarySearch" && !sorted
    ? 'Binary search needs a sorted array — click "Sort ascending", then enter a target and Run.'
    : "Ready. Pick an operation, enter its inputs, then Run.";

  const footer = (
    <div className="flex flex-col gap-1.5">
      <span>
        {hasRun
          ? `Step ${cursor + 1} of ${steps.length}`
          : `Array of ${base.length} elements · indices 0…${Math.max(base.length - 1, 0)}`}
      </span>
      <span className="font-mono text-xs">
        {op.label}: time {op.time} · space {op.space}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <VisualizerShell
        title="Array Visualizer"
        description="Run an operation step by step and watch how the array's contiguous slots respond."
        controls={controls}
        message={message}
        footer={footer}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2" role="list" aria-label="Array cells">
            <AnimatePresence mode="popLayout" initial={false}>
              {cells.map((cell, i) => (
                <ArrayCell key={cell.id} cell={cell} index={i} state={cellState(cell)} />
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-2" aria-hidden="true">
            {cells.map((cell, i) => (
              <span
                key={cell.id}
                className="w-14 text-center font-mono text-[0.7rem] text-muted-foreground"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </VisualizerShell>

      <div className="grid gap-4 lg:grid-cols-2">
        <div
          className={cn(
            "flex flex-col gap-2 rounded-lg border p-4 text-sm",
            current ? statusStyles[current.status] : statusStyles.info
          )}
        >
          <h3 className="font-heading text-sm font-medium text-foreground">
            How {op.label} works
          </h3>
          <p>{op.explanation}</p>
          <p className="text-xs">
            <span className="font-medium text-foreground">Backend angle: </span>
            {op.backend}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <CodeBlock label={`${op.label} — pseudocode`} code={op.pseudocode} />
          <CodeBlock label={`${op.label} — JavaScript`} code={op.code} />
        </div>
      </div>

      <ComplexityTable rows={complexityRows} highlight={op.label} />
    </div>
  );
}
