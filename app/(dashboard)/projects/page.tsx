import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ui/project-card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="mt-2 text-muted-foreground">Manage and track all your projects.</p>
        </div>
        <Button className="shrink-0 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/projects/sprintflow">
          <ProjectCard
            name="SprintFlow"
            description="Project management tool built with Next.js"
            status="Active"
            progress={65}
            taskCount={128}
            members={['EU', 'SA', 'AL']}
            lastUpdated="Updated 2h ago"
          />
        </Link>
        <Link href="/projects/website-redesign">
          <ProjectCard
            name="Website Redesign"
            description="Modernizing the corporate marketing site"
            status="In Progress"
            progress={32}
            taskCount={45}
            members={['MK', 'SA']}
            lastUpdated="Updated 5h ago"
          />
        </Link>
        <Link href="/projects/mobile-app">
          <ProjectCard
            name="Mobile Application"
            description="Cross-platform mobile app"
            status="To Do"
            progress={0}
            taskCount={89}
            members={['AL', 'EU']}
            lastUpdated="Updated 1d ago"
          />
        </Link>
        <Link href="/projects/ai-research">
          <ProjectCard
            name="AI Research Platform"
            description="Internal tooling for AI experiments"
            status="On Hold"
            progress={15}
            taskCount={24}
            members={['EU']}
            lastUpdated="Updated 1w ago"
          />
        </Link>
      </div>
    </div>
  );
}
