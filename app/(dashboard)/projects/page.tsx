import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Button>New Project</Button>
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          <Link href="/projects/1" className="text-blue-600 hover:underline">
            Demo Project
          </Link>
          <p className="text-sm text-muted-foreground mt-1">A placeholder for the project list.</p>
        </div>
      </div>
    </div>
  );
}
