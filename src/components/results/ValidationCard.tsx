'use client';

import { GlassCard } from '../ui/GlassCard';
import { AlertTriangle, CheckCircle, Shield, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ValidationCardProps {
    data: {
        flags: string[];
        suspicionScore: number;
    };
    validityScore: number;
    isFlagged: boolean;
}

export const ValidationCard = ({ data, validityScore, isFlagged }: ValidationCardProps) => {
    // Determine status
    const status = isFlagged ? 'High Anomaly Detected' : validityScore < 80 ? 'Pattern Irregularities' : 'Valid Neural Signature';
    const statusColor = isFlagged ? 'text-red-500' : validityScore < 80 ? 'text-yellow-400' : 'text-green-400';
    const statusIcon = isFlagged ? AlertOctagon : validityScore < 80 ? AlertTriangle : CheckCircle;

    const StatusIcon = statusIcon;

    return (
        <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden">
            {/* Background Matrix Rain Effect (Static for now) */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <Shield className="w-6 h-6 text-neon-teal" />
                DATA INTEGRITY
            </h3>

            <div className="flex-1 flex flex-col justify-center relative z-10">
                <div className="text-center mb-6">
                    <StatusIcon className={`w-16 h-16 mx-auto mb-4 ${statusColor}`} />
                    <div className={`text-lg font-bold ${statusColor} mb-1`}>{status}</div>
                    <div className="text-sm text-white/50">Confidence Score: {validityScore}%</div>
                </div>

                {data.flags.length > 0 ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Flagged Anomalies</div>
                        {data.flags.map((flag, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-white/80">
                                <span className="text-red-500 mt-1">•</span>
                                {flag}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <div className="text-green-400 font-semibold mb-1">Clean Data Set</div>
                        <div className="text-xs text-green-400/70">No algorithmic manipulation detected. Response patterns consistent with human baseline.</div>
                    </div>
                )}
            </div>
        </GlassCard>
    );
};
