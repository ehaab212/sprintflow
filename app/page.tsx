import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth/session';

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border bg-card/50 backdrop-blur-md">
        <Link className="flex items-center gap-2.5" href="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            SF
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Sprint<span className="text-primary">Flow</span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-3 sm:gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button size="sm">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="container px-4 md:px-6 py-16 md:py-28 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
            SprintFlow 2.0 • Authentication Ready
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
            Plan. Build. Ship. <span className="text-primary">Improve.</span>
          </h1>
          <p className="mx-auto max-w-[650px] text-muted-foreground md:text-xl mt-6">
            The modern Agile project management workspace for high-velocity software engineering teams.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto px-8">Open Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto px-8">Create Free Account</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border flex flex-col sm:flex-row justify-between text-xs text-muted-foreground">
        <p>© 2026 SprintFlow. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Enterprise-grade Agile Workflow Engine</p>
      </footer>
    </div>
  );
}

