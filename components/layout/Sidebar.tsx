"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, UploadCloud, Database, Sparkles, PanelLeftClose, PanelLeft } from "lucide-react"

const NAV_ITEMS = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/upload", label: "Upload Scan", icon: UploadCloud },
    { href: "/data", label: "Database", icon: Database },
]

interface SidebarProps {
    collapsed: boolean
    onCollapse: (v: boolean) => void
}

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col bg-primary text-primary-foreground transition-all duration-300",
            collapsed ? "w-16" : "w-64"
        )}>
            {/* Brand */}
            <div className="flex items-center gap-3 px-4 h-14 border-b border-white/10">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-secondary-foreground" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold tracking-tight leading-none">GKI BIODATA</span>
                        <span className="text-[10px] text-primary-foreground/50 font-medium">OCR Scanner</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white/15 text-white"
                                    : "text-primary-foreground/60 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Collapse toggle */}
            <div className="p-2 border-t border-white/10">
                <button
                    onClick={() => onCollapse(!collapsed)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-primary-foreground/50 hover:bg-white/10 hover:text-white transition-colors text-xs"
                >
                    {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                    {!collapsed && <span>Tutup</span>}
                </button>
            </div>
        </aside>
    )
}
