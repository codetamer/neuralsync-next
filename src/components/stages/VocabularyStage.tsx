'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { GlassCard } from '../ui/GlassCard';
import { audio } from '../../engine/AudioEngine';
import { BookOpen, ArrowRight, Check, X } from 'lucide-react';
import { VOCABULARY_ITEMS, VocabularyItem } from '../../data/vocabularyContent';

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const VocabularyStage = () => {
    const { recordResponse, nextStage } = useTestStore();

    // Game state
    const [phase, setPhase] = useState<'instructions' | 'playing' | 'feedback' | 'complete'>('instructions');
    const [items, setItems] = useState<VocabularyItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [startTime] = useState(Date.now());
    const [itemStartTime, setItemStartTime] = useState(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);

    const TOTAL_ITEMS = 10; // Show 10 random vocabulary items per session

    // Initialize items
    const startGame = useCallback(() => {
        const selectedItems = shuffleArray(VOCABULARY_ITEMS).slice(0, TOTAL_ITEMS);
        setItems(selectedItems);
        setCurrentIndex(0);
        prepareOptions(selectedItems[0]);
        setPhase('playing');
    }, []);

    // Prepare options for current item
    const prepareOptions = (item: VocabularyItem) => {
        const allOptions = [item.definition, ...item.distractors];
        setOptions(shuffleArray(allOptions));
        setItemStartTime(Date.now());
        setSelectedOption(null);
        setIsCorrect(null);
    };

    // Handle option selection
    const handleSelect = (optionIndex: number) => {
        if (selectedOption !== null) return;

        const currentItem = items[currentIndex];
        const selectedDef = options[optionIndex];
        const correct = selectedDef === currentItem.definition;
        const rt = Date.now() - itemStartTime;

        setSelectedOption(optionIndex);
        setIsCorrect(correct);
        setReactionTimes(prev => [...prev, rt]);

        if (correct) {
            audio.playSuccess();
            setScore(prev => prev + 1);
        } else {
            audio.playError();
        }

        setPhase('feedback');
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

        const avgRT = reactionTimes.length > 0
            ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
            : 0;

        recordResponse({
            choice: score,
            latency_ms: Date.now() - startTime,
            accuracy: score >= TOTAL_ITEMS * 0.6 // 60%+ is passing
        });

        setTimeout(nextStage, 2000);
    };

    const currentItem = items[currentIndex];

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
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-blue-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">Vocabulary Assessment</h2>

                        <div className="text-white/70 space-y-4 text-left max-w-md mx-auto">
                            <p>You will see a word and must select its <span className="text-neon-cyan font-semibold">correct definition</span>.</p>
                            <p>Choose the best answer from the four options provided.</p>
                            <p>Take your time, but try to answer as accurately as possible.</p>
                        </div>

                        <div className="flex justify-center">
                            <NeonButton onClick={startGame}>
                                Begin <ArrowRight className="w-4 h-4 ml-2" />
                            </NeonButton>
                        </div>
                    </motion.div>
                )}

                {/* Playing / Feedback */}
                {(phase === 'playing' || phase === 'feedback') && currentItem && (
                    <motion.div
                        key={`item-${currentIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* Progress */}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/50">Word {currentIndex + 1} of {TOTAL_ITEMS}</span>
                            <span className="text-neon-cyan">Score: {score}</span>
                        </div>

                        {/* Word */}
                        <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/10">
                            <div className="text-white/50 text-sm mb-2">Define this word:</div>
                            <div className="text-4xl font-bold text-white">{currentItem.word}</div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {options.map((option, idx) => {
                                const isSelected = selectedOption === idx;
                                const isCorrectOption = option === currentItem.definition;
                                const showResult = phase === 'feedback';

                                return (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleSelect(idx)}
                                        disabled={phase === 'feedback'}
                                        whileHover={phase === 'playing' ? { scale: 1.01 } : {}}
                                        whileTap={phase === 'playing' ? { scale: 0.99 } : {}}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${showResult && isCorrectOption
                                            ? 'border-green-500 bg-green-500/10'
                                            : showResult && isSelected && !isCorrectOption
                                                ? 'border-red-500 bg-red-500/10'
                                                : isSelected
                                                    ? 'border-neon-cyan bg-neon-cyan/10'
                                                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                            } ${phase === 'feedback' ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${showResult && isCorrectOption
                                                ? 'border-green-500 bg-green-500'
                                                : showResult && isSelected && !isCorrectOption
                                                    ? 'border-red-500 bg-red-500'
                                                    : isSelected
                                                        ? 'border-neon-cyan bg-neon-cyan'
                                                        : 'border-white/30'
                                                }`}>
                                                {showResult && isCorrectOption && <Check className="w-4 h-4 text-white" />}
                                                {showResult && isSelected && !isCorrectOption && <X className="w-4 h-4 text-white" />}
                                            </div>
                                            <span className={`${showResult && isCorrectOption ? 'text-green-400' : 'text-white/80'
                                                }`}>
                                                {option}
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Feedback continue button */}
                        {phase === 'feedback' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center pt-4"
                            >
                                <NeonButton onClick={handleContinue}>
                                    {currentIndex + 1 >= TOTAL_ITEMS ? 'Finish' : 'Next Word'} <ArrowRight className="w-4 h-4 ml-2" />
                                </NeonButton>
                            </motion.div>
                        )}
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
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-blue-400" />
                        </div>

                        <div>
                            <div className="text-2xl font-bold text-white">Vocabulary Complete</div>
                            <div className="text-blue-400 text-lg mt-2">
                                Score: {score}/{TOTAL_ITEMS} ({Math.round((score / TOTAL_ITEMS) * 100)}%)
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};
