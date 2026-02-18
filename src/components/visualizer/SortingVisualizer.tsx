import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSortingStore } from '@/store/useSortingStore';

export function SortingVisualizer() {
  const { steps, currentStep, array } = useSortingStore();
  const step = steps[currentStep];
  const displayArray = step ? step.array : array;
  const maxVal = useMemo(() => Math.max(...displayArray, 1), [displayArray]);

  const barWidth = Math.max(2, Math.min(40, 800 / displayArray.length - 2));
  const gap = Math.max(1, Math.min(4, barWidth * 0.15));
  const svgWidth = displayArray.length * (barWidth + gap);
  const svgHeight = 300;

  const getBarColor = (index: number): string => {
    if (!step) return 'hsl(var(--vis-default))';
    if (step.sorted.includes(index)) return 'hsl(var(--vis-sorted))';
    if (step.swapping.includes(index)) return 'hsl(var(--vis-swap))';
    if (step.comparing.includes(index)) return 'hsl(var(--vis-compare))';
    if (step.active.includes(index)) return 'hsl(var(--vis-active))';
    return 'hsl(var(--vis-default))';
  };

  return (
    <div className="w-full flex items-end justify-center p-4 overflow-x-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="mx-auto"
      >
        {displayArray.map((value, i) => {
          const height = (value / maxVal) * (svgHeight - 20);
          const x = i * (barWidth + gap);
          const y = svgHeight - height;
          return (
            <motion.rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={height}
              rx={Math.min(3, barWidth / 4)}
              fill={getBarColor(i)}
              initial={false}
              animate={{ y, height, fill: getBarColor(i) }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
            />
          );
        })}
      </svg>
    </div>
  );
}
