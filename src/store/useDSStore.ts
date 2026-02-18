import { create } from 'zustand';
import { DataStructureStep } from '@/algorithms/types';
import { dsAlgorithms } from '@/algorithms/dataStructures';

interface DSOperation {
  type: string;
  value?: number;
  index?: number;
}

interface DSStore {
  steps: DataStructureStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  selectedDS: string;
  operations: DSOperation[];
  inputValue: string;
  inputIndex: string;

  setDS: (id: string) => void;
  setInputValue: (v: string) => void;
  setInputIndex: (v: string) => void;
  addOperation: (op: DSOperation) => void;
  runOperations: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  togglePlay: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setCurrentStep: (step: number) => void;
  clearAll: () => void;
}

export const useDSStore = create<DSStore>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1,
  selectedDS: 'stack',
  operations: [],
  inputValue: '',
  inputIndex: '',

  setDS: (id) => set({ selectedDS: id, steps: [], currentStep: 0, isPlaying: false, operations: [] }),
  setInputValue: (v) => set({ inputValue: v }),
  setInputIndex: (v) => set({ inputIndex: v }),

  addOperation: (op) => {
    const { operations } = get();
    const newOps = [...operations, op];
    set({ operations: newOps });
    // Auto-run to show current state
    const { selectedDS } = get();
    const algo = dsAlgorithms.find(a => a.id === selectedDS);
    if (algo) {
      const steps = algo.run(newOps as any);
      set({ steps, currentStep: steps.length - 1 });
    }
  },

  runOperations: () => {
    const { operations, selectedDS } = get();
    const algo = dsAlgorithms.find(a => a.id === selectedDS);
    if (algo) {
      const steps = algo.run(operations as any);
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
    const { isPlaying, steps, operations, selectedDS } = get();
    if (steps.length === 0 && operations.length > 0) {
      const algo = dsAlgorithms.find(a => a.id === selectedDS);
      if (algo) {
        const s = algo.run(operations as any);
        set({ steps: s, currentStep: 0, isPlaying: true });
      }
    } else {
      set({ isPlaying: !isPlaying });
    }
  },

  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentStep: 0, isPlaying: false }),
  setSpeed: (speed) => set({ speed }),
  setCurrentStep: (step) => set({ currentStep: step }),
  clearAll: () => set({ steps: [], currentStep: 0, isPlaying: false, operations: [], inputValue: '', inputIndex: '' }),
}));
