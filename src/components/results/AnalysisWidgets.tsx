'use client';

import { GlassCard } from '../ui/GlassCard';
import { Brain, Heart, Zap, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { DeepInsight } from '../../engine/AnalysisEngine';

interface AnalysisWidgetsProps {
    analysis: DeepInsight;
    iq: number;
    eq: number;
    risk: number;
}

export const AnalysisWidgets = ({ analysis, iq, eq, risk }: AnalysisWidgetsProps) => {
    // Calculate percentiles and tiers for visualization
    const getTier = (score: number, thresholds: number[]) => {
        if (score >= thresholds[3]) return { label: 'Elite', color: 'text-neon-teal' };
        if (score >= thresholds[2]) return { label: 'Strong', color: 'text-neon-green' };
        if (score >= thresholds[1]) return { label: 'Average', color: 'text-yellow-400' };
        return { label: 'Developing', color: 'text-orange-400' };
    };

    const iqTier = getTier(iq, [85, 100, 115, 130]);
    const eqTier = getTier(eq, [85, 100, 115, 130]);
    const riskTier = risk > 70 ? 'High' : risk > 40 ? 'Balanced' : 'Conservative';

    // Use derived insights from the engine
    const strengths = analysis.strengths.slice(0, 5).map(s => ({ icon: Sparkles, text: s }));
    const optimizations = analysis.actionableSteps.slice(0, 5);

    // Check for critical weakness (mirror reflection)
    const criticalWeakness = analysis.detailedWeaknesses.find(w => w.impact.includes("Catastrophic") || w.impact.includes("failure"));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full">
            {/* Cognitive Profile */}
            <GlassCard className="p-6 space-y-4 flex flex-col justify-center">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-neon-blue" />
                    COGNITIVE PROFILE
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-neural-muted">Fluid Intelligence (IQ)</span>
                        <div className="text-right">
                            <div className="text-xl font-mono font-bold text-white">{iq}</div>
                            <div className={`text-xs font-mono ${iqTier.color}`}>{iqTier.label}</div>
                        </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-blue" style={{ width: `${Math.min(100, (iq / 145) * 100)}%` }} />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-neural-muted">Emotional Intelligence (EQ)</span>
                        <div className="text-right">
                            <div className="text-xl font-mono font-bold text-white">{eq}</div>
                            <div className={`text-xs font-mono ${eqTier.color}`}>{eqTier.label}</div>
                        </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-purple" style={{ width: `${Math.min(100, (eq / 145) * 100)}%` }} />
                    </div>
                </div>
            </GlassCard>

            {/* Risk & Strategy */}
            <GlassCard className="p-6 space-y-4 flex flex-col justify-center">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-neon-orange" />
                    RISK DYNAMICS
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-neural-muted">Risk Tolerance</span>
                    <div className="text-right">
                        <div className="text-xl font-mono font-bold text-white">{risk}/100</div>
                        <div className="text-xs font-mono text-neon-orange">{riskTier}</div>
                    </div>
                </div>
                <p className="text-sm text-gray-400 italic">
                    {/* Use the holistic summary snippet if available or fallback */}
                    {/* We can construct a specialized snippet here or rely on AnalysisEngine to pass it.
                         For now, let's keep the simple dynamic text but maybe sourced from engine later.
                         Keeping local logic for this specific small text as it's UI specific. */}
                    {risk > 70 ? "Thriving in high-stakes environments." :
                        risk > 40 ? "Balancing calculated risks with stability." :
                            "Prioritizing safety and methodical planning."}
                </p>
            </GlassCard>

            {/* Strengths (Engine Sourced) */}
            <GlassCard className="p-6 space-y-4 border-l-4 border-l-neon-green">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-neon-green" />
                    CORE STRENGTHS
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    {strengths.map((strength, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                            <span className="text-neon-green mt-0.5">+</span>
                            <span>{strength.text}</span>
                        </li>
                    ))}
                </ul>
            </GlassCard>

            {/* Optimization - Growth Pathways (Engine Sourced) */}
            <GlassCard className="p-6 space-y-4 border-l-4 border-l-neon-blue">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-neon-blue" />
                        GROWTH PATHWAYS
                    </h3>
                </div>

                {criticalWeakness && (
                    <div className="bg-red-500/10 border border-red-500/20 p-2 rounded mb-2">
                        <p className="text-xs text-red-400 font-bold">CRITICAL BOTTLENECK DETECTED</p>
                    </div>
                )}

                <ul className="space-y-2 text-sm text-gray-300">
                    {optimizations.map((opt, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                            <span className="text-neon-blue mt-0.5">△</span>
                            <span>{opt}</span>
                        </li>
                    ))}
                </ul>
            </GlassCard>
        </div>
    );
};
