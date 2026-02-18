import { useCallback, useRef } from 'react';
import { useGraphStore } from '@/store/useGraphStore';
import { cn } from '@/lib/utils';

export function PathfindingGrid() {
  const { grid, start, end, steps, currentStep, isDrawing, toggleCell, setDrawing } = useGraphStore();
  const step = steps[currentStep];
  const visitedSet = new Set(step?.visited ?? []);
  const frontierSet = new Set(step?.frontier ?? []);
  const pathSet = new Set(step?.path ?? []);
  const currentCell = step?.current ?? null;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((r: number, c: number) => {
    setDrawing(true);
    toggleCell(r, c);
  }, [setDrawing, toggleCell]);

  const handleMouseEnter = useCallback((r: number, c: number) => {
    if (isDrawing) toggleCell(r, c);
  }, [isDrawing, toggleCell]);

  const handleMouseUp = useCallback(() => {
    setDrawing(false);
  }, [setDrawing]);

  const getCellClass = (r: number, c: number): string => {
    const key = `${r},${c}`;
    if (r === start[0] && c === start[1]) return 'bg-vis-start';
    if (r === end[0] && c === end[1]) return 'bg-vis-end';
    if (grid[r][c] === 'wall') return 'bg-vis-wall';
    if (pathSet.has(key)) return 'bg-vis-path';
    if (currentCell === key) return 'bg-vis-current animate-pulse-soft';
    if (frontierSet.has(key)) return 'bg-vis-frontier/50';
    if (visitedSet.has(key)) return 'bg-vis-visited/40';
    return 'bg-secondary/30 hover:bg-secondary/60';
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-auto p-4"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="inline-grid gap-px mx-auto"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length ?? 0}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, r) =>
          row.map((_, c) => (
            <div
              key={`${r}-${c}`}
              className={cn(
                'w-5 h-5 sm:w-6 sm:h-6 rounded-sm cursor-pointer transition-colors duration-100',
                getCellClass(r, c)
              )}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
            />
          ))
        )}
      </div>
    </div>
  );
}
