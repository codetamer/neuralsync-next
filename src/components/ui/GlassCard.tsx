'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard = ({ children, className, hoverEffect = false, ...props }: GlassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={hoverEffect ? { scale: 1.02, boxShadow: "0 0 30px rgba(0, 240, 255, 0.15)" } : undefined}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "glass-card rounded-2xl p-6 relative overflow-hidden",
                className
            )}
            {...props}
        >
            {/* Shine effect on hover */}
            {hoverEffect && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}
            {children}
        </motion.div>
    );
};
