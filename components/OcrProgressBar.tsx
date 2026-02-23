import { CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export type OcrStep = "idle" | "uploading" | "extracting" | "parsing" | "saving" | "complete" | "error";

interface OcrProgressBarProps {
    currentStep: OcrStep;
    errorMessage?: string;
}

const steps = [
    { id: "uploading", label: "Mengunggah Gambar", description: "Menyimpan berkas ke server" },
    { id: "extracting", label: "Membaca Teks (OCR)", description: "AI sedang mengekstrak tulisan" },
    { id: "parsing", label: "Strukturisasi Data", description: "Mengubah teks menjadi format digital" },
    { id: "saving", label: "Menyimpan ke Database", description: "Mendaftarkan data jemaat baru" },
];

export default function OcrProgressBar({ currentStep, errorMessage }: OcrProgressBarProps) {
    if (currentStep === "idle") return null;

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
    const isComplete = currentStep === "complete";
    const isError = currentStep === "error";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl mx-auto glass p-8 rounded-[2rem] border-white/40 shadow-2xl relative overflow-hidden"
        >
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">
                        Pemrosesan Cerdas
                    </h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                        GKI Biodata AI Engine
                    </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                </div>
            </div>

            <div className="relative space-y-8">
                {/* Vertical Progress Line */}
                <div className="absolute left-[18px] top-2 bottom-2 w-[2px] bg-slate-100 -z-10" />
                <motion.div
                    className="absolute left-[18px] top-2 w-[2px] bg-primary -z-10"
                    initial={{ height: 0 }}
                    animate={{ height: isComplete ? "100%" : `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {steps.map((step, index) => {
                    const isPassed = isComplete || (currentStepIndex > index && !isError);
                    const isActive = currentStep === step.id;

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-6 group"
                        >
                            <div className="relative flex-shrink-0 mt-1">
                                <AnimatePresence mode="wait">
                                    {isPassed ? (
                                        <motion.div
                                            key="checked"
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        </motion.div>
                                    ) : isActive ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                        >
                                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="idle"
                                            className="w-9 h-9 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center"
                                        >
                                            <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex flex-col">
                                <span className={cn(
                                    "text-base font-bold transition-colors duration-300",
                                    isPassed ? "text-slate-900" : isActive ? "text-primary" : "text-slate-400"
                                )}>
                                    {step.label}
                                </span>
                                <span className={cn(
                                    "text-xs mt-0.5 font-medium transition-colors duration-300",
                                    isActive ? "text-slate-600" : "text-slate-400"
                                )}>
                                    {step.description}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>
                {isError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-8 overflow-hidden"
                    >
                        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 flex gap-3 shadow-inner">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Pemrosesan Gagal</p>
                                <p className="text-red-600 mt-1 leading-relaxed opacity-90">{errorMessage || "Terjadi kesalahan sistem yang tidak terduga."}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
