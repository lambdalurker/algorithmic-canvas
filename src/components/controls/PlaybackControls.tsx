import { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronFirst } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
  onSetStep: (step: number) => void;
}

export function PlaybackControls({
  isPlaying, currentStep, totalSteps, speed,
  onTogglePlay, onStepForward, onStepBackward, onReset, onSetSpeed, onSetStep,
}: PlaybackControlsProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      const ms = Math.max(20, 300 / speed);
      intervalRef.current = setInterval(onStepForward, ms);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, speed, onStepForward]);

  // Keyboard shortcuts
  useEffect(() => {
    const playHandler = () => onTogglePlay();
    const fwdHandler = () => onStepForward();
    const bwdHandler = () => onStepBackward();
    document.addEventListener('algo:togglePlay', playHandler);
    document.addEventListener('algo:stepForward', fwdHandler);
    document.addEventListener('algo:stepBackward', bwdHandler);
    return () => {
      document.removeEventListener('algo:togglePlay', playHandler);
      document.removeEventListener('algo:stepForward', fwdHandler);
      document.removeEventListener('algo:stepBackward', bwdHandler);
    };
  }, [onTogglePlay, onStepForward, onStepBackward]);

  const speedLabels = [0.25, 0.5, 1, 2, 4];
  const speedIndex = speedLabels.indexOf(speed);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Progress bar */}
      {totalSteps > 0 && (
        <div className="px-1">
          <Slider
            value={[currentStep]}
            min={0}
            max={Math.max(totalSteps - 1, 0)}
            step={1}
            onValueChange={([v]) => onSetStep(v)}
            className="w-full"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onStepBackward} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={onTogglePlay}
            className="h-9 w-9 rounded-full"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onStepForward} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { onReset(); }} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground font-mono tabular-nums">
          {totalSteps > 0 ? `${currentStep + 1} / ${totalSteps}` : '—'}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Speed</span>
          <div className="flex gap-1">
            {speedLabels.map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className={`text-[11px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                  speed === s
                    ? 'bg-primary/15 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
