import { Menu, Search, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 sm:px-6">
      <Button size="icon" variant="outline" className="sm:hidden shrink-0">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex flex-1 items-center justify-between">
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full max-w-sm sm:w-64 md:w-80 lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search tasks, projects, or people..."
              className="w-full rounded-lg bg-background border border-border h-10 pl-10 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
