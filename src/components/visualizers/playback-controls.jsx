"use client";

import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Shared playback vocabulary for step-driven visualizers (e.g. sorting,
// linked-list traversal). Stateless: the parent owns playback state.
// onStepBack/canStepBack are optional — omit them to hide the step-back button.
export function PlaybackControls({
  isPlaying = false,
  onPlayPause,
  onStep,
  onStepBack,
  onReset,
  canStep = true,
  canStepBack = true,
  canReset = true,
  speed,
  onSpeedChange,
  minSpeed = 100,
  maxSpeed = 1200,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        {onStepBack ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onStepBack}
            disabled={!canStepBack}
            aria-label="Step backward"
          >
            <SkipBack />
            Back
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause /> : <Play />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onStep}
          disabled={!canStep}
          aria-label="Step forward"
        >
          <SkipForward />
          Step
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onReset}
          disabled={!canReset}
          aria-label="Reset"
        >
          <RotateCcw />
          Reset
        </Button>
      </div>

      {typeof speed === "number" && onSpeedChange ? (
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Speed</span>
          {/* Slider is "delay" in ms; invert so right = faster. */}
          <Slider
            className="w-32"
            min={minSpeed}
            max={maxSpeed}
            step={50}
            value={[maxSpeed + minSpeed - speed]}
            onValueChange={([v]) => onSpeedChange(maxSpeed + minSpeed - v)}
            aria-label="Playback speed"
          />
        </label>
      ) : null}
    </div>
  );
}
