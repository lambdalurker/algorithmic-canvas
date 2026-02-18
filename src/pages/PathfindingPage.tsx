import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGraphStore } from '@/store/useGraphStore';
import { pathfindingAlgorithms } from '@/algorithms/pathfinding';
import { AppLayout } from '@/components/layout/AppLayout';
import { PathfindingGrid } from '@/components/visualizer/PathfindingGrid';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { AlgorithmInfo } from '@/components/panels/AlgorithmInfo';
import { Button } from '@/components/ui/button';
import { Eraser, Play, RotateCcw } from 'lucide-react';

export default function PathfindingPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const navigate = useNavigate();
  const store = useGraphStore();

  const algo = useMemo(
    () => pathfindingAlgorithms.find(a => a.id === algorithmId) ?? pathfindingAlgorithms[0],
    [algorithmId]
  );

  useEffect(() => {
    if (algorithmId && algo.id !== store.selectedAlgorithm) {
      store.setAlgorithm(algo.id);
    }
  }, [algo.id]);

  useEffect(() => {
    if (!algorithmId) navigate('/pathfinding/bfs', { replace: true });
  }, [algorithmId]);

  const step = store.steps[store.currentStep];

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top controls */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-border flex-wrap">
            <h2 className="text-lg font-semibold">{algo.name}</h2>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={store.clearWalls} className="gap-1.5">
                <Eraser className="h-3.5 w-3.5" />
                Clear Walls
              </Button>
              <Button variant="outline" size="sm" onClick={() => { store.reset(); }} className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
              <Button size="sm" onClick={store.runAlgorithm} className="gap-1.5">
                <Play className="h-3.5 w-3.5" />
                Visualize
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 flex items-center justify-center bg-secondary/10 overflow-auto">
            <PathfindingGrid />
          </div>

          {/* Playback */}
          <div className="px-4 py-3 border-t border-border">
            <PlaybackControls
              isPlaying={store.isPlaying}
              currentStep={store.currentStep}
              totalSteps={store.steps.length}
              speed={store.speed}
              onTogglePlay={store.togglePlay}
              onStepForward={store.stepForward}
              onStepBackward={store.stepBackward}
              onReset={store.reset}
              onSetSpeed={store.setSpeed}
              onSetStep={store.setCurrentStep}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border overflow-y-auto p-4 space-y-4">
          <AlgorithmInfo
            algorithm={algo}
            description={step?.description}
          />
          <div className="rounded-lg bg-secondary/30 border border-border p-3">
            <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">How to use</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Click on the grid to draw walls</li>
              <li>• Green cell = start, Red cell = end</li>
              <li>• Click "Visualize" to run the algorithm</li>
              <li>• Use playback controls to step through</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
