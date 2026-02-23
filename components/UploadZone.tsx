import { UploadCloud, FileUp, Sparkles } from "lucide-react";
import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
    onUpload: (file: File) => void;
    isLoading: boolean;
}

export default function UploadZone({ onUpload, isLoading }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (isLoading) return;

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                setSelectedFile(file);
                onUpload(file);
            }
        },
        [onUpload, isLoading]
    );

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (isLoading) return;

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onUpload(file);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-2xl mx-auto"
        >
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-80 px-4 py-8 border-2 border-dashed rounded-3xl transition-all duration-500 ease-out overflow-hidden group",
                    isDragging
                        ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                        : "border-slate-200 glass hover:border-primary/40 hover:shadow-2xl",
                    isLoading && "opacity-50 pointer-events-none"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[100px]" />
                </div>

                <input
                    type="file"
                    accept="image/jpeg, image/png, application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <div className="flex flex-col items-center justify-center p-6 text-center z-10 transition-transform duration-500 group-hover:scale-105">
                    <motion.div
                        animate={isDragging ? { y: [0, -10, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={cn(
                            "w-20 h-20 mb-6 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500",
                            isDragging ? "bg-primary text-white" : "bg-white text-primary"
                        )}
                    >
                        {selectedFile ? (
                            <FileUp className="w-10 h-10" />
                        ) : (
                            <UploadCloud className="w-10 h-10" />
                        )}
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {selectedFile ? (
                            <motion.div
                                key="selected"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-1">
                                    {selectedFile.name}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    File siap untuk diproses
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                                    Mulai Digitalisasi
                                </h3>
                                <p className="text-base text-slate-600 max-w-xs mb-6 font-medium leading-relaxed">
                                    Tarik berkas Biodata ke sini atau <span className="text-primary font-bold underline decoration-2 underline-offset-4">telusuri</span> dari perangkat.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-200">
                            <Sparkles className="w-3 h-3 text-blue-500" /> AI OCR Ready
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-200">
                            JPG / PNG
                        </span>
                    </div>
                </div>

                {/* Animated Glow on Drag */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 border-4 border-primary/50 rounded-3xl animate-pulse-glow z-0"
                        />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
