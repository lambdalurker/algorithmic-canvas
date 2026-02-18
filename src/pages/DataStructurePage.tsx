import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDSStore } from '@/store/useDSStore';
import { dsAlgorithms } from '@/algorithms/dataStructures';
import { AppLayout } from '@/components/layout/AppLayout';
import { DSVisualizer } from '@/components/visualizer/DSVisualizer';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { CodePanel } from '@/components/panels/CodePanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2, Play } from 'lucide-react';

export default function DataStructurePage() {
  const { dsId } = useParams<{ dsId: string }>();
  const navigate = useNavigate();
  const store = useDSStore();

  const algo = useMemo(
    () => dsAlgorithms.find(a => a.id === dsId) ?? dsAlgorithms[0],
    [dsId]
  );

  useEffect(() => {
    if (dsId && algo.id !== store.selectedDS) {
      store.setDS(algo.id);
    }
  }, [algo.id]);

  useEffect(() => {
    if (!dsId) navigate('/ds/stack', { replace: true });
  }, [dsId]);

  const step = store.steps[store.currentStep];

  const handleAdd = () => {
    const val = parseInt(store.inputValue);
    if (isNaN(val)) return;
    const idx = store.inputIndex ? parseInt(store.inputIndex) : undefined;

    const opType = algo.id === 'queue' ? 'enqueue' :
                   algo.id === 'linked-list' ? 'insert' : 'insert';

    if (algo.id === 'bst' || algo.id === 'avl') {
      store.addOperation({ type: 'insert', value: val });
    } else if (algo.id === 'linked-list') {
      store.addOperation({ type: 'insert', value: val, index: idx });
    } else {
      store.addOperation({ type: opType === 'enqueue' ? 'enqueue' : 'push', value: val });
    }
    store.setInputValue('');
    store.setInputIndex('');
  };

  const handleRemove = () => {
    const idx = store.inputIndex ? parseInt(store.inputIndex) : undefined;
    const opType = algo.id === 'queue' ? 'dequeue' :
                   algo.id === 'linked-list' ? 'delete' :
                   algo.id === 'bst' ? 'search' : 'pop';

    if (algo.id === 'bst' && store.inputValue) {
      store.addOperation({ type: 'search', value: parseInt(store.inputValue) });
    } else if (algo.id === 'linked-list') {
      store.addOperation({ type: 'delete', index: idx ?? 0 });
    } else {
      store.addOperation({ type: opType });
    }
    store.setInputValue('');
  };

  const showIndex = algo.id === 'linked-list';
  const showRemove = algo.id !== 'avl';
  const removeLabel = algo.id === 'stack' ? 'Pop' :
                      algo.id === 'queue' ? 'Dequeue' :
                      algo.id === 'linked-list' ? 'Delete' :
                      algo.id === 'bst' ? 'Search' : 'Remove';

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
        {/* Main visualization */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Controls */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-wrap">
            <h2 className="text-lg font-semibold">{algo.name}</h2>
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <Input
                type="number"
                placeholder="Value"
                value={store.inputValue}
                onChange={e => store.setInputValue(e.target.value)}
                className="w-20 h-8 text-sm"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              {showIndex && (
                <Input
                  type="number"
                  placeholder="Index"
                  value={store.inputIndex}
                  onChange={e => store.setInputIndex(e.target.value)}
                  className="w-20 h-8 text-sm"
                />
              )}
              <Button size="sm" onClick={handleAdd} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                {algo.id === 'stack' ? 'Push' : algo.id === 'queue' ? 'Enqueue' : 'Insert'}
              </Button>
              {showRemove && (
                <Button size="sm" variant="outline" onClick={handleRemove} className="gap-1.5">
                  <Minus className="h-3.5 w-3.5" />
                  {removeLabel}
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={store.runOperations} className="gap-1.5">
                <Play className="h-3.5 w-3.5" />
                Replay
              </Button>
              <Button size="sm" variant="ghost" onClick={store.clearAll} className="gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </div>

          {/* Visualization */}
          <div className="flex-1 flex items-center justify-center min-h-[200px] bg-secondary/10">
            <DSVisualizer />
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
          <CodePanel code={algo.code} activeLine={step?.codeLine ?? -1} />

          {/* Info panel */}
          <div className="rounded-lg bg-secondary/30 border border-border overflow-hidden">
            <div className="px-3 py-2 border-b border-border">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Info</span>
            </div>
            <div className="p-3 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{algo.description}</p>
              {step?.description && (
                <div className="rounded-md bg-primary/5 border border-primary/10 px-3 py-2">
                  <p className="text-sm text-foreground">{step.description}</p>
                </div>
              )}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Complexity</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <Badge variant="secondary" className="font-mono text-[11px] h-5">{algo.timeComplexity}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Space</span>
                    <Badge variant="secondary" className="font-mono text-[11px] h-5">{algo.spaceComplexity}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Operations</h4>
                <div className="flex flex-wrap gap-1.5">
                  {algo.operations.map(op => (
                    <span key={op} className="text-xs px-2 py-0.5 rounded-md bg-secondary/50 text-secondary-foreground font-mono">{op}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
