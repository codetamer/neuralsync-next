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
import { motion } from 'framer-motion';
import { Share2, Download, Home, RotateCcw } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';
import { AnalysisEngine, AnalysisInput } from '../../engine/AnalysisEngine';
import { getArchetypeTheme } from '../../utils/themeMapping';
import { ThreeDCard } from '../ui/ThreeDCard';
import { CognitiveDomainCard } from './CognitiveDomainCard';
import { ValidationCard } from './ValidationCard';

export const ResultsDashboard = () => {
    const { getResults, resetTest, returnToHome, stages } = useTestStore();
    const [results, setResults] = useState<any>(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const handleRetakeTest = () => {
        resetTest();
        window.location.reload();
    };

    const handleReturnHome = () => {
        returnToHome();
        window.location.reload();
    };

    useEffect(() => {
        const data = getResults();
        setResults(data);
    }, [getResults]);

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

    // Prepare Data for Neural Signature (Latency vs Difficulty)
    // We must look up the difficulty from the dynamic 'stages' array in the store
    const signatureData = results.rawResponses ? results.rawResponses.map((r: any) => ({
        latency: r.latency_ms,
        difficulty: stages[r.stage]?.difficulty || 5,
        accuracy: r.accuracy,
        stage: r.stage
    })) : [];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-8" ref={dashboardRef}>

            {/* HERO REVEAL SECTION */}
            <HeroArchetype
                archetype={analysis.archetype}
                description={analysis.archetypeDesc}
                matchScore={analysis.matchScore}
                colorTheme={theme.primary}
            />

            {/* Validity Warning */}
            {results.isFlagged && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-center -mt-4 mb-12 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-center gap-2 text-red-400 font-mono font-bold mb-1">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
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
                    transition={{ delay: 0.4 }}
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
                    transition={{ delay: 0.6 }}
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
                    transition={{ delay: 0.7 }}
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

            {/* Deep Dive Section: Granular Domains & Text Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
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
                    transition={{ delay: 0.9 }}
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
                    transition={{ delay: 1.0 }}
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
            </motion.div>

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
            />
        </div >
    );
};
