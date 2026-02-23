"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Database, Pencil, Trash2, CheckCircle2, AlertTriangle, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
        confirmed: families.filter(f => f.status === 'confirmed').length,
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/20 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900 py-3 px-6 md:px-10 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-amber-400" />
                    <h1 className="text-lg font-black text-white tracking-tight">Database Jemaat</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/upload">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full text-xs gap-1 px-5">
                            <FileText className="w-3.5 h-3.5" /> Scan Baru
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-white/10 rounded-full text-xs">Home</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto p-4 md:p-8 max-w-5xl space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Total", count: statCounts.all, color: "bg-slate-100 text-slate-700", filter: "" },
                        { label: "Perlu Review", count: statCounts.pending, color: "bg-amber-100 text-amber-700", filter: "pending_review" },
                        { label: "Terkonfirmasi", count: statCounts.confirmed, color: "bg-emerald-100 text-emerald-700", filter: "confirmed" },
                    ].map(s => (
                        <button
                            key={s.label}
                            onClick={() => setStatusFilter(s.filter)}
                            className={`rounded-2xl p-4 text-left transition-all border-2 ${statusFilter === s.filter ? 'border-primary shadow-md' : 'border-transparent'
                                } ${s.color}`}
                        >
                            <p className="text-2xl font-black">{s.count}</p>
                            <p className="text-xs font-bold opacity-70">{s.label}</p>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Cari nama kepala keluarga..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-11 h-11 rounded-xl border-slate-200 bg-white shadow-sm"
                    />
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : families.length === 0 ? (
                    <div className="text-center py-20 space-y-3">
                        <Database className="w-12 h-12 text-slate-200 mx-auto" />
                        <p className="text-slate-400 font-medium">Belum ada data</p>
                        <Link href="/upload">
                            <Button className="rounded-full mt-2">Mulai Scan</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {families.map((f, idx) => (
                            <motion.div
                                key={f.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-primary/20 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.status === 'confirmed' ? 'bg-emerald-100' : 'bg-amber-100'
                                        }`}>
                                        {f.status === 'confirmed'
                                            ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            : <AlertTriangle className="w-5 h-5 text-amber-600" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{f.nama_kepala_keluarga}</p>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span>{f.jemaat || "—"}</span>
                                            <span>·</span>
                                            <span>{f.anggota_count} anggota</span>
                                            {f.review_count > 0 && (
                                                <>
                                                    <span>·</span>
                                                    <span className="text-amber-500 font-bold">{f.review_count} butuh review</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/review/${f.id}`}>
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-primary hover:bg-primary/10">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button onClick={() => handleDelete(f.id)} variant="ghost" size="icon" className="rounded-full h-8 w-8 text-red-400 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
