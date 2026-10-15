import { cn } from "@/lib/utils"

export type StatusType = "Active" | "Completed" | "In Progress" | "On Hold" | "To Do" | "In Review" | "Done" | "Archived"
export type PriorityType = "High" | "Medium" | "Low"

interface StatusBadgeProps {
  status?: StatusType
  priority?: PriorityType
  className?: string
}

export function StatusBadge({ status, priority, className }: StatusBadgeProps) {
  let bg = "bg-muted"
  let text = "text-muted-foreground"
  const label = status || priority

  if (status) {
    switch (status) {
      case "Active":
      case "In Progress":
        bg = "bg-blue-500/10"
        text = "text-blue-500"
        break
      case "Completed":
      case "Done":
        bg = "bg-green-500/10"
        text = "text-green-500"
        break
      case "On Hold":
        bg = "bg-amber-500/10"
        text = "text-amber-500"
        break
      case "In Review":
        bg = "bg-purple-500/10"
        text = "text-purple-500"
        break
      case "To Do":
        bg = "bg-slate-500/10"
        text = "text-slate-400"
        break
      case "Archived":
        bg = "bg-zinc-500/10"
        text = "text-zinc-400"
        break
    }
  } else if (priority) {
    switch (priority) {
      case "High":
        bg = "bg-red-500/10"
        text = "text-red-500"
        break
      case "Medium":
        bg = "bg-amber-500/10"
        text = "text-amber-500"
        break
      case "Low":
        bg = "bg-blue-500/10"
        text = "text-blue-500"
        break
    }
  }

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", bg, text, className)}>
      {label}
    </span>
  )
}
