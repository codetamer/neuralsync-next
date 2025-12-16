'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTestStore } from '../store/useTestStore';
import { StageType } from '../engine/TestEngine';
import { AnimatePresence, motion } from 'framer-motion';
import { NeonButton } from './ui/NeonButton';
import { audio } from '../engine/AudioEngine';
import { ResultsCertificate } from './ResultsCertificate';
import { MiniInsight } from './ui/MiniInsight';
import { IntroStage } from './stages/IntroStage';

// Dynamic Imports for Performance Optimization (Lazy Loading)
const MatrixStageEnhanced = dynamic(() => import('./stages/MatrixStageEnhanced').then(mod => mod.MatrixStageEnhanced), { ssr: false });
const StroopStage = dynamic(() => import('./stages/StroopStage').then(mod => mod.StroopStage), { ssr: false });
const BartStage = dynamic(() => import('./stages/BartStage').then(mod => mod.BartStage), { ssr: false });
const PersonalityStage = dynamic(() => import('./stages/PersonalityStage').then(mod => mod.PersonalityStage), { ssr: false });
const ThisOrThatStage = dynamic(() => import('./stages/ThisOrThatStage').then(mod => mod.ThisOrThatStage), { ssr: false });
const CardSwipeStage = dynamic(() => import('./stages/CardSwipeStage').then(mod => mod.CardSwipeStage), { ssr: false });
const ScenarioStage = dynamic(() => import('./stages/ScenarioStage').then(mod => mod.ScenarioStage), { ssr: false });
const NBackStage = dynamic(() => import('./stages/NBackStage').then(mod => mod.NBackStage), { ssr: false });
const DigitSpanStage = dynamic(() => import('./stages/DigitSpanStage').then(mod => mod.DigitSpanStage), { ssr: false });
const SpatialSpanStage = dynamic(() => import('./stages/SpatialSpanStage').then(mod => mod.SpatialSpanStage), { ssr: false });
const SymbolMatchStage = dynamic(() => import('./stages/SymbolMatchStage').then(mod => mod.SymbolMatchStage), { ssr: false });
const ReactionTimeStage = dynamic(() => import('./stages/ReactionTimeStage').then(mod => mod.ReactionTimeStage), { ssr: false });
const VocabularyStage = dynamic(() => import('./stages/VocabularyStage').then(mod => mod.VocabularyStage), { ssr: false });
const TrailMakingStage = dynamic(() => import('./stages/TrailMakingStage').then(mod => mod.TrailMakingStage), { ssr: false });
const BiasAuditStage = dynamic(() => import('./stages/BiasAuditStage').then(mod => mod.BiasAuditStage), { ssr: false });
const EmotionRecognitionStage = dynamic(() => import('./stages/EmotionRecognitionStage').then(mod => mod.EmotionRecognitionStage), { ssr: false });

// Personality UI variants for randomization
type PersonalityVariant = 'slider' | 'this_or_that' | 'card_swipe';

const getRandomPersonalityVariant = (): PersonalityVariant => {
    const variants: PersonalityVariant[] = ['slider', 'this_or_that', 'card_swipe'];
    return variants[Math.floor(Math.random() * variants.length)];
};

const SECTION_TITLES: Record<string, string> = {
    'matrix': 'PATTERN ANALYSIS',
    'nback': 'WORKING MEMORY',
    'digitspan': 'WORKING MEMORY',
    'spatialspan': 'WORKING MEMORY',
    'symbolmatch': 'PROCESSING SPEED',
    'reactiontime': 'PROCESSING SPEED',
    'vocabulary': 'CRYSTALLIZED INTELLIGENCE',
    'trailmaking': 'EXECUTIVE FUNCTION',
    'biasaudit': 'META-COGNITION',
    'scenario': 'EMOTIONAL INTELLIGENCE',
    'emotion': 'MICRO-EXPRESSION ANALYSIS',
    'bart': 'RISK ASSESSMENT',
    'personality': 'PERSONALITY PROFILE'
};

export const StageController = () => {
    const { currentStage, isTestComplete, nextStage, setSection, currentSection, stages, isPaused, resumeTest, returnToHome, responses } = useTestStore();
    const [showTransition, setShowTransition] = useState(false);
    const [transitionTitle, setTransitionTitle] = useState('');
    const [showMiniInsight, setShowMiniInsight] = useState(false);
    const [startTime] = useState(Date.now());

    // Select personality variant once per session
    const personalityVariant = useMemo(() => getRandomPersonalityVariant(), []);

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
        if (stageDef.type === 'matrix' || stageDef.type === 'nback' || stageDef.type === 'digitspan' || stageDef.type === 'spatialspan' || stageDef.type === 'symbolmatch' || stageDef.type === 'reactiontime') newSection = 'IQ';
        else if (stageDef.type === 'scenario' || stageDef.type === 'emotion') newSection = 'EQ';
        else if (stageDef.type === 'bart') newSection = 'RISK';
        else if (stageDef.type === 'personality') newSection = 'PERSONALITY';
        // Debug doesn't really change sections in a measurable way for the progress bar, 
        // but we can leave it as previous or default.

        // Check for section change
        if (newSection !== currentSection && newSection !== 'INTRO') {
            setSection(newSection);
            setTransitionTitle(SECTION_TITLES[stageDef.type] || 'NEXT SECTOR');
            setShowTransition(true);
            audio.playSuccess();
        } else if (currentStage > 0 && !showTransition) {
            // Normal stage progression (only if not transitioning)
            // audio.playSuccess(); // Optional feedback
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

    // Effect 3: Show Mini-Insight every 6 personality questions
    const prevPersonalityCount = useRef(0);
    useEffect(() => {
        const personalityStagesCompleted = responses.filter(r =>
            stages[r.stage]?.type === 'personality'
        ).length;

        // Show insight at 6, 12, 18... personality items
        if (personalityStagesCompleted > 0 &&
            personalityStagesCompleted % 6 === 0 &&
            personalityStagesCompleted !== prevPersonalityCount.current) {
            prevPersonalityCount.current = personalityStagesCompleted;
            setShowMiniInsight(true);
        }
    }, [responses, stages]);

    // Initial Mount Check
    const [isMounted, setIsMounted] = useState(false);
    const hasCheckedResume = useRef(false);

    useEffect(() => {
        setIsMounted(true);
        // Only run this check ONCE when the component mounts
        if (!hasCheckedResume.current) {
            hasCheckedResume.current = true;
            // If we load the app (fresh mount) and have progress or are complete,
            // we should ensure we are in a PAUSED state so the resume screen shows.
            // Using logic from closure is risky if hydration is delayed, but with sessionStorage it's usually instant.
            if (currentStage > 0 && !isTestComplete && !isPaused) {
                returnToHome(); // Sets isPaused = true
            }
        }
    }, [currentStage, isTestComplete, isPaused, returnToHome]);

    // Prevent flash of content logic until mount check confirms pause state
    if (!isMounted) {
        return null;
    }

    if (isTestComplete && !isPaused) {
        return <ResultsCertificate />;
    }

    const stageDef = stages[currentStage];

    if (!stageDef) {
        // ... (Error UI kept same)
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

    // Intro Stage handling (including Resume Mode)
    // We render IntroStage if it's the actual Intro Stage OR if we are PAUSED
    // Note: IntroStage is NOT dynamic because it's the LCP (Largest Contentful Paint) entry point
    if (stageDef.type === 'intro' || isPaused) {
        return (
            <IntroStage
                isResumeMode={isPaused}
                onResumeHandled={() => resumeTest()}
            />
        );
    }

    // Calculate elapsed time for progress bar
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);

    return (
        <>
            {/* Note: ProgressBar is rendered in AppShell.tsx */}

            {/* Mini-Insight Modal */}
            <AnimatePresence>
                {showMiniInsight && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-neural-bg/80 backdrop-blur-sm p-4"
                    >
                        <MiniInsight
                            insightType="personality"
                            primaryTrait="Conscientiousness"
                            direction="balanced"
                            onContinue={() => setShowMiniInsight(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
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
                        {stageDef.type === 'matrix' && <MatrixStageEnhanced />}
                        {stageDef.type === 'nback' && <NBackStage />}
                        {stageDef.type === 'digitspan' && <DigitSpanStage />}
                        {stageDef.type === 'spatialspan' && <SpatialSpanStage />}
                        {stageDef.type === 'symbolmatch' && <SymbolMatchStage />}
                        {stageDef.type === 'reactiontime' && <ReactionTimeStage />}
                        {stageDef.type === 'vocabulary' && <VocabularyStage />}
                        {stageDef.type === 'trailmaking' && <TrailMakingStage />}
                        {stageDef.type === 'biasaudit' && <BiasAuditStage />}
                        {stageDef.type === 'stroop' && <StroopStage />}
                        {stageDef.type === 'bart' && <BartStage />}
                        {stageDef.type === 'personality' && (
                            personalityVariant === 'this_or_that' ? <ThisOrThatStage /> :
                                personalityVariant === 'card_swipe' ? <CardSwipeStage /> :
                                    <PersonalityStage />
                        )}
                        {stageDef.type === 'scenario' && <ScenarioStage />}
                        {stageDef.type === 'emotion' && <EmotionRecognitionStage />}

                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
};
