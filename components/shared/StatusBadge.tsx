import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STATUS_MAP = {
    pending_review: { label: "Perlu Review", className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" },
    needs_followup: { label: "Tinjau Ulang", className: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800" },
    confirmed: { label: "Terkonfirmasi", className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800" },
    error: { label: "Error", className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800" },
} as const

type StatusKey = keyof typeof STATUS_MAP

export function StatusBadge({ status }: { status: string }) {
    const key = (status in STATUS_MAP ? status : "pending_review") as StatusKey
    const s = STATUS_MAP[key]
    return (
        <Badge variant="outline" className={cn("text-[10px] font-semibold", s.className)}>
            {s.label}
        </Badge>
    )
}
