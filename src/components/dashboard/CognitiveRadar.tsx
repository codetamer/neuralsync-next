'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { Target } from 'lucide-react';
import { memo } from 'react';

interface CognitiveRadarProps {
    data: any[];
    title?: string;
}

export const CognitiveRadar = memo(({ data, title = "Brain Profile" }: CognitiveRadarProps) => {
    // If no data, show empty state or default
    const chartData = data.length > 0 ? data : [
        { subject: 'Memory', A: 0, fullMark: 100 },
        { subject: 'Speed', A: 0, fullMark: 100 },
        { subject: 'Attention', A: 0, fullMark: 100 },
        { subject: 'Logic', A: 0, fullMark: 100 },
        { subject: 'Flexibility', A: 0, fullMark: 100 },
        { subject: 'Language', A: 0, fullMark: 100 },
    ];

    return (
        <GlassCard className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-teal" />
                {title}
            </h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#ffffff20" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff80', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Performance"
                            dataKey="A"
                            stroke="#00f3ff"
                            strokeWidth={2}
                            fill="#00f3ff"
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            content={({ active, payload, label }: any) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-black/90 border border-neon-teal/50 p-3 rounded-lg shadow-lg backdrop-blur-md">
                                            <p className="text-neon-teal font-bold mb-1">{label}</p>
                                            <p className="text-white text-lg font-mono">
                                                {payload[0].value} <span className="text-xs text-white/50">/ 100</span>
                                            </p>
                                            <p className="text-[10px] text-white/50 mt-1 max-w-[150px]">
                                                Score represents your percentile rank vs global population.
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-white/30 mt-2">
                Based on your aggregate stage performance.
            </p>
        </GlassCard>
    );
});
