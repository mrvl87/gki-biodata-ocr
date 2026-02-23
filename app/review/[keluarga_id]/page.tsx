"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Sparkles, User, UserPlus, Trash2, Info, CheckCircle2, AlertTriangle, Plus, Loader2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CODE_MAPS, decodeLabel } from "@/lib/codeMaps";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AnggotaForm {
    id: string;
    no_urut: number;
    nama_lengkap: string;
    jenis_kelamin: number | null;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    golongan_darah: number | null;
    jabatan_jemaat: number | null;
    status_baptis: number | null;
    status_sidi: number | null;
    status_pernikahan: number | null;
    tgl_nikah: string | null;
    tempat_nikah: string | null;
    status_hub_keluarga: number | null;
    pendidikan_terakhir: number | null;
    gelar_terakhir: string | null;
    pekerjaan: number | null;
    asal_gereja: string | null;
    nama_ibu: string | null;
    nama_ayah: string | null;
    suku: string | null;
    intra: number | null;
    status_domisili: number | null;
    needs_review: boolean;
    review_fields: string[];
    confidence_score: number | null;
    id_gereja?: string | null;
    [key: string]: any;
}

interface KeluargaForm {
    id: string;
    nama_kepala_keluarga: string;
    jemaat: string | null;
    klasis: string | null;
    alamat: string | null;
    provinsi: string | null;
    kab_kota: string | null;
    telepon: string | null;
    scan_url: string | null;
    scan_url_full: string | null;
    status: string;
    created_at: string;
    [key: string]: any;
}

export default function ReviewPage({ params }: { params: { keluarga_id: string } }) {
    const { keluarga_id } = params;
    const router = useRouter();
    const [keluarga, setKeluarga] = useState<KeluargaForm | null>(null);
    const [anggota, setAnggota] = useState<AnggotaForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null); // track which anggota is being deleted
    const [adding, setAdding] = useState(false);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/families/${keluarga_id}`);
            if (!res.ok) throw new Error("Gagal memuat data");
            const data = await res.json();

            const { anggota_keluarga, ...familyData } = data;
            setKeluarga(familyData);
            setAnggota(anggota_keluarga || []);
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [keluarga_id]);

    useEffect(() => { fetchDetails(); }, [fetchDetails]);

    // --- CRUD Handlers ---

    const updateAnggotaField = (idx: number, field: string, value: any) => {
        setAnggota(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
    };

    const updateKeluargaField = (field: string, value: any) => {
        setKeluarga(prev => prev ? { ...prev, [field]: value } : prev);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`/api/families/${keluarga_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keluarga: {
                        nama_kepala_keluarga: keluarga?.nama_kepala_keluarga,
                        jemaat: keluarga?.jemaat,
                        klasis: keluarga?.klasis,
                        alamat: keluarga?.alamat,
                        provinsi: keluarga?.provinsi,
                        kab_kota: keluarga?.kab_kota,
                        telepon: keluarga?.telepon,
                    },
                    anggota: anggota,
                    action: 'confirm'
                })
            });
            if (!res.ok) throw new Error("Gagal menyimpan");
            showToast("Data berhasil dikonfirmasi!");
            router.push("/data?confirmed=true");
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            setSaving(true);
            const res = await fetch(`/api/families/${keluarga_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keluarga: {
                        nama_kepala_keluarga: keluarga?.nama_kepala_keluarga,
                        jemaat: keluarga?.jemaat,
                        klasis: keluarga?.klasis,
                        alamat: keluarga?.alamat,
                    },
                    anggota: anggota
                })
            });
            if (!res.ok) throw new Error("Gagal menyimpan draft");
            showToast("Draft tersimpan!");
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleFollowUp = async () => {
        try {
            setSaving(true);
            const res = await fetch(`/api/families/${keluarga_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keluarga: {
                        nama_kepala_keluarga: keluarga?.nama_kepala_keluarga,
                        jemaat: keluarga?.jemaat,
                        klasis: keluarga?.klasis,
                        alamat: keluarga?.alamat,
                        provinsi: keluarga?.provinsi,
                        kab_kota: keluarga?.kab_kota,
                        telepon: keluarga?.telepon,
                    },
                    anggota: anggota,
                    action: 'followup'
                })
            });
            if (!res.ok) throw new Error("Gagal menandai follow-up");
            showToast("Data ditandai untuk tinjau ulang");
            router.push("/data?followup=true");
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAnggota = async (anggotaId: string) => {
        try {
            setDeleting(anggotaId);
            const res = await fetch(`/api/families/${keluarga_id}?anggota_id=${anggotaId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Gagal menghapus anggota");
            setAnggota(prev => prev.filter(a => a.id !== anggotaId));
            showToast("Anggota berhasil dihapus");
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setDeleting(null);
        }
    };

    const handleAddAnggota = async () => {
        try {
            setAdding(true);
            const res = await fetch(`/api/families/${keluarga_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama_lengkap: "Anggota Baru" })
            });
            if (!res.ok) throw new Error("Gagal menambah anggota");
            const newAnggota = await res.json();
            setAnggota(prev => [...prev, newAnggota]);
            setExpandedIdx(anggota.length); // expand the new one
            showToast("Anggota baru ditambahkan");
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteFamily = async () => {
        if (!confirm("Hapus seluruh data keluarga ini? Tindakan ini tidak dapat dibatalkan.")) return;
        try {
            setSaving(true);
            const res = await fetch(`/api/families/${keluarga_id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Gagal menghapus");
            router.push("/data");
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    // --- Helpers ---
    const isFlagged = (person: AnggotaForm, field: string) =>
        person.needs_review && person.review_fields?.includes(field);

    const renderField = (
        label: string,
        fieldKey: string,
        value: string | null | number,
        person: AnggotaForm,
        idx: number,
        type: 'text' | 'date' = 'text'
    ) => {
        const flagged = isFlagged(person, fieldKey);
        return (
            <div className="space-y-1">
                <label className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {label}
                    {flagged && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    {!flagged && value && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                </label>
                <Input
                    type={type}
                    value={value ?? ""}
                    onChange={(e) => updateAnggotaField(idx, fieldKey, e.target.value)}
                    className={`h-8 text-sm rounded-lg uppercase ${flagged ? 'border-amber-400 bg-amber-50/50 focus-visible:ring-amber-300' : 'border-border'}`}
                />
            </div>
        );
    };

    // Renders a <select> dropdown for coded fields. Shows descriptive labels, stores numeric codes.
    const renderSelectField = (
        label: string,
        fieldKey: string,
        value: number | null,
        person: AnggotaForm,
        idx: number,
        codeMapKey: keyof typeof CODE_MAPS
    ) => {
        const flagged = isFlagged(person, fieldKey);
        const options = CODE_MAPS[codeMapKey] as Record<number, string>;
        return (
            <div className="space-y-1">
                <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {label}
                    {flagged && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    {!flagged && value != null && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                </label>
                <select
                    value={value ?? ""}
                    onChange={(e) => updateAnggotaField(idx, fieldKey, e.target.value ? Number(e.target.value) : null)}
                    className={`flex h-8 w-full rounded-lg border bg-background px-2 py-1 text-sm uppercase ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${flagged ? 'border-amber-400 bg-amber-50/50 focus-visible:ring-amber-300' : 'border-border'}`}
                >
                    <option value="">— Pilih —</option>
                    {Object.entries(options).map(([code, desc]) => (
                        <option key={code} value={code}>{desc}</option>
                    ))}
                </select>
            </div>
        );
    };

    // --- Render ---
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Memuat Data...</p>
            </div>
        </div>
    );

    if (!keluarga) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <p className="text-muted-foreground font-medium">Data keluarga tidak ditemukan</p>
                <Link href="/data"><Button variant="outline" className="rounded-full">Kembali</Button></Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-2xl shadow-xl text-sm font-bold ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    <h1 className="text-lg font-bold text-foreground tracking-tight">Review Data</h1>
                    <StatusBadge status={keluarga.status} />
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleDeleteFamily} variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 rounded-full text-xs gap-1">
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </Button>
                    <Button onClick={handleSaveDraft} disabled={saving} variant="outline" size="sm" className="rounded-full text-xs">
                        Simpan Draft
                    </Button>
                    <Button onClick={handleFollowUp} disabled={saving} size="sm" variant="outline" className="rounded-full text-xs gap-1 border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/20">
                        <Bookmark className="w-3.5 h-3.5" />
                        Tinjau Ulang
                    </Button>
                    <Button onClick={handleSave} disabled={saving} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs gap-1 px-5">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Konfirmasi
                    </Button>
                </div>
            </div>

            <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-6">

                    {/* Left: Scan Preview */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="surface-raised rounded-2xl p-6 shadow-sm border border-border space-y-4">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-muted-foreground" />
                                <h3 className="font-bold text-foreground text-sm">Scan Asli</h3>
                            </div>
                            {keluarga.scan_url_full && (
                                <img src={keluarga.scan_url_full} alt="Scan" className="rounded-xl border border-border shadow-sm w-full hover:scale-105 transition-transform cursor-zoom-in" />
                            )}
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Status</span>
                                    <Badge className={`text-[10px] rounded-md ${keluarga.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {keluarga.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Total Anggota</span>
                                    <span className="font-bold text-slate-700">{anggota.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Butuh Review</span>
                                    <span className="font-bold text-amber-600">{anggota.filter(a => a.needs_review).length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Dibuat</span>
                                    <span className="font-mono text-slate-600">{new Date(keluarga.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Data Forms */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Family Header Card */}
                        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Kepala Keluarga</h2>
                                    <p className="text-xs text-slate-400">Data utama keluarga</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                                    <Input value={keluarga.nama_kepala_keluarga} onChange={e => updateKeluargaField('nama_kepala_keluarga', e.target.value)} className="h-10 text-base font-bold text-slate-800 rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jemaat</label>
                                    <Input value={keluarga.jemaat || ""} onChange={e => updateKeluargaField('jemaat', e.target.value)} className="h-9 rounded-lg border-slate-200" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Klasis</label>
                                    <Input value={keluarga.klasis || ""} onChange={e => updateKeluargaField('klasis', e.target.value)} className="h-9 rounded-lg border-slate-200" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Provinsi</label>
                                    <Input value={keluarga.provinsi || ""} onChange={e => updateKeluargaField('provinsi', e.target.value)} className="h-9 rounded-lg border-slate-200" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kab/Kota</label>
                                    <Input value={keluarga.kab_kota || ""} onChange={e => updateKeluargaField('kab_kota', e.target.value)} className="h-9 rounded-lg border-slate-200" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat</label>
                                    <Input value={keluarga.alamat || ""} onChange={e => updateKeluargaField('alamat', e.target.value)} className="h-9 rounded-lg border-slate-200" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telepon</label>
                                    <Input value={keluarga.telepon || ""} onChange={e => updateKeluargaField('telepon', e.target.value)} className="h-9 rounded-lg border-slate-200" />
                                </div>
                            </div>
                        </section>

                        {/* Anggota Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <UserPlus className="w-4 h-4 text-slate-400" />
                                    <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs">Anggota Keluarga ({anggota.length})</h3>
                                </div>
                                <Button onClick={handleAddAnggota} disabled={adding} variant="outline" size="sm" className="rounded-full text-xs gap-1 border-dashed">
                                    {adding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                    Tambah
                                </Button>
                            </div>

                            <AnimatePresence>
                                {anggota.map((person, idx) => (
                                    <motion.div
                                        key={person.id}
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16, height: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${person.needs_review ? 'border-amber-200' : 'border-slate-100'
                                            }`}
                                    >
                                        {/* Collapsed Row */}
                                        <button
                                            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                                            className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${person.needs_review ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {person.no_urut}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-slate-800 text-sm">{person.nama_lengkap || "—"}</p>
                                                    <p className="text-[11px] text-slate-400">
                                                        {person.tempat_lahir || "?"}, {person.tanggal_lahir || "?"} · {decodeLabel('hubKeluarga', person.status_hub_keluarga)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {person.id_gereja && (
                                                    <Badge className="bg-blue-100 text-blue-700 border-none text-[10px] font-mono rounded-md">{person.id_gereja}</Badge>
                                                )}
                                                {person.needs_review ? (
                                                    <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] rounded-md">
                                                        <AlertTriangle className="w-3 h-3 mr-1" /> {person.review_fields?.length || 0} field
                                                    </Badge>
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                )}
                                                <span className="text-slate-300 text-xs">{expandedIdx === idx ? '▲' : '▼'}</span>
                                            </div>
                                        </button>

                                        {/* Expanded Form */}
                                        <AnimatePresence>
                                            {expandedIdx === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-slate-100"
                                                >
                                                    <div className="p-5 space-y-4">
                                                        {/* Row 1: Identity */}
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {renderField("Nama Lengkap", "nama_lengkap", person.nama_lengkap, person, idx)}
                                                            {renderField("Tempat Lahir", "tempat_lahir", person.tempat_lahir, person, idx)}
                                                            {renderField("Tanggal Lahir", "tanggal_lahir", person.tanggal_lahir, person, idx, 'date')}
                                                        </div>

                                                        {/* Row 2: Status */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                            {renderSelectField("Jenis Kelamin", "jenis_kelamin", person.jenis_kelamin, person, idx, 'jenisKelamin')}
                                                            {renderSelectField("Gol. Darah", "golongan_darah", person.golongan_darah, person, idx, 'golonganDarah')}
                                                            {renderSelectField("Hub. Keluarga", "status_hub_keluarga", person.status_hub_keluarga, person, idx, 'hubKeluarga')}
                                                            {renderSelectField("Status Domisili", "status_domisili", person.status_domisili, person, idx, 'statusDomisili')}
                                                        </div>

                                                        {/* Row 3: Church */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                            {renderSelectField("Jabatan Jemaat", "jabatan_jemaat", person.jabatan_jemaat, person, idx, 'jabatanJemaat')}
                                                            {renderSelectField("Baptis", "status_baptis", person.status_baptis, person, idx, 'statusBaptisSidi')}
                                                            {renderSelectField("Sidi", "status_sidi", person.status_sidi, person, idx, 'statusBaptisSidi')}
                                                            {renderSelectField("Intra", "intra", person.intra, person, idx, 'intra')}
                                                        </div>

                                                        {/* Row 4: Marriage */}
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {renderSelectField("Status Nikah", "status_pernikahan", person.status_pernikahan, person, idx, 'statusPernikahan')}
                                                            {renderField("Tgl Nikah", "tgl_nikah", person.tgl_nikah, person, idx, 'date')}
                                                            {renderField("Tempat Nikah", "tempat_nikah", person.tempat_nikah, person, idx)}
                                                        </div>

                                                        {/* Row 5: Education & Work */}
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {renderSelectField("Pendidikan", "pendidikan_terakhir", person.pendidikan_terakhir, person, idx, 'pendidikan')}
                                                            {renderField("Gelar", "gelar_terakhir", person.gelar_terakhir, person, idx)}
                                                            {renderSelectField("Pekerjaan", "pekerjaan", person.pekerjaan, person, idx, 'pekerjaan')}
                                                        </div>

                                                        {/* Row 6: Family Origins */}
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {renderField("Nama Ayah", "nama_ayah", person.nama_ayah, person, idx)}
                                                            {renderField("Nama Ibu", "nama_ibu", person.nama_ibu, person, idx)}
                                                            {renderField("Suku", "suku", person.suku, person, idx)}
                                                        </div>

                                                        {/* Row 7: Misc */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {renderField("Asal Gereja", "asal_gereja", person.asal_gereja, person, idx)}
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</label>
                                                                <div className="flex items-center gap-2 h-8">
                                                                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                                        <div className={`h-full rounded-full transition-all ${(person.confidence_score || 0) > 0.7 ? 'bg-emerald-400' :
                                                                            (person.confidence_score || 0) > 0.4 ? 'bg-amber-400' : 'bg-red-400'
                                                                            }`} style={{ width: `${(person.confidence_score || 0) * 100}%` }} />
                                                                    </div>
                                                                    <span className="text-xs font-mono text-slate-500">{((person.confidence_score || 0) * 100).toFixed(0)}%</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex justify-end pt-2 border-t border-slate-50">
                                                            <Button
                                                                onClick={() => handleDeleteAnggota(person.id)}
                                                                disabled={deleting === person.id}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-500 hover:bg-red-50 rounded-full text-xs gap-1"
                                                            >
                                                                {deleting === person.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                                                Hapus Anggota
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
