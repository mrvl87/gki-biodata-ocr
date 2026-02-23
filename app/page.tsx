"use client";

import { UploadCloud, Database, Sparkles, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <main className="flex-1 container mx-auto p-8 lg:p-12 max-w-5xl flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5" /> Mistral OCR Engine
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-6 leading-[1.1]">
            Digitalisasi Data <br />
            <span className="text-primary">Tanpa Mengetik.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ubah tumpukan formulir kertas menjadi database digital dalam hitungan detik.
            Didukung oleh model AI tercanggih untuk akurasi tinggi.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {/* Upload Card */}
          <motion.div variants={item}>
            <Link href="/upload" className="group block h-full rounded-2xl surface-raised p-1 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
              <div className="h-full rounded-xl bg-muted/30 p-8 flex flex-col items-center text-center transition-colors group-hover:bg-primary/5">
                <div className="w-14 h-14 rounded-2xl surface-raised shadow-sm flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Upload Baru</h3>
                <p className="text-muted-foreground text-sm">
                  Scan atau foto formulir fisik. AI akan otomatis mendeteksi setiap kolom informasi.
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Database Card */}
          <motion.div variants={item}>
            <Link href="/data" className="group block h-full rounded-2xl surface-raised p-1 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
              <div className="h-full rounded-xl bg-muted/30 p-8 flex flex-col items-center text-center transition-colors group-hover:bg-emerald-500/5">
                <div className="w-14 h-14 rounded-2xl surface-raised shadow-sm flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Database size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Arsip Data</h3>
                <p className="text-muted-foreground text-sm">
                  Akses riwayat digitalisasi. Cari jemaat secara instan dan ekspor ke CSV kapan saja.
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Quality Card */}
          <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
            <div className="h-full rounded-2xl surface-raised p-8 flex flex-col justify-center border border-border shadow-sm relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-5">
                <ShieldCheck size={140} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-bold text-foreground tracking-tight">Kualitas Terjamin</span>
              </div>
              <p className="text-muted-foreground text-sm mb-5 relative z-10">
                Sistem kami memverifikasi setiap input dan menandai data yang membutuhkan validasi manusia.
              </p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/80?img=${i + 10}`} alt="avatar" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary/10 flex items-center justify-center text-[9px] font-bold text-secondary shadow-sm">
                  +2k
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-8 text-center text-muted-foreground text-xs font-medium opacity-40">
        &copy; 2026 GKI Biodata System &bull; Powered by Mistral AI &amp; OpenRouter
      </footer>
    </div>
  );
}
