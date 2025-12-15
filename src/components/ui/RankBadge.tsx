'use client';

import { RankTier, EloEngine } from '../../engine/EloEngine';
import { motion } from 'framer-motion';

interface RankBadgeProps {
    tier: RankTier;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showLabel?: boolean;
}

export const RankBadge = ({ tier, size = 'md', className = '', showLabel = false }: RankBadgeProps) => {
    const color = EloEngine.getRankColor(tier);

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    // Geometric Shapes for Ranks
    const renderIcon = () => {
        switch (tier) {
            case 'BRONZE': // Bronze - Cube
                return (
                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-1-10-5-10 5 2 1 10 5 6-3" stroke={color} strokeWidth="2" fill="none" />
                );
            case 'SILVER': // Silver - Hexagon
                return (
                    <path d="M12 2L2 8v10l10 6 10-6V8L12 2z" stroke={color} strokeWidth="2" fill="none" />
                );
            case 'GOLD': // Gold - Star
                return (
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="2" fill="none" />
                );
            case 'PLATINUM': // Platinum - Diamond
                return (
                    <path d="M12 2L2 12l10 10 10-10L12 2z" stroke={color} strokeWidth="2" fill="none" />
                );
            case 'DIAMOND': // Diamond - Complex Crystal
                return (
                    <>
                        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" fill="none" />
                        <path d="M2 17l10 5 10-5" stroke={color} strokeWidth="2" fill="none" />
                        <path d="M2 7v10l10 5 10-5V7" stroke={color} strokeWidth="2" fill="none" />
                        <path d="M12 22V12" stroke={color} strokeWidth="2" fill="none" />
                    </>
                );
            case 'LEGEND': // Legend - Tesseract-like
                return (
                    <>
                        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
                        <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
                        <path d="M12 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4" fill={color} opacity={0.5} />
                    </>
                );
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <motion.div
                className={`${sizeClasses[size]}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, filter: `drop-shadow(0 0 8px ${color})` }}
            >
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                    {renderIcon()}
                </svg>
            </motion.div>
            {showLabel && (
                <div className="mt-2 font-display font-bold tracking-widest text-sm" style={{ color }}>
                    {tier}
                </div>
            )}
        </div>
    );
};
