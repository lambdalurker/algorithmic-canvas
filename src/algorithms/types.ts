export interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  active: number[];
  description: string;
  codeLine: number;
  comparisons: number;
  swaps: number;
}

export interface SortingAlgorithm {
  id: string;
  name: string;
  description: string;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  code: string[];
  run: (array: number[]) => SortingStep[];
}

export interface PathfindingStep {
  visited: string[];
  current: string | null;
  frontier: string[];
  path: string[];
  description: string;
}

export interface PathfindingAlgorithm {
  id: string;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  weighted: boolean;
  run: (grid: CellType[][], start: [number, number], end: [number, number]) => PathfindingStep[];
}

export type CellType = 'empty' | 'wall' | 'start' | 'end';
