'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Brain, Cpu, Sparkles, Target, Briefcase, Shield } from 'lucide-react';

interface NeuralAnalysisProps {
    iq: number;
    eq: number;
    risk: number;
    personalityType: string;
    ocean: {
        openness: number;
        conscientiousness: number;
        extraversion: number;
        agreeableness: number;
        neuroticism: number;
    };
}

export const NeuralAnalysis = ({ iq, eq, risk, personalityType, ocean }: NeuralAnalysisProps) => {
    const [typedText, setTypedText] = useState('');
    const [analysis, setAnalysis] = useState<any>(null);

    // Generate Deep Insights
    useEffect(() => {
        const generateAnalysis = () => {
            // Helper: Calculate percentile rank
            const getPercentile = (score: number, mean: number, sd: number) => {
                const z = (score - mean) / sd;
                return Math.round(50 + (z * 34)); // Simplified percentile
            };

            const iqPercentile = getPercentile(iq, 100, 15);
            const eqPercentile = getPercentile(eq, 100, 15);

            // === 1. GUARANTEED STRENGTHS (Always 3-5) ===
            const strengths = [];

            // Tier 1: Exceptional abilities (Top 10%)
            if (iq > 125) strengths.push(`Elite Abstract Reasoning (Top ${100 - iqPercentile}%)`);
            else if (iq > 115) strengths.push("Advanced Pattern Recognition");
            else if (iq > 105) strengths.push("Strong Analytical Capability");

            if (eq > 125) strengths.push(`Exceptional Social Intelligence (Top ${100 - eqPercentile}%)`);
            else if (eq > 115) strengths.push("High Empathetic Accuracy");
            else if (eq > 105) strengths.push("Effective Emotional Calibration");

            if (risk > 75) strengths.push("Bold Decision-Making Under Uncertainty");
            else if (risk > 60) strengths.push("Balanced Risk Assessment");

            // Tier 2: OCEAN Strengths (Top 2 traits)
            const oceanScores = [
                { trait: "Openness", score: ocean.openness, strength: "Intellectual Curiosity & Creative Thinking" },
                { trait: "Conscientiousness", score: ocean.conscientiousness, strength: "Methodical Execution & Reliability" },
                { trait: "Extraversion", score: ocean.extraversion, strength: "Social Energy & Leadership Presence" },
                { trait: "Agreeableness", score: ocean.agreeableness, strength: "Collaborative Spirit & Empathy" },
                { trait: "Emotional Stability", score: 100 - ocean.neuroticism, strength: "Composure Under Pressure" }
            ].sort((a, b) => b.score - a.score);

            // Add top 2 OCEAN traits if not already covered
            for (let i = 0; i < 2 && strengths.length < 5; i++) {
                if (oceanScores[i].score > 60) {
                    strengths.push(oceanScores[i].strength);
                }
            }

            // Ensure minimum 3 strengths
            if (strengths.length < 3) {
                if (iq > 90) strengths.push("Logical Problem-Solving Capability");
                if (eq > 90) strengths.push("Interpersonal Awareness");
                if (strengths.length < 3) strengths.push("Adaptive Learning Capacity");
            }

            // === 2. GROWTH AREAS (Always 2-3, specific and actionable) ===
            const weaknesses = [];

            // Identify specific improvement areas based on score gaps
            const allScores = [
                { name: "Analytical Processing", score: iq, threshold: 100 },
                { name: "Emotional Regulation", score: eq, threshold: 100 },
                { name: "Decisiveness", score: risk, threshold: 50 },
                { name: "Creative Exploration", score: ocean.openness, threshold: 60 },
                { name: "Structured Planning", score: ocean.conscientiousness, threshold: 60 },
                { name: "Stress Management", score: 100 - ocean.neuroticism, threshold: 60 }
            ].sort((a, b) => a.score - b.score);

            // Bottom 2 scores become growth areas
            for (let i = 0; i < 2; i++) {
                if (allScores[i].score < allScores[i].threshold) {
                    weaknesses.push(allScores[i].name);
                }
            }

            // Add specific behavioral patterns
            if (iq > 130 && eq < 95) weaknesses.push("Balancing Logic with Emotional Intelligence");
            if (risk > 85) weaknesses.push("Calculated Risk vs Impulsivity Management");
            if (ocean.agreeableness > 85 && risk < 40) weaknesses.push("Assertiveness in High-Stakes Situations");
            if (ocean.neuroticism > 75) weaknesses.push("Anxiety Regulation Techniques");

            // Ensure 2-3 growth areas
            if (weaknesses.length === 0) weaknesses.push("Continuous Skill Refinement", "Cross-Domain Knowledge Building");
            if (weaknesses.length === 1) weaknesses.push("Adaptive Resilience Training");

            // === 3. EXPANDED ARCHETYPES (12+ nuanced types) ===
            let archetype = "Adaptive Generalist";
            let archetypeDesc = "You possess a balanced cognitive profile capable of adapting to various challenges.";
            let matchScore = 75;

            // High IQ Archetypes
            if (iq > 130 && ocean.openness > 75) {
                archetype = "Visionary Architect";
                archetypeDesc = "You construct entire systems from abstract concepts. Your mind operates in possibility space, designing solutions before they're needed.";
                matchScore = 95;
            } else if (iq > 125 && ocean.conscientiousness > 80 && risk < 40) {
                archetype = "Precision Engineer";
                archetypeDesc = "You don't just solve problems—you optimize them out of existence. Relentless logic paired with methodical discipline.";
                matchScore = 93;
            } else if (iq > 120 && risk > 70 && ocean.openness > 65) {
                archetype = "Strategic Innovator";
                archetypeDesc = "You see opportunities where others see chaos. Combines analytical rigor with calculated risk-taking to drive breakthrough outcomes.";
                matchScore = 91;
            }

            // High EQ Archetypes
            else if (eq > 125 && ocean.agreeableness > 70) {
                archetype = "Harmonic Resonator";
                archetypeDesc = "You stabilize chaotic social systems through exceptional emotional intelligence. A natural mediator and team catalyst.";
                matchScore = 94;
            } else if (eq > 120 && ocean.extraversion > 75) {
                archetype = "Social Catalyst";
                archetypeDesc = "You accelerate human connection and group dynamics. Natural leader for high-growth, people-centric environments.";
                matchScore = 92;
            } else if (eq > 115 && iq > 110 && ocean.conscientiousness > 70) {
                archetype = "Empathetic Diplomat";
                archetypeDesc = "Rare blend of systematic thinking and social finesse. You navigate complex human systems with both logic and emotional awareness.";
                matchScore = 90;
            }

            // Risk-Driven Archetypes
            else if (risk > 80 && ocean.conscientiousness < 50) {
                archetype = "Chaos Navigator";
                archetypeDesc = "You thrive where others freeze. High-uncertainty environments are your native habitat. Your risk tolerance is a strategic weapon.";
                matchScore = 88;
            } else if (risk > 70 && iq > 110 && ocean.neuroticism < 40) {
                archetype = "Calculated Maverick";
                archetypeDesc = "Bold but not reckless. You take intelligent risks backed by pattern recognition and emotional stability under pressure.";
                matchScore = 89;
            }

            // Balanced/Specialist Archetypes
            else if (ocean.conscientiousness > 80 && ocean.neuroticism < 40 && risk < 50) {
                archetype = "Methodical Stabilizer";
                archetypeDesc = "Reliability incarnate. You bring order to complexity through systematic approaches and unshakeable composure.";
                matchScore = 87;
            } else if (iq > 110 && eq > 110 && Math.abs(iq - eq) < 15) {
                archetype = "Renaissance Synthesizer";
                archetypeDesc = "Equally fluent in logic and emotion. You bridge analytical and human domains, making you invaluable in interdisciplinary challenges.";
                matchScore = 92;
            } else if (ocean.openness > 80 && ocean.extraversion < 40) {
                archetype = "Introspective Visionary";
                archetypeDesc = "Deep curiosity meets contemplative processing. You generate novel insights through solitary intellectual exploration.";
                matchScore = 86;
            } else if (ocean.agreeableness > 80 && ocean.conscientiousness > 70) {
                archetype = "Harmonious Executor";
                archetypeDesc = "You combine collaborative spirit with disciplined execution. Ideal for roles requiring both teamwork and delivery excellence.";
                matchScore = 85;
            }

            // === 4. MULTI-TIER CAREER RECOMMENDATIONS ===
            const careers: { ideal: string[]; strong: string[]; growth: string[] } = { ideal: [], strong: [], growth: [] };

            // Use archetype + scores for targeted recommendations
            if (archetype === "Visionary Architect") {
                careers.ideal = ["Chief Technology Officer", "Systems Architect", "Research Scientist"];
                careers.strong = ["Product Strategist", "Innovation Consultant", "Futurist Author"];
            } else if (archetype === "Precision Engineer") {
                careers.ideal = ["Algorithmic Trader", "Backend Architect", "Operations Research Analyst"];
                careers.strong = ["Data Scientist", "Quality Assurance Lead", "Process Optimization Specialist"];
            } else if (archetype === "Social Catalyst") {
                careers.ideal = ["Venture Capitalist", "Political Strategist", "Brand Evangelist"];
                careers.strong = ["Talent Acquisition Lead", "Event Director", "Community Builder"];
            } else if (archetype === "Harmonic Resonator") {
                careers.ideal = ["Organizational Psychologist", "Conflict Mediator", "HR Strategy Director"];
                careers.strong = ["Executive Coach", "Team Facilitator", "Culture Architect"];
            } else if (archetype === "Chaos Navigator") {
                careers.ideal = ["Crisis Manager", "Startup Founder", "Emergency Response Coordinator"];
                careers.strong = ["Trader (High-Frequency)", "Test Pilot", "Field Operations Lead"];
            } else {
                // Balanced recommendations based on top 2 scores
                if (iq > 110) careers.strong.push("Strategy Consultant", "Business Analyst");
                if (eq > 110) careers.strong.push("Account Manager", "Client Success Lead");
                if (ocean.conscientiousness > 70) careers.strong.push("Project Manager", "Operations Lead");
                if (ocean.openness > 70) careers.strong.push("UX Designer", "Content Strategist");

                careers.ideal = careers.strong.slice(0, 2);
                careers.strong = careers.strong.slice(2);
            }

            const careerText = careers.ideal.length > 0
                ? careers.ideal.join(", ")
                : "Consulting, Management, Specialized Analysis";

            // === 5. COGNITIVE ARCHITECTURE ===
            let cpuType = "Standard-Core";
            if (iq > 135) cpuType = "Quantum-Logic Hybrid";
            else if (iq > 125) cpuType = "Multi-Core Hyper-Thread";
            else if (iq > 115) cpuType = "Optimized Dual-Core";

            let osType = "Stable-Build v4.0";
            if (ocean.neuroticism > 75) osType = "High-Sensitivity Mode";
            else if (ocean.neuroticism < 30 && ocean.conscientiousness > 75) osType = "Real-Time OS (Military-Grade)";
            else if (ocean.conscientiousness > 80) osType = "Precision Kernel v8.2";

            return {
                archetype,
                archetypeDesc,
                matchScore,
                strengths: strengths.slice(0, 5),
                weaknesses: weaknesses.slice(0, 3),
                career: careerText,
                cpuType,
                osType,
                raw: `> INITIALIZING DEEP SCAN v5.0...\n> DECRYPTING NEURAL SIGNATURE...\n> \n> SUBJECT: ${personalityType.toUpperCase()}\n> METRICS: IQ[${iq}] EQ[${eq}] RISK[${risk}%]\n> OCEAN: O[${ocean.openness}] C[${ocean.conscientiousness}] E[${ocean.extraversion}] A[${ocean.agreeableness}] N[${ocean.neuroticism}]\n> \n> DETECTED ARCHETYPE: [${archetype.toUpperCase()}] (${matchScore}% MATCH)\n> "${archetypeDesc}"\n> \n> PRIMARY ASSETS:\n> ${strengths.map(s => `+ ${s}`).join('\n> ')}\n> \n> GROWTH VECTORS:\n> ${weaknesses.map(w => `△ ${w}`).join('\n> ')}\n> \n> OPTIMAL DEPLOYMENT:\n> ${careerText}\n> \n> SYSTEM STATUS: ONLINE.`
            };
        };

        setAnalysis(generateAnalysis());
    }, [iq, eq, risk, personalityType, ocean]);

    // Typing Effect
    useEffect(() => {
        if (!analysis) return;
        let i = 0;
        const text = analysis.raw;
        setTypedText('');

        const interval = setInterval(() => {
            setTypedText((prev) => prev + text.charAt(i));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, 10); // Faster typing

        return () => clearInterval(interval);
    }, [analysis]);

    if (!analysis) return null;

    return (
        <GlassCard className="p-6 md:p-8 space-y-6 h-full flex flex-col">
            <div className="flex items-center gap-3 text-neon-teal mb-2">
                <Brain className="w-6 h-6" />
                <h3 className="text-xl font-display font-bold tracking-wider">NEURAL ANALYSIS</h3>
            </div>

            {/* Terminal View */}
            <div className="bg-neural-bg/90 rounded-lg p-4 font-mono text-xs md:text-sm text-neon-teal min-h-[300px] overflow-hidden border border-white/10 shadow-[inset_0_0_20px_rgba(15,23,42,0.8)] relative">
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]" />

                <div className="absolute top-2 right-2 flex gap-1 z-20">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>

                <pre className="whitespace-pre-wrap break-words leading-relaxed relative z-0 font-bold opacity-90">
                    {typedText}
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"
                    />
                </pre>
            </div>

            {/* Visual Widgets */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                    <div className="p-2 bg-neon-purple/20 rounded-md text-neon-purple">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">Processor</div>
                        <div className="text-sm font-bold text-white">{analysis.cpuType}</div>
                    </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                    <div className="p-2 bg-neon-blue/20 rounded-md text-neon-blue">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">OS Kernel</div>
                        <div className="text-sm font-bold text-white">{analysis.osType}</div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
