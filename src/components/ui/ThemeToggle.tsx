'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/useThemeStore';
import { cn } from '../../lib/utils';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="relative h-6 w-11 rounded-full bg-neural-card border border-neural-border overflow-hidden shadow-inner transition-colors duration-300 hover:border-white/20"
            aria-label="Toggle theme"
        >
            {/* Background Track */}
            <div className={cn(
                "absolute inset-0 transition-opacity duration-500",
                theme === 'zenith' ? "opacity-100 bg-gradient-to-r from-neon-teal/20 to-neon-purple/20" : "opacity-0"
            )} />

            <div className={cn(
                "absolute inset-0 transition-opacity duration-500",
                theme === 'original' ? "opacity-100 bg-gradient-to-r from-neutral-900 to-black" : "opacity-0"
            )} />

            {/* Toggle Handle */}
            <motion.div
                className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-md flex items-center justify-center z-10"
                animate={{
                    x: theme === 'zenith' ? 20 : 0,
                    backgroundColor: theme === 'zenith' ? '#F8FAFC' : '#171717'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                {/* Icon inside handle */}
                <motion.div
                    animate={{ rotate: theme === 'zenith' ? 0 : 180 }}
                    className="text-[8px]"
                >
                    {theme === 'zenith' ? '✨' : '⚡'}
                </motion.div>
            </motion.div>
        </button>
    );
};
