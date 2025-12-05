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

    // Dynamic Analysis Text (Expanded Combinatorics)
    const getAnalysis = () => {
        // High IQ Combos
        if (iq > 120) {
            if (risk > 70) return "High Logic + High Risk: You are a 'Visionary Strategist'. You see patterns others miss and have the courage to act on them immediately.";
            if (risk < 40) return "High Logic + Low Risk: You are a 'Calculated Architect'. You build robust, error-proof systems and prefer certainty over speculation.";
            if (eq > 115) return "High IQ + High EQ: You are a 'Diplomatic Polymath'. You bridge the gap between complex technical systems and human emotional needs.";
            return "Analytical Specialist: Your raw processing power is your standout trait. You solve problems that baffle others, but may need to translate your solutions for them.";
        }

        // High EQ Combos (Average IQ)
        if (eq > 120) {
            if (risk > 60) return "High EQ + Risk: You are a 'Social Catalyst'. You read rooms instantly and aren't afraid to disrupt social inertia to get results.";
            return "Empathic Anchor: You are the emotional bedrock of your team. You perceive friction before it happens and smooth it out invisibly.";
        }

        // High Risk Combos (Average IQ/EQ)
        if (risk > 80) {
            return "Maverick Operator: You prefer forgiveness to permission. You move fast and break things, which is high-value in early-stage chaos but risky in established stability.";
        }

        // Low Risk Combos
        if (risk < 30) {
            if (iq > 100) return "The Guardian: You are excellent at identifying failure points. While others look for upside, you ensure survival by plugging leaks.";
            return "Risk Averse: You likely struggle with analysis paralysis. Trust your initial instincts more often—they are better than you think.";
        }

        // Balanced
        return "Balanced Adaptive Profile: You possess a versatile cognitive toolkit without extreme spikes. This makes you a universal translator capable of operating in almost any domain.";
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
