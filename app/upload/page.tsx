"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/UploadZone";
import OcrProgressBar, { OcrStep } from "@/components/OcrProgressBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadPage() {
    const router = useRouter();
    const [step, setStep] = useState<OcrStep>("idle");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const handleUpload = async (file: File) => {
        try {
            setStep("uploading");
            setErrorMsg("");

            const formData = new FormData();
            formData.append("file", file);

            // We start fetching but simulate the UI steps updating since the 
            // actual API call blocks until complete (could take up to 30-40s)

            // Simulate intermediate steps visually for UX while API runs
            const simulateStepsTimeout = setTimeout(() => setStep("extracting"), 2000);
            const simulateParseTimeout = setTimeout(() => setStep("parsing"), 15000);
            const simulateSaveTimeout = setTimeout(() => setStep("saving"), 25000);

            const response = await fetch("/api/ocr", {
                method: "POST",
                body: formData,
            });

            clearTimeout(simulateStepsTimeout);
            clearTimeout(simulateParseTimeout);
            clearTimeout(simulateSaveTimeout);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Gagal memproses gambar.");
            }

            const result = await response.json();
            setStep("complete");

            // Redirect depending on review necessity
            if (result.needs_review) {
                setTimeout(() => {
                    router.push(`/review/${result.keluarga_id}`);
                }, 1500);
            } else {
                setTimeout(() => {
                    router.push(`/data?success=true&keluarga_id=${result.keluarga_id}`);
                }, 1500);
            }

        } catch (err: unknown) {
            console.error(err);
            setStep("error");
            if (err instanceof Error) {
                setErrorMsg(err.message);
            } else {
                setErrorMsg(String(err));
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-100/50 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-100/50 rounded-full blur-[120px]"
                />
            </div>

            <header className="sticky top-0 z-50 w-full glass-dark py-4 px-6 mb-8 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            Digitalisasi <span className="bg-white text-primary px-2 py-0.5 rounded-lg text-sm">PRO</span>
                        </h1>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mt-0.5">
                            GKI Biodata Automation
                        </p>
                    </div>
                </div>

                <Link href="/data">
                    <Button variant="outline" className="hidden sm:flex border-white/20 text-white bg-white/5 hover:bg-white/10 gap-2 rounded-full">
                        <LayoutDashboard className="w-4 h-4" />
                        Database
                    </Button>
                </Link>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col items-center justify-center gap-12 relative">
                <AnimatePresence mode="wait">
                    {step === "idle" || step === "error" ? (
                        <motion.div
                            key="upload-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full space-y-8"
                        >
                            <div className="text-center space-y-4 mb-2">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/5"
                                >
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </motion.div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter sm:text-5xl">
                                    Unggah <span className="text-primary italic">Biodata</span>
                                </h2>
                                <p className="text-slate-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
                                    Simpan data jemaat secara instan menggunakan teknologi <span className="text-slate-900 font-bold">Mistral OCR v2</span> & <span className="text-slate-900 font-bold">Gemini 1.5</span>.
                                </p>
                            </div>

                            <UploadZone onUpload={handleUpload} isLoading={false} />

                            {step === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <OcrProgressBar currentStep="error" errorMessage={errorMsg} />
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="progress-section"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <OcrProgressBar currentStep={step} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Trust Badges */}
                <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Gemini" className="h-6" />
                    <img src="https://mistral.ai/images/logo.svg" alt="Mistral" className="h-4" />
                </div>
            </main>
        </div>
    );
}
