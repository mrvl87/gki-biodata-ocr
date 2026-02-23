"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Database, Pencil, Trash2, CheckCircle2, AlertTriangle, Loader2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";

interface FamilyRow {
    id: string;
    nama_kepala_keluarga: string;
    jemaat: string | null;
    status: string;
    created_at: string;
    anggota_count: number;
    review_count: number;
}

export default function DataPage() {
    const [families, setFamilies] = useState<FamilyRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const fetchFamilies = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            if (search) params.set("search", search);

            const res = await fetch(`/api/families?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setFamilies(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => {
        const debounce = setTimeout(fetchFamilies, 300);
        return () => clearTimeout(debounce);
    }, [fetchFamilies]);

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus data keluarga ini?")) return;
        try {
            const res = await fetch(`/api/families/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Gagal menghapus");
            setFamilies(prev => prev.filter(f => f.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const statCounts = {
        all: families.length,
        pending: families.filter(f => f.status === 'pending_review').length,
        followup: families.filter(f => f.status === 'needs_followup').length,
        confirmed: families.filter(f => f.status === 'confirmed').length,
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Page header */}
            <div className="border-b border-border px-6 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground tracking-tight">Database Jemaat</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Kelola data keluarga hasil digitalisasi</p>
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: "Total", count: statCounts.all, color: "bg-muted text-foreground", filter: "" },
                        { label: "Perlu Review", count: statCounts.pending, color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300", filter: "pending_review" },
                        { label: "Tinjau Ulang", count: statCounts.followup, color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300", filter: "needs_followup" },
                        { label: "Terkonfirmasi", count: statCounts.confirmed, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300", filter: "confirmed" },
                    ].map(s => (
                        <button
                            key={s.label}
                            onClick={() => setStatusFilter(s.filter)}
                            className={`rounded-xl p-4 text-left transition-all border-2 ${statusFilter === s.filter ? 'border-primary shadow-sm' : 'border-transparent'
                                } ${s.color}`}
                        >
                            <p className="text-2xl font-bold">{s.count}</p>
                            <p className="text-xs font-medium opacity-70">{s.label}</p>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama kepala keluarga..."
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        className="pl-11 h-11 rounded-xl"
                    />
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : families.length === 0 ? (
                    <EmptyState
                        icon={Database}
                        title="Belum ada data"
                        description="Upload scan formulir untuk mulai mendigitalisasi data jemaat."
                        actionLabel="Mulai Scan"
                        actionHref="/upload"
                    />
                ) : (
                    <div className="space-y-2">
                        {families.map((f, idx) => (
                            <motion.div
                                key={f.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="surface-raised rounded-xl p-4 shadow-sm border border-border flex items-center justify-between group hover:border-primary/20 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${f.status === 'confirmed'
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                                        : f.status === 'needs_followup'
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'bg-amber-50 dark:bg-amber-900/20'
                                        }`}>
                                        {f.status === 'confirmed'
                                            ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            : f.status === 'needs_followup'
                                                ? <Bookmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                : <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground uppercase">{f.nama_kepala_keluarga}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                            <span>{f.jemaat || "—"}</span>
                                            <span>·</span>
                                            <span>{f.anggota_count} anggota</span>
                                            {f.review_count > 0 && (
                                                <>
                                                    <span>·</span>
                                                    <span className="text-amber-500 font-semibold">{f.review_count} butuh review</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={f.status} />
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/review/${f.id}`}>
                                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-primary hover:bg-primary/10">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button onClick={() => handleDelete(f.id)} variant="ghost" size="icon" className="rounded-full h-8 w-8 text-destructive hover:bg-destructive/10">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
