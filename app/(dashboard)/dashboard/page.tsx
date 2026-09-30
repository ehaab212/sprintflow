import { MetricCard } from '@/components/ui/metric-card';
import { ProjectCard } from '@/components/ui/project-card';
import { FolderKanban, CheckCircle2, CircleDashed, Clock, Activity, Target } from 'lucide-react';

import { getCurrentUser } from '@/lib/auth/session';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {firstName} 👋</h1>
        <p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening with your projects today.</p>
      </div>

      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Projects"
          value={3}
          icon={FolderKanban}
          trend="+1 from last month"
          trendUp={true}
        />
        <MetricCard
          title="My Tasks"
          value={12}
          icon={CircleDashed}
          trend="-2 from yesterday"
          trendUp={true}
        />
        <MetricCard
          title="In Progress"
          value={5}
          icon={Clock}
          trend="On track"
          trendUp={true}
        />
        <MetricCard
          title="Completed"
          value={24}
          icon={CheckCircle2}
          trend="+12% from last week"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold tracking-tight">Sprint Progress</h3>
          </div>
          <div className="mt-6 flex-1">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">Sprint 12</p>
                <p className="text-xs text-muted-foreground">Ending in 3 days</p>
              </div>
              <span className="text-2xl font-bold">68%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden mt-4">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: '68%' }} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-semibold mt-1">24 pts</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold mt-1">11 pts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <CircleDashed className="h-5 w-5 text-primary" />
            <h3 className="font-semibold tracking-tight">Task Distribution</h3>
          </div>
          <div className="mt-6 flex-1 flex flex-col justify-center gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-500" />
                  <span>To Do</span>
                </div>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>In Progress</span>
                </div>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span>In Review</span>
                </div>
                <span className="font-medium">4</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Done</span>
                </div>
                <span className="font-medium">24</span>
              </div>
            </div>
            <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full">
              <div className="bg-slate-500" style={{ width: '25%' }} />
              <div className="bg-blue-500" style={{ width: '16%' }} />
              <div className="bg-purple-500" style={{ width: '8%' }} />
              <div className="bg-green-500" style={{ width: '51%' }} />
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold tracking-tight">Recent Activity</h3>
          </div>
          <div className="mt-6 flex-1 space-y-6">
            <div className="relative flex gap-4">
              <div className="absolute left-[15px] top-8 h-full w-px bg-border" />
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground z-10">
                EU
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Ehaab</span> completed <span className="font-medium">API integration</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="relative flex gap-4">
              <div className="absolute left-[15px] top-8 h-full w-px bg-border" />
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground z-10">
                SA
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Sarah</span> moved <span className="font-medium">Authentication</span> to In Progress
                </p>
                <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
              </div>
            </div>
            <div className="relative flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground z-10">
                AL
              </div>
              <div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Ali</span> created a new task <span className="font-medium">Design System</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Recent Projects</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            name="SprintFlow Redesign"
            description="Premium SaaS UI/UX overhaul"
            status="In Progress"
            progress={45}
            taskCount={32}
            members={['EU', 'SA']}
            lastUpdated="Updated 2h ago"
          />
          <ProjectCard
            name="Marketing Website"
            description="New landing pages for Q4"
            status="Active"
            progress={80}
            taskCount={14}
            members={['AL', 'MK', 'EU']}
            lastUpdated="Updated 1d ago"
          />
          <ProjectCard
            name="Mobile Application"
            description="React Native iOS app"
            status="To Do"
            progress={0}
            taskCount={56}
            members={['SA']}
            lastUpdated="Created 2d ago"
          />
        </div>
      </div>
    </div>
  );
}
