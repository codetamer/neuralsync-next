'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTestStore } from '../../store/useTestStore';
import { motion } from 'framer-motion';
import { ThreeDCard } from '../ui/ThreeDCard';
import { NeonButton } from '../ui/NeonButton';
import { ShareModal } from './ShareModal';
import { Home, RotateCcw, Share2, Zap, Brain, Activity } from 'lucide-react';
import { AnalysisEngine, AnalysisInput } from '../../engine/AnalysisEngine';
import { TraitRadar } from './TraitRadar';

export const QuickResultsDashboard = () => {
    const { getResults, resetTest, returnToHome, startQuickSession } = useTestStore();
    const [results, setResults] = useState<any>(null);
    const [isShareOpen, setIsShareOpen] = useState(false);

    useEffect(() => {
        const data = getResults();
        setResults(data);
    }, [getResults]);

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

    if (!results || !analysis) return null;

    const radarData = [
        { subject: 'Attention', A: results.cognitive?.attention?.score || 0, fullMark: 100 },
        { subject: 'Memory', A: results.cognitive?.memory?.score || 0, fullMark: 100 },
        { subject: 'Processing', A: results.cognitive?.processing?.score || 0, fullMark: 100 },
        { subject: 'Spatial', A: results.cognitive?.spatial?.score || 0, fullMark: 100 },
        { subject: 'Flexibility', A: results.cognitive?.flexibility?.score || 0, fullMark: 100 },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <h1 className="text-3xl font-bold font-display text-white">QUICK SCAN COMPLETE</h1>
                <p className="text-white/50">Rapid neural assessment finalized.</p>
            </motion.div>

            {/* Key Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                    <ThreeDCard className="h-full bg-blue-500/10 border-blue-500/30">
                        <div className="p-6 text-center space-y-2">
                            <Zap className="w-8 h-8 text-blue-400 mx-auto" />
                            <div className="text-4xl font-bold text-white">{results.iq}</div>
                            <div className="text-xs uppercase text-blue-300 font-mono">Cognitive Speed (Est)</div>
                        </div>
                    </ThreeDCard>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                    <ThreeDCard className="h-full bg-purple-500/10 border-purple-500/30">
                        <div className="p-6 text-center space-y-2">
                            <Brain className="w-8 h-8 text-purple-400 mx-auto" />
                            <div className="text-4xl font-bold text-white">{analysis.archetype}</div>
                            <div className="text-xs uppercase text-purple-300 font-mono">Neural Archetype</div>
                        </div>
                    </ThreeDCard>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                    <ThreeDCard className="h-full bg-emerald-500/10 border-emerald-500/30">
                        <div className="p-6 text-center space-y-2">
                            <Activity className="w-8 h-8 text-emerald-400 mx-auto" />
                            <div className="text-4xl font-bold text-white">{results.validityScore}%</div>
                            <div className="text-xs uppercase text-emerald-300 font-mono">Focus Score</div>
                        </div>
                    </ThreeDCard>
                </motion.div>
            </div>

            {/* Radar & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <ThreeDCard>
                        <div className="p-4 h-[300px] flex items-center justify-center">
                            <TraitRadar data={radarData} />
                        </div>
                    </ThreeDCard>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-2">Key Insight</h3>
                        <p className="text-white/70 leading-relaxed">
                            {analysis.storySections?.hook || analysis.archetypeDesc}
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-2">Recommendation</h3>
                        <p className="text-white/70 leading-relaxed">
                            {analysis.actionableSteps[0]}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4 pt-8"
            >
                <NeonButton onClick={returnToHome} variant="secondary" className="w-40">
                    <Home className="w-4 h-4 mr-2" /> HOME
                </NeonButton>
                <NeonButton onClick={startQuickSession} variant="secondary" className="w-40">
                    <RotateCcw className="w-4 h-4 mr-2" /> RETRY
                </NeonButton>
                <NeonButton onClick={() => setIsShareOpen(true)} variant="primary" className="w-40">
                    <Share2 className="w-4 h-4 mr-2" /> SHARE
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
                    apexTrait: results.apexTraits?.[0]
                }}
                archetype={analysis.archetype}
            />
        </div>
    );
};
