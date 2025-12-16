'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ReactNode } from 'react';
import { audio } from '../../engine/AudioEngine';

interface NeonButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    glow?: boolean;
    color?: 'teal' | 'amber' | 'purple' | 'blue' | 'red'; // Extend color support while we are at it
    fullWidth?: boolean;
}

export const NeonButton = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    glow = true,
    fullWidth = false,
    color,
    ...props
}: NeonButtonProps) => {

    const variants = {
        primary: "bg-neon-teal/10 border-neon-teal/50 text-neon-teal hover:bg-neon-teal/20 hover:border-neon-teal hover:shadow-neon-teal",
        secondary: "bg-neon-purple/10 border-neon-purple/50 text-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple hover:shadow-neon-purple",
        danger: "bg-neon-red/10 border-neon-red/50 text-neon-red hover:bg-neon-red/20 hover:border-neon-red",
        ghost: "bg-transparent border-transparent text-neural-muted hover:text-neural-text hover:bg-white/5",
    };

    // Override colors if specified
    const colorStyles = color === 'amber'
        ? "bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500/20 hover:border-amber-500 hover:shadow-amber-500"
        : color === 'red'
            ? "bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            : variants[variant];

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg font-semibold",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => audio.playHover()}
            onClick={(e) => {
                audio.playClick();
                props.onClick?.(e);
            }}
            className={cn(
                "relative rounded-xl border backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2",
                color ? colorStyles : variants[variant],
                sizes[size],
                glow && variant !== 'ghost' ? "shadow-[0_0_15px_rgba(0,0,0,0.2)]" : "",
                fullWidth ? "w-full" : "",
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};
