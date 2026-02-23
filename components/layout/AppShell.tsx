"use client"
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <main className={cn(
                "flex-1 flex flex-col overflow-hidden transition-all duration-300",
                collapsed ? "ml-16" : "ml-64"
            )}>
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
