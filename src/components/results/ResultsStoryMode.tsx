import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeepInsight } from '../../engine/AnalysisEngine';
import { X, ChevronRight, ChevronLeft, Share2, Download } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';
import html2canvas from 'html2canvas';

interface ResultsStoryModeProps {
    insight: DeepInsight;
    onClose: () => void;
}

export const ResultsStoryMode: React.FC<ResultsStoryModeProps> = ({ insight, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 6;

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onClose();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    // Auto-advance for first slide
    useEffect(() => {
        if (currentSlide === 0) {
            const timer = setTimeout(() => {
                nextSlide();
            }, 3000); // 3 seconds intro
            return () => clearTimeout(timer);
        }
    }, [currentSlide]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        })
    };

    const [direction, setDirection] = useState(0);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection === 1) nextSlide();
        else prevSlide();
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-black text-white flex flex-col overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-50">
                {Array.from({ length: totalSlides }).map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: "0%" }}
                            animate={{
                                width: i < currentSlide ? "100%" : i === currentSlide ? "100%" : "0%"
                            }}
                            transition={{ duration: i === currentSlide ? 5 : 0.3, ease: "linear" }}
                        />
                    </div>
                ))}
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full backdrop-blur-md"
            >
                <X className="w-6 h-6 text-white/80" />
            </button>

            {/* Slide Content */}
            <div className="flex-1 relative w-full h-full flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute w-full h-full max-w-md mx-auto p-6 flex flex-col justify-center items-center text-center"
                    >
                        {/* SLIDE 0: INTRO */}
                        {currentSlide === 0 && (
                            <div className="space-y-6">
                                <motion.div
                                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 blur-xl opacity-70 mx-auto"
                                />
                                <h1 className="text-3xl font-bold font-mono tracking-tighter">
                                    NEURAL SIGNATURE
                                    <br />
                                    DECRYPTED
                                </h1>
                            </div>
                        )}

                        {/* SLIDE 1: HOOK */}
                        {currentSlide === 1 && (
                            <div className="space-y-8">
                                <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                                    RARE.
                                </h2>
                                <p className="text-2xl font-light leading-relaxed">
                                    {insight.storySections?.hook || "You are truly unique."}
                                </p>
                            </div>
                        )}

                        {/* SLIDE 2: ARCHETYPE */}
                        {currentSlide === 2 && (
                            <div className="space-y-6">
                                <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">
                                    Your Archetype
                                </span>
                                <motion.h2
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl font-black text-white"
                                >
                                    {insight.archetype}
                                </motion.h2>
                                <div className="w-48 h-48 mx-auto relative">
                                    {/* Placeholder for elaborate archetype visual/icon */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
                                    <div className="absolute inset-4 border-2 border-white/10 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                        <span className="text-5xl">⚡</span>
                                    </div>
                                </div>
                                <p className="text-lg text-white/80 italic">
                                    "{insight.archetypeDesc}"
                                </p>
                            </div>
                        )}

                        {/* SLIDE 3: FLEX (STRENGTH) */}
                        {currentSlide === 3 && (
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-8 rounded-3xl border border-green-500/30">
                                    <h3 className="text-xl font-bold text-green-400 mb-4">YOUR SUPERPOWER</h3>
                                    <p className="text-2xl font-medium">
                                        {insight.storySections?.flex}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* SLIDE 4: ROAST (WEAKNESS) */}
                        {currentSlide === 4 && (
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-8 rounded-3xl border border-red-500/30">
                                    <h3 className="text-xl font-bold text-red-400 mb-4">THE BRUTAL TRUTH</h3>
                                    <p className="text-2xl font-medium">
                                        {insight.storySections?.roast}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* SLIDE 5: PATH & SHARE */}
                        {currentSlide === 5 && (
                            <div className="space-y-8 w-full">
                                <h3 className="text-2xl font-bold mb-4">Your Trajectory</h3>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                                    <p className="text-xl font-mono text-cyan-300">
                                        {insight.storySections?.path}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 w-full">
                                    <NeonButton
                                        variant="primary"
                                        onClick={onClose}
                                        className="w-full py-4 text-lg"
                                    >
                                        Explore Full Dashboard
                                    </NeonButton>

                                    <button className="flex items-center justify-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                        Share Story
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Areas */}
            <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={() => paginate(-1)} />
            <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={() => paginate(1)} />
        </div>
    );
};
