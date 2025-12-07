'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Brain,
    Zap,
    Heart,
    Shield,
    Lightbulb,
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Info
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface CognitiveScore {
    label: string;
    abbreviation: string;
    score: number;
    percentile: number;
    description: string;
    icon: keyof typeof iconMap;
    color: string;
    reliability?: number;      // 0-1, Cronbach's alpha
    confidence?: [number, number]; // 95% CI bounds
}

export interface CognitiveScoreCardProps {
    scores: CognitiveScore[];
    title?: string;
    showReliability?: boolean;
}

const iconMap = {
    brain: Brain,
    zap: Zap,
    heart: Heart,
    shield: Shield,
    lightbulb: Lightbulb,
    target: Target,
    trending: TrendingUp,
};

// ============================================================================
// COGNITIVE SCORE CARD COMPONENT
// ============================================================================

export const CognitiveScoreCard: React.FC<CognitiveScoreCardProps> = ({
    scores,
    title = "COGNITIVE PROFILE",
    showReliability = false,
}) => {
    return (
        <div className="bg-neural-card/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                <h3 className="font-display text-lg font-bold text-white tracking-wider flex items-center gap-2">
                    <Brain className="w-5 h-5 text-neon-cyan" />
                    {title}
                </h3>
                <p className="text-neural-muted text-xs mt-1">
                    Six-factor cognitive assessment based on CHC theory
                </p>
            </div>

            {/* Score Grid */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {scores.map((score, idx) => (
                    <ScoreModule key={score.abbreviation} score={score} delay={idx * 0.1} showReliability={showReliability} />
                ))}
            </div>

            {/* Explanation Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-start gap-2 text-xs text-neural-muted">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                        Scores are standardized with mean=100 and SD=15. Percentiles indicate
                        your position relative to the normative population.
                    </span>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// INDIVIDUAL SCORE MODULE
// ============================================================================

interface ScoreModuleProps {
    score: CognitiveScore;
    delay: number;
    showReliability: boolean;
}

const ScoreModule: React.FC<ScoreModuleProps> = ({ score, delay, showReliability }) => {
    const Icon = iconMap[score.icon] || Brain;

    // Determine score band
    const getScoreBand = (s: number): { label: string; color: string } => {
        if (s >= 130) return { label: 'Very Superior', color: 'text-neon-cyan' };
        if (s >= 120) return { label: 'Superior', color: 'text-neon-green' };
        if (s >= 110) return { label: 'High Average', color: 'text-emerald-400' };
        if (s >= 90) return { label: 'Average', color: 'text-white' };
        if (s >= 80) return { label: 'Low Average', color: 'text-yellow-400' };
        if (s >= 70) return { label: 'Below Average', color: 'text-orange-400' };
        return { label: 'Very Low', color: 'text-red-400' };
    };

    const band = getScoreBand(score.score);

    // Calculate progress bar width (60-140 range mapped to 0-100%)
    const progressWidth = Math.min(100, Math.max(0, ((score.score - 60) / 80) * 100));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-all group"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: `${score.color}20` }}
                    >
                        <Icon className="w-4 h-4" style={{ color: score.color }} />
                    </div>
                    <div>
                        <p className="text-xs font-mono text-neural-muted">{score.abbreviation}</p>
                        <p className="text-sm font-medium text-white truncate max-w-[100px]">{score.label}</p>
                    </div>
                </div>
            </div>

            {/* Score Display */}
            <div className="flex items-baseline gap-2 mb-2">
                <span className={cn("text-2xl font-bold font-display", band.color)}>
                    {score.score}
                </span>
                <span className="text-xs text-neural-muted">
                    / {score.percentile}%ile
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressWidth}%` }}
                    transition={{ delay: delay + 0.3, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: score.color }}
                />
            </div>

            {/* Band Label */}
            <p className={cn("text-xs font-mono", band.color)}>{band.label}</p>

            {/* Confidence Interval (if available) */}
            {showReliability && score.confidence && (
                <div className="mt-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1 text-xs text-neural-muted">
                        <span>95% CI:</span>
                        <span className="font-mono">
                            [{score.confidence[0]}–{score.confidence[1]}]
                        </span>
                    </div>
                    {score.reliability && (
                        <div className="flex items-center gap-1 text-xs text-neural-muted mt-1">
                            <span>α =</span>
                            <span className={cn(
                                "font-mono",
                                score.reliability >= 0.85 ? "text-neon-green" :
                                    score.reliability >= 0.70 ? "text-yellow-400" :
                                        "text-red-400"
                            )}>
                                {score.reliability.toFixed(2)}
                            </span>
                            {score.reliability >= 0.85 && <CheckCircle className="w-3 h-3 text-neon-green" />}
                            {score.reliability < 0.70 && <AlertTriangle className="w-3 h-3 text-red-400" />}
                        </div>
                    )}
                </div>
            )}

            {/* Tooltip on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {/* Could add tooltip implementation here */}
            </div>
        </motion.div>
    );
};

// ============================================================================
// PRESET SCORE CONFIGURATIONS
// ============================================================================

export const createCognitiveScores = (results: {
    gf?: number;  // Fluid Intelligence
    gwm?: number; // Working Memory
    gs?: number;  // Processing Speed
    gc?: number;  // Crystallized Intelligence
    gex?: number; // Executive Function
    meta?: number; // Meta-Cognition
    // Legacy support
    iq?: number;
    eq?: number;
}): CognitiveScore[] => {
    return [
        {
            label: 'Fluid Intelligence',
            abbreviation: 'Gf',
            score: results.gf ?? results.iq ?? 100,
            percentile: scoreToPercentile(results.gf ?? results.iq ?? 100),
            description: 'Abstract reasoning and novel problem-solving ability',
            icon: 'brain',
            color: '#22d3ee', // cyan
        },
        {
            label: 'Working Memory',
            abbreviation: 'Gwm',
            score: results.gwm ?? 100,
            percentile: scoreToPercentile(results.gwm ?? 100),
            description: 'Ability to hold and manipulate information in mind',
            icon: 'zap',
            color: '#a855f7', // purple
        },
        {
            label: 'Processing Speed',
            abbreviation: 'Gs',
            score: results.gs ?? 100,
            percentile: scoreToPercentile(results.gs ?? 100),
            description: 'Speed of cognitive operations and reaction time',
            icon: 'trending',
            color: '#22c55e', // green
        },
        {
            label: 'Crystallized Intel.',
            abbreviation: 'Gc',
            score: results.gc ?? 100,
            percentile: scoreToPercentile(results.gc ?? 100),
            description: 'Accumulated knowledge and verbal abilities',
            icon: 'lightbulb',
            color: '#f97316', // orange
        },
        {
            label: 'Executive Function',
            abbreviation: 'Gex',
            score: results.gex ?? 100,
            percentile: scoreToPercentile(results.gex ?? 100),
            description: 'Cognitive control, inhibition, and flexibility',
            icon: 'target',
            color: '#ec4899', // pink
        },
        {
            label: 'Meta-Cognition',
            abbreviation: 'Meta',
            score: results.meta ?? results.eq ?? 100,
            percentile: scoreToPercentile(results.meta ?? results.eq ?? 100),
            description: 'Self-awareness, calibration, and bias detection',
            icon: 'heart',
            color: '#eab308', // yellow
        },
    ];
};

// Helper function
function scoreToPercentile(score: number): number {
    // Standard IQ score to percentile (mean=100, SD=15)
    const z = (score - 100) / 15;
    // Approximation of standard normal CDF
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return Math.round((z > 0 ? 1 - p : p) * 100);
}

export default CognitiveScoreCard;
