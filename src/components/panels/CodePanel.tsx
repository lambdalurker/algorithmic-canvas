import { cn } from '@/lib/utils';

interface CodePanelProps {
  code: string[];
  activeLine: number;
}

export function CodePanel({ code, activeLine }: CodePanelProps) {
  return (
    <div className="rounded-lg bg-secondary/30 border border-border overflow-hidden">
      <div className="px-3 py-2 border-b border-border">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Pseudocode</span>
      </div>
      <pre className="p-3 text-sm font-mono overflow-x-auto">
        {code.map((line, i) => (
          <div
            key={i}
            className={cn(
              'px-2 py-0.5 rounded-sm transition-colors flex gap-3',
              i === activeLine && 'bg-primary/15 text-primary'
            )}
          >
            <span className="text-muted-foreground/40 select-none w-4 text-right shrink-0 text-xs leading-5">
              {i + 1}
            </span>
            <span className="leading-5">{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
