import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Brain, Cpu, Sparkles, Target, Briefcase, Shield } from 'lucide-react';
import { DeepInsight } from '../../engine/AnalysisEngine';

interface NeuralAnalysisProps {
    analysis: DeepInsight;
    iq: number;
    eq: number;
}

export const NeuralAnalysis = ({ analysis, iq, eq }: NeuralAnalysisProps) => {
    const [typedText, setTypedText] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Typing Effect for Raw Terminal Output
    useEffect(() => {
        if (!analysis) return;
        let i = 0;
        const text = analysis.raw;
        setTypedText('');

        const interval = setInterval(() => {
            setTypedText((prev) => prev + text.charAt(i));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, 5); // Fast typing

        return () => clearInterval(interval);
    }, [analysis]);

    if (!isVisible) return null;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">



            {/* Core Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Strengths */}
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Target className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-lg font-semibold text-white">Primary Assets</h3>
                    </div>
                    <ul className="space-y-2">
                        {analysis.strengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-yellow-500 mt-1">▸</span>
                                {str}
                            </li>
                        ))}
                    </ul>
                </GlassCard>

                {/* Core Weaknesses (Detailed) */}
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-semibold text-white">Critical Vulnerabilities</h3>
                    </div>
                    <ul className="space-y-4">
                        {analysis.detailedWeaknesses.map((weak, i) => (
                            <li key={i} className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                                <div className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1">{weak.title}</div>
                                <p className="text-sm text-gray-300 leading-snug mb-2">{weak.description}</p>
                                <div className="text-xs text-red-500/80 font-mono border-t border-red-500/20 pt-2 flex gap-2">
                                    <span>⚠️ IMPACT:</span>
                                    {weak.impact}
                                </div>
                            </li>
                        ))}
                    </ul>
                </GlassCard>

                {/* Strategic Interventions (Actionable Steps) */}
                <GlassCard className="p-6 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <Target className="w-5 h-5 text-neon-green" />
                        <h3 className="text-lg font-semibold text-white">Strategic Protocol (Growth Plan)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.actionableSteps.map((step, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                <div className="w-6 h-6 rounded-full bg-neon-green/20 text-neon-green flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Optimal Career - Shifted to bottom */}
                <GlassCard className="p-6 md:col-span-2 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-purple-400" />
                        <h3 className="text-md font-semibold text-white">Recommended Professional Role</h3>
                    </div>
                    <p className="text-purple-300/60 text-xs mb-2 pl-8">
                        Based on your unique cognitive synergy, you would excel in:
                    </p>
                    <p className="text-purple-300 font-mono text-sm leading-relaxed pl-8">
                        {analysis.career}
                    </p>
                </GlassCard>
            </div>

            {/* Terminal View */}
            <div className="bg-black/90 rounded-lg p-4 font-mono text-xs md:text-xs text-green-500/80 overflow-hidden border border-white/10 relative min-h-[200px]">
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-50">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <pre className="whitespace-pre-wrap break-words leading-relaxed relative z-0">
                    {typedText}
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-1.5 h-3 bg-green-500 ml-0.5 align-middle"
                    />
                </pre>
            </div>

            {/* System Specs */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                    <div className="p-2 bg-neon-purple/20 rounded-md text-neon-purple">
                        <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">Processor</div>
                        <div className="text-xs font-bold text-white">{analysis.cpuType}</div>
                    </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                    <div className="p-2 bg-neon-blue/20 rounded-md text-neon-blue">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">OS Kernel</div>
                        <div className="text-xs font-bold text-white">{analysis.osType}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
