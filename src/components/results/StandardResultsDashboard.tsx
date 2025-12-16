'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useTestStore } from '../../store/useTestStore';
import { ApexCard } from './ApexCard';
import { TraitRadar } from './TraitRadar';
import { AnalysisWidgets } from './AnalysisWidgets';
import { CognitiveProfile } from './CognitiveProfile';
import { NeuralAnalysis } from './NeuralAnalysis';
import { NeuralSignature } from './NeuralSignature';
import { HeroArchetype } from './HeroArchetype';
import { ShareModal } from './ShareModal';
import { ResultsStoryMode } from './ResultsStoryMode';
import { Play, Share2, Download, Home, RotateCcw, Flame } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { NeonButton } from '../ui/NeonButton';
import { AnalysisEngine, AnalysisInput } from '../../engine/AnalysisEngine';
import { getArchetypeTheme } from '../../utils/themeMapping';
import { ThreeDCard } from '../ui/ThreeDCard';
import { CognitiveDomainCard } from './CognitiveDomainCard';
import { ValidationCard } from './ValidationCard';
import { useAuth } from '../../context/AuthContext';
import { UserService } from '../../services/UserService';

import { ArchetypeReveal } from './ArchetypeReveal';
import { BrutalTruthModal } from './BrutalTruthModal';
import { RoastCard } from './RoastCard';
import { Activity, X } from 'lucide-react';
import { AdSlotNative } from '../ads/AdSlotNative';

export const StandardResultsDashboard = () => {
    const { getResults, resetTest, returnToHome, stages, isDisqualified, isRanked, updateElo, isTestComplete } = useTestStore();

    // --- ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS ---
    const [results, setResults] = useState<any>(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isStoryOpen, setIsStoryOpen] = useState(true);
    const [isRoastOpen, setIsRoastOpen] = useState(false);
    const [hasRevealed, setHasRevealed] = useState(false);
    const [truthAcknowledged, setTruthAcknowledged] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const handleRetakeTest = () => {
        resetTest();
    };

    const handleReturnHome = () => {
        resetTest();
    };

    // Calculate Results
    useEffect(() => {
        if (!isTestComplete) return;

        const data = getResults();
        setResults(data);
    }, [getResults, isTestComplete]);

    // Generate Deep Analysis from Engine
    const analysis = useMemo(() => {
        if (!results) return null;

        const input: AnalysisInput = {
            iq: results.iq,
            eq: results.eq,
            riskTolerance: results.riskTolerance,
            hexaco: results.hexaco,
            cognitive: results.cognitive,
            meta: results.meta
        };

        return AnalysisEngine.generate(input);
    }, [results]);

    // Derive Theme
    const theme = useMemo(() => {
        return analysis ? getArchetypeTheme(analysis.archetype) : getArchetypeTheme("Adaptive Generalist");
    }, [analysis]);

    // Save Neural Profile to Backend (Once)
    const [profileSaved, setProfileSaved] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (analysis && user && !profileSaved && !isRanked && !isDisqualified) {
            UserService.saveNeuralProfile(user.uid, {
                ...analysis,
                iqEstimate: results.iq,
                eqEstimate: results.eq,
                riskEstimate: results.riskTolerance,
                hexaco: results.hexaco,
                cognitive: results.cognitive
            }).then(() => {
                setProfileSaved(true);
                console.log("Neural Profile Saved");
            }).catch(console.error);
        }
    }, [analysis, user, profileSaved, isRanked, isDisqualified, results]);

    if (!results || !analysis) return null;

    // Prepare Data for Radar Chart (HEXACO)
    const radarData = [
        { subject: 'Honesty', A: results.hexaco.honesty, fullMark: 100 },
        { subject: 'Emotion', A: results.hexaco.emotionality, fullMark: 100 },
        { subject: 'Extraversion', A: results.hexaco.extraversion, fullMark: 100 },
        { subject: 'Agreeableness', A: results.hexaco.agreeableness, fullMark: 100 },
        { subject: 'Conscientious', A: results.hexaco.conscientiousness, fullMark: 100 },
        { subject: 'Openness', A: results.hexaco.openness, fullMark: 100 },
    ];

    // Determine Apex Trait
    const apexTrait = results.apexTraits && results.apexTraits.length > 0
        ? results.apexTraits[0]
        : { trait: 'Unknown', score: 0, description: 'Analysis pending...' };

    // Prepare Data for Neural Signature
    const signatureData = results.rawResponses ? results.rawResponses.map((r: any) => ({
        latency: r.latency_ms,
        difficulty: stages[r.stage]?.difficulty || 5, // Accessing stages from store
        accuracy: r.accuracy,
        stage: r.stage
    })) : [];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-8" ref={dashboardRef}>

            {/* Archetype Reveal Sequence */}
            <AnimatePresence>
                {!hasRevealed && analysis && (
                    <ArchetypeReveal
                        archetypeTitle={analysis.archetype}
                        traits={[
                            ...analysis.strengths,
                            `IQ: ${results.iq}`,
                            `EQ: ${results.eq}`,
                            `RISK: ${results.riskTolerance}%`
                        ]}
                        onComplete={() => setHasRevealed(true)}
                    />
                )}
            </AnimatePresence>

            {/* Brutal Truth Modal - Mandatory Interrupt */}
            <AnimatePresence>
                {hasRevealed && !truthAcknowledged && analysis && (
                    <BrutalTruthModal
                        truth={analysis.brutalTruth || "YOU ARE MEDIOCRE."}
                        onAcknowledge={() => setTruthAcknowledged(true)}
                    />
                )}
            </AnimatePresence>

            {/* Story Mode Overlay - Only show AFTER truth acknowledged */}
            <AnimatePresence>
                {hasRevealed && truthAcknowledged && isStoryOpen && analysis && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000]"
                    >
                        <ResultsStoryMode
                            insight={analysis}
                            onClose={() => setIsStoryOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HERO REVEAL SECTION */}
            <div className="relative">
                <HeroArchetype
                    archetype={analysis.archetype}
                    description={analysis.archetypeDesc}
                    matchScore={analysis.matchScore}
                    colorTheme={theme.primary}
                />

                {/* Floating Story Button */}
                {!isStoryOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsStoryOpen(true)}
                        className="absolute top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold shadow-lg shadow-purple-500/30"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        PLAY STORY
                    </motion.button>
                )}
            </div>

            {/* Validity Warning */}
            {results.isFlagged && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-center -mt-4 mb-12 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-center gap-2 text-red-400 font-mono font-bold mb-1">
                        <Activity className="w-5 h-5" />
                        DATA ANOMALY DETECTED
                    </div>
                    <p className="text-white/80 text-sm">
                        Response consistency falls below the reliability threshold ({results.validityScore}%).
                        Results may not accurately reflect your cognitive profile.
                    </p>
                </motion.div>
            )}

            {/* Top Section: Apex Card & Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    <ThreeDCard className="h-full">
                        <ApexCard
                            trait={apexTrait.trait}
                            score={apexTrait.score}
                            description={apexTrait.description}
                        />
                    </ThreeDCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="h-full"
                >
                    <ThreeDCard className="h-full">
                        <div className="bg-neural-card backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center justify-center min-h-[400px] h-full">
                            <TraitRadar data={radarData} />
                        </div>
                    </ThreeDCard>
                </motion.div>
            </div>

            {/* Middle Section: Big Numbers & Validation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="h-full"
                >
                    <ThreeDCard className="h-full">
                        <CognitiveProfile
                            iq={results.iq}
                            eq={results.eq}
                            risk={results.riskTolerance}
                        />
                    </ThreeDCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="h-full"
                >
                    <ThreeDCard className="h-full">
                        {results.validityScore !== undefined ? (
                            <ValidationCard
                                data={results.antigaming}
                                validityScore={results.validityScore}
                                isFlagged={results.isFlagged}
                            />
                        ) : (
                            <AnalysisWidgets
                                analysis={analysis}
                                iq={results.iq}
                                eq={results.eq}
                                risk={results.riskTolerance}
                            />
                        )}
                    </ThreeDCard>
                </motion.div>
            </div>

            {/* Native Ad Slot - "Recommended Protocol" */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AdSlotNative delay={0.6} />
            </div>

            {/* Deep Dive Section: Granular Domains & Text Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="h-full"
                >
                    <ThreeDCard className="h-full">
                        {results.cognitive && (
                            <CognitiveDomainCard data={results.cognitive} />
                        )}
                    </ThreeDCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="h-full"
                >
                    <ThreeDCard className="h-full">
                        <NeuralAnalysis
                            analysis={analysis}
                            iq={results.iq}
                            eq={results.eq}
                        />
                    </ThreeDCard>
                </motion.div>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-1 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="h-full"
                >
                    <ThreeDCard className="h-full">
                        <NeuralSignature data={signatureData} />
                    </ThreeDCard>
                </motion.div>
            </div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="flex flex-wrap justify-center gap-4 pt-8 pb-12"
            >
                <NeonButton onClick={handleReturnHome} variant="secondary" className="w-48">
                    <Home className="w-4 h-4 mr-2" /> RETURN HOME
                </NeonButton>
                <NeonButton onClick={handleRetakeTest} variant="secondary" className="w-48">
                    <RotateCcw className="w-4 h-4 mr-2" /> RETAKE TEST
                </NeonButton>
                <NeonButton onClick={() => setIsShareOpen(true)} variant="primary" className="w-48">
                    <Share2 className="w-4 h-4 mr-2" /> SHARE PROFILE
                </NeonButton>
                <NeonButton onClick={() => setIsRoastOpen(true)} className="w-48" color="red">
                    <Flame className="w-4 h-4 mr-2" /> GET ROASTED
                </NeonButton>
            </motion.div>

            {/* Roast Modal - Viral Mechanic */}
            <AnimatePresence>
                {isRoastOpen && analysis && (
                    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
                        <div className="relative">
                            <button onClick={() => setIsRoastOpen(false)} className="absolute -top-12 right-0 text-white/50 hover:text-white p-2">
                                <X className="w-8 h-8" />
                            </button>
                            <RoastCard insight={analysis} theme={theme} />
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                scores={{
                    iq: results.iq,
                    iqPercentile: results.iqPercentile,
                    eq: results.eq,
                    eqPercentile: results.eqPercentile,
                    riskTolerance: results.riskTolerance,
                    hexaco: results.hexaco,
                    apexTrait: apexTrait
                }}
                archetype={analysis.archetype}
            />
        </div >
    );
};
