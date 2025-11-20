'use client';

import { GlassCard } from '../ui/GlassCard';
import { Brain, Heart, Zap, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalysisWidgetsProps {
    iq: number;
    eq: number;
    risk: number;
    personalityType: string;
}

export const AnalysisWidgets = ({ iq, eq, risk, personalityType }: AnalysisWidgetsProps) => {
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
                        <span className="text-xl font-mono font-bold text-white">{iq}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-blue" style={{ width: `${Math.min(100, (iq / 145) * 100)}%` }} />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-neural-muted">Emotional Intelligence (EQ)</span>
                        <span className="text-xl font-mono font-bold text-white">{eq}</span>
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
                    <span className="text-xl font-mono font-bold text-white">{risk}/100</span>
                </div>
                <p className="text-sm text-gray-400">
                    {risk > 70 ? "High risk tolerance. You prefer high-stakes environments and rapid decision making." :
                        risk > 40 ? "Balanced risk profile. You weigh options carefully but can act decisively." :
                            "Conservative approach. You prioritize stability and calculated moves."}
                </p>
            </GlassCard>

            {/* Strengths */}
            <GlassCard className="p-6 space-y-4 border-l-4 border-l-neon-green">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-neon-green" />
                    CORE STRENGTHS
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    {iq > 115 && <li className="flex gap-2"><span className="text-neon-green">+</span> Exceptional pattern recognition</li>}
                    {eq > 115 && <li className="flex gap-2"><span className="text-neon-green">+</span> High emotional acuity</li>}
                    {risk > 60 && <li className="flex gap-2"><span className="text-neon-green">+</span> Decisive under pressure</li>}
                    <li className="flex gap-2"><span className="text-neon-green">+</span> {personalityType} Archetype</li>
                </ul>
            </GlassCard>

            {/* Optimization */}
            <GlassCard className="p-6 space-y-4 border-l-4 border-l-neon-red">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-neon-red" />
                    OPTIMIZATION ZONES
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    {iq < 100 && <li className="flex gap-2"><span className="text-neon-red">•</span> Logic puzzles & abstract reasoning practice</li>}
                    {eq < 100 && <li className="flex gap-2"><span className="text-neon-red">•</span> Social cue analysis & empathy training</li>}
                    {risk < 30 && <li className="flex gap-2"><span className="text-neon-red">•</span> Confidence building in uncertain scenarios</li>}
                    <li className="flex gap-2"><span className="text-neon-red">•</span> Cognitive load management</li>
                </ul>
            </GlassCard>
        </div>
    );
};
