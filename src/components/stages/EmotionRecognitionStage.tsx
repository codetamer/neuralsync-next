import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '@/store/useTestStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Brain, Clock, Zap } from 'lucide-react';
import Image from 'next/image';

const EMOTIONS = ['Happy', 'Angry', 'Surprised', 'Sad', 'Disgusted', 'Fearful'] as const;
type EmotionType = typeof EMOTIONS[number];

// Expanded Dataset (18 images total)
const RAW_DATASET = [
    { type: 'Happy', variants: 3 },
    { type: 'Angry', variants: 3 },
    { type: 'Surprised', variants: 3 },
    { type: 'Sad', variants: 3 },
    { type: 'Disgusted', variants: 3 },
    { type: 'Fearful', variants: 3 },
] as const;

interface Trial {
    id: string;
    image: string;
    correct: EmotionType;
    options: string[];
}

export const EmotionRecognitionStage = () => {
    const { recordResponse, nextStage, stages, currentStage } = useTestStore();
    const [trials, setTrials] = useState<Trial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Setup
    useEffect(() => {
        // 1. Generate full pool of items
        const fullPool = RAW_DATASET.flatMap(e =>
            Array.from({ length: e.variants }).map((_, i) => ({
                id: `emo_${e.type.toLowerCase()}_${i + 1}`,
                correct: e.type as EmotionType,
                // Ensure filename matches 'root' emotion name (e.g. 'surprise' not 'surprised')
                image: `/assets/emotions/${e.type.toLowerCase().replace('surprised', 'surprise').replace('disgusted', 'disgust').replace('fearful', 'fear')}_${i + 1}.png`
            }))
        );

        // 2. Shuffle Pool
        const shuffled = [...fullPool].sort(() => 0.5 - Math.random());

        // 3. Determine Length based on Difficulty
        // Difficulty 7+ (Full) -> 12 items
        // Difficulty < 7 (Quick) -> 6 items
        const stageDef = stages[currentStage];
        const targetLength = stageDef && stageDef.difficulty >= 7 ? 12 : 6;
        const selectedItems = shuffled.slice(0, targetLength);

        // 4. Generate Options for each item
        const generatedTrials: Trial[] = selectedItems.map(item => {
            const distractors = EMOTIONS
                .filter(e => e !== item.correct)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            const options = [item.correct, ...distractors].sort(() => 0.5 - Math.random());

            return {
                ...item,
                options
            };
        });

        setTrials(generatedTrials);
        setIsLoaded(true);
        setStartTime(Date.now());
    }, []); // Run once on mount

    const currentTrial = trials[currentIndex];

    // Reset timer on trial change
    useEffect(() => {
        if (currentTrial) {
            setStartTime(Date.now());
        }
    }, [currentIndex, currentTrial]);

    const handleOptionSelect = (option: string) => {
        if (isTransitioning || !currentTrial) return;

        const latency = Date.now() - startTime;
        const isCorrect = option === currentTrial.correct;

        recordResponse({
            choice: option,
            latency_ms: latency,
            accuracy: isCorrect
        });

        setIsTransitioning(true);

        setTimeout(() => {
            if (currentIndex < trials.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setIsTransitioning(false);
            } else {
                nextStage();
            }
        }, 300);
    };

    if (!isLoaded || !currentTrial) {
        return <div className="flex h-[80vh] items-center justify-center text-neon-purple animate-pulse">Loading Neuro-Assets...</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh]">

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-2 px-4 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-sm font-semibold uppercase tracking-wider">
                    <Brain className="w-4 h-4" />
                    <span>Emotional Intelligence</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-neon-purple/80 to-neon-blue/80 mb-4">
                    Micro-Expression Analysis
                </h2>
                <p className="text-gray-400 max-w-lg mx-auto text-lg leading-relaxed">
                    Identify the emotion displayed as quickly as possible.
                </p>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center">

                {/* Image Card */}
                <GlassCard className="aspect-[4/5] relative overflow-hidden group border-neon-purple/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] flex items-center justify-center bg-black/40">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentTrial.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={currentTrial.image}
                                alt="Emotion"
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Scanline overlay effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,25,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20" />
                </GlassCard>

                {/* Options Grid */}
                <div className="flex flex-col justify-center gap-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2 font-mono">
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-neon-blue" />
                            Reaction Time Active
                        </span>
                        <span>{currentIndex + 1} / {trials.length}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {currentTrial.options.map((option, idx) => (
                            <NeonButton
                                key={`${currentTrial.id}-${option}`}
                                onClick={() => handleOptionSelect(option)}
                                variant="secondary"
                                className="h-24 text-xl py-0 group relative overflow-hidden"
                            >
                                <span className="relative z-10 group-hover:scale-110 transition-transform duration-300 block">
                                    {option}
                                </span>
                            </NeonButton>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-gray-400 flex items-start gap-3">
                        <Zap className="w-4 h-4 text-neon-yellow shrink-0 mt-0.5" />
                        <p>
                            Micro-expressions can appear and vanish in less than 1/25th of a second. Trust your instinct.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
