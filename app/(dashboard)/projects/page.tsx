import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserProjects } from '@/lib/db/queries/projects';
import { ProjectCard } from '@/components/ui/project-card';
import { CreateProjectDialog } from '@/components/project/create-project-dialog';
import { FolderKanban, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StatusType } from '@/components/ui/status-badge';
import type { ProjectStatus } from '@prisma/client';

function formatProjectStatus(status: ProjectStatus): StatusType {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'ON_HOLD':
      return 'On Hold';
    case 'COMPLETED':
      return 'Completed';
    case 'ARCHIVED':
      return 'Archived';
    default:
      return 'Active';
  }
}

function getInitials(name?: string | null): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `Updated ${diffMins}m ago`;
  if (diffHours < 24) return `Updated ${diffHours}h ago`;
  if (diffDays === 1) return 'Updated yesterday';
  if (diffDays < 7) return `Updated ${diffDays}d ago`;
  return `Updated ${new Date(date).toLocaleDateString()}`;
}

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  const projects = user?.id ? await getUserProjects(user.id) : [];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="mt-2 text-muted-foreground">Manage and track your active agile workspaces.</p>
        </div>
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <FolderKanban className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">No projects found</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            You don&apos;t have access to any projects yet. Create your first workspace to start organizing user stories, sprints, and tasks.
          </p>
          <div className="mt-6">
            <CreateProjectDialog
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Your First Project</span>
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const doneTasks = project.tasks.filter((t) => t.status === 'DONE').length;
            const progress = project.tasks.length > 0
              ? Math.round((doneTasks / project.tasks.length) * 100)
              : 0;

            const memberInitials = project.members.map((m) => getInitials(m.user.name));

            return (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <ProjectCard
                  name={project.name}
                  description={project.description}
                  status={formatProjectStatus(project.status)}
                  progress={progress}
                  taskCount={project._count.tasks}
                  members={memberInitials}
                  lastUpdated={formatRelativeTime(project.updatedAt)}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
