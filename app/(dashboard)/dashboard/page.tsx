import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserProjects } from '@/lib/db/queries/projects';
import { MetricCard } from '@/components/ui/metric-card';
import { ProjectCard } from '@/components/ui/project-card';
import { CreateProjectDialog } from '@/components/project/create-project-dialog';
import { FolderKanban, CheckCircle2, CircleDashed, Clock, Target, Plus } from 'lucide-react';
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

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const firstName = user?.name ? user.name.split(' ')[0] : 'there';
  const projects = user?.id ? await getUserProjects(user.id) : [];

  // Compute real metrics from the user's actual database records
  const activeProjectsCount = projects.filter((p) => p.status === 'ACTIVE').length;
  
  // Aggregate tasks from all accessible projects
  const allTasks = projects.flatMap((p) => p.tasks);
  const totalTasksCount = allTasks.length;
  const inProgressTasksCount = allTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const inReviewTasksCount = allTasks.filter((t) => t.status === 'IN_REVIEW').length;
  const doneTasksCount = allTasks.filter((t) => t.status === 'DONE').length;
  const todoTasksCount = allTasks.filter((t) => t.status === 'TODO').length;

  const totalCompletedPercentage = totalTasksCount > 0
    ? Math.round((doneTasksCount / totalTasksCount) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s the live status of your agile projects and tasks.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Metrics Row (Derived strictly from real database records) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Projects"
          value={activeProjectsCount}
          icon={FolderKanban}
          trend={`${projects.length} total projects`}
          trendUp={activeProjectsCount > 0}
        />
        <MetricCard
          title="Total Tasks"
          value={totalTasksCount}
          icon={CircleDashed}
          trend={`${todoTasksCount} remaining in to-do`}
          trendUp={true}
        />
        <MetricCard
          title="In Progress"
          value={inProgressTasksCount}
          icon={Clock}
          trend={`${inReviewTasksCount} in review`}
          trendUp={inProgressTasksCount > 0}
        />
        <MetricCard
          title="Completed Tasks"
          value={doneTasksCount}
          icon={CheckCircle2}
          trend={`${totalCompletedPercentage}% overall completion`}
          trendUp={doneTasksCount > 0}
        />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <FolderKanban className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Welcome to SprintFlow</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            You don&apos;t have any projects yet. Create your first project to start tracking sprints, user stories, and tasks in real-time.
          </p>
          <div className="mt-6">
            <CreateProjectDialog
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Project</span>
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Real Task Distribution Widget */}
            <div className="col-span-1 flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <CircleDashed className="h-5 w-5 text-primary" />
                <h3 className="font-semibold tracking-tight">Task Distribution</h3>
              </div>
              <div className="mt-6 flex-1 flex flex-col justify-center gap-4">
                {totalTasksCount === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No tasks created across your projects yet.
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-slate-500" />
                          <span>To Do</span>
                        </div>
                        <span className="font-medium">{todoTasksCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500" />
                          <span>In Progress</span>
                        </div>
                        <span className="font-medium">{inProgressTasksCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500" />
                          <span>In Review</span>
                        </div>
                        <span className="font-medium">{inReviewTasksCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <span>Done</span>
                        </div>
                        <span className="font-medium">{doneTasksCount}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted">
                      {todoTasksCount > 0 && (
                        <div
                          className="bg-slate-500"
                          style={{ width: `${(todoTasksCount / totalTasksCount) * 100}%` }}
                        />
                      )}
                      {inProgressTasksCount > 0 && (
                        <div
                          className="bg-blue-500"
                          style={{ width: `${(inProgressTasksCount / totalTasksCount) * 100}%` }}
                        />
                      )}
                      {inReviewTasksCount > 0 && (
                        <div
                          className="bg-purple-500"
                          style={{ width: `${(inReviewTasksCount / totalTasksCount) * 100}%` }}
                        />
                      )}
                      {doneTasksCount > 0 && (
                        <div
                          className="bg-green-500"
                          style={{ width: `${(doneTasksCount / totalTasksCount) * 100}%` }}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sprint Progress Widget */}
            <div className="col-span-1 flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold tracking-tight">Active Workspaces</h3>
              </div>
              <div className="mt-6 flex-1 flex flex-col justify-center gap-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Projects</span>
                    <span className="font-semibold text-foreground">{projects.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Active Projects</span>
                    <span className="font-semibold text-foreground">{activeProjectsCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Stories Across Projects</span>
                    <span className="font-semibold text-foreground">
                      {projects.reduce((acc, p) => acc + p._count.stories, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Bugs Tracked</span>
                    <span className="font-semibold text-foreground">
                      {projects.reduce((acc, p) => acc + p._count.bugs, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Workspace Summary */}
            <div className="col-span-1 flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm justify-between">
              <div>
                <h3 className="font-semibold tracking-tight">Quick Actions</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Common operations for your workspaces.
                </p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <CreateProjectDialog
                    trigger={
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Plus className="h-4 w-4 text-primary" />
                        <span>Create New Project</span>
                      </Button>
                    }
                  />
                  <Link href="/projects" className="w-full">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <FolderKanban className="h-4 w-4 text-muted-foreground" />
                      <span>View All Projects</span>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground">
                Role-based access control and team management active.
              </div>
            </div>
          </div>

          {/* Real Recent Projects Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Your Projects</h2>
              <Link href="/projects" className="text-sm text-primary hover:underline font-medium">
                View all ({projects.length})
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => {
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
          </div>
        </>
      )}
    </div>
  );
}
