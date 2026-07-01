"use client";

import { useEffect, useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { VisualizerShell } from "@/components/visualizers/visualizer-shell";
import { PlaybackControls } from "@/components/visualizers/playback-controls";
import { CodeBlock } from "@/components/visualizers/code-block";
import { PseudocodeBlock } from "@/components/visualizers/pseudocode-block";
import { ComplexityTable } from "@/components/visualizers/complexity-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  makeItems,
  buildPushSteps,
  buildPopSteps,
  buildPeekSteps,
  buildEnqueueSteps,
  buildDequeueSteps,
  buildFrontSteps,
} from "@/lib/algorithms/linear-structure";
import * as stack from "@/lib/dsa/stack-content";
import * as queue from "@/lib/dsa/queue-content";

// Per-kind configuration. The reducer, playback, and panels are kind-agnostic;
// only the layout orientation, end labels, operation set, and content differ.
const CONFIGS = {
  stack: {
    title: "Stack Visualizer",
    description:
      "Push, pop, and peek at the single open end. Run an operation to step through it.",
    orientation: "vertical", // newest on top
    reminder: "LIFO · all operations O(1)",
    defaultValues: stack.DEFAULT_STACK,
    operations: stack.stackOperations,
    operationOrder: stack.operationOrder,
    complexityRows: stack.complexityRows,
    spaceNote: stack.spaceNote,
    mutatingOps: new Set(["push", "pop"]),
    // Maps a position to the end label badge it carries.
    endLabels: { top: "top" },
    farLabel: "bottom", // static label at the closed end
    stateLabels: {
      entering: "just pushed",
      exiting: "being popped",
      highlight: "top, being read",
    },
    builders: {
      push: (items, inputs) => buildPushSteps(items, inputs.value),
      pop: (items) => buildPopSteps(items),
      peek: (items) => buildPeekSteps(items),
    },
  },
  queue: {
    title: "Queue Visualizer",
    description:
      "Enqueue at the rear, dequeue from the front, or read the front. Run an operation to step through it.",
    orientation: "horizontal", // front on the left, rear on the right
    reminder: "FIFO · all operations O(1)",
    defaultValues: queue.DEFAULT_QUEUE,
    operations: queue.queueOperations,
    operationOrder: queue.operationOrder,
    complexityRows: queue.complexityRows,
    spaceNote: queue.spaceNote,
    mutatingOps: new Set(["enqueue", "dequeue"]),
    endLabels: { front: "front", rear: "rear", both: "front · rear" },
    stateLabels: {
      entering: "just enqueued",
      exiting: "being dequeued",
      highlight: "front, being read",
    },
    builders: {
      enqueue: (items, inputs) => buildEnqueueSteps(items, inputs.value),
      dequeue: (items) => buildDequeueSteps(items),
      front: (items) => buildFrontSteps(items),
    },
  },
};

const DEFAULT_INPUTS = { value: "" };

function initState(kind) {
  const config = CONFIGS[kind];
  return {
    base: makeItems(config.defaultValues),
    operation: config.operationOrder[0],
    inputs: { ...DEFAULT_INPUTS },
    steps: [],
    cursor: -1,
    isPlaying: false,
    speed: 600,
    error: null,
  };
}

// Validates the inputs the operation needs; returns parsed values or an error.
function validate(operation, operations, inputs) {
  const op = operations[operation];
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
    parsed[need] = num;
  }
  return { parsed };
}

function makeReducer(config) {
  return function reducer(state, action) {
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
          config.operations,
          state.inputs
        );
        if (error) {
          return { ...state, error, steps: [], cursor: -1, isPlaying: false };
        }
        const steps = config.builders[state.operation](state.base, parsed);
        return { ...state, steps, cursor: 0, isPlaying: steps.length > 1, error: null };
      }

      case "STEP_FORWARD":
        if (state.cursor >= state.steps.length - 1) return { ...state, isPlaying: false };
        return { ...state, cursor: state.cursor + 1, isPlaying: false };

      case "STEP_BACKWARD":
        if (state.cursor <= 0) return state;
        return { ...state, cursor: state.cursor - 1, isPlaying: false };

      case "TICK":
        if (state.cursor >= state.steps.length - 1) return { ...state, isPlaying: false };
        return { ...state, cursor: state.cursor + 1 };

      case "PLAY_PAUSE": {
        if (state.steps.length === 0) return state;
        if (!state.isPlaying && state.cursor >= state.steps.length - 1) {
          return { ...state, cursor: 0, isPlaying: state.steps.length > 1 };
        }
        return { ...state, isPlaying: !state.isPlaying };
      }

      case "COMMIT": {
        const last = state.steps[state.steps.length - 1];
        return {
          ...state,
          base: last.items.map((item) => ({ ...item })),
          steps: [],
          cursor: -1,
          isPlaying: false,
          inputs: { ...DEFAULT_INPUTS },
        };
      }

      case "RESET":
        return {
          ...initState(action.kind),
          operation: state.operation,
          speed: state.speed,
        };

      case "SET_SPEED":
        return { ...state, speed: action.speed };

      default:
        return state;
    }
  };
}

// Enter/exit motion per orientation: vertical (stack) drops in from the top;
// horizontal (queue) slides in from the rear (right) and out toward the front (left).
const MOTION = {
  vertical: {
    initial: { opacity: 0, scale: 0.6, y: -12 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.6, y: -12 },
  },
  horizontal: {
    initial: { opacity: 0, scale: 0.6, x: 12 },
    animate: { opacity: 1, scale: 1, x: 0 },
    exit: { opacity: 0, scale: 0.6, x: -12 },
  },
};

// Where the end-label badge sits relative to the cell, by orientation.
const BADGE_POSITION = {
  vertical: "absolute left-full ml-2 whitespace-nowrap",
  horizontal: "absolute bottom-full mb-1 whitespace-nowrap",
};

function StructureCell({ cell, orientation, endLabel, badge, state, stateLabels }) {
  const tone =
    state === "entering"
      ? "border-primary bg-primary/15 text-foreground ring-2 ring-primary/60"
      : state === "exiting"
      ? "border-destructive bg-destructive/15 text-destructive ring-2 ring-destructive/60 line-through"
      : state === "highlight"
      ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/60 font-semibold"
      : "border-border bg-background text-foreground";
  const suffix = stateLabels[state];
  const motionProps = MOTION[orientation];
  return (
    <motion.li
      layout
      role="listitem"
      aria-label={`Value ${cell.value}${endLabel ? `, ${endLabel}` : ""}${suffix ? `, ${suffix}` : ""}`}
      initial={motionProps.initial}
      animate={motionProps.animate}
      exit={motionProps.exit}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      className={cn(
        "relative flex h-12 w-28 items-center justify-center rounded-lg border text-sm font-medium font-mono",
        tone
      )}
    >
      {cell.value}
      {badge ? (
        <span
          className={cn(
            "text-xs font-medium text-primary",
            BADGE_POSITION[orientation]
          )}
        >
          {orientation === "vertical" ? `← ${badge}` : badge}
        </span>
      ) : null}
    </motion.li>
  );
}

export function LinearStructureVisualizer({ kind = "stack" }) {
  const config = CONFIGS[kind];
  const [state, dispatch] = useReducer(makeReducer(config), kind, initState);
  const { base, operation, inputs, steps, cursor, isPlaying, speed, error } = state;

  const op = config.operations[operation];
  const hasRun = cursor >= 0 && steps.length > 0;
  const current = hasRun ? steps[cursor] : null;
  const atEnd = cursor >= steps.length - 1;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => dispatch({ type: "TICK" }), speed);
    return () => clearTimeout(timer);
  }, [isPlaying, cursor, speed]);

  const items = current ? current.items : base;
  const highlight = current ? new Set(current.highlight) : new Set();
  const isVertical = config.orientation === "vertical";
  // Stack: top = last element. Queue: front = first element, rear = last.
  const frontId = items.length > 0 ? items[0].id : null;
  const rearId = items.length > 0 ? items[items.length - 1].id : null;
  // Stack renders newest-on-top: reverse so the top cell is first in the column.
  const displayItems = isVertical ? [...items].reverse() : items;

  // The end-label badge a given cell carries, if any (e.g. "top", "front · rear").
  function endLabelFor(cell) {
    if (isVertical) {
      return cell.id === rearId ? config.endLabels.top : null;
    }
    if (cell.id === frontId && cell.id === rearId) return config.endLabels.both;
    if (cell.id === frontId) return config.endLabels.front;
    if (cell.id === rearId) return config.endLabels.rear;
    return null;
  }

  function cellState(cell) {
    if (!current) return "idle";
    if (current.exiting === cell.id) return "exiting";
    if (current.entering === cell.id) return "entering";
    if (highlight.has(cell.id)) return "highlight";
    return "idle";
  }

  const canCommit =
    hasRun && atEnd && config.mutatingOps.has(operation) && current.status !== "error";

  const controls = (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {config.operationOrder.map((key) => {
          const entry = config.operations[key];
          const active = key === operation;
          return (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              disabled={!entry.enabled}
              onClick={() => dispatch({ type: "SET_OPERATION", operation: key })}
              title={entry.label}
            >
              {entry.label}
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
          Generate steps
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
        onReset={() => dispatch({ type: "RESET", kind })}
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
    : "Ready. Pick an operation, enter a value if needed, then Generate steps.";

  const noun = isVertical ? "on the stack" : "in the queue";
  const footer = (
    <div className="flex flex-col gap-1.5">
      <span>
        {hasRun
          ? `Step ${cursor + 1} of ${steps.length}`
          : `${items.length} element${items.length === 1 ? "" : "s"} ${noun}`}
      </span>
      <span className="font-mono text-xs">{config.reminder}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <VisualizerShell
        title={config.title}
        description={config.description}
        controls={controls}
        message={message}
        footer={footer}
      >
        {isVertical ? (
          <div className="flex flex-col items-center gap-2">
            {items.length === 0 ? (
              <div className="flex h-12 w-28 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                empty
              </div>
            ) : (
              <ul
                role="list"
                aria-label="Stack contents, top first"
                className="flex flex-col gap-2"
              >
                <AnimatePresence initial={false}>
                  {displayItems.map((cell) => (
                    <StructureCell
                      key={cell.id}
                      cell={cell}
                      orientation="vertical"
                      endLabel={endLabelFor(cell)}
                      badge={endLabelFor(cell)}
                      state={cellState(cell)}
                      stateLabels={config.stateLabels}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}
            <span className="text-xs text-muted-foreground" aria-hidden="true">
              bottom
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 pt-5">
            {items.length === 0 ? (
              <div className="flex h-12 w-28 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                empty
              </div>
            ) : (
              <ul
                role="list"
                aria-label="Queue contents, front first"
                className="flex flex-row gap-2"
              >
                <AnimatePresence initial={false}>
                  {displayItems.map((cell) => (
                    <StructureCell
                      key={cell.id}
                      cell={cell}
                      orientation="horizontal"
                      endLabel={endLabelFor(cell)}
                      badge={endLabelFor(cell)}
                      state={cellState(cell)}
                      stateLabels={config.stateLabels}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}
            <span className="text-xs text-muted-foreground" aria-hidden="true">
              dequeue ← front · · · rear ← enqueue
            </span>
          </div>
        )}
      </VisualizerShell>

      <div className="grid gap-4 lg:grid-cols-2">
        <div
          className={cn(
            "flex flex-col gap-2 rounded-lg border p-4 text-sm",
            current && current.status === "error"
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : current && current.status === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-border bg-muted/40 text-muted-foreground"
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
          <PseudocodeBlock
            label={`${op.label} — pseudocode`}
            code={op.pseudocode}
            activeLine={current ? current.pseudoLine : null}
          />
          <CodeBlock label={`${op.label} — JavaScript`} code={op.code} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ComplexityTable rows={config.complexityRows} highlight={op.label} />
        <p className="text-xs text-muted-foreground">{config.spaceNote}</p>
      </div>
    </div>
  );
}
