'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeonButton } from '../ui/NeonButton';
import { Lock, Play, Loader2, Terminal, ShieldAlert, Cpu } from 'lucide-react';

interface AdSlotDProps {
    onComplete: () => void;
}

const TERMINAL_LOGS = [
    "Establishing secure connection...",
    "Bypassing neural firewall...",
    "Decrypting cortex metrics...",
    "Analyzing reaction time patterns...",
    "Synthesizing personality vectors...",
    "Validating checksums...",
    "Optimizing visual buffer...",
    "Access granted. Retrieving payload..."
];

export const AdSlotD = ({ onComplete }: AdSlotDProps) => {
    const [timeLeft, setTimeLeft] = useState(15); // Reduced to 15s for better UX, or keep 30 if revenue critical
    const [logs, setLogs] = useState<string[]>([]);
    const logInterval = useRef<NodeJS.Timeout | null>(null);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Terminal Log Logic
    useEffect(() => {
        let index = 0;
        setLogs([TERMINAL_LOGS[0]]);

        logInterval.current = setInterval(() => {
            index++;
            if (index < TERMINAL_LOGS.length) {
                setLogs(prev => [...prev.slice(-4), TERMINAL_LOGS[index]]);
            }
        }, 2000);

        return () => {
            if (logInterval.current) clearInterval(logInterval.current);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4 font-mono overflow-hidden"
        >
            {/* Background Grid & Glitch Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-purple/50 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-scanline" />

            <div className="w-full max-w-3xl space-y-8 relative z-10">

                {/* Header Section */}
                <div className="text-center space-y-2 relative">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-sm bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-bold tracking-[0.2em] mb-4"
                    >
                        <Lock className="w-3 h-3 animate-pulse" />
                        ENCRYPTED DATA STREAM
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter glitch-text" data-text="DECRYPTING NEURAL PROFILE">
                        DECRYPTING NEURAL PROFILE
                    </h2>
                    <p className="text-neon-purple/80 tracking-widest text-xs uppercase">
                        Secure connection established // Bitrate: 4096 Tbps
                    </p>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Panel: Terminal Logs */}
                    <div className="hidden md:flex flex-col gap-2 p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs h-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/80 to-transparent z-10" />
                        <div className="flex items-center gap-2 text-white/50 mb-2 border-b border-white/5 pb-2">
                            <Terminal className="w-3 h-3" />
                            SYSTEM_LOG
                        </div>
                        <div className="space-y-2 mt-auto">
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-neon-green/80"
                                >
                                    <span className="text-white/30 mr-2">{'>'}</span>
                                    {log}
                                </motion.div>
                            ))}
                            <div className="h-4 w-2 bg-neon-green animate-pulse" />
                        </div>
                    </div>

                    {/* Center/Right: Video Ad Container */}
                    <div className="col-span-1 md:col-span-2 relative aspect-video bg-black rounded-xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.1)] group">

                        {/* Progress Bar Top */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 15, ease: "linear" }}
                                className="h-full bg-neon-purple shadow-[0_0_10px_#a855f7]"
                            />
                        </div>

                        {/* Scanner Line */}
                        <motion.div
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-px bg-neon-purple/50 z-10 box-shadow-[0_0_20px_#a855f7]"
                        />

                        {/* Placeholder Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black">
                            <div className="relative">
                                <div className="absolute inset-0 bg-neon-purple blur-xl opacity-20 animate-pulse" />
                                <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center relative z-10 group-hover:border-neon-purple/50 transition-colors">
                                    <Play className="w-8 h-8 text-white/80 ml-1 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <span className="font-mono text-xs text-white/30 tracking-widest uppercase">
                                SPONSOR_VIDEO_STREAM
                            </span>
                        </div>

                        {/* Countdown Overlay */}
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                            {timeLeft > 0 ? (
                                <>
                                    <Loader2 className="w-3 h-3 text-neon-purple animate-spin" />
                                    <span className="text-xs font-bold text-white font-mono">{timeLeft}s</span>
                                </>
                            ) : (
                                <span className="text-xs font-bold text-neon-green font-mono">COMPLETE</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="flex flex-col items-center gap-4 pt-8">
                    <NeonButton
                        onClick={onComplete}
                        disabled={timeLeft > 0}
                        size="lg"
                        className="w-full max-w-sm h-14 text-lg tracking-widest font-bold"
                        glow={timeLeft === 0}
                        color={timeLeft === 0 ? 'purple' : undefined}
                    >
                        {timeLeft > 0 ? (
                            <span className="flex items-center gap-3 opacity-50">
                                <Cpu className="w-5 h-5 animate-pulse" />
                                PROCESSING DATA...
                            </span>
                        ) : (
                            <span className="flex items-center gap-3">
                                ACCESS PROFILE <ShieldAlert className="w-5 h-5" />
                            </span>
                        )}
                    </NeonButton>

                    <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.3em]">
                        NeuralSync Encryption Standard v4.0
                    </p>
                </div>
            </div>

            <style jsx global>{`
                .animate-scanline {
                    animation: scanline 8s linear infinite;
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                .glitch-text {
                    position: relative;
                }
                .glitch-text::before,
                .glitch-text::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .glitch-text::before {
                    left: 2px;
                    text-shadow: -1px 0 red;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim-1 2s infinite linear alternate-reverse;
                }
                .glitch-text::after {
                    left: -2px;
                    text-shadow: -1px 0 blue;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim-2 3s infinite linear alternate-reverse;
                }
                @keyframes glitch-anim-1 {
                    0% { clip: rect(20px, 9999px, 80px, 0); }
                    100% { clip: rect(30px, 9999px, 100px, 0); }
                }
                @keyframes glitch-anim-2 {
                    0% { clip: rect(65px, 9999px, 100px, 0); }
                    100% { clip: rect(10px, 9999px, 60px, 0); }
                }
            `}</style>
        </motion.div>
    );
};
