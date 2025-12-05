'use client';

import { useEffect, useState } from 'react';
import { useTestStore } from '../store/useTestStore';
import { StageType } from '../engine/TestEngine';
import { MatrixStage } from './stages/MatrixStage';
import { StroopStage } from './stages/StroopStage';
import { BartStage } from './stages/BartStage';
import { PersonalityStage } from './stages/PersonalityStage';
import { ScenarioStage } from './stages/ScenarioStage';
import { AnimatePresence, motion } from 'framer-motion';
import { NeonButton } from './ui/NeonButton';
import { audio } from '../engine/AudioEngine';
import { ResultsCertificate } from './ResultsCertificate';

const SECTION_TITLES: Record<string, string> = {
    'matrix': 'LOGIC SECTOR',
    'scenario': 'EMOTIONAL INTELLIGENCE',
    'bart': 'RISK ASSESSMENT',
    'personality': 'PERSONALITY PROFILE'
};

export const StageController = () => {
    const { currentStage, isTestComplete, nextStage, setSection, currentSection, stages } = useTestStore();
    const [showTransition, setShowTransition] = useState(false);
    const [transitionTitle, setTransitionTitle] = useState('');

    // Effect 1: Detect Section Change and Trigger Transition
    useEffect(() => {
        if (isTestComplete) {
            audio.playSuccess();
            return;
        }

        const stageDef = stages[currentStage];
        if (!stageDef) return;

        // Determine current section based on stage type
        let newSection: 'INTRO' | 'IQ' | 'EQ' | 'RISK' | 'PERSONALITY' = 'INTRO';
        if (stageDef.type === 'matrix') newSection = 'IQ';
        else if (stageDef.type === 'scenario') newSection = 'EQ';
        else if (stageDef.type === 'bart') newSection = 'RISK';
        else if (stageDef.type === 'personality') newSection = 'PERSONALITY';

        // Check for section change
        if (newSection !== currentSection && newSection !== 'INTRO') {
            setSection(newSection);
            setTransitionTitle(SECTION_TITLES[stageDef.type] || 'NEXT SECTOR');
            setShowTransition(true);
            audio.playSuccess();
        } else if (currentStage > 0 && !showTransition) {
            // Normal stage progression (only if not transitioning)
            audio.playSuccess();
        }
    }, [currentStage, isTestComplete, setSection, currentSection, stages]);

    // Effect 2: Handle Transition Timeout
    useEffect(() => {
        if (showTransition) {
            const timer = setTimeout(() => {
                setShowTransition(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [showTransition]);

    if (isTestComplete) {
        return <ResultsCertificate />;
    }

    const stageDef = stages[currentStage];

    if (!stageDef) {
        return (
            <div className="text-center max-w-2xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold text-neon-red mb-4">SYSTEM ERROR</h1>
                <p className="text-neural-muted">
                    Unknown stage detected. Please use the menu (top right) to reset the test or return home.
                </p>
                <div className="text-sm font-mono text-neural-muted/50">
                    Current Stage: {currentStage} | Expected: 0-{stages.length - 1}
                </div>
            </div>
        );
    }

    // Intro Stage
    if (stageDef.type === 'intro') {
        return (
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-5xl font-display font-bold text-white mb-6 tracking-tight">
                    NEURAL<span className="text-neon-teal">SYNC</span>
                </h1>
                <p className="text-xl text-neural-muted mb-12 leading-relaxed">
                    Advanced psychometric evaluation system initialized.
                    Please ensure you are in a quiet environment.
                </p>
                <NeonButton onClick={nextStage} size="lg" className="mx-auto w-64">
                    BEGIN EVALUATION
                </NeonButton>
            </div>
        );
    }

    return (
        <>
            {/* Section Transition Overlay */}
            <AnimatePresence>
                {showTransition && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-neural-bg/90 backdrop-blur-md"
                    >
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="mb-4"
                            >
                                <div className="w-24 h-1 bg-neon-teal mx-auto mb-8 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                            </motion.div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-6xl font-display font-bold text-white tracking-widest mb-4"
                            >
                                {transitionTitle}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-neon-teal font-mono text-lg tracking-widest animate-pulse"
                            >
                                INITIALIZING...
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {!showTransition && (
                    <motion.div
                        key={currentStage}
                        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                    >
                        {stageDef.type === 'matrix' && <MatrixStage />}
                        {stageDef.type === 'stroop' && <StroopStage />}
                        {stageDef.type === 'bart' && <BartStage />}
                        {stageDef.type === 'personality' && <PersonalityStage />}
                        {stageDef.type === 'scenario' && <ScenarioStage />}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
