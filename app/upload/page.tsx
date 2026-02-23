"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/UploadZone";
import OcrProgressBar, { OcrStep } from "@/components/OcrProgressBar";
import { Sparkles } from "lucide-react";
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
        <div className="min-h-screen flex flex-col">
            {/* Page header */}
            <div className="border-b border-border px-6 py-5">
                <h1 className="text-xl font-bold text-foreground tracking-tight">Upload Scan</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Unggah foto formulir biodata untuk diproses AI</p>
            </div>

            <main className="flex-1 max-w-3xl w-full mx-auto p-6 lg:p-10 flex flex-col items-center justify-center gap-10">
                <AnimatePresence mode="wait">
                    {step === "idle" || step === "error" ? (
                        <motion.div
                            key="upload-section"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full space-y-8"
                        >
                            <div className="text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-14 h-14 bg-secondary/10 rounded-2xl mx-auto flex items-center justify-center border border-secondary/20"
                                >
                                    <Sparkles className="w-7 h-7 text-secondary" />
                                </motion.div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                                    Unggah <span className="text-primary">Biodata</span>
                                </h2>
                                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                                    Simpan data jemaat secara instan menggunakan <span className="text-foreground font-semibold">Mistral OCR</span> &amp; <span className="text-foreground font-semibold">Gemini</span>.
                                </p>
                            </div>

                            <UploadZone onUpload={handleUpload} isLoading={false} />

                            {step === "error" && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <OcrProgressBar currentStep="error" errorMessage={errorMsg} />
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="progress-section"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <OcrProgressBar currentStep={step} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
