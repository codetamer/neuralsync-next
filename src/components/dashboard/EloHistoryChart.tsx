'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp } from 'lucide-react';

interface EloHistoryProps {
    data: any[]; // { date: string, elo: number }
}

import { memo } from 'react';

export const EloHistoryChart = memo(({ data }: EloHistoryProps) => {
    return (
        <GlassCard className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neon-blue" />
                Performance Trend
            </h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="date"
                            hide={data.length < 2}
                            tick={{ fill: '#ffffff50', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            domain={['dataMin - 50', 'dataMax + 50']}
                            tick={{ fill: '#ffffff50', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            orientation="right"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: '#fff' }}
                            itemStyle={{ color: '#2563eb' }}
                            labelStyle={{ color: '#ffffff50' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="elo"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#colorElo)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-white/30 mt-2">
                Your rating history over recent matches.
            </p>
        </GlassCard>
    );
});
