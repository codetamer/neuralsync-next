'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ArrowRight, Brain, Heart, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * MiniInsight - Quick feedback component shown between test sections
 * 
 * Shows users partial insights based on their answers so far to maintain
 * engagement and provide a sense of progress.
 */

interface MiniInsightProps {
    insightType: 'personality' | 'cognitive' | 'emotional' | 'general';
    primaryTrait: string;
    secondaryTrait?: string;
    direction: 'high' | 'low' | 'balanced';
    onContinue: () => void;
    className?: string;
}

const INSIGHT_TEMPLATES = {
    personality: {
        high: [
            "You show a strong tendency toward {trait}",
            "Your responses suggest you lean heavily into {trait}",
            "{trait} appears to be a defining aspect of your personality"
        ],
        low: [
            "You appear to de-emphasize {trait}",
            "Your responses suggest {trait} isn't a major driver for you",
            "You seem to prioritize other traits over {trait}"
        ],
        balanced: [
            "You show a balanced approach to {trait}",
            "Your {trait} tendencies appear context-dependent",
            "You demonstrate flexibility in {trait}"
        ]
    },
    cognitive: {
        high: [
            "Your pattern recognition is showing strong signals",
            "Early indicators suggest above-average processing speed",
            "Your analytical responses are consistent"
        ],
        low: [
            "Taking time to process — quality over speed",
            "Your approach suggests careful deliberation",
            "You're prioritizing accuracy over speed"
        ],
        balanced: [
            "Balanced cognitive approach detected",
            "Your processing style adapts to the challenge",
            "Varied cognitive strategies observed"
        ]
    },
    emotional: {
        high: [
            "High emotional awareness in your responses",
            "Your social intuition appears well-developed",
            "Strong empathetic signals detected"
        ],
        low: [
            "Logic-first approach to emotional scenarios",
            "You prioritize rational analysis",
            "Objective decision-making style observed"
        ],
        balanced: [
            "Balanced head-heart integration",
            "You blend logic with emotional awareness",
            "Adaptive emotional style detected"
        ]
    },
    general: {
        high: [
            "Strong signals emerging from your responses",
            "Your profile is taking shape",
            "Clear patterns forming"
        ],
        low: [
            "Unique response patterns detected",
            "Your profile is distinctive",
            "Interesting divergences noted"
        ],
        balanced: [
            "Balanced profile emerging",
            "Versatile tendencies observed",
            "Multi-dimensional patterns detected"
        ]
    }
};

const getRandomTemplate = (type: MiniInsightProps['insightType'], direction: MiniInsightProps['direction']): string => {
    const templates = INSIGHT_TEMPLATES[type][direction];
    return templates[Math.floor(Math.random() * templates.length)];
};

const formatInsight = (template: string, trait: string): string => {
    return template.replace('{trait}', trait);
};

const ICONS = {
    personality: Brain,
    cognitive: Zap,
    emotional: Heart,
    general: Lightbulb
};

const COLORS = {
    personality: 'from-neon-purple to-violet-500',
    cognitive: 'from-neon-green to-emerald-500',
    emotional: 'from-pink-500 to-rose-500',
    general: 'from-amber-500 to-orange-500'
};

export const MiniInsight = ({
    insightType,
    primaryTrait,
    secondaryTrait,
    direction,
    onContinue,
    className
}: MiniInsightProps) => {
    const Icon = ICONS[insightType];
    const gradientColor = COLORS[insightType];
    const template = getRandomTemplate(insightType, direction);
    const insightText = formatInsight(template, primaryTrait);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
                "w-full max-w-md mx-auto p-6 rounded-2xl",
                "bg-gradient-to-br from-neural-card to-neural-surface",
                "border border-white/10 shadow-2xl",
                className
            )}
        >
            {/* Icon Header */}
            <div className="flex items-center justify-center mb-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                        "bg-gradient-to-br",
                        gradientColor
                    )}
                >
                    <Icon className="w-8 h-8 text-white" />
                </motion.div>
            </div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-4"
            >
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                    Early Signal Detected
                </span>
                <h3 className="text-lg font-display font-bold text-white mt-1">
                    💡 Quick Insight
                </h3>
            </motion.div>

            {/* Insight Text */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center text-white/80 text-sm leading-relaxed mb-2"
            >
                {insightText}
            </motion.p>

            {/* Secondary trait if present */}
            {secondaryTrait && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-white/50 text-xs"
                >
                    Also detecting: <span className="text-white/70">{secondaryTrait}</span>
                </motion.p>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

            {/* Continue Button */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={onContinue}
                className={cn(
                    "w-full py-3 rounded-xl",
                    "bg-gradient-to-r from-white/5 to-white/10",
                    "border border-white/10",
                    "text-white font-medium text-sm",
                    "flex items-center justify-center gap-2",
                    "hover:bg-white/10 transition-all duration-300",
                    "group"
                )}
            >
                Continue
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>

            {/* Disclaimer */}
            <p className="text-[9px] text-white/30 text-center mt-3">
                This is a preliminary signal. Full analysis at completion.
            </p>
        </motion.div>
    );
};

/**
 * Hook to generate insights from partial test data
 */
export const usePartialInsights = (responses: Array<{ choice: number | string; stage: number }>, stages: Array<{ type: string; contentId?: string }>) => {
    // Simple heuristic to determine dominant trait direction
    const getInsightFromResponses = (): {
        insightType: MiniInsightProps['insightType'];
        primaryTrait: string;
        secondaryTrait?: string;
        direction: MiniInsightProps['direction'];
    } => {
        const personalityResponses = responses.filter(r =>
            stages[r.stage]?.type === 'personality'
        );

        if (personalityResponses.length === 0) {
            return {
                insightType: 'general',
                primaryTrait: 'cognitive patterns',
                direction: 'balanced'
            };
        }

        // Calculate average response value
        const avg = personalityResponses.reduce((sum, r) => sum + Number(r.choice), 0) / personalityResponses.length;

        let direction: MiniInsightProps['direction'] = 'balanced';
        if (avg > 5) direction = 'high';
        else if (avg < 3) direction = 'low';

        // Map to trait names
        const traits = ['Conscientiousness', 'Openness', 'Extraversion', 'Agreeableness', 'Emotional Stability', 'Integrity'];
        const randomTrait = traits[Math.floor(Math.random() * traits.length)];

        return {
            insightType: 'personality',
            primaryTrait: randomTrait,
            direction
        };
    };

    return { getInsightFromResponses };
};

export default MiniInsight;
