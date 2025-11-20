'use client';

import { useEffect, useState } from 'react';
import { useTestStore } from '../../store/useTestStore';
import { ApexCard } from './ApexCard';
import { TraitRadar } from './TraitRadar';
import { AnalysisWidgets } from './AnalysisWidgets';
import { motion } from 'framer-motion';
import { Share2, Download, Home, RotateCcw } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';

export const ResultsDashboard = () => {
    const { getResults, resetTest, returnToHome } = useTestStore();
    const [results, setResults] = useState<any>(null);

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

    if (!results) return null;

    // Prepare Data for Radar Chart
    const radarData = [
        { subject: 'Openness', A: results.ocean.openness, fullMark: 100 },
        { subject: 'Conscientiousness', A: results.ocean.conscientiousness, fullMark: 100 },
        { subject: 'Extraversion', A: results.ocean.extraversion, fullMark: 100 },
        { subject: 'Agreeableness', A: results.ocean.agreeableness, fullMark: 100 },
        { subject: 'Neuroticism', A: results.ocean.neuroticism, fullMark: 100 },
    ];

    // Determine Apex Trait
    const apexTrait = results.apexTraits && results.apexTraits.length > 0
        ? results.apexTraits[0]
        : { trait: 'Unknown', score: 0, description: 'Analysis pending...' };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 mb-12"
            >
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">
                    NEURAL<span className="text-neon-teal">PROFILE</span>
                </h1>
                <p className="text-xl text-neural-muted">Analysis Complete. Subject Verified.</p>
            </motion.div>

            {/* Top Section: Apex Card & Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <ApexCard
                        trait={apexTrait.trait}
                        score={apexTrait.score}
                        description={apexTrait.description}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center justify-center"
                >
                    <TraitRadar data={radarData} />
                </motion.div>
            </div>

            {/* Middle Section: Widgets */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <AnalysisWidgets
                    iq={results.iq}
                    eq={results.eq}
                    risk={results.riskTolerance}
                    personalityType={apexTrait.trait} // Simplified for now
                />
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-4 pt-8 pb-12"
            >
                <NeonButton onClick={handleReturnHome} variant="secondary" className="w-48">
                    <Home className="w-4 h-4 mr-2" /> RETURN HOME
                </NeonButton>
                <NeonButton onClick={handleRetakeTest} variant="secondary" className="w-48">
                    <RotateCcw className="w-4 h-4 mr-2" /> RETAKE TEST
                </NeonButton>
                <NeonButton variant="primary" className="w-48">
                    <Share2 className="w-4 h-4 mr-2" /> SHARE PROFILE
                </NeonButton>
            </motion.div>
        </div>
    );
};
