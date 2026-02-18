import { create } from 'zustand';
import { SortingStep } from '@/algorithms/types';
import { sortingAlgorithms } from '@/algorithms/sorting';

const generateRandomArray = (size: number): number[] =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);

interface SortingStore {
  array: number[];
  arraySize: number;
  steps: SortingStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  selectedAlgorithm: string;
  generateArray: () => void;
  setArraySize: (size: number) => void;
  runAlgorithm: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  togglePlay: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setAlgorithm: (id: string) => void;
  setCurrentStep: (step: number) => void;
}

export const useSortingStore = create<SortingStore>((set, get) => ({
  array: generateRandomArray(30),
  arraySize: 30,
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1,
  selectedAlgorithm: 'bubble',

  generateArray: () => {
    const { arraySize } = get();
    set({ array: generateRandomArray(arraySize), steps: [], currentStep: 0, isPlaying: false });
  },
  setArraySize: (size) => {
    set({ arraySize: size, array: generateRandomArray(size), steps: [], currentStep: 0, isPlaying: false });
  },
  runAlgorithm: () => {
    const { array, selectedAlgorithm } = get();
    const algo = sortingAlgorithms.find(a => a.id === selectedAlgorithm);
    if (algo) {
      const steps = algo.run(array);
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
    if (steps.length === 0) {
      get().runAlgorithm();
    } else {
      set({ isPlaying: !isPlaying });
    }
  },
  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentStep: 0, isPlaying: false }),
  setSpeed: (speed) => set({ speed }),
  setAlgorithm: (id) => set({ selectedAlgorithm: id, steps: [], currentStep: 0, isPlaying: false }),
  setCurrentStep: (step) => set({ currentStep: step }),
}));
