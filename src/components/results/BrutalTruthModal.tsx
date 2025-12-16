'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Check, XCircle } from 'lucide-react';
import { useState } from 'react';

interface BrutalTruthModalProps {
    truth: string;
    onAcknowledge: () => void;
}

export const BrutalTruthModal = ({ truth, onAcknowledge }: BrutalTruthModalProps) => {
    const [isShimmying, setIsShimmying] = useState(false);

    const handleReject = () => {
        setIsShimmying(true);
        setTimeout(() => setIsShimmying(false), 500);
    };

    return (
        <div className="fixed inset-0 z-[1500] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black animate-pulse" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative max-w-2xl w-full border-2 border-red-600/50 bg-neutral-900/90 rounded-none p-8 md:p-12 text-center shadow-[0_0_100px_rgba(220,38,38,0.3)]"
            >
                {/* Warning Tape */}
                <div className="absolute -top-6 -left-6 -right-6 h-12 bg-yellow-400 text-black font-black flex items-center justify-center overflow-hidden transform -rotate-1 shadow-lg">
                    <div className="flex gap-4 animate-marquee whitespace-nowrap">
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 fill-black" /> WARNING: EGO HAZARD DETECTED
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-8 space-y-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-red-500 font-mono tracking-[0.2em] text-sm uppercase mb-4">
                            Analysis Conclusion #1
                        </h2>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase drop-shadow-2xl">
                            {truth}
                        </h1>
                    </motion.div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-red-900 to-transparent" />

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onAcknowledge}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-none uppercase tracking-widest flex items-center gap-3 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                        >
                            <Check className="w-5 h-5" />
                            I Accept This Flaw
                        </motion.button>

                        <motion.button
                            animate={isShimmying ? { x: [-5, 5, -5, 5, 0] } : {}}
                            onClick={handleReject}
                            className="text-neutral-500 hover:text-red-400 font-mono text-xs uppercase tracking-widest py-4 px-8 flex items-center gap-2 transition-colors cursor-not-allowed"
                        >
                            <XCircle className="w-4 h-4" />
                            Deny Reality
                        </motion.button>
                    </div>

                    <p className="text-neutral-600 text-[10px] font-mono mt-4">
                        *Denial is statistically correlated with lower growth potential.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
