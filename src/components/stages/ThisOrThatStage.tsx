'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { HEXACO_ITEMS, ATTENTION_CHECKS } from '../../data/testContent';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

/**
 * ThisOrThatStage - Binary choice personality assessment
 * 
 * Instead of a 7-point slider, users choose between two opposing statements.
 * This is faster and more engaging while still capturing trait direction.
 */

interface QuestionPair {
    id: string;
    statementA: string;
    statementB: string;
    category: 'honesty' | 'emotionality' | 'extraversion' | 'agreeableness' | 'conscientiousness' | 'openness';
    // Which side is "high trait"? A or B
    highTraitSide: 'A' | 'B';
}



export const ThisOrThatStage = () => {
    const { recordResponse, nextStage, currentStage, stages } = useTestStore();
    const [startTime, setStartTime] = useState(0);
    const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentPair, setCurrentPair] = useState<QuestionPair | null>(null);

    const stageDef = stages[currentStage];

    // Initialize pair from current stage content
    useEffect(() => {
        setStartTime(performance.now());
        setSelectedSide(null);

        if (stageDef && stageDef.contentId) {
            // Find the primary item assigned to this stage
            const primaryItem = HEXACO_ITEMS.find(i => i.id === stageDef.contentId);

            if (primaryItem) {
                // Find a complementary item (same category, opposite polarity)
                const opponent = HEXACO_ITEMS.find(i =>
                    i.category === primaryItem.category &&
                    i.reverse !== primaryItem.reverse &&
                    i.id !== primaryItem.id
                );

                // Fallback: if no perfect opposite, find any other item in category
                const fallback = !opponent ? HEXACO_ITEMS.find(i => i.category === primaryItem.category && i.id !== primaryItem.id) : null;
                const other = opponent || fallback;

                if (other) {
                    // Normalize: Side A is always high trait, Side B is low trait (reversed)
                    // If primary is Normal, it goes to A. if primary is Reverse, it goes to B.
                    const isPrimaryNormal = !primaryItem.reverse;

                    setCurrentPair({
                        id: stageDef.contentId,
                        statementA: isPrimaryNormal ? primaryItem.text : other.text,
                        statementB: isPrimaryNormal ? other.text : primaryItem.text,
                        category: primaryItem.category,
                        highTraitSide: 'A'
                    });
                }
            } else if (stageDef.type === 'personality') {
                // Fallback for missing ID - random pair
                const randomItem = HEXACO_ITEMS[Math.floor(Math.random() * HEXACO_ITEMS.length)];
                if (randomItem) {
                    setCurrentPair({
                        id: 'random',
                        statementA: randomItem.text,
                        statementB: "I behave in the opposite way.",
                        category: randomItem.category,
                        highTraitSide: 'A'
                    });
                }
            }
        }
    }, [stageDef, currentStage]);

    const handleChoice = useCallback((side: 'A' | 'B') => {
        if (isAnimating || !currentPair) return;

        setIsAnimating(true);
        setSelectedSide(side);

        const latency = performance.now() - startTime;

        // Convert binary choice to score
        // Side A (High Trait) = 6, Side B (Low Trait) = 2
        const isHighTrait = side === currentPair.highTraitSide;
        const scoreValue = isHighTrait ? 6 : 2;

        // Add randomization for distribution
        const finalScore = scoreValue + (Math.random() > 0.5 ? 1 : 0);

        setTimeout(() => {
            recordResponse({
                choice: Math.min(7, Math.max(1, finalScore)),
                latency_ms: Math.round(latency),
                accuracy: true // Personality has no wrong answers
            });

            nextStage(); // Move to next stage immediately
            setIsAnimating(false);
        }, 300);
    }, [currentPair, startTime, isAnimating, recordResponse, nextStage]);

    // Swipe and Keyboard handlers...
    const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 100) {
            handleChoice(info.offset.x < 0 ? 'A' : 'B');
        }
    }, [handleChoice]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            handleChoice('A');
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            handleChoice('B');
        }
    }, [handleChoice]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Animation values
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-5, 5]);
    const opacityA = useTransform(x, [-150, 0], [0.5, 1]);
    const opacityB = useTransform(x, [0, 150], [1, 0.5]);

    if (!currentPair) return null;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 min-h-[60vh] justify-center select-none py-8 px-4">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-neon-purple/20 rounded-lg">
                        <Zap className="w-6 h-6 text-neon-purple" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-wide">
                        Preference Pulse
                    </h2>
                </div>
                <p className="text-neural-muted text-sm font-medium tracking-wide uppercase opacity-70">
                    Which statement describes you better?
                </p>
                {/* Removed internal count as ProgressBar handles global progress */}
            </div>

            {/* Card Container */}
            <motion.div
                key={currentPair.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="relative w-full"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Option A */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoice('A')}
                        disabled={isAnimating}
                        style={{ opacity: opacityA }}
                        className={cn(
                            "group relative p-8 rounded-3xl border transition-all duration-300 min-h-[280px] flex flex-col justify-center items-center text-center gap-6 overflow-hidden backdrop-blur-md",
                            selectedSide === 'A'
                                ? "border-neon-purple bg-neon-purple/20 shadow-[0_0_50px_rgba(167,139,250,0.3)] z-10"
                                : "border-white/10 bg-white/5 hover:border-neon-purple/50 hover:bg-neon-purple/5 hover:shadow-[0_0_30px_rgba(167,139,250,0.1)]"
                        )}
                    >
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-xl md:text-2xl font-display font-medium text-white/90 leading-relaxed max-w-sm">
                                "{currentPair.statementA}"
                            </p>
                        </div>
                        <div className="text-xs font-mono text-neon-purple/50 uppercase tracking-widest bg-neon-purple/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            Select Option A
                        </div>
                    </motion.button>

                    {/* VS Badge */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:flex">
                        <div className="w-16 h-16 rounded-full bg-[#0B1120] border-2 border-white/10 flex items-center justify-center shadow-xl">
                            <span className="text-sm font-bold text-white/40">VS</span>
                        </div>
                    </div>
                    <div className="flex md:hidden items-center justify-center -my-3 z-20 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-[#0B1120] border border-white/10 flex items-center justify-center shadow-xl">
                            <span className="text-xs font-bold text-white/40">VS</span>
                        </div>
                    </div>

                    {/* Option B */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoice('B')}
                        disabled={isAnimating}
                        style={{ opacity: opacityB }}
                        className={cn(
                            "group relative p-8 rounded-3xl border transition-all duration-300 min-h-[280px] flex flex-col justify-center items-center text-center gap-6 overflow-hidden backdrop-blur-md",
                            selectedSide === 'B'
                                ? "border-neon-blue bg-neon-blue/20 shadow-[0_0_50px_rgba(56,189,248,0.3)] z-10"
                                : "border-white/10 bg-white/5 hover:border-neon-blue/50 hover:bg-neon-blue/5 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]"
                        )}
                    >
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-xl md:text-2xl font-display font-medium text-white/90 leading-relaxed max-w-sm">
                                "{currentPair.statementB}"
                            </p>
                        </div>
                        <div className="text-xs font-mono text-neon-blue/50 uppercase tracking-widest bg-neon-blue/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            Select Option B
                        </div>
                    </motion.button>
                </div>
            </motion.div>

            {/* Keyboard Hints */}
            <div className="flex items-center gap-8 text-xs text-white/20 font-mono mt-4">
                <span className="flex items-center gap-2"><kbd className="bg-white/10 px-2 py-1 rounded">← A</kbd></span>
                <span>or</span>
                <span className="flex items-center gap-2"><kbd className="bg-white/10 px-2 py-1 rounded">D →</kbd></span>
            </div>
        </div>
    );
};

export default ThisOrThatStage;
