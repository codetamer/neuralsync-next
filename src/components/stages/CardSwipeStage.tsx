'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { HEXACO_ITEMS } from '../../data/testContent';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '../../lib/utils';
import { ThumbsUp, ThumbsDown, Sparkles, Brain } from 'lucide-react';

/**
 * CardSwipeStage - Premium Tinder-style personality assessment
 * 
 * Users swipe left (disagree) or right (agree) on personality statements.
 * Swipe intensity determines strength of agreement (1-3 vs 5-7 on scale).
 */

interface PersonalityCard {
    id: string;
    text: string;
    category: 'honesty' | 'emotionality' | 'extraversion' | 'agreeableness' | 'conscientiousness' | 'openness';
    reverse: boolean;
}

const CATEGORY_COLORS: Record<string, { gradient: string; text: string; glow: string }> = {
    honesty: { gradient: 'from-amber-500/20 to-orange-500/10', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    emotionality: { gradient: 'from-pink-500/20 to-rose-500/10', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
    extraversion: { gradient: 'from-yellow-500/20 to-amber-500/10', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    agreeableness: { gradient: 'from-green-500/20 to-emerald-500/10', text: 'text-green-400', glow: 'shadow-green-500/20' },
    conscientiousness: { gradient: 'from-blue-500/20 to-cyan-500/10', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    openness: { gradient: 'from-purple-500/20 to-violet-500/10', text: 'text-purple-400', glow: 'shadow-purple-500/20' }
};

const selectRandomCards = (count: number): PersonalityCard[] => {
    const categories = ['honesty', 'emotionality', 'extraversion', 'agreeableness', 'conscientiousness', 'openness'] as const;
    const cards: PersonalityCard[] = [];

    const perCategory = Math.ceil(count / 6);

    categories.forEach(category => {
        const categoryItems = HEXACO_ITEMS.filter(i => i.category === category);
        const shuffled = [...categoryItems].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, perCategory);

        selected.forEach(item => {
            cards.push({
                id: item.id,
                text: item.text,
                category: item.category,
                reverse: item.reverse
            });
        });
    });

    return cards.sort(() => 0.5 - Math.random()).slice(0, count);
};

export const CardSwipeStage = () => {
    const { recordResponse, nextStage, currentStage, stages } = useTestStore();
    const [startTime, setStartTime] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

    const [cards] = useState(() => selectRandomCards(12));
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const currentCard = cards[currentCardIndex];
    const categoryStyle = currentCard ? CATEGORY_COLORS[currentCard.category] : CATEGORY_COLORS.openness;

    // Motion values for swipe gesture
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-300, 300], [-20, 20]);
    const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);

    // Visual feedback overlays
    const leftOpacity = useTransform(x, [-150, -50, 0], [1, 0.3, 0]);
    const rightOpacity = useTransform(x, [0, 50, 150], [0, 0.3, 1]);
    const cardBorderColor = useTransform(
        x,
        [-150, 0, 150],
        ['rgba(239, 68, 68, 0.5)', 'rgba(255, 255, 255, 0.1)', 'rgba(34, 197, 94, 0.5)']
    );

    useEffect(() => {
        setStartTime(performance.now());
        setIsExiting(false);
        setExitDirection(null);
    }, [currentCardIndex]);

    const handleSwipe = useCallback((direction: 'left' | 'right', intensity: number = 1) => {
        if (isExiting) return;

        setIsExiting(true);
        setExitDirection(direction);

        const latency = performance.now() - startTime;

        let rawScore: number;
        if (direction === 'left') {
            rawScore = 3 - Math.min(2, Math.floor(intensity * 2));
        } else {
            rawScore = 5 + Math.min(2, Math.floor(intensity * 2));
        }

        const finalScore = currentCard.reverse ? (8 - rawScore) : rawScore;

        setTimeout(() => {
            recordResponse({
                choice: Math.min(7, Math.max(1, finalScore)),
                latency_ms: Math.round(latency),
                accuracy: true
            });

            if (currentCardIndex < cards.length - 1) {
                setCurrentCardIndex(prev => prev + 1);
                x.set(0);
            } else {
                nextStage();
            }
        }, 300);
    }, [currentCard, startTime, isExiting, currentCardIndex, cards.length, recordResponse, nextStage, x]);

    const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;
        const velocity = Math.abs(info.velocity.x);
        const intensity = Math.min(1, velocity / 1000 + Math.abs(info.offset.x) / 300);

        if (info.offset.x < -threshold) {
            handleSwipe('left', intensity);
        } else if (info.offset.x > threshold) {
            handleSwipe('right', intensity);
        }
    }, [handleSwipe]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            handleSwipe('left', 0.5);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            handleSwipe('right', 0.5);
        }
    }, [handleSwipe]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!currentCard) return <div className="text-center text-neural-muted">Loading...</div>;

    const progress = ((currentCardIndex + 1) / cards.length) * 100;

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
            {/* Header - Matches app style */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-4 h-4 text-neon-purple" />
                        <h2 className="text-xl font-display font-bold text-white">
                            Personality Profile
                        </h2>
                    </div>
                    <p className="text-neural-muted text-xs">
                        Swipe right if it sounds like you, left if it doesn't
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neural-muted">
                    <span>{currentCardIndex + 1}/{cards.length}</span>
                </div>
            </div>

            {/* Main Card Area */}
            <GlassCard className="p-6 bg-neural-card relative overflow-hidden min-h-[380px] flex flex-col items-center justify-center">
                {/* Background Glow */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-50",
                    categoryStyle.gradient
                )} />

                {/* Card Stack */}
                <div className="relative w-full max-w-md h-[280px] flex items-center justify-center">
                    {/* Background cards (stack effect) */}
                    {cards.length - currentCardIndex > 2 && (
                        <div className="absolute w-[90%] h-full bg-white/[0.02] rounded-2xl transform scale-[0.92] translate-y-3 border border-white/5" />
                    )}
                    {cards.length - currentCardIndex > 1 && (
                        <div className="absolute w-[95%] h-full bg-white/[0.03] rounded-2xl transform scale-[0.96] translate-y-1.5 border border-white/5" />
                    )}

                    {/* Current Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCard.id}
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: 0,
                                x: isExiting ? (exitDirection === 'left' ? -400 : 400) : 0,
                                rotate: isExiting ? (exitDirection === 'left' ? -25 : 25) : 0
                            }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            drag={!isExiting ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.8}
                            onDragEnd={handleDragEnd}
                            style={{ x, rotate, scale }}
                            className="absolute w-full cursor-grab active:cursor-grabbing z-10"
                        >
                            <motion.div
                                className="w-full h-[260px] rounded-2xl border-2 flex flex-col justify-center items-center p-8 relative overflow-hidden backdrop-blur-sm"
                                style={{
                                    borderColor: cardBorderColor,
                                    background: 'linear-gradient(135deg, rgba(30, 32, 46, 0.9), rgba(20, 22, 34, 0.95))'
                                }}
                            >
                                {/* Disagree Overlay */}
                                <motion.div
                                    style={{ opacity: leftOpacity }}
                                    className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-transparent pointer-events-none"
                                />
                                <motion.div
                                    style={{ opacity: leftOpacity }}
                                    className="absolute left-6 top-1/2 -translate-y-1/2"
                                >
                                    <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center bg-red-500/20 transform -rotate-12">
                                        <ThumbsDown className="w-8 h-8 text-red-500" />
                                    </div>
                                </motion.div>

                                {/* Agree Overlay */}
                                <motion.div
                                    style={{ opacity: rightOpacity }}
                                    className="absolute inset-0 bg-gradient-to-l from-green-500/30 to-transparent pointer-events-none"
                                />
                                <motion.div
                                    style={{ opacity: rightOpacity }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2"
                                >
                                    <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-500/20 transform rotate-12">
                                        <ThumbsUp className="w-8 h-8 text-green-500" />
                                    </div>
                                </motion.div>

                                {/* Quote Mark */}
                                <div className="absolute top-4 left-6 text-4xl text-white/10 font-serif">"</div>
                                <div className="absolute bottom-4 right-6 text-4xl text-white/10 font-serif rotate-180">"</div>

                                {/* Card Content */}
                                <p className="text-lg text-white text-center leading-relaxed font-medium px-6 z-10">
                                    {currentCard.text}
                                </p>

                                {/* Category Badge */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                    <span className={cn(
                                        "text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10",
                                        categoryStyle.text
                                    )}>
                                        {currentCard.category}
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md mt-6">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-neon-purple to-neon-teal"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Controls */}
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => handleSwipe('left', 0.7)}
                        disabled={isExiting}
                        className="w-16 h-16 rounded-full bg-neural-card border-2 border-red-500/30 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/50 transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
                    >
                        <ThumbsDown className="w-7 h-7 text-red-400" />
                    </button>

                    <button
                        onClick={() => handleSwipe('right', 0.7)}
                        disabled={isExiting}
                        className="w-16 h-16 rounded-full bg-neural-card border-2 border-green-500/30 flex items-center justify-center hover:bg-green-500/10 hover:border-green-500/50 transition-all shadow-lg hover:shadow-green-500/20 active:scale-95"
                    >
                        <ThumbsUp className="w-7 h-7 text-green-400" />
                    </button>
                </div>

                {/* Keyboard Hints */}
                <div className="flex items-center gap-6 text-[10px] text-white/30 font-mono">
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">A</kbd>
                        Disagree
                    </span>
                    <span className="flex items-center gap-1">
                        Agree
                        <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">D</kbd>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CardSwipeStage;
