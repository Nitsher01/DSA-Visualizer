import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const visualizers = [
  {
    href: "/array",
    title: "Array",
    description: "1D and 2D array visualizations with pointers and sliding windows.",
    tags: ["1D Arrays", "2D Arrays", "Pointers"],
    icon: (
      <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-md border border-blue-200 dark:border-blue-800 h-16 w-16 flex items-center justify-center">
        <div className="text-blue-600 dark:text-blue-300 font-mono text-xs text-center">
          <div className="bg-white dark:bg-slate-800 rounded-sm px-1 py-0.5">12</div>
          <div className="bg-white dark:bg-slate-800 rounded-sm px-1 py-0.5 mt-1">34</div>
        </div>
      </div>
    ),
  },
  {
    href: "/stack",
    title: "Stack",
    description: "LIFO data structure with push, pop, and peek operations.",
    tags: ["Push/Pop", "Peek", "Visual Stack"],
    icon: (
      <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="24" width="20" height="4" rx="1" fill="#90CDF4"/>
        <rect x="12" y="18" width="16" height="4" rx="1" fill="#63B3ED"/>
        <rect x="14" y="12" width="12" height="4" rx="1" fill="#4299E1"/>
      </svg>
    ),
  },
  {
    href: "/queue",
    title: "Queue",
    description: "FIFO data structure with enqueue and dequeue operations.",
    tags: ["Enqueue/Dequeue", "Front/Rear", "FIFO"],
    icon: (
      <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20L18 14" stroke="#F6AD55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 20L18 26" stroke="#F6AD55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 14L28 20" stroke="#F6AD55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 26L28 20" stroke="#F6AD55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/heap",
    title: "Heap",
    description: "Binary heap with min/max heap operations and tree visualization.",
    tags: ["Min/Max Heap", "Tree View", "Heapify"],
    icon: (
        <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="14" r="4" fill="#68D391"/>
            <circle cx="14" cy="26" r="4" fill="#9AE6B4"/>
            <circle cx="26" cy="26" r="4" fill="#9AE6B4"/>
            <path d="M20 18V22" stroke="#48BB78" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 22L14 22" stroke="#48BB78" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 22L26 22" stroke="#48BB78" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    ),
  },
  {
    href: "/hashmap",
    title: "HashMap",
    description: "Hash table implementation with collision handling.",
    tags: ["Insert", "Search", "Delete"],
    icon: (
       <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
         <rect x="10" y="16" width="20" height="12" rx="2" fill="#F6E05E"/>
         <path d="M16 16V12C16 9.79086 17.7909 8 20 8C22.2091 8 24 9.79086 24 12V16" stroke="#D69E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
         <circle cx="20" cy="22" r="2" fill="#D69E2E"/>
       </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
              </svg>
              <h1 className="text-xl font-bold">DSA Visualizer</h1>
              <Badge variant="secondary">v1.0</Badge>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visualizers.map((item) => (
            <Link href={item.href} key={item.title} className="group">
              <Card className="h-full transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader className="text-center items-center">
                    {item.icon}
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="mb-2">{item.title}</CardTitle>
                  <CardDescription>
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <section className="text-center mt-20">
          <h3 className="text-3xl font-bold mb-4">Algorithm Visualizer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Link href="/algorithms" className="group">
              <Card className="h-full transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader className="text-center items-center">
                  <span className="text-5xl mb-4">⚙️</span>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="mb-2">Standard Algorithms</CardTitle>
                  <CardDescription>
                    Visualize classic sorting and searching algorithms like Bubble Sort, Merge Sort, and Binary Search.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            <div className="group cursor-not-allowed">
              <Card className="h-full bg-muted/50">
                <CardHeader className="text-center items-center">
                  <span className="text-5xl mb-4">✨</span>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="mb-2">Custom Algorithms</CardTitle>
                  <CardDescription>
                    (Coming Soon) Write your own Python or JavaScript code and see it animated.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 mt-auto bg-background border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 DSA Visualizer. Built for coding interview preparation and algorithm learning.</p>
          <p>Built with vibe coding ❤️</p>
        </div>
      </footer>
    </div>
  );
}
