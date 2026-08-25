import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl tracking-tight">SprintFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4 flex items-center" href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center bg-muted/50">
        <div className="container px-4 md:px-6 py-12 md:py-24 lg:py-32 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Plan. Build. Ship. Improve.
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            The modern Agile project management workspace for software teams.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t flex flex-col sm:flex-row">
        <p className="text-xs text-muted-foreground">© 2026 SprintFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
