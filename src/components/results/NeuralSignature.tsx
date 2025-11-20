'use client';

import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp, Award, Target, Brain } from 'lucide-react';

interface NeuralSignatureProps {
    data: {
        latency: number;
        difficulty: number;
        accuracy: boolean;
        stage: number;
    }[];
}

export const NeuralSignature = ({ data }: NeuralSignatureProps) => {
    // 1. Group data by difficulty level and calculate metrics
    const difficultyLevels = Array.from(new Set(data.map(d => d.difficulty))).sort((a, b) => a - b);

    const chartData = difficultyLevels.map(level => {
        const levelData = data.filter(d => d.difficulty === level);
        const accurateCount = levelData.filter(d => d.accuracy).length;
        const accuracyPercent = (accurateCount / levelData.length) * 100;
        const avgLatency = levelData.reduce((sum, d) => sum + d.latency, 0) / levelData.length;

        return {
            level,
            accuracy: Math.round(accuracyPercent),
            latency: Math.round(avgLatency),
            count: levelData.length
        };
    });

    // 2. Determine Cognitive Ceiling - where accuracy drops below 70%
    const cognitiveceiling = chartData.findIndex(d => d.accuracy < 70);
    // Handle edge cases: if all levels have >70% accuracy, ceiling is at max level
    // If all levels have <70% accuracy, ceiling is at level 1 (fundamental skills)
    const ceilingLevel = cognitiveceiling === -1
        ? chartData.length  // All levels passed
        : Math.max(1, cognitiveceiling); // At least level 1

    // 3. Calculate overall metrics
    const overallAccuracy = (data.filter(d => d.accuracy).length / data.length) * 100;

    // 4. Generate specific, actionable insights
    let insightText = "";
    let insightIcon = Brain;

    if (ceilingLevel >= 9) {
        insightText = `Elite cognitive performance! You maintain peak accuracy (>70%) through Level ${ceilingLevel}. This places you in the top 5% for mental endurance. Focus: Challenge yourself with expert-level complexity to continue growth.`;
        insightIcon = Award;
    } else if (ceilingLevel >= 7) {
        insightText = `Strong cognitive capacity. You sustain high performance up to Level ${ceilingLevel} (top 20%). Your ceiling indicates solid mental resilience. Next step: Target specific difficulty ${ceilingLevel + 1} challenges for breakthrough.`;
        insightIcon = Target;
    } else if (ceilingLevel >= 5) {
        insightText = `Solid foundation. Performance remains reliable through Level ${ceilingLevel}. Strategy: Use spaced repetition on Level ${ceilingLevel + 1} tasks. Break complex problems into smaller chunks to build endurance.`;
        insightIcon = Brain;
    } else if (ceilingLevel >= 3) {
        insightText = `Building capacity. Ceiling at Level ${ceilingLevel} suggests room for foundational strengthening. Action plan: (1) Daily 15-min progressive difficulty drills (2) Focus on accuracy over speed (3) Review Level ${ceilingLevel} patterns.`;
        insightIcon = TrendingUp;
    } else {
        insightText = `Developing base skills. Current ceiling at Level ${ceilingLevel}. Recommended approach: Start with Level 1-2 mastery (aim for 95% accuracy), then gradually increase difficulty. Consider cognitive training apps (Lumosity, Peak) for systematic progression.`;
        insightIcon = TrendingUp;
    }

    const InsightIcon = insightIcon;

    return (
        <GlassCard className="p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 z-10 relative">
                <div className="flex items-center gap-3 text-neon-teal">
                    <Brain className="w-6 h-6" />
                    <div>
                        <h3 className="text-xl font-display font-bold tracking-wider">COGNITIVE LOAD CAPACITY</h3>
                        <p className="text-xs text-white/50 font-mono">ACCURACY & SPEED vs. DIFFICULTY</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">{Math.round(overallAccuracy)}%</div>
                    <div className="text-xs text-neon-teal">Overall Accuracy</div>
                </div>
            </div>

            {/* Cognitive Ceiling Indicator */}
            <div className="mb-4 p-3 bg-neon-teal/10 border border-neon-teal/30 rounded-lg z-10">
                <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-neon-teal" />
                    <span className="text-xs font-mono text-neon-teal font-bold">COGNITIVE CEILING: LEVEL {ceilingLevel}</span>
                </div>
                <p className="text-xs text-white/70">
                    Your performance remains optimal up to difficulty level {ceilingLevel}
                </p>
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[320px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 30, bottom: 20, left: 0 }}>
                        <defs>
                            <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00f3ff" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#00f3ff" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="degradedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>

                        <XAxis
                            dataKey="level"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                            label={{ value: 'Difficulty Level', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                        />

                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            domain={[0, 100]}
                            stroke="rgba(0,243,255,0.5)"
                            tick={{ fill: 'rgba(0,243,255,0.7)', fontSize: 10 }}
                            label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: 'rgba(0,243,255,0.7)', fontSize: 10 }}
                        />

                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="rgba(255,215,0,0.5)"
                            tick={{ fill: 'rgba(255,215,0,0.7)', fontSize: 10 }}
                            label={{ value: 'Avg Latency (ms)', angle: 90, position: 'insideRight', fill: 'rgba(255,215,0,0.7)', fontSize: 10 }}
                        />

                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-black/95 border border-neon-teal/40 p-4 rounded-lg shadow-[0_0_20px_rgba(0,243,255,0.3)] backdrop-blur-md">
                                            <div className="text-neon-teal font-bold mb-2 border-b border-white/10 pb-2">
                                                LEVEL {data.level}
                                            </div>
                                            <div className="space-y-1.5 font-mono text-xs">
                                                <div className="flex justify-between gap-6">
                                                    <span className="text-white/60">Accuracy:</span>
                                                    <span className="text-neon-teal font-bold">{data.accuracy}%</span>
                                                </div>
                                                <div className="flex justify-between gap-6">
                                                    <span className="text-white/60">Avg Latency:</span>
                                                    <span className="text-yellow-400 font-bold">{data.latency}ms</span>
                                                </div>
                                                <div className="flex justify-between gap-6">
                                                    <span className="text-white/60">Responses:</span>
                                                    <span className="text-white">{data.count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Bar
                            yAxisId="left"
                            dataKey="accuracy"
                            name="Accuracy"
                            radius={[4, 4, 0, 0]}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.accuracy >= 70 ? 'url(#accuracyGradient)' : 'url(#degradedGradient)'}
                                />
                            ))}
                        </Bar>

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="latency"
                            stroke="#ffd700"
                            strokeWidth={3}
                            dot={{ fill: '#ffd700', r: 4, strokeWidth: 2, stroke: '#000' }}
                            activeDot={{ r: 6, stroke: '#ffd700', strokeWidth: 2 }}
                            name="Latency"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mt-4 mb-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                    <div className="w-4 h-3 rounded" style={{ background: 'linear-gradient(to bottom, rgba(0,243,255,0.8), rgba(0,243,255,0.3))' }}></div>
                    <span className="text-white/60">Accuracy (Optimal ≥70%)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                    <div className="w-4 h-3 bg-yellow-400/80 rounded"></div>
                    <span className="text-white/60">Processing Speed</span>
                </div>
            </div>

            {/* Insights */}
            <div className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10 z-10">
                <div className="flex items-start gap-3">
                    <InsightIcon className="w-5 h-5 text-neon-teal shrink-0 mt-0.5" />
                    <div>
                        <span className="text-neon-teal font-bold text-sm mr-2">COGNITIVE INSIGHT:</span>
                        <span className="text-sm text-white/80 leading-relaxed">{insightText}</span>
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-teal/5 rounded-full blur-3xl pointer-events-none" />
        </GlassCard>
    );
};
