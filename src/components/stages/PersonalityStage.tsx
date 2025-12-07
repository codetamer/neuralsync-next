'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { HEXACO_ITEMS, ATTENTION_CHECKS } from '../../data/testContent';
import { NeonButton } from '../ui/NeonButton';
import { cn } from '../../lib/utils';

export const PersonalityStage = () => {
    const { recordResponse, nextStage, currentStage, stages } = useTestStore();
    const [value, setValue] = useState(4); // 1-7
    const [startTime, setStartTime] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const stageDef = stages[currentStage];
    // Resolve content: Could be HEXACO Item OR Attention Check
    const hexacoItem = HEXACO_ITEMS.find(i => i.id === stageDef?.contentId);
    const checkItem = ATTENTION_CHECKS.find(c => c.id === stageDef?.contentId);
    const question = hexacoItem || checkItem;

    useEffect(() => {
        setValue(4);
        setStartTime(performance.now());
    }, [currentStage]);

    const handleConfirm = () => {
        const latency = performance.now() - startTime;
        recordResponse({
            choice: value,
            latency_ms: Math.round(latency),
            accuracy: true
        });
        nextStage();
    };

    // Map value to color
    const getColor = (val: number) => {
        if (val < 3) return '#ef4444'; // Red (Disagree)
        if (val < 4) return '#f97316'; // Orange
        if (val === 4) return '#ffffff'; // White (Neutral)
        if (val < 6) return '#22d3ee'; // Teal
        return '#4ade80'; // Green (Agree)
    };

    const getLabel = (val: number) => {
        switch (val) {
            case 1: return "STRONGLY DISAGREE";
            case 2: return "DISAGREE";
            case 3: return "SLIGHTLY DISAGREE";
            case 4: return "NEUTRAL";
            case 5: return "SLIGHTLY AGREE";
            case 6: return "AGREE";
            case 7: return "STRONGLY AGREE";
            default: return "";
        }
    };

    if (!question) return <div>Loading question...</div>;

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5 min-h-[50vh] justify-start md:justify-center select-none py-2">
            <div className="text-center space-y-1">
                <h2 className="text-2xl font-display font-bold text-white">Identity Matrix</h2>
                <p className="text-neural-muted text-sm">Resonate with the statement.</p>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={question.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex flex-col items-center gap-6"
                >
                    <h3 className="text-2xl md:text-3xl text-center font-light leading-snug max-w-xl px-4 min-h-[80px] flex items-center justify-center">
                        "{question.text}"
                    </h3>

                    {/* Orb Resonator Interface */}
                    <div className="relative w-full max-w-xl h-24 flex items-center justify-center my-2">
                        {/* Track Line */}
                        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-neon-red/50 via-white/20 to-neon-green/50" />

                        {/* Ticks */}
                        <div className="absolute inset-x-0 flex justify-between px-4 pointer-events-none">
                            {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                <div
                                    key={n}
                                    className={cn(
                                        "w-1 h-1 rounded-full transition-all duration-300",
                                        n === value ? "bg-white scale-150" : "bg-white/20"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Labels */}
                        <div className="absolute -top-8 left-0 text-xs font-mono text-neon-red tracking-widest">DISAGREE</div>
                        <div className="absolute -top-8 right-0 text-xs font-mono text-neon-green tracking-widest">AGREE</div>

                        {/* The Orb */}
                        <div className="absolute inset-x-0 h-full flex items-center px-4">
                            <input
                                type="range"
                                min="1"
                                max="7"
                                step="1"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                onMouseDown={() => setIsDragging(true)}
                                onMouseUp={() => setIsDragging(false)}
                                onTouchStart={() => setIsDragging(true)}
                                onTouchEnd={() => setIsDragging(false)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />

                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                                animate={{
                                    left: `${((value - 1) / 6) * 100}%`,
                                    x: '-50%'
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <motion.div
                                    animate={{
                                        scale: isDragging ? 1.2 : 1,
                                        boxShadow: `0 0 ${20 + (Math.abs(value - 4) * 10)}px ${getColor(value)}`,
                                        backgroundColor: getColor(value)
                                    }}
                                    className="w-12 h-12 rounded-full blur-[2px]"
                                />
                                <motion.div
                                    animate={{ scale: isDragging ? 1.1 : 1 }}
                                    className="absolute inset-0 bg-white rounded-full mix-blend-overlay"
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Dynamic Label */}
                    <div className="h-8 flex items-center justify-center">
                        <motion.div
                            key={value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xl font-mono font-bold tracking-widest"
                            style={{ color: getColor(value) }}
                        >
                            {getLabel(value)}
                        </motion.div>
                    </div>

                    <NeonButton
                        onClick={handleConfirm}
                        size="lg"
                        className="w-full max-w-xs"
                        variant={value === 4 ? 'secondary' : 'primary'}
                    >
                        CONFIRM RESONANCE
                    </NeonButton>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
