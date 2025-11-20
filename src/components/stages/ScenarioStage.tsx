'use client';

import { motion } from 'framer-motion';
import { useTestStore, STAGE_DEFINITIONS } from '../../store/useTestStore';
import { EQ_SCENARIOS } from '../../data/testContent';
import { NeonButton } from '../ui/NeonButton';

import { useState } from 'react';

export const ScenarioStage = () => {
    const { currentStage, recordResponse, nextStage, addXp } = useTestStore();
    const [startTime] = useState(Date.now());
    const stageDef = STAGE_DEFINITIONS[currentStage];

    // Find the scenario content
    const scenario = EQ_SCENARIOS.find(s => s.id === stageDef.contentId);

    const handleChoice = (index: number) => {
        // Award XP for completing scenarios
        addXp(30);

        recordResponse({
            choice: index,
            latency_ms: Date.now() - startTime,
            accuracy: true // Scenarios are subjective/weighted, handled in engine
        });
        nextStage();
    };

    if (!scenario) return <div>Loading scenario...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-display font-bold text-neon-teal mb-2">
                    {stageDef.title}
                </h2>
                <p className="text-neural-muted text-sm uppercase tracking-widest">
                    SITUATIONAL JUDGMENT PROTOCOL
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neural-dark/50 border border-neon-teal/20 rounded-xl p-8 mb-8 backdrop-blur-sm"
            >
                <p className="text-xl text-white leading-relaxed">
                    {scenario.scenario}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
                {scenario.options.map((option, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleChoice(index)}
                        className="group relative w-full text-left p-6 rounded-lg border border-neural-border hover:border-neon-teal/50 transition-all duration-300 bg-neural-bg/50 hover:bg-neural-dark"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-neural-muted group-hover:border-neon-teal flex items-center justify-center text-neural-muted group-hover:text-neon-teal transition-colors">
                                {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-neural-gray-100 group-hover:text-white transition-colors text-lg">
                                {option.text}
                            </span>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-lg bg-neon-teal/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
