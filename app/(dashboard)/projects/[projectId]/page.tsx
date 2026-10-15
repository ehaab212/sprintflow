import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getAuthorizedProject, getProjectMemberRole } from '@/lib/db/queries/projects';
import { StatusBadge, type StatusType } from '@/components/ui/status-badge';
import { ProjectSettingsDialog } from '@/components/project/project-settings-dialog';
import { Users, Calendar, BarChart3, Clock, ShieldCheck, Layers } from 'lucide-react';
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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user?.id) {
    notFound();
  }

  const resolvedParams = await params;
  const projectParam = resolvedParams.projectId;

  // Enforces server-side authorization: returns null if not found or user is not a member/owner
  const project = await getAuthorizedProject(projectParam, user.id);

  if (!project) {
    notFound();
  }

  const userRole = await getProjectMemberRole(project.id, user.id);
  const canManageSettings = userRole === 'OWNER' || userRole === 'ADMIN';

  // Calculate real task metrics from database
  const totalTasks = project.tasks.length;
  const doneTasks = project.tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const inReviewTasks = project.tasks.filter((t) => t.status === 'IN_REVIEW').length;
  const todoTasks = project.tasks.filter((t) => t.status === 'TODO').length;

  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const activeSprint = project.sprints.find((s) => s.status === 'ACTIVE') || project.sprints[0];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Project Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
              <StatusBadge status={formatProjectStatus(project.status)} className="mt-0.5" />
              {userRole && (
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  {userRole}
                </span>
              )}
            </div>
            <p className="text-base text-muted-foreground max-w-2xl">
              {project.description || 'No description provided for this project.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-2 mr-2">
              {project.members.map((member, i) => (
                <div
                  key={i}
                  title={`${member.user.name || member.user.email} (${member.role})`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium text-secondary-foreground z-10"
                >
                  {getInitials(member.user.name)}
                </div>
              ))}
            </div>

            {canManageSettings && (
              <ProjectSettingsDialog
                projectId={project.id}
                initialData={{
                  name: project.name,
                  description: project.description,
                  status: project.status,
                }}
              />
            )}
          </div>
        </div>

        {/* Navigation Tabs (Overview active, future phases signposted) */}
        <div className="border-b border-border">
          <nav className="flex gap-6 -mb-px overflow-x-auto pb-1">
            <span className="border-b-2 border-primary text-primary px-1 py-4 text-sm font-medium whitespace-nowrap cursor-default">
              Overview
            </span>
            <span className="border-b-2 border-transparent text-muted-foreground px-1 py-4 text-sm font-medium whitespace-nowrap opacity-60 cursor-not-allowed" title="Backlog management coming in Sprint 6">
              Backlog
            </span>
            <span className="border-b-2 border-transparent text-muted-foreground px-1 py-4 text-sm font-medium whitespace-nowrap opacity-60 cursor-not-allowed" title="Kanban board coming in Sprint 8">
              Board
            </span>
            <span className="border-b-2 border-transparent text-muted-foreground px-1 py-4 text-sm font-medium whitespace-nowrap opacity-60 cursor-not-allowed" title="Sprint planning coming in Sprint 7">
              Sprints
            </span>
            <span className="border-b-2 border-transparent text-muted-foreground px-1 py-4 text-sm font-medium whitespace-nowrap opacity-60 cursor-not-allowed" title="Reports coming in Sprint 11">
              Reports
            </span>
          </nav>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Project Progress</h2>
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Overall Completion</span>
              <span className="text-2xl font-bold">{progress}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> Team
                </span>
                <span className="font-semibold">{project.members.length} {project.members.length === 1 ? 'Member' : 'Members'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Created
                </span>
                <span className="font-semibold">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4" /> Status
                </span>
                <span className="font-semibold">{formatProjectStatus(project.status)}</span>
              </div>
            </div>
          </div>

          {/* Current Sprint Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Current Sprint</h2>
            {activeSprint ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{activeSprint.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {activeSprint.goal || 'No goal set for this sprint.'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                    {activeSprint.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-background/50">
                <Layers className="h-8 w-8 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-medium text-foreground">No active sprint</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Sprint creation and planning will be available in Sprint 7.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Task Summary & Metadata Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Task Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="font-semibold">{totalTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Done</span>
                </div>
                <span className="font-medium">{doneTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-muted-foreground">In Progress</span>
                </div>
                <span className="font-medium">{inProgressTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-sm text-muted-foreground">In Review</span>
                </div>
                <span className="font-medium">{inReviewTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-500" />
                  <span className="text-sm text-muted-foreground">To Do</span>
                </div>
                <span className="font-medium">{todoTasks}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Project Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-muted-foreground">Owner</span>
                <span className="font-medium text-foreground">{project.owner.name || project.owner.email}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-muted-foreground">Slug</span>
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground">{project.slug}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Stories</span>
                <span className="font-medium text-foreground">{project._count.stories}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Bugs</span>
                <span className="font-medium text-foreground">{project._count.bugs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
