import Link from 'next/link';
import { LayoutDashboard, FolderKanban, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
          <span className="font-bold">SF</span>
          <span className="sr-only">SprintFlow</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="sr-only">Dashboard</span>
        </Link>
        <Link
          href="/projects"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
          <FolderKanban className="h-5 w-5" />
          <span className="sr-only">Projects</span>
        </Link>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="#"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
