import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <Button className="rounded-full">{actionLabel}</Button>
                </Link>
            )}
        </div>
    )
}
