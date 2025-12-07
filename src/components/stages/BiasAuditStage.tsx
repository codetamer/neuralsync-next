'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { audio } from '../../engine/AudioEngine';
import { Brain, ArrowRight, Lightbulb, AlertTriangle } from 'lucide-react';
import { BIAS_ITEMS, BiasItem, selectRandomBiasItems } from '../../data/biasContent';

// Shuffle options
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const BiasAuditStage = () => {
    const { recordResponse, nextStage } = useTestStore();

    // Game state
    const [phase, setPhase] = useState<'instructions' | 'playing' | 'explanation' | 'complete'>('instructions');
    const [items, setItems] = useState<BiasItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffledOptions, setShuffledOptions] = useState<BiasItem['options']>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [biasedChoices, setBiasedChoices] = useState(0);
    const [startTime] = useState(Date.now());

    const TOTAL_ITEMS = 6; // Show 6 bias scenarios per session

    // Initialize items
    const startGame = useCallback(() => {
        const selectedItems = selectRandomBiasItems(TOTAL_ITEMS);
        setItems(selectedItems);
        setCurrentIndex(0);
        prepareOptions(selectedItems[0]);
        setPhase('playing');
    }, []);

    // Prepare shuffled options
    const prepareOptions = (item: BiasItem) => {
        setShuffledOptions(shuffleArray([...item.options]));
        setSelectedIndex(null);
    };

    // Handle option selection
    const handleSelect = (optionIndex: number) => {
        if (selectedIndex !== null) return;

        const selectedOption = shuffledOptions[optionIndex];
        setSelectedIndex(optionIndex);
        setTotalScore(prev => prev + selectedOption.score);

        if (selectedOption.biased) {
            setBiasedChoices(prev => prev + 1);
            audio.playError();
        } else {
            audio.playSuccess();
        }

        setPhase('explanation');
    };

    // Move to next item
    const handleContinue = () => {
        if (currentIndex + 1 >= TOTAL_ITEMS) {
            finishTask();
        } else {
            setCurrentIndex(prev => prev + 1);
            prepareOptions(items[currentIndex + 1]);
            setPhase('playing');
        }
    };

    // Finish task
    const finishTask = () => {
        setPhase('complete');

        const maxScore = TOTAL_ITEMS * 5; // Max 5 per item
        const biasResistance = ((totalScore / maxScore) * 100);

        recordResponse({
            choice: Math.round(biasResistance), // Bias resistance score 0-100
            latency_ms: Date.now() - startTime,
            accuracy: biasedChoices <= TOTAL_ITEMS * 0.3 // Good if <30% biased choices
        });

        setTimeout(nextStage, 2500);
    };

    const currentItem = items[currentIndex];
    const selectedOption = selectedIndex !== null ? shuffledOptions[selectedIndex] : null;

    // Get bias type label
    const getBiasLabel = (type: string) => {
        const labels: Record<string, string> = {
            'anchoring': 'Anchoring Bias',
            'confirmation': 'Confirmation Bias',
            'sunk_cost': 'Sunk Cost Fallacy',
            'availability': 'Availability Heuristic',
            'framing': 'Framing Effect',
            'bandwagon': 'Bandwagon Effect',
            'hindsight': 'Hindsight Bias'
        };
        return labels[type] || type;
    };

    return (
        <GlassCard className="max-w-2xl mx-auto p-8">
            <AnimatePresence mode="wait">
                {/* Instructions */}
                {phase === 'instructions' && (
                    <motion.div
                        key="instructions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                            <Brain className="w-8 h-8 text-purple-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">Cognitive Bias Audit</h2>

                        <div className="text-white/70 space-y-4 text-left max-w-md mx-auto">
                            <p>You will see scenarios that may trigger <span className="text-purple-400 font-semibold">cognitive biases</span> - mental shortcuts that can lead to irrational decisions.</p>
                            <p>Choose the <span className="text-neon-cyan font-semibold">most rational response</span> for each situation.</p>
                            <p>After each answer, you'll learn about the bias being tested.</p>
                        </div>

                        <div className="flex justify-center">
                            <NeonButton onClick={startGame}>
                                Begin <ArrowRight className="w-4 h-4 ml-2" />
                            </NeonButton>
                        </div>
                    </motion.div>
                )}

                {/* Playing */}
                {phase === 'playing' && currentItem && (
                    <motion.div
                        key={`item-${currentIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* Progress */}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/50">Scenario {currentIndex + 1} of {TOTAL_ITEMS}</span>
                            <span className="text-purple-400">Score: {totalScore}</span>
                        </div>

                        {/* Scenario */}
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-white/90 leading-relaxed">{currentItem.scenario}</p>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {shuffledOptions.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full p-4 rounded-xl border-2 text-left transition-all border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                >
                                    <span className="text-white/80">{option.text}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Explanation */}
                {phase === 'explanation' && currentItem && (
                    <motion.div
                        key="explanation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* Result header */}
                        <div className={`flex items-center gap-3 p-4 rounded-xl ${selectedOption?.biased
                            ? 'bg-red-500/10 border border-red-500/30'
                            : 'bg-green-500/10 border border-green-500/30'
                            }`}>
                            {selectedOption?.biased ? (
                                <>
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                    <div>
                                        <div className="text-red-400 font-semibold">Biased Response Detected</div>
                                        <div className="text-white/50 text-sm">{getBiasLabel(currentItem.type)}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Lightbulb className="w-6 h-6 text-green-400" />
                                    <div>
                                        <div className="text-green-400 font-semibold">Rational Choice!</div>
                                        <div className="text-white/50 text-sm">You avoided the {getBiasLabel(currentItem.type)}</div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Explanation */}
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex items-start gap-3">
                                <Brain className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                                <p className="text-white/70 leading-relaxed">{currentItem.explanation}</p>
                            </div>
                        </div>

                        {/* Your choice recap */}
                        <div className="text-sm text-white/50">
                            Your choice: <span className={selectedOption?.biased ? 'text-red-400' : 'text-green-400'}>
                                "{selectedOption?.text}"
                            </span>
                        </div>

                        <div className="flex justify-center pt-2">
                            <NeonButton onClick={handleContinue}>
                                {currentIndex + 1 >= TOTAL_ITEMS ? 'See Results' : 'Next Scenario'} <ArrowRight className="w-4 h-4 ml-2" />
                            </NeonButton>
                        </div>
                    </motion.div>
                )}

                {/* Complete */}
                {phase === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                            <Brain className="w-10 h-10 text-purple-400" />
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-white">Bias Audit Complete</div>
                            <div className="text-purple-400 text-lg mt-2">
                                Bias Resistance: {Math.round((totalScore / (TOTAL_ITEMS * 5)) * 100)}%
                            </div>
                            <div className="text-white/50 mt-1">
                                {biasedChoices === 0
                                    ? 'Perfect! No biased choices detected.'
                                    : `${biasedChoices} biased choice${biasedChoices > 1 ? 's' : ''} detected`}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};
