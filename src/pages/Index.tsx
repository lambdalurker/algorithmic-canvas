import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Grid3X3, Zap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  {
    title: 'Sorting Algorithms',
    description: 'Visualize Bubble, Selection, Insertion, Merge, Quick, and Heap Sort with step-by-step animations.',
    icon: BarChart3,
    href: '/sorting/bubble',
    color: 'from-primary/20 to-primary/5',
    items: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort'],
  },
  {
    title: 'Pathfinding Algorithms',
    description: 'Explore BFS, DFS, Dijkstra\'s, and A* on an interactive grid. Draw walls and watch algorithms find the path.',
    icon: Grid3X3,
    href: '/pathfinding/bfs',
    color: 'from-accent/20 to-accent/5',
    items: ['BFS', 'DFS', "Dijkstra's", 'A* Search'],
  },
];

const features = [
  { icon: Zap, title: 'Real-time Animation', desc: 'Watch algorithms execute step by step with smooth SVG animations' },
  { icon: BookOpen, title: 'Learn by Doing', desc: 'Synchronized code highlighting and complexity analysis at each step' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <BarChart3 className="h-3.5 w-3.5" />
              Interactive Algorithm Visualizer
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              <span className="gradient-text">See Algorithms</span>
              <br />
              <span className="text-foreground">Come to Life</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Master sorting and pathfinding algorithms through beautiful, interactive step-by-step visualizations. Watch, learn, and understand.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/sorting/bubble">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link to="/pathfinding/bfs">Pathfinding</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link to={cat.href} className="block group">
                <div className={`glass-card p-6 bg-gradient-to-br ${cat.color} hover:border-primary/30 transition-all duration-300`}>
                  <cat.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map(item => (
                      <span key={item} className="text-xs px-2 py-0.5 rounded-md bg-secondary/50 text-secondary-foreground">{item}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex gap-4"
            >
              <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
