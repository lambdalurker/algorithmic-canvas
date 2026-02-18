# AlgoViz — Interactive Algorithm Visualizer

> Built by [Ishan Upadhyay](https://github.com/GlitchyIshan)

A beautifully crafted, interactive algorithm visualization platform built with React, TypeScript, and Tailwind CSS. Watch sorting algorithms, pathfinding algorithms, and data structure operations come to life with step-by-step animations.

## Features

- **Sorting Algorithms** — Bubble, Selection, Insertion, Merge, Quick, and Heap Sort with synchronized code highlighting
- **Pathfinding Algorithms** — BFS, DFS, Dijkstra's, and A\* on an interactive grid with wall-drawing
- **Data Structures** — Stack, Queue, Linked List, BST, and AVL Tree with step-by-step operation visualization
- **Playback Controls** — Play, pause, step forward/backward, and scrub through any algorithm
- **Complexity Analysis** — Time and space complexity shown at every step
- **Dark UI** — Clean, minimal dark interface powered by shadcn/ui

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Zustand](https://zustand-demo.pmnd.rs/) — state management
- [React Router v6](https://reactrouter.com/)

## Getting Started

```sh
# Clone the repo
git clone https://github.com/GlitchyIshan/algorithmic-canvas.git
cd algorithmic-canvas

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run test`    | Run tests                |
| `npm run lint`    | Lint code                |

## Project Structure

```
src/
├── algorithms/       # Pure algorithm logic (sorting, pathfinding, DS)
├── components/
│   ├── controls/     # PlaybackControls
│   ├── layout/       # AppLayout, AppSidebar
│   ├── panels/       # AlgorithmInfo, CodePanel
│   └── visualizer/   # SortingVisualizer, PathfindingGrid, DSVisualizer
├── pages/            # Route-level pages
├── store/            # Zustand stores
└── hooks/            # Custom React hooks
```

## License

MIT © [Ishan Upadhyay](https://github.com/GlitchyIshan)
