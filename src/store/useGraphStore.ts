import { create } from 'zustand';
import { CellType, PathfindingStep } from '@/algorithms/types';
import { pathfindingAlgorithms } from '@/algorithms/pathfinding';

const createEmptyGrid = (rows: number, cols: number): CellType[][] =>
  Array.from({ length: rows }, () => Array(cols).fill('empty'));

interface GraphStore {
  grid: CellType[][];
  gridRows: number;
  gridCols: number;
  start: [number, number];
  end: [number, number];
  steps: PathfindingStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  selectedAlgorithm: string;
  isDrawing: boolean;

  initGrid: () => void;
  toggleCell: (r: number, c: number) => void;
  setStart: (pos: [number, number]) => void;
  setEnd: (pos: [number, number]) => void;
  runAlgorithm: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  togglePlay: () => void;
  pause: () => void;
  reset: () => void;
  clearWalls: () => void;
  clearAll: () => void;
  setSpeed: (speed: number) => void;
  setAlgorithm: (id: string) => void;
  setDrawing: (d: boolean) => void;
  setGridSize: (rows: number, cols: number) => void;
  setCurrentStep: (step: number) => void;
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  grid: createEmptyGrid(20, 35),
  gridRows: 20,
  gridCols: 35,
  start: [10, 5],
  end: [10, 29],
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1,
  selectedAlgorithm: 'bfs',
  isDrawing: false,

  initGrid: () => {
    const { gridRows, gridCols } = get();
    set({ grid: createEmptyGrid(gridRows, gridCols), steps: [], currentStep: 0, isPlaying: false });
  },
  toggleCell: (r, c) => {
    const { grid, start, end } = get();
    if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = newGrid[r][c] === 'wall' ? 'empty' : 'wall';
    set({ grid: newGrid });
  },
  setStart: (pos) => {
    const { grid } = get();
    const newGrid = grid.map(row => [...row]);
    newGrid[pos[0]][pos[1]] = 'empty';
    set({ start: pos, grid: newGrid, steps: [], currentStep: 0 });
  },
  setEnd: (pos) => {
    const { grid } = get();
    const newGrid = grid.map(row => [...row]);
    newGrid[pos[0]][pos[1]] = 'empty';
    set({ end: pos, grid: newGrid, steps: [], currentStep: 0 });
  },
  runAlgorithm: () => {
    const { grid, start, end, selectedAlgorithm } = get();
    const algo = pathfindingAlgorithms.find(a => a.id === selectedAlgorithm);
    if (algo) {
      const steps = algo.run(grid, start, end);
      set({ steps, currentStep: 0, isPlaying: true });
    }
  },
  stepForward: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) set({ currentStep: currentStep + 1 });
    else set({ isPlaying: false });
  },
  stepBackward: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },
  togglePlay: () => {
    const { isPlaying, steps } = get();
    if (steps.length === 0) get().runAlgorithm();
    else set({ isPlaying: !isPlaying });
  },
  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentStep: 0, isPlaying: false }),
  clearWalls: () => {
    const { gridRows, gridCols } = get();
    set({ grid: createEmptyGrid(gridRows, gridCols), steps: [], currentStep: 0, isPlaying: false });
  },
  clearAll: () => {
    const { gridRows, gridCols } = get();
    set({ grid: createEmptyGrid(gridRows, gridCols), steps: [], currentStep: 0, isPlaying: false, start: [Math.floor(gridRows / 2), 3], end: [Math.floor(gridRows / 2), gridCols - 4] });
  },
  setSpeed: (speed) => set({ speed }),
  setAlgorithm: (id) => set({ selectedAlgorithm: id, steps: [], currentStep: 0, isPlaying: false }),
  setDrawing: (d) => set({ isDrawing: d }),
  setGridSize: (rows, cols) => set({ gridRows: rows, gridCols: cols, grid: createEmptyGrid(rows, cols), start: [Math.floor(rows / 2), 3], end: [Math.floor(rows / 2), cols - 4], steps: [], currentStep: 0 }),
  setCurrentStep: (step) => set({ currentStep: step }),
}));
