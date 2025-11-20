'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface TraitRadarProps {
    data: {
        subject: string;
        A: number;
        fullMark: number;
    }[];
}

export const TraitRadar = ({ data }: TraitRadarProps) => {
    return (
        <div className="w-full h-[400px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart key={JSON.stringify(data)} cx="50%" cy="50%" outerRadius="90%" data={data}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Trait Score"
                        dataKey="A"
                        stroke="#00f3ff"
                        strokeWidth={3}
                        fill="#00f3ff"
                        fillOpacity={0.3}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            border: '1px solid rgba(0, 243, 255, 0.3)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#00f3ff' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
