import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { BarChart3, Grid3X3, Home, ArrowUpDown, ArrowDownUp, ListOrdered, GitMerge, Zap, Layers, Search, Route, Navigation, Star, LayoutList, Inbox, Link2, Binary, TreePine } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Home',
    items: [{ title: 'Dashboard', url: '/', icon: Home }],
  },
  {
    label: 'Sorting',
    items: [
      { title: 'Bubble Sort', url: '/sorting/bubble', icon: ArrowUpDown },
      { title: 'Selection Sort', url: '/sorting/selection', icon: ArrowDownUp },
      { title: 'Insertion Sort', url: '/sorting/insertion', icon: ListOrdered },
      { title: 'Merge Sort', url: '/sorting/merge', icon: GitMerge },
      { title: 'Quick Sort', url: '/sorting/quick', icon: Zap },
      { title: 'Heap Sort', url: '/sorting/heap', icon: Layers },
    ],
  },
  {
    label: 'Pathfinding',
    items: [
      { title: 'BFS', url: '/pathfinding/bfs', icon: Search },
      { title: 'DFS', url: '/pathfinding/dfs', icon: Route },
      { title: "Dijkstra's", url: '/pathfinding/dijkstra', icon: Navigation },
      { title: 'A* Search', url: '/pathfinding/astar', icon: Star },
    ],
  },
  {
    label: 'Data Structures',
    items: [
      { title: 'Stack', url: '/ds/stack', icon: LayoutList },
      { title: 'Queue', url: '/ds/queue', icon: Inbox },
      { title: 'Linked List', url: '/ds/linked-list', icon: Link2 },
      { title: 'BST', url: '/ds/bst', icon: Binary },
      { title: 'AVL Tree', url: '/ds/avl', icon: TreePine },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border">
      <div className="h-14 flex items-center px-5 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm tracking-tight">AlgoViz</span>
        </Link>
      </div>
      <SidebarContent className="py-2">
        {navItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium px-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.url}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <div className="mt-auto border-t border-border p-4">
        <p className="text-[11px] text-muted-foreground/50">
          ⌨ Space: Play · ←→: Step
        </p>
      </div>
    </Sidebar>
  );
}
