import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Settings, Users, Calendar, BarChart3, Clock, ArrowRight } from 'lucide-react';

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  // Using Promise to unwrap params correctly as per Next.js App Router async params rule
  const resolvedParams = await params;
  const projectId = resolvedParams.projectId;
  const projectName = projectId === 'sprintflow' ? 'SprintFlow' 
    : projectId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Project Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{projectName}</h1>
              <StatusBadge status="Active" className="mt-1" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Project management tool built with Next.js App Router, Tailwind CSS, and a modern SaaS interface.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex -space-x-2 mr-2">
              {['EU', 'SA', 'AL'].map((member, i) => (
                <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium text-secondary-foreground z-10">
                  {member}
                </div>
              ))}
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button>View Board</Button>
          </div>
        </div>

        {/* Tabs (UI Only) */}
        <div className="border-b border-border">
          <nav className="flex gap-6 -mb-px overflow-x-auto pb-1">
            <a href="#" className="border-b-2 border-primary text-primary px-1 py-4 text-sm font-medium whitespace-nowrap">
              Overview
            </a>
            <a href="#" className="border-b-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground px-1 py-4 text-sm font-medium whitespace-nowrap">
              Backlog
            </a>
            <a href="#" className="border-b-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground px-1 py-4 text-sm font-medium whitespace-nowrap">
              Board
            </a>
            <a href="#" className="border-b-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground px-1 py-4 text-sm font-medium whitespace-nowrap">
              Sprints
            </a>
            <a href="#" className="border-b-2 border-transparent text-muted-foreground hover:border-border hover:text-foreground px-1 py-4 text-sm font-medium whitespace-nowrap">
              Reports
            </a>
          </nav>
        </div>
      </div>

      {/* Overview Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold tracking-tight mb-4">Project Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Overall Completion</span>
              <span className="text-2xl font-bold">65%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary transition-all rounded-full" style={{ width: '65%' }} />
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Users className="h-4 w-4"/> Team</span>
                <span className="font-semibold">3 Members</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Calendar className="h-4 w-4"/> Due Date</span>
                <span className="font-semibold">Oct 15, 2026</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><BarChart3 className="h-4 w-4"/> Status</span>
                <span className="font-semibold text-green-500">On Track</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold tracking-tight mb-4">Current Sprint (Sprint 12)</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Frontend Redesign</h4>
                    <p className="text-xs text-muted-foreground">Ends in 3 days</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">View <ArrowRight className="h-3 w-3" /></Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Backend API V2</h4>
                    <p className="text-xs text-muted-foreground">Starts Oct 20</p>
                  </div>
                </div>
                <StatusBadge status="To Do" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold tracking-tight mb-4">Task Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="font-semibold">128</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Done</span>
                </div>
                <span className="font-medium">84</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-muted-foreground">In Progress</span>
                </div>
                <span className="font-medium">21</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-500" />
                  <span className="text-sm text-muted-foreground">To Do</span>
                </div>
                <span className="font-medium">23</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold tracking-tight mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground mt-0.5">
                  EU
                </div>
                <div className="text-sm">
                  <p className="text-foreground">Merged <span className="font-medium">UI Redesign</span></p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground mt-0.5">
                  SA
                </div>
                <div className="text-sm">
                  <p className="text-foreground">Commented on <span className="font-medium">Auth Issue</span></p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
