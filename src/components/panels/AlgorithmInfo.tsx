import { Badge } from '@/components/ui/badge';
import { SortingAlgorithm } from '@/algorithms/types';
import { PathfindingAlgorithm } from '@/algorithms/types';

interface AlgorithmInfoProps {
  algorithm: SortingAlgorithm | PathfindingAlgorithm;
  stats?: { comparisons?: number; swaps?: number };
  description?: string;
}

export function AlgorithmInfo({ algorithm, stats, description }: AlgorithmInfoProps) {
  const isSorting = 'timeComplexity' in algorithm && typeof algorithm.timeComplexity === 'object';
  const sortAlgo = algorithm as SortingAlgorithm;
  const pathAlgo = algorithm as PathfindingAlgorithm;

  return (
    <div className="rounded-lg bg-secondary/30 border border-border overflow-hidden">
      <div className="px-3 py-2 border-b border-border">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Algorithm Info</span>
      </div>
      <div className="p-3 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{algorithm.description}</p>

        {/* Step description */}
        {description && (
          <div className="rounded-md bg-primary/5 border border-primary/10 px-3 py-2">
            <p className="text-sm text-foreground">{description}</p>
          </div>
        )}

        {/* Complexity */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Complexity</h4>
          {isSorting ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best</span>
                <Badge variant="secondary" className="font-mono text-[11px] h-5">{sortAlgo.timeComplexity.best}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average</span>
                <Badge variant="secondary" className="font-mono text-[11px] h-5">{sortAlgo.timeComplexity.average}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Worst</span>
                <Badge variant="secondary" className="font-mono text-[11px] h-5">{sortAlgo.timeComplexity.worst}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Space</span>
                <Badge variant="secondary" className="font-mono text-[11px] h-5">{sortAlgo.spaceComplexity}</Badge>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <Badge variant="secondary" className="font-mono text-[11px] h-5">{pathAlgo.timeComplexity}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Space</span>
                <Badge variant="secondary" className="font-mono text-[11px] h-5">{pathAlgo.spaceComplexity}</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {stats.comparisons !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comparisons</span>
                  <span className="font-mono text-foreground">{stats.comparisons}</span>
                </div>
              )}
              {stats.swaps !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Swaps</span>
                  <span className="font-mono text-foreground">{stats.swaps}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Legend</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {isSorting ? (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vis-compare" /> Comparing</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vis-swap" /> Swapping</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vis-sorted" /> Sorted</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vis-active" /> Active</span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vis-visited/60" /> Visited</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vis-frontier" /> Frontier</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vis-path" /> Path</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vis-start" /> Start</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vis-end" /> End</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
