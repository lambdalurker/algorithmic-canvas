# AlgoViz — Code Architecture & Documentation

> Author: Ishan Upadhyay ([@GlitchyIshan](https://github.com/GlitchyIshan))  
> Stack: React 18 · TypeScript · Vite · Tailwind CSS · Zustand · Framer Motion

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Architecture Overview](#4-architecture-overview)
5. [Data Flow](#5-data-flow)
6. [Algorithms Layer (`src/algorithms/`)](#6-algorithms-layer)
   - [types.ts](#61-typests)
   - [sorting.ts](#62-sortingts)
   - [pathfinding.ts](#63-pathfindingt)
   - [dataStructures.ts](#64-datastructurets)
7. [State Management (`src/store/`)](#7-state-management)
   - [useSortingStore](#71-usesortingstore)
   - [useGraphStore](#72-usegraphstore)
   - [useDSStore](#73-usedsstore)
8. [Pages (`src/pages/`)](#8-pages)
9. [Components (`src/components/`)](#9-components)
   - [Layout](#91-layout)
   - [Visualizers](#92-visualizers)
   - [Controls](#93-controls)
   - [Panels](#94-panels)
10. [Styling System](#10-styling-system)
11. [Routing](#11-routing)
12. [Keyboard Shortcuts](#12-keyboard-shortcuts)
13. [Adding a New Algorithm](#13-adding-a-new-algorithm)

---

## 1. Project Overview

AlgoViz is an interactive algorithm visualization platform. Users can:

- Watch **sorting algorithms** execute step-by-step on animated bar charts
- Draw walls on a **pathfinding grid** and watch BFS/DFS/Dijkstra/A\* find the path
- Perform **data structure operations** (push, pop, enqueue, insert, etc.) and watch them animate

Every algorithm is pre-computed into an array of "steps" (snapshots), and the UI scrubs through those steps — making playback, pause, and step-back trivial with no re-computation.

---

## 2. Tech Stack

| Technology               | Role                                                       |
| ------------------------ | ---------------------------------------------------------- |
| **React 18**             | UI rendering                                               |
| **TypeScript**           | Type safety across the entire codebase                     |
| **Vite**                 | Dev server and bundler                                     |
| **Tailwind CSS**         | Utility-first styling                                      |
| **shadcn/ui**            | Pre-built accessible component primitives (Radix UI based) |
| **Framer Motion**        | SVG and element animations                                 |
| **Zustand**              | Lightweight global state management                        |
| **React Router v6**      | Client-side routing with URL-based algorithm selection     |
| **TanStack React Query** | (Installed, available for future async data needs)         |

---

## 3. Folder Structure

```
algorithmic-canvas/
├── index.html                    # App entry — meta, OG tags, fonts
├── vite.config.ts                # Vite configuration (port 8080, path alias @/)
├── tailwind.config.ts            # Tailwind + custom vis-* color tokens
├── tsconfig.app.json             # TypeScript config
│
└── src/
    ├── main.tsx                  # React DOM render entry
    ├── App.tsx                   # Router + providers root
    ├── index.css                 # CSS variables, dark mode, utilities
    │
    ├── algorithms/               # Pure algorithm logic — no React, no side effects
    │   ├── types.ts              # All shared TypeScript interfaces
    │   ├── sorting.ts            # 6 sorting algorithms (bubble → heap)
    │   ├── pathfinding.ts        # 4 pathfinding algorithms (BFS/DFS/Dijkstra/A*)
    │   └── dataStructures.ts     # 5 data structures (Stack/Queue/LinkedList/BST/AVL)
    │
    ├── store/                    # Zustand global stores (one per visualizer domain)
    │   ├── useSortingStore.ts
    │   ├── useGraphStore.ts
    │   └── useDSStore.ts
    │
    ├── pages/                    # Route-level page components
    │   ├── Index.tsx             # Landing / home page
    │   ├── SortingPage.tsx       # /sorting/:algorithmId
    │   ├── PathfindingPage.tsx   # /pathfinding/:algorithmId
    │   ├── DataStructurePage.tsx # /ds/:dsId
    │   └── NotFound.tsx          # 404 fallback
    │
    ├── components/
    │   ├── NavLink.tsx
    │   ├── layout/
    │   │   ├── AppLayout.tsx     # Shell: sidebar + header + keyboard events
    │   │   └── AppSidebar.tsx    # Navigation sidebar with all algorithm links
    │   ├── visualizer/
    │   │   ├── SortingVisualizer.tsx    # SVG animated bar chart
    │   │   ├── PathfindingGrid.tsx      # CSS grid with mouse-draw interaction
    │   │   └── DSVisualizer.tsx         # SVG stack/queue/linked-list/tree renderer
    │   ├── controls/
    │   │   └── PlaybackControls.tsx     # Play/pause/step/speed/scrub bar
    │   ├── panels/
    │   │   ├── CodePanel.tsx     # Pseudocode viewer with active line highlight
    │   │   └── AlgorithmInfo.tsx # Complexity badges + live stats
    │   └── ui/                   # shadcn/ui primitives (button, slider, badge, etc.)
    │
    ├── hooks/
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    └── lib/
        └── utils.ts              # cn() helper (clsx + tailwind-merge)
```

---

## 4. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                        App.tsx                           │
│   QueryClientProvider > TooltipProvider > BrowserRouter  │
└──────────────────────────┬───────────────────────────────┘
                           │ Routes
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   SortingPage      PathfindingPage    DataStructurePage
          │                │                │
          │   reads from   │                │
          ▼                ▼                ▼
   useSortingStore   useGraphStore      useDSStore
    (Zustand)         (Zustand)          (Zustand)
          │                │                │
          │   calls        │                │
          ▼                ▼                ▼
    sorting.ts      pathfinding.ts   dataStructures.ts
    (pure fns)       (pure fns)        (pure fns)
          │
          └── returns SortingStep[] / PathfindingStep[] / DataStructureStep[]
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
  SortingVisualizer  PathfindingGrid    DSVisualizer
  (Framer Motion SVG) (CSS Grid)       (Framer Motion SVG)
          │
  PlaybackControls (shared across all three pages)
  CodePanel        (sorting + DS pages)
  AlgorithmInfo    (all pages)
```

---

## 5. Data Flow

The entire system follows a **pre-compute → scrub** pattern:

```
User clicks "Visualize"
        │
        ▼
Store calls algo.run(input)        ← pure function, no side effects
        │
        ▼
Returns Step[]                     ← array of immutable snapshots
        │
        ▼
Stored in Zustand: { steps, currentStep }
        │
        ▼
PlaybackControls increments currentStep via setInterval
        │
        ▼
Visualizer reads steps[currentStep] and renders the snapshot
        │
        ▼
Framer Motion animates the diff between frames
```

**Key benefit:** Because every past state is in the array, stepping backward is O(1) — just decrement `currentStep`.

---

## 6. Algorithms Layer

All algorithm files in `src/algorithms/` are **pure TypeScript** — zero React imports, zero side effects.

### 6.1 `types.ts`

Central type definitions used by all algorithms, stores, and components.

```typescript
// Snapshot of one step in a sorting algorithm
interface SortingStep {
  array: number[]; // current array state
  comparing: number[]; // indices being compared (yellow)
  swapping: number[]; // indices being swapped (red)
  sorted: number[]; // finalized indices (green)
  active: number[]; // secondary highlight (blue)
  description: string; // human-readable step description
  codeLine: number; // index into algo.code[] to highlight
  comparisons: number; // running comparison count
  swaps: number; // running swap count
}

// Snapshot of one step in a pathfinding algorithm
interface PathfindingStep {
  visited: string[]; // "row,col" keys of visited cells
  current: string | null; // currently processing cell
  frontier: string[]; // cells in queue/stack/open-set
  path: string[]; // reconstructed path cells
  description: string;
}

// Grid cell types
type CellType = "empty" | "wall" | "start" | "end";

// Snapshot of one step in a data structure operation
interface DataStructureStep {
  elements: number[]; // current elements
  highlighted: number[]; // indices to highlight
  description: string;
  codeLine: number;
  action: string; // e.g. 'push', 'pop', 'enqueue'
  pointers: Record<string, number>; // named pointers (top, head, tail)
  treeData?: any; // tree node data for BST/AVL
}
```

Each algorithm also exports a descriptor object (`SortingAlgorithm`, `PathfindingAlgorithm`, `DSAlgorithm`) containing `id`, `name`, `description`, complexity strings, `code[]` (pseudocode lines), and the `run()` function.

---

### 6.2 `sorting.ts`

Implements 6 sorting algorithms. Each uses a **snapper pattern**:

```typescript
// createSnapper returns a snap() closure that pushes a frozen
// copy of the current array state into the steps[] array
function createSnapper(arr, steps, sorted, counters): Snap;

// Each algorithm calls snap() at every meaningful moment:
snap("Comparing 5 and 3", codeLine, { comparing: [i, j] });
```

| Algorithm      | Time (Best/Avg/Worst)           | Space    | Notes                                 |
| -------------- | ------------------------------- | -------- | ------------------------------------- |
| Bubble Sort    | O(n) / O(n²) / O(n²)            | O(1)     | Marks sorted suffix each pass         |
| Selection Sort | O(n²) / O(n²) / O(n²)           | O(1)     | Tracks `minIdx` with active highlight |
| Insertion Sort | O(n) / O(n²) / O(n²)            | O(1)     | Inner loop shifts right               |
| Merge Sort     | O(n log n) × 3                  | O(n)     | Recursive; snaps during merge phase   |
| Quick Sort     | O(n log n) / O(n log n) / O(n²) | O(log n) | Lomuto partition scheme               |
| Heap Sort      | O(n log n) × 3                  | O(1)     | Heapify-down with active tracking     |

Exported as `sortingAlgorithms: SortingAlgorithm[]` — the store and sidebar both consume this array.

---

### 6.3 `pathfinding.ts`

All algorithms operate on a `CellType[][]` grid. Cells are identified by `"row,col"` string keys for O(1) set lookups. Movement is 4-directional (no diagonals).

```typescript
const key = (r, c) => `${r},${c}`; // encode
const parse = (k) => k.split(",").map(Number); // decode
```

| Algorithm  | Guaranteed Shortest Path | Weighted | Notes                                            |
| ---------- | ------------------------ | -------- | ------------------------------------------------ |
| BFS        | ✅ Yes                   | ❌ No    | Queue-based; explores rings outward              |
| DFS        | ❌ No                    | ❌ No    | Stack-based; explores deep first                 |
| Dijkstra's | ✅ Yes                   | ✅ Yes   | Min-heap (sorted array); all edges weight 1 here |
| A\*        | ✅ Yes                   | ✅ Yes   | Dijkstra + Manhattan heuristic                   |

Path reconstruction uses a `parent: Map<string, string>` that traces back from end → start.

---

### 6.4 `dataStructures.ts`

Each data structure is a factory function returning a `DSAlgorithm` with a `run(ops[])` method that replays all operations from scratch, capturing a step for each action.

| DS              | Operations                        | Visualization                                 |
| --------------- | --------------------------------- | --------------------------------------------- |
| **Stack**       | `push(val)`, `pop()`              | Vertical SVG boxes, `top` pointer             |
| **Queue**       | `enqueue(val)`, `dequeue()`       | Horizontal SVG boxes, `front`/`rear` pointers |
| **Linked List** | `insert(val, idx)`, `delete(idx)` | Horizontal boxes with arrow connectors        |
| **BST**         | `insert(val)`, `search(val)`      | Recursive tree layout with `TreeVisualizer`   |
| **AVL Tree**    | `insert(val)` (auto-balances)     | Same tree layout, shows rotation steps        |

`DSVisualizer` auto-selects the render mode based on `selectedDS`:

- Stack → vertical SVG layout
- Queue / Linked List → horizontal SVG layout with arrows
- BST / AVL → `<TreeVisualizer>` recursive SVG tree

---

## 7. State Management

Three independent Zustand stores, one per visualizer domain. They share the same shape pattern:

```
{ data, steps[], currentStep, isPlaying, speed, selectedAlgorithm }
+ actions: generateArray/initGrid, runAlgorithm, stepForward/Backward,
           togglePlay, pause, reset, setSpeed, setCurrentStep
```

### 7.1 `useSortingStore`

```typescript
// Key state
array: number[]          // current display array
arraySize: number        // 5–200, slider-controlled
steps: SortingStep[]     // pre-computed snapshots
currentStep: number      // index into steps[]
isPlaying: boolean
speed: number            // multiplier: 0.25 | 0.5 | 1 | 2 | 4

// Key actions
generateArray()          // randomizes array, clears steps
runAlgorithm()           // computes steps[], starts playing
setArraySize(n)          // regenerates with new size
```

### 7.2 `useGraphStore`

```typescript
// Key state
grid: CellType[][]       // 20×35 grid of 'empty'|'wall'|'start'|'end'
start: [row, col]        // default [10, 5]
end:   [row, col]        // default [10, 29]
isDrawing: boolean       // true while mouse is held down on grid
steps: PathfindingStep[]

// Key actions
toggleCell(r, c)         // flip empty ↔ wall (ignores start/end cells)
setStart(pos)            // move start marker
setEnd(pos)              // move end marker
clearWalls()             // reset all walls to empty
clearAll()               // reset grid + steps
runAlgorithm()           // compute steps from current grid state
```

### 7.3 `useDSStore`

```typescript
// Key state
selectedDS: string       // 'stack'|'queue'|'linked-list'|'bst'|'avl'
operations: DSOperation[] // operation log [{type, value?, index?}]
steps: DataStructureStep[]

// Key actions
addOperation(op)         // appends op + immediately re-runs to show result
runOperations()          // replays all ops from step 0 with isPlaying=true
setDS(id)               // switches DS, clears operations and steps
```

`addOperation` has a unique behavior: after every add, it immediately re-runs all operations and jumps `currentStep` to the last step — so the user sees the current state without having to press Play.

---

## 8. Pages

### `Index.tsx` — Landing Page

- No store dependency
- Displays category cards (Sorting / Pathfinding / Data Structures) and a features section
- Framer Motion entrance animation (`opacity: 0 → 1, y: 20 → 0`)
- "Start Exploring" CTA links to `/sorting/bubble`

### `SortingPage.tsx` — `/sorting/:algorithmId`

- Reads `:algorithmId` from URL params; falls back to `bubble` if invalid
- Top bar: algorithm name, array size slider (5–200), shuffle button, visualize button
- Center: `<SortingVisualizer />` (SVG bar chart)
- Bottom: `<PlaybackControls />`
- Right panel (lg breakpoint): `<CodePanel />` + `<AlgorithmInfo />`

### `PathfindingPage.tsx` — `/pathfinding/:algorithmId`

- Same layout pattern as SortingPage
- Top bar: Clear Walls, Reset, Visualize buttons
- Center: `<PathfindingGrid />` (interactive CSS grid)
- Right panel: `<AlgorithmInfo />` (no CodePanel — pathfinding has no pseudocode array)

### `DataStructurePage.tsx` — `/ds/:dsId`

- More interactive than the other pages — operations are driven by user input
- Top bar: value input, index input (for Linked List), Add/Remove/Play buttons
- The displayed button labels adapt per DS (`Push`/`Pop`, `Enqueue`/`Dequeue`, etc.)
- Center: `<DSVisualizer />`
- Right panel: `<CodePanel />` + operation history badges

---

## 9. Components

### 9.1 Layout

#### `AppLayout.tsx`

Shell wrapper used by all three page types. Provides:

- `SidebarProvider` context
- Fixed `<header>` (h-14) with sidebar toggle and gradient "AlgoViz" title
- **Global keyboard event listener** (dispatches custom DOM events):

```
Space      → CustomEvent('algo:togglePlay')
ArrowRight → CustomEvent('algo:stepForward')
ArrowLeft  → CustomEvent('algo:stepBackward')
```

Keyboard events are dispatched on the `document` rather than calling store actions directly — this keeps `AppLayout` decoupled from the specific stores.

#### `AppSidebar.tsx`

- Uses shadcn/ui `Sidebar` primitives
- Renders `navItems[]` grouped into Home / Sorting / Pathfinding / Data Structures
- Active route is highlighted using `useLocation()` comparison
- All algorithm routes are statically defined in the `navItems` array

---

### 9.2 Visualizers

#### `SortingVisualizer.tsx`

- Reads `useSortingStore` for `steps`, `currentStep`, `array`
- Renders an SVG `<motion.rect>` per array element
- Bar width and gap auto-calculated from array length: `barWidth = max(2, min(40, 800/n - 2))`
- Bar color determined per-step by priority: sorted > swapping > comparing > active > default
- Colors reference CSS variables (`hsl(var(--vis-*))`), not hard-coded values

```typescript
// Color priority (highest wins)
sorted    → --vis-sorted  (green)
swapping  → --vis-swap    (red)
comparing → --vis-compare (yellow)
active    → --vis-active  (blue)
default   → --vis-default (grey)
```

#### `PathfindingGrid.tsx`

- Reads `useGraphStore` for grid state and step data
- Renders a CSS `inline-grid` with `grid-template-columns: repeat(cols, ...)`
- Mouse interaction for wall-drawing:
  - `onMouseDown` → sets `isDrawing = true`, toggles cell
  - `onMouseEnter` → if `isDrawing`, toggles cell (drag-to-draw)
  - `onMouseUp` / `onMouseLeave` → sets `isDrawing = false`
- Cell class determined by: start > end > wall > path > current > frontier > visited > empty

#### `DSVisualizer.tsx`

- Three render modes:
  1. **Stack** — vertical SVG layout, most-recent element at top
  2. **Queue / Linked List** — horizontal SVG with `→` arrows between nodes
  3. **BST / AVL** — delegates to `<TreeVisualizer>`, a recursive SVG tree renderer
- `TreeVisualizer` lays out nodes by depth, computing x positions recursively
- All boxes use `<motion.rect>` with spring animations (`stiffness: 300, damping: 25`)

---

### 9.3 Controls

#### `PlaybackControls.tsx`

Shared across all three pages. Props-driven (no direct store access):

```typescript
interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // multiplier
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
  onSetStep: (step: number) => void;
}
```

Internally manages:

- **Auto-play**: `setInterval` with `ms = max(20, 300 / speed)` — at speed 4, ticks every 75ms; at 0.25, every 1200ms
- **Keyboard events**: Listens to `algo:togglePlay`, `algo:stepForward`, `algo:stepBackward` custom DOM events dispatched by `AppLayout`
- **Progress scrubber**: shadcn `<Slider>` bound to `currentStep`
- **Speed cycle**: 5 preset speeds `[0.25, 0.5, 1, 2, 4]` cycled with a single button

---

### 9.4 Panels

#### `CodePanel.tsx`

- Props: `code: string[]`, `activeLine: number`
- Renders a monospace code block; line `activeLine` gets `bg-primary/15 text-primary` highlight
- Line numbers shown as muted text on the left
- `codeLine` in each step maps to an index in `algo.code[]`

#### `AlgorithmInfo.tsx`

- Props: `algorithm`, `stats?`, `description?`
- Detects sorting vs pathfinding by checking if `timeComplexity` is an object
- Sorting: shows Best / Average / Worst / Space complexity as `<Badge>` components
- Pathfinding: shows Time / Space only
- `stats` prop shows live comparison/swap counters from the current step
- `description` prop shows the step's human-readable explanation in a callout box

---

## 10. Styling System

### CSS Variables (Design Tokens)

Defined in `src/index.css` under `:root` (light) and `.dark`. The `<html>` tag has `class="dark"` by default.

```css
/* UI tokens */
--primary, --secondary, --muted, --accent, --destructive
--background, --foreground, --border, --radius

/* Visualization colors — used by all visualizers */
--vis-compare    /* yellow  — elements being compared */
--vis-swap       /* red     — elements being swapped */
--vis-sorted     /* green   — finalized/sorted */
--vis-active     /* blue    — secondary highlight */
--vis-default    /* grey    — normal bar/node */
--vis-visited    /* purple  — visited grid cells */
--vis-path       /* yellow  — shortest path */
--vis-current    /* red     — currently processed cell */
--vis-frontier   /* cyan    — BFS queue / A* open set */
--vis-wall       /* dark    — wall cells */
--vis-start      /* green   — start cell */
--vis-end        /* red     — end cell */
```

### Utility Classes

```css
.gradient-text   /* primary → accent gradient text clip */
.glass-card      /* frosted glass card: bg-card/80 + backdrop-blur */
.vis-glow        /* SVG drop-shadow glow effect */
```

### Path Alias

`@/` resolves to `src/` — configured in both `vite.config.ts` and `tsconfig.app.json`.

```typescript
import { cn } from "@/lib/utils"; // → src/lib/utils.ts
```

---

## 11. Routing

Routes are defined in `App.tsx`:

```
/                          → Index (landing page)
/sorting/:algorithmId      → SortingPage
  algorithmId: bubble | selection | insertion | merge | quick | heap

/pathfinding/:algorithmId  → PathfindingPage
  algorithmId: bfs | dfs | dijkstra | astar

/ds/:dsId                  → DataStructurePage
  dsId: stack | queue | linked-list | bst | avl

*                          → NotFound
```

Each page reads the URL param and syncs it to the store via `useEffect`. If the URL param is missing or invalid, the page redirects to the default route (`/sorting/bubble`, `/pathfinding/bfs`, `/ds/stack`).

---

## 12. Keyboard Shortcuts

| Key              | Action        |
| ---------------- | ------------- |
| `Space`          | Play / Pause  |
| `→` (ArrowRight) | Step Forward  |
| `←` (ArrowLeft)  | Step Backward |

These are registered in `AppLayout.tsx` and broadcast as `CustomEvent`s on `document`. `PlaybackControls` subscribes to these events, keeping the layout shell decoupled from any specific store.

> Keyboard events are ignored when an `<input>` or `<textarea>` is focused — important for the DS page where the user types values.

---

## 13. Adding a New Algorithm

### New Sorting Algorithm

**1. Add the implementation in `src/algorithms/sorting.ts`:**

```typescript
function mySortRun(input: number[]): SortingStep[] {
  const arr = [...input],
    steps: SortingStep[] = [],
    sorted: number[] = [];
  const c = { comparisons: 0, swaps: 0 };
  const snap = createSnapper(arr, steps, sorted, c);

  snap("Starting My Sort", 0);
  // ... algorithm logic, call snap() at each meaningful moment
  snap("Array is sorted!", lastLine);
  return steps;
}
```

**2. Add a descriptor to the `sortingAlgorithms` array:**

```typescript
export const sortingAlgorithms: SortingAlgorithm[] = [
  // ... existing
  {
    id: "mysort",
    name: "My Sort",
    description: "Description of the algorithm.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    code: ["for i in range(n):", "  ..."],
    run: mySortRun,
  },
];
```

**3. Add a sidebar nav entry in `AppSidebar.tsx`:**

```typescript
{ title: 'My Sort', url: '/sorting/mysort', icon: SomeIcon },
```

**4. Add a route (optional — existing `/sorting/:algorithmId` will auto-handle it).**

---

### New Pathfinding Algorithm

Same pattern in `src/algorithms/pathfinding.ts` — implement a `run()` function returning `PathfindingStep[]`, add to `pathfindingAlgorithms[]`, add to sidebar.

---

### New Data Structure

Same pattern in `src/algorithms/dataStructures.ts` — create a factory function, add to `dsAlgorithms[]`, add to sidebar. Add handling for the new `dsId` in `DataStructurePage.tsx`'s `handleAdd`/`handleRemove` functions if operations differ.

---

_Documentation written for AlgoViz v1.0.0_
