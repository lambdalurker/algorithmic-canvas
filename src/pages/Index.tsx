import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Grid3X3,
  Zap,
  BookOpen,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    title: "Sorting Algorithms",
    description:
      "Visualize Bubble, Selection, Insertion, Merge, Quick, and Heap Sort with step-by-step animations.",
    icon: BarChart3,
    href: "/sorting/bubble",
    color: "bg-amber-100/70",
    items: [
      "Bubble Sort",
      "Selection Sort",
      "Insertion Sort",
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
    ],
  },
  {
    title: "Pathfinding Algorithms",
    description:
      "Explore BFS, DFS, Dijkstra's, and A* on an interactive grid. Draw walls and watch algorithms find the path.",
    icon: Grid3X3,
    href: "/pathfinding/bfs",
    color: "bg-emerald-100/70",
    items: ["BFS", "DFS", "Dijkstra's", "A* Search"],
  },
  {
    title: "Data Structures",
    description:
      "Visualize Stack, Queue, Linked List, BST, and AVL Tree operations with step-by-step animations.",
    icon: Layers,
    href: "/ds/stack",
    color: "bg-violet-100/70",
    items: ["Stack", "Queue", "Linked List", "BST", "AVL Tree"],
  },
];

const features = [
  {
    icon: Zap,
    title: "Real-time Animation",
    desc: "Watch algorithms execute step by step with smooth SVG animations",
  },
  {
    icon: BookOpen,
    title: "Learn by Doing",
    desc: "Synchronized code highlighting and complexity analysis at each step",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 border border-border/60 text-primary text-xs font-semibold tracking-wide mb-6 shadow-sm">
              <BarChart3 className="h-3.5 w-3.5" />
              Interactive Algorithm Visualizer
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-foreground">
              See Algorithms
              <br />
              Come to Life
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Master sorting and pathfinding algorithms through beautiful,
              interactive step-by-step visualizations. Watch, learn, and
              understand.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full px-6 shadow-md shadow-primary/20"
              >
                <Link to="/sorting/bubble">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-6 bg-card/70"
              >
                <Link to="/pathfinding/bfs">Pathfinding</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link to={cat.href} className="block group">
                <div
                  className={`paper-card p-6 ${cat.color} transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg`}
                >
                  <div className="h-10 w-10 rounded-2xl bg-card/70 border border-border/60 flex items-center justify-center mb-4">
                    <cat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {cat.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2 py-0.5 rounded-md bg-secondary/60 text-secondary-foreground"
                      >
                        {item}
                      </span>
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
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex gap-4 rounded-2xl bg-card/70 border border-border/60 p-5"
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
