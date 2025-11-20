'use client';

import { GlassCard } from '../ui/GlassCard';
import { Brain, Heart, Zap, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

interface AnalysisWidgetsProps {
    iq: number;
    eq: number;
    risk: number;
    personalityType: string;
}

export const AnalysisWidgets = ({ iq, eq, risk, personalityType }: AnalysisWidgetsProps) => {
    // Calculate percentiles
    const getPercentile = (score: number, mean: number, sd: number) => {
        const z = (score - mean) / sd;
        return Math.max(1, Math.min(99, Math.round(50 + (z * 34))));
    };

    const iqPercentile = getPercentile(iq, 100, 15);
    const eqPercentile = getPercentile(eq, 100, 15);

    // Tier categorization
    const getTier = (score: number, thresholds: number[]) => {
        if (score >= thresholds[3]) return { label: 'Elite', color: 'text-neon-teal' };
        if (score >= thresholds[2]) return { label: 'Strong', color: 'text-neon-green' };
        if (score >= thresholds[1]) return { label: 'Average', color: 'text-yellow-400' };
        return { label: 'Developing', color: 'text-orange-400' };
    };

    const iqTier = getTier(iq, [85, 100, 115, 130]);
    const eqTier = getTier(eq, [85, 100, 115, 130]);
    const riskTier = risk > 70 ? 'High' : risk > 40 ? 'Balanced' : 'Conservative';

    // Generate insights (always show something meaningful)
    const getStrengths = () => {
        const strengths = [];
        if (iq > 115) strengths.push({ icon: Brain, text: `${iqTier.label} pattern recognition (Top ${100 - iqPercentile}%)` });
        else if (iq > 105) strengths.push({ icon: Brain, text: "Strong analytical capability" });
        else strengths.push({ icon: Brain, text: "Logical problem-solving skills" });

        if (eq > 115) strengths.push({ icon: Heart, text: `${eqTier.label} emotional intelligence (Top ${100 - eqPercentile}%)` });
        else if (eq > 105) strengths.push({ icon: Heart, text: "Effective social calibration" });
        else strengths.push({ icon: Heart, text: "Developing empathy skills" });

        if (risk > 60) strengths.push({ icon: Zap, text: "Decisive under pressure" });
        else if (risk > 40) strengths.push({ icon: Zap, text: "Balanced risk assessment" });
        else strengths.push({ icon: Zap, text: "Cautious decision-making" });

        strengths.push({ icon: Sparkles, text: `${personalityType} archetype` });

        return strengths;
    };

    const getOptimizations = () => {
        const optimizations = [];

        // Always provide actionable growth areas
        if (iq < 110) optimizations.push("Daily logic puzzles & abstract reasoning practice");
        else if (iq < 125) optimizations.push("Advanced problem-solving challenges");
        else optimizations.push("Teaching others (Feynman technique)");

        if (eq < 110) optimizations.push("Social cue analysis & active listening exercises");
        else if (eq < 125) optimizations.push("Advanced conflict resolution scenarios");
        else optimizations.push("Emotional regulation mastery");

        if (risk < 30) optimizations.push("Confidence building in uncertain scenarios");
        else if (risk > 80) optimizations.push("Impulse control & long-term planning");
        else optimizations.push("Strategic risk-reward optimization");

        optimizations.push("Cognitive load management & mindfulness");

        return optimizations;
    };

    const strengths = getStrengths();
    const optimizations = getOptimizations();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Cognitive Profile */}
            <GlassCard className="p-6 space-y-4">
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
            <GlassCard className="p-6 space-y-4">
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
                <p className="text-sm text-gray-400">
                    {risk > 70 ? "You thrive in high-stakes environments and embrace uncertainty. Natural fit for entrepreneurial or high-pressure roles." :
                        risk > 40 ? "You balance calculated risks with stability. Adaptable to both conservative and aggressive strategies." :
                            "You prioritize safety and methodical planning. Excel in roles requiring precision and low error tolerance."}
                </p>
            </GlassCard>

            {/* Strengths */}
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

            {/* Optimization */}
            <GlassCard className="p-6 space-y-4 border-l-4 border-l-neon-blue">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-neon-blue" />
                    GROWTH PATHWAYS
                </h3>
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
