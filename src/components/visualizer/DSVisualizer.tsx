import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDSStore } from '@/store/useDSStore';

export function DSVisualizer() {
  const { steps, currentStep, selectedDS } = useDSStore();
  const step = steps[currentStep];
  const elements = step?.elements ?? [];
  const highlighted = new Set(step?.highlighted ?? []);
  const pointers = step?.pointers ?? {};
  const treeData = step?.treeData;
  const isTree = selectedDS === 'bst' || selectedDS === 'avl';

  if (isTree && treeData) {
    return <TreeVisualizer treeData={treeData} />;
  }

  if (isTree && !treeData) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
        Add elements to visualize the tree
      </div>
    );
  }

  const isLinkedList = selectedDS === 'linked-list';
  const isStack = selectedDS === 'stack';
  const isQueue = selectedDS === 'queue';

  if (elements.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
        Add elements to start visualizing
      </div>
    );
  }

  const boxSize = 52;
  const gap = isLinkedList ? 72 : 12;
  const totalWidth = elements.length * boxSize + (elements.length - 1) * gap;

  return (
    <div className="w-full flex items-center justify-center p-6 overflow-x-auto">
      <svg
        width={Math.max(totalWidth + 40, 200)}
        height={isStack ? elements.length * (boxSize + 8) + 60 : 160}
        className="mx-auto"
      >
        {isStack ? (
          // Stack: vertical layout, top = last element
          <>
            {elements.map((val, i) => {
              const reverseI = elements.length - 1 - i;
              const x = 60;
              const y = reverseI * (boxSize + 8) + 20;
              const isHL = highlighted.has(i);
              const isTop = pointers.top === i;
              return (
                <g key={`${i}-${val}`}>
                  <motion.rect
                    x={x}
                    y={y}
                    width={boxSize * 2}
                    height={boxSize}
                    rx={8}
                    fill={isHL ? 'hsl(var(--vis-active))' : 'hsl(var(--secondary))'}
                    stroke={isTop ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                    strokeWidth={isTop ? 2 : 1}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                  <text
                    x={x + boxSize}
                    y={y + boxSize / 2 + 5}
                    textAnchor="middle"
                    className="fill-foreground text-sm font-mono font-medium"
                  >
                    {val}
                  </text>
                  {isTop && (
                    <text
                      x={x + boxSize * 2 + 12}
                      y={y + boxSize / 2 + 5}
                      className="fill-primary text-[10px] font-medium"
                    >
                      ← top
                    </text>
                  )}
                </g>
              );
            })}
          </>
        ) : (
          // Queue / Linked List: horizontal
          <>
            {elements.map((val, i) => {
              const x = i * (boxSize + gap) + 20;
              const y = 40;
              const isHL = highlighted.has(i);
              const isFront = pointers.front === i;
              const isBack = pointers.back === i;
              const isHead = pointers.head === i;
              const isCurr = pointers.current === i;
              return (
                <g key={`${i}-${val}`}>
                  <motion.rect
                    x={x}
                    y={y}
                    width={boxSize}
                    height={boxSize}
                    rx={8}
                    fill={isHL ? 'hsl(var(--vis-active))' : isCurr ? 'hsl(var(--vis-compare))' : 'hsl(var(--secondary))'}
                    stroke={isFront || isBack || isHead ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                    strokeWidth={isFront || isBack || isHead ? 2 : 1}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                  <text
                    x={x + boxSize / 2}
                    y={y + boxSize / 2 + 5}
                    textAnchor="middle"
                    className="fill-foreground text-sm font-mono font-medium"
                  >
                    {val}
                  </text>
                  {/* Pointer labels */}
                  {(isFront || isHead) && (
                    <text x={x + boxSize / 2} y={y - 8} textAnchor="middle" className="fill-primary text-[10px] font-medium">
                      {isHead ? 'head' : 'front'}
                    </text>
                  )}
                  {isBack && (
                    <text x={x + boxSize / 2} y={y + boxSize + 16} textAnchor="middle" className="fill-primary text-[10px] font-medium">
                      back
                    </text>
                  )}
                  {/* Arrow for linked list */}
                  {isLinkedList && i < elements.length - 1 && (
                    <g>
                      <line
                        x1={x + boxSize + 2}
                        y1={y + boxSize / 2}
                        x2={x + boxSize + gap - 8}
                        y2={y + boxSize / 2}
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth={1.5}
                      />
                      <polygon
                        points={`${x + boxSize + gap - 8},${y + boxSize / 2 - 4} ${x + boxSize + gap - 8},${y + boxSize / 2 + 4} ${x + boxSize + gap},${y + boxSize / 2}`}
                        fill="hsl(var(--muted-foreground))"
                      />
                    </g>
                  )}
                </g>
              );
            })}
          </>
        )}
      </svg>
    </div>
  );
}

// ============ Tree Visualizer ============
interface TreeNodeData {
  val: number;
  left?: TreeNodeData | null;
  right?: TreeNodeData | null;
}

interface TreePos {
  val: number;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}

function layoutTree(node: TreeNodeData | null, x: number, y: number, spread: number, result: TreePos[], parentX?: number, parentY?: number) {
  if (!node) return;
  result.push({ val: node.val, x, y, parentX, parentY });
  if (node.left) layoutTree(node.left, x - spread, y + 64, spread * 0.55, result, x, y);
  if (node.right) layoutTree(node.right, x + spread, y + 64, spread * 0.55, result, x, y);
}

function TreeVisualizer({ treeData }: { treeData: TreeNodeData }) {
  const positions = useMemo(() => {
    const result: TreePos[] = [];
    layoutTree(treeData, 400, 40, 160, result);
    return result;
  }, [treeData]);

  const minX = Math.min(...positions.map(p => p.x)) - 40;
  const maxX = Math.max(...positions.map(p => p.x)) + 40;
  const maxY = Math.max(...positions.map(p => p.y)) + 40;

  return (
    <div className="w-full flex items-center justify-center p-4 overflow-x-auto">
      <svg width={maxX - minX} height={maxY + 20} viewBox={`${minX} 0 ${maxX - minX} ${maxY + 20}`} className="mx-auto">
        {/* Edges */}
        {positions.filter(p => p.parentX !== undefined).map((p, i) => (
          <motion.line
            key={`edge-${i}`}
            x1={p.parentX}
            y1={(p.parentY ?? 0) + 18}
            x2={p.x}
            y2={p.y - 18}
            stroke="hsl(var(--border))"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
        {/* Nodes */}
        {positions.map((p, i) => (
          <g key={`node-${i}`}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={20}
              fill="hsl(var(--secondary))"
              stroke="hsl(var(--primary))"
              strokeWidth={1.5}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.05 }}
            />
            <text
              x={p.x}
              y={p.y + 5}
              textAnchor="middle"
              className="fill-foreground text-xs font-mono font-medium"
            >
              {p.val}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
