import { PathfindingStep, PathfindingAlgorithm, CellType } from './types';

const key = (r: number, c: number) => `${r},${c}`;
const parse = (k: string): [number, number] => { const [r, c] = k.split(',').map(Number); return [r, c]; };

function getNeighbors(r: number, c: number, grid: CellType[][]): [number, number][] {
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const result: [number, number][] = [];
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] !== 'wall') {
      result.push([nr, nc]);
    }
  }
  return result;
}

function reconstructPath(parent: Map<string, string>, start: [number, number], end: [number, number]): string[] {
  const path: string[] = [];
  let cur = key(end[0], end[1]);
  const startKey = key(start[0], start[1]);
  while (cur && cur !== startKey) {
    path.unshift(cur);
    cur = parent.get(cur)!;
  }
  path.unshift(startKey);
  return path;
}

// ─── BFS ───
function bfsRun(grid: CellType[][], start: [number, number], end: [number, number]): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  const visited = new Set<string>();
  const queue: [number, number][] = [start];
  const parent = new Map<string, string>();
  visited.add(key(start[0], start[1]));

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const k = key(r, c);
    steps.push({
      visited: [...visited],
      current: k,
      frontier: queue.map(([r, c]) => key(r, c)),
      path: [],
      description: `Visiting (${r}, ${c})`,
    });

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, start, end);
      for (let i = 1; i <= path.length; i++) {
        steps.push({ visited: [...visited], current: null, frontier: [], path: path.slice(0, i), description: 'Reconstructing shortest path...' });
      }
      return steps;
    }

    for (const [nr, nc] of getNeighbors(r, c, grid)) {
      const nk = key(nr, nc);
      if (!visited.has(nk)) {
        visited.add(nk);
        parent.set(nk, k);
        queue.push([nr, nc]);
      }
    }
  }

  steps.push({ visited: [...visited], current: null, frontier: [], path: [], description: 'No path found!' });
  return steps;
}

// ─── DFS ───
function dfsRun(grid: CellType[][], start: [number, number], end: [number, number]): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  const visited = new Set<string>();
  const stack: [number, number][] = [start];
  const parent = new Map<string, string>();

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const k = key(r, c);
    if (visited.has(k)) continue;
    visited.add(k);

    steps.push({
      visited: [...visited],
      current: k,
      frontier: stack.map(([r, c]) => key(r, c)),
      path: [],
      description: `Exploring (${r}, ${c})`,
    });

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, start, end);
      for (let i = 1; i <= path.length; i++) {
        steps.push({ visited: [...visited], current: null, frontier: [], path: path.slice(0, i), description: 'Reconstructing path...' });
      }
      return steps;
    }

    for (const [nr, nc] of getNeighbors(r, c, grid)) {
      const nk = key(nr, nc);
      if (!visited.has(nk)) {
        parent.set(nk, k);
        stack.push([nr, nc]);
      }
    }
  }

  steps.push({ visited: [...visited], current: null, frontier: [], path: [], description: 'No path found!' });
  return steps;
}

// ─── Dijkstra ───
function dijkstraRun(grid: CellType[][], start: [number, number], end: [number, number]): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  const dist = new Map<string, number>();
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const pq: { key: string; dist: number }[] = [];

  const sk = key(start[0], start[1]);
  dist.set(sk, 0);
  pq.push({ key: sk, dist: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { key: k } = pq.shift()!;
    if (visited.has(k)) continue;
    visited.add(k);
    const [r, c] = parse(k);

    steps.push({
      visited: [...visited],
      current: k,
      frontier: pq.map(p => p.key),
      path: [],
      description: `Processing (${r}, ${c}), distance: ${dist.get(k)}`,
    });

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, start, end);
      for (let i = 1; i <= path.length; i++) {
        steps.push({ visited: [...visited], current: null, frontier: [], path: path.slice(0, i), description: 'Reconstructing shortest path...' });
      }
      return steps;
    }

    for (const [nr, nc] of getNeighbors(r, c, grid)) {
      const nk = key(nr, nc);
      const newDist = (dist.get(k) ?? 0) + 1;
      if (newDist < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, newDist);
        parent.set(nk, k);
        pq.push({ key: nk, dist: newDist });
      }
    }
  }

  steps.push({ visited: [...visited], current: null, frontier: [], path: [], description: 'No path found!' });
  return steps;
}

// ─── A* ───
function astarRun(grid: CellType[][], start: [number, number], end: [number, number]): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  const heuristic = (r: number, c: number) => Math.abs(r - end[0]) + Math.abs(c - end[1]);
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const openSet: string[] = [];

  const sk = key(start[0], start[1]);
  gScore.set(sk, 0);
  fScore.set(sk, heuristic(start[0], start[1]));
  openSet.push(sk);

  while (openSet.length > 0) {
    openSet.sort((a, b) => (fScore.get(a) ?? Infinity) - (fScore.get(b) ?? Infinity));
    const k = openSet.shift()!;
    const [r, c] = parse(k);
    visited.add(k);

    steps.push({
      visited: [...visited],
      current: k,
      frontier: [...openSet],
      path: [],
      description: `A* exploring (${r}, ${c}), f=${fScore.get(k)}`,
    });

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, start, end);
      for (let i = 1; i <= path.length; i++) {
        steps.push({ visited: [...visited], current: null, frontier: [], path: path.slice(0, i), description: 'Reconstructing optimal path...' });
      }
      return steps;
    }

    for (const [nr, nc] of getNeighbors(r, c, grid)) {
      const nk = key(nr, nc);
      if (visited.has(nk)) continue;
      const tentativeG = (gScore.get(k) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        parent.set(nk, k);
        gScore.set(nk, tentativeG);
        fScore.set(nk, tentativeG + heuristic(nr, nc));
        if (!openSet.includes(nk)) openSet.push(nk);
      }
    }
  }

  steps.push({ visited: [...visited], current: null, frontier: [], path: [], description: 'No path found!' });
  return steps;
}

export const pathfindingAlgorithms: PathfindingAlgorithm[] = [
  {
    id: 'bfs', name: 'Breadth-First Search',
    description: 'Explores all nodes at the present depth before moving to nodes at the next depth level. Guarantees shortest path in unweighted graphs.',
    timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', weighted: false,
    run: bfsRun,
  },
  {
    id: 'dfs', name: 'Depth-First Search',
    description: 'Explores as far as possible along each branch before backtracking. Does not guarantee shortest path.',
    timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', weighted: false,
    run: dfsRun,
  },
  {
    id: 'dijkstra', name: "Dijkstra's Algorithm",
    description: 'Finds the shortest path between nodes in a weighted graph. Uses a priority queue to greedily select the nearest unvisited node.',
    timeComplexity: 'O((V + E) log V)', spaceComplexity: 'O(V)', weighted: true,
    run: dijkstraRun,
  },
  {
    id: 'astar', name: 'A* Pathfinding',
    description: 'Informed search algorithm using heuristics to find the optimal path. Combines Dijkstra\'s completeness with greedy best-first speed.',
    timeComplexity: 'O(E)', spaceComplexity: 'O(V)', weighted: true,
    run: astarRun,
  },
];
