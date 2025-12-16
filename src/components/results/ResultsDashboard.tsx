'use client';

import { useTestStore } from '../../store/useTestStore';
import { RankedResultsDashboard } from './RankedResultsDashboard';
import { QuickResultsDashboard } from './QuickResultsDashboard';
import { StandardResultsDashboard } from './StandardResultsDashboard';
import { NeonButton } from '../ui/NeonButton';
import { motion } from 'framer-motion';

export const ResultsDashboard = () => {
    const { isTestComplete, isDisqualified, isRanked, sessionMode, returnToHome } = useTestStore();

    // --- GUARD CLAUSE: Prevent rendering invalid state during reset ---
    if (!isTestComplete) return null;

    // --- DISQUALIFIED STATE ---
    if (isDisqualified) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-red-500 space-y-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-bold tracking-tighter border-4 border-red-600 p-8 rounded-lg uppercase"
                >
                    Disqualified
                </motion.div>
                <p className="text-xl text-red-400 font-mono">
                    Focus loss detected during Ranked Gauntlet.
                </p>
                <p className="text-sm text-red-900/50">
                    Your session has been voided.
                </p>
                <NeonButton onClick={returnToHome} variant="primary" className="mt-8">
                    RETURN TO LOBBY
                </NeonButton>
            </div>
        );
    }

    // --- RANKED MODE ---
    if (isRanked || sessionMode === 'RANKED') {
        return <RankedResultsDashboard />;
    }

    // --- QUICK MODE ---
    if (sessionMode === 'QUICK') {
        return <QuickResultsDashboard />;
    }

    // --- STANDARD MODE (DEFAULT) ---
    return <StandardResultsDashboard />;
};
