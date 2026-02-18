import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSortingStore } from '@/store/useSortingStore';
import { sortingAlgorithms } from '@/algorithms/sorting';
import { AppLayout } from '@/components/layout/AppLayout';
import { SortingVisualizer } from '@/components/visualizer/SortingVisualizer';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { CodePanel } from '@/components/panels/CodePanel';
import { AlgorithmInfo } from '@/components/panels/AlgorithmInfo';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Shuffle } from 'lucide-react';

export default function SortingPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const navigate = useNavigate();
  const store = useSortingStore();

  const algo = useMemo(
    () => sortingAlgorithms.find(a => a.id === algorithmId) ?? sortingAlgorithms[0],
    [algorithmId]
  );

  useEffect(() => {
    if (algorithmId && algo.id !== store.selectedAlgorithm) {
      store.setAlgorithm(algo.id);
    }
  }, [algo.id]);

  useEffect(() => {
    if (!algorithmId) navigate('/sorting/bubble', { replace: true });
  }, [algorithmId]);

  const step = store.steps[store.currentStep];

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
        {/* Main visualization area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top controls */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-border flex-wrap">
            <h2 className="text-lg font-semibold">{algo.name}</h2>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-muted-foreground">Size: {store.arraySize}</span>
              <Slider
                value={[store.arraySize]}
                min={5}
                max={200}
                step={1}
                onValueChange={([v]) => store.setArraySize(v)}
                className="w-28"
              />
              <Button variant="outline" size="sm" onClick={store.generateArray} className="gap-1.5">
                <Shuffle className="h-3.5 w-3.5" />
                New Array
              </Button>
              <Button size="sm" onClick={store.runAlgorithm}>
                Visualize
              </Button>
            </div>
          </div>

          {/* SVG Visualization */}
          <div className="flex-1 flex items-center justify-center min-h-[200px] bg-secondary/10">
            <SortingVisualizer />
          </div>

          {/* Playback controls */}
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
          <CodePanel code={algo.code} activeLine={step?.codeLine ?? -1} />
          <AlgorithmInfo
            algorithm={algo}
            stats={step ? { comparisons: step.comparisons, swaps: step.swaps } : undefined}
            description={step?.description}
          />
        </div>
      </div>
    </AppLayout>
  );
}
