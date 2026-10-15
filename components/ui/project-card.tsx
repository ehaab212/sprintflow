import { cn } from "@/lib/utils"
import { StatusBadge, type StatusType } from "./status-badge"
import { ArrowRight, CheckCircle2 } from "lucide-react"

interface ProjectCardProps {
  name: string
  description?: string | null
  status: StatusType
  progress: number
  taskCount: number
  members: string[]
  lastUpdated: string
  className?: string
}

export function ProjectCard({
  name,
  description,
  status,
  progress,
  taskCount,
  members,
  lastUpdated,
  className
}: ProjectCardProps) {
  return (
    <div className={cn("group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md cursor-pointer", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground truncate">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description || 'No description provided.'}</p>
        </div>
        <StatusBadge status={status} className="shrink-0" />
      </div>

      <div className="mt-6 flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div 
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div className="flex flex-col gap-2">
          <div className="flex -space-x-2">
            {members.length > 0 ? (
              members.slice(0, 4).map((member, i) => (
                <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-medium text-secondary-foreground">
                  {member}
                </div>
              ))
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-medium text-secondary-foreground">
                —
              </div>
            )}
            {members.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium text-muted-foreground">
                +{members.length - 4}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{lastUpdated}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>{taskCount}</span>
          </div>
          <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
        </div>
      </div>
    </div>
  )
}
