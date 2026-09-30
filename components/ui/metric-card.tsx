import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  description?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  description,
  className,
}: MetricCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight">{value}</span>
        {trend && (
          <span className={cn("text-sm font-medium", trendUp ? "text-green-500" : "text-red-500")}>
            {trend}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
