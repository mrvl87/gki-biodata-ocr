"use client";

import { UploadCloud, Database, Sparkles, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[100px]" />
      </div>

      <header className="w-full glass-dark py-6 px-10 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">
            GKI <span className="text-primary-foreground/80">BIODATA</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/data">
            <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full px-6">Database</Button>
          </Link>
          <Link href="/upload">
            <Button className="bg-white text-primary hover:bg-slate-100 rounded-full px-6 font-bold shadow-lg shadow-white/5">Mulai Scan</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-10 max-w-6xl flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5" /> Next-Generation OCR
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
            Digitalisasi Data <br />
            <span className="text-primary italic">Tanpa Mengetik.</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Ubah tumpukan formulir kertas menjadi database digital dalam hitungan detik.
            Didukung oleh model AI tercanggih untuk akurasi tinggi.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
        >
          <motion.div variants={item}>
            <Link href="/upload" className="group block h-full rounded-[2.5rem] bg-white p-2 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
              <div className="h-full rounded-[2rem] bg-slate-50 p-8 flex flex-col items-center text-center transition-colors group-hover:bg-primary/5">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Upload Baru</h3>
                <p className="text-slate-500 font-medium">
                  Scan atau foto formulir fisik. AI akan otomatis mendeteksi setiap kolom informasi.
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/data" className="group block h-full rounded-[2.5rem] bg-white p-2 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
              <div className="h-full rounded-[2rem] bg-slate-50 p-8 flex flex-col items-center text-center transition-colors group-hover:bg-emerald-500/5">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-lg flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Database size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Arsip Data</h3>
                <p className="text-slate-500 font-medium">
                  Akses riwayat digitalisasi. Cari jemaat secara instan dan ekspor ke CSV kapan saja.
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
            <div className="h-full rounded-[2.5rem] glass p-10 flex flex-col justify-center border-white shadow-2xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <ShieldCheck size={180} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-black text-slate-900 tracking-tight">Kualitas Terjamin</span>
              </div>
              <p className="text-slate-600 font-medium mb-6 relative z-10">
                Sistem kami memverifikasi setiap input dan menandai data yang membutuhkan validasi manusia.
              </p>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 shadow-sm">
                  +2k
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-[0.3em] opacity-40">
        &copy; 2024 GKI Biodata System &bull; Powered by Anthropic & OpenRouter
      </footer>
    </div>
  );
}
