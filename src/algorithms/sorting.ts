import { SortingStep, SortingAlgorithm } from './types';

type Snap = (desc: string, line: number, extras?: Partial<Pick<SortingStep, 'comparing' | 'swapping' | 'active'>>) => void;

function createSnapper(arr: number[], steps: SortingStep[], sorted: number[], counters: { comparisons: number; swaps: number }): Snap {
  return (desc, line, extras = {}) => {
    steps.push({
      array: [...arr],
      comparing: extras.comparing ?? [],
      swapping: extras.swapping ?? [],
      sorted: [...sorted],
      active: extras.active ?? [],
      description: desc,
      codeLine: line,
      comparisons: counters.comparisons,
      swaps: counters.swaps,
    });
  };
}

// ─── Bubble Sort ───
function bubbleSortRun(input: number[]): SortingStep[] {
  const arr = [...input], steps: SortingStep[] = [], sorted: number[] = [];
  const c = { comparisons: 0, swaps: 0 };
  const snap = createSnapper(arr, steps, sorted, c);
  const n = arr.length;
  snap('Starting Bubble Sort', 0);
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      c.comparisons++;
      snap(`Comparing ${arr[j]} and ${arr[j + 1]}`, 2, { comparing: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        c.swaps++;
        snap(`Swapped ${arr[j]} and ${arr[j + 1]}`, 3, { swapping: [j, j + 1] });
      }
    }
    sorted.push(n - 1 - i);
  }
  sorted.push(0);
  snap('Array is sorted!', 5);
  return steps;
}

// ─── Selection Sort ───
function selectionSortRun(input: number[]): SortingStep[] {
  const arr = [...input], steps: SortingStep[] = [], sorted: number[] = [];
  const c = { comparisons: 0, swaps: 0 };
  const snap = createSnapper(arr, steps, sorted, c);
  const n = arr.length;
  snap('Starting Selection Sort', 0);
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    snap(`Finding minimum from index ${i}`, 2, { active: [i] });
    for (let j = i + 1; j < n; j++) {
      c.comparisons++;
      snap(`Comparing ${arr[j]} with current min ${arr[minIdx]}`, 3, { comparing: [j, minIdx], active: [i] });
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      c.swaps++;
      snap(`Swapped ${arr[i]} into position ${i}`, 5, { swapping: [i, minIdx] });
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  snap('Array is sorted!', 7);
  return steps;
}

// ─── Insertion Sort ───
function insertionSortRun(input: number[]): SortingStep[] {
  const arr = [...input], steps: SortingStep[] = [], sorted: number[] = [0];
  const c = { comparisons: 0, swaps: 0 };
  const snap = createSnapper(arr, steps, sorted, c);
  snap('Starting Insertion Sort', 0);
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    snap(`Inserting ${key} into sorted portion`, 2, { active: [i] });
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      c.comparisons++;
      arr[j + 1] = arr[j];
      c.swaps++;
      snap(`Shifting ${arr[j]} right`, 4, { swapping: [j, j + 1] });
      j--;
    }
    if (j >= 0) c.comparisons++;
    arr[j + 1] = key;
    sorted.push(i);
    snap(`Placed ${key} at position ${j + 1}`, 5, { active: [j + 1] });
  }
  snap('Array is sorted!', 7);
  return steps;
}

// ─── Merge Sort ───
function mergeSortRun(input: number[]): SortingStep[] {
  const arr = [...input], steps: SortingStep[] = [], sorted: number[] = [];
  const c = { comparisons: 0, swaps: 0 };
  const snap = createSnapper(arr, steps, sorted, c);
  snap('Starting Merge Sort', 0);

  function merge(left: number, mid: number, right: number) {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    snap(`Merging [${left}..${mid}] and [${mid + 1}..${right}]`, 3, { active: Array.from({ length: right - left + 1 }, (_, x) => left + x) });
    while (i < L.length && j < R.length) {
      c.comparisons++;
      if (L[i] <= R[j]) {
        arr[k] = L[i]; i++;
      } else {
        arr[k] = R[j]; j++;
        c.swaps++;
      }
      snap(`Placed ${arr[k]} at position ${k}`, 5, { comparing: [k], active: Array.from({ length: right - left + 1 }, (_, x) => left + x) });
      k++;
    }
    while (i < L.length) { arr[k] = L[i]; i++; k++; }
    while (j < R.length) { arr[k] = R[j]; j++; k++; }
    snap(`Merged segment [${left}..${right}]`, 6, { active: Array.from({ length: right - left + 1 }, (_, x) => left + x) });
  }

  function mergeSort(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSort(left, mid);
      mergeSort(mid + 1, right);
      merge(left, mid, right);
    }
  }

  mergeSort(0, arr.length - 1);
  for (let i = 0; i < arr.length; i++) sorted.push(i);
  snap('Array is sorted!', 8);
  return steps;
}

// ─── Quick Sort ───
function quickSortRun(input: number[]): SortingStep[] {
  const arr = [...input], steps: SortingStep[] = [], sorted: number[] = [];
  const c = { comparisons: 0, swaps: 0 };
  const snap = createSnapper(arr, steps, sorted, c);
  snap('Starting Quick Sort', 0);

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    snap(`Pivot: ${pivot} at index ${high}`, 3, { active: [high] });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      c.comparisons++;
      snap(`Comparing ${arr[j]} with pivot ${pivot}`, 4, { comparing: [j, high] });
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        c.swaps++;
        snap(`Swapped ${arr[i]} and ${arr[j]}`, 5, { swapping: [i, j] });
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    c.swaps++;
    snap(`Pivot ${pivot} placed at index ${i + 1}`, 6, { swapping: [i + 1, high] });
    sorted.push(i + 1);
    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      sorted.push(low);
    }
  }

  quickSort(0, arr.length - 1);
  snap('Array is sorted!', 9);
  return steps;
}

// ─── Heap Sort ───
function heapSortRun(input: number[]): SortingStep[] {
  const arr = [...input], steps: SortingStep[] = [], sorted: number[] = [];
  const c = { comparisons: 0, swaps: 0 };
  const snap = createSnapper(arr, steps, sorted, c);
  const n = arr.length;
  snap('Starting Heap Sort — building max heap', 0);

  function heapify(size: number, i: number) {
    let largest = i;
    const left = 2 * i + 1, right = 2 * i + 2;
    if (left < size) { c.comparisons++; if (arr[left] > arr[largest]) largest = left; }
    if (right < size) { c.comparisons++; if (arr[right] > arr[largest]) largest = right; }
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      c.swaps++;
      snap(`Heapify: swapped ${arr[i]} and ${arr[largest]}`, 3, { swapping: [i, largest] });
      heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  snap('Max heap built', 1);

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    c.swaps++;
    sorted.push(i);
    snap(`Extracted max ${arr[i]} to position ${i}`, 5, { swapping: [0, i] });
    heapify(i, 0);
  }
  sorted.push(0);
  snap('Array is sorted!', 7);
  return steps;
}

// ─── Registry ───
export const sortingAlgorithms: SortingAlgorithm[] = [
  {
    id: 'bubble', name: 'Bubble Sort',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Simple but inefficient for large datasets.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    code: [
      'function bubbleSort(arr):',
      '  for i = 0 to n-1:',
      '    for j = 0 to n-i-2:',
      '      if arr[j] > arr[j+1]:',
      '        swap(arr[j], arr[j+1])',
      '  return arr',
    ],
    run: bubbleSortRun,
  },
  {
    id: 'selection', name: 'Selection Sort',
    description: 'Divides the input into a sorted and unsorted region. Repeatedly selects the smallest element from the unsorted region and moves it to the sorted region.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    code: [
      'function selectionSort(arr):',
      '  for i = 0 to n-1:',
      '    minIdx = i',
      '    for j = i+1 to n:',
      '      if arr[j] < arr[minIdx]:',
      '        minIdx = j',
      '    swap(arr[i], arr[minIdx])',
      '  return arr',
    ],
    run: selectionSortRun,
  },
  {
    id: 'insertion', name: 'Insertion Sort',
    description: 'Builds the final sorted array one element at a time. Efficient for small datasets and nearly sorted arrays.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    code: [
      'function insertionSort(arr):',
      '  for i = 1 to n:',
      '    key = arr[i]',
      '    j = i - 1',
      '    while j >= 0 and arr[j] > key:',
      '      arr[j+1] = arr[j]; j--',
      '    arr[j+1] = key',
      '  return arr',
    ],
    run: insertionSortRun,
  },
  {
    id: 'merge', name: 'Merge Sort',
    description: 'Divide-and-conquer algorithm. Divides array into halves, recursively sorts them, then merges the sorted halves. Guarantees O(n log n) performance.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    code: [
      'function mergeSort(arr, l, r):',
      '  if l < r:',
      '    mid = (l + r) / 2',
      '    mergeSort(arr, l, mid)',
      '    mergeSort(arr, mid+1, r)',
      '    merge(arr, l, mid, r)',
      '    // merge two sorted halves',
      '  return arr',
      '  // done',
    ],
    run: mergeSortRun,
  },
  {
    id: 'quick', name: 'Quick Sort',
    description: 'Efficient divide-and-conquer algorithm. Picks a pivot, partitions array around it. Average case O(n log n) with good cache performance.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    code: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    pi = partition(arr, low, high)',
      '    // pivot = arr[high]',
      '    // compare elements with pivot',
      '    // swap smaller to left',
      '    // place pivot in correct position',
      '    quickSort(arr, low, pi-1)',
      '    quickSort(arr, pi+1, high)',
      '  return arr',
    ],
    run: quickSortRun,
  },
  {
    id: 'heap', name: 'Heap Sort',
    description: 'Uses a binary max-heap data structure. Builds heap from array, then repeatedly extracts the maximum element. Guaranteed O(n log n) with O(1) extra space.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    code: [
      'function heapSort(arr):',
      '  buildMaxHeap(arr)',
      '  for i = n-1 down to 1:',
      '    swap(arr[0], arr[i])',
      '    heapify(arr, i, 0)',
      '    // fix heap property',
      '  return arr',
      '  // done',
    ],
    run: heapSortRun,
  },
];
