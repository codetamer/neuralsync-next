import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

interface CognitiveProfileProps {
    iq: number;
    eq: number;
    risk: number;
}

export const CognitiveProfile = ({ iq, eq, risk }: CognitiveProfileProps) => {
    const metrics = [
        { label: 'Logic (IQ)', value: iq, color: 'bg-blue-500', desc: 'Pattern recognition & abstract reasoning' },
        { label: 'Empathy (EQ)', value: eq, color: 'bg-purple-500', desc: 'Emotional awareness & social calibration' },
        { label: 'Risk Tolerance', value: risk, color: 'bg-red-500', desc: 'Decision making under uncertainty' }
    ];

    // Dynamic Analysis Text
    const getAnalysis = () => {
        if (iq > 120 && risk > 70) return "High Logic + High Risk: You are a 'Visionary Strategist'. You see patterns others miss and have the courage to act on them.";
        if (iq > 120 && risk < 40) return "High Logic + Low Risk: You are a 'Calculated Architect'. You build robust systems and prefer certainty over speculation.";
        if (eq > 120 && iq > 110) return "High EQ + High IQ: You are a 'Diplomatic Leader'. You understand both systems and people, making you an effective mediator.";
        if (risk > 80 && eq < 50) return "High Risk + Lower EQ: You are a 'Maverick'. You take bold chances but may overlook the human element.";
        return "Balanced Profile: You possess a versatile cognitive toolkit, adaptable to various challenges.";
    };

    return (
        <GlassCard className="p-6 space-y-6">
            <h3 className="text-2xl font-display font-bold text-white">Cognitive Architecture</h3>

            <div className="space-y-6">
                {metrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-white/80 font-medium">{metric.label}</span>
                            <span className="text-neon-teal font-mono text-xl">{metric.value}</span>
                        </div>
                        <div className="h-4 bg-neural-card rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (metric.value / 150) * 100)}%` }} // Scale roughly to 150 max
                                transition={{ duration: 1, delay: index * 0.2 }}
                                className={`h-full ${metric.color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                            />
                        </div>
                        <p className="text-xs text-white/40">{metric.desc}</p>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-white/10">
                <h4 className="text-neon-teal font-bold mb-2">Deep Dive Analysis</h4>
                <p className="text-white/70 leading-relaxed">
                    {getAnalysis()}
                </p>
            </div>
        </GlassCard>
    );
};
