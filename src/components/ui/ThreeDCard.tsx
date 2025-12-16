'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ThreeDCardProps {
    children: React.ReactNode;
    className?: string;
}

export const ThreeDCard = ({ children, className = "" }: ThreeDCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth movement
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    // Transform mouse position to rotation
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

    // Calculate mouse position relative to card center
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        // Calculate normalized position (-0.5 to 0.5)
        // 0.5 would be the edge, 0 is center
        const width = rect.width;
        const height = rect.height;

        const mouseXRel = e.clientX - rect.left;
        const mouseYRel = e.clientY - rect.top;

        const xPct = (mouseXRel / width) - 0.5;
        const yPct = (mouseYRel / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`perspective-[1000px] ${className}`}
        >
            <div style={{ transform: "translateZ(20px)" }} className="h-full">
                {children}
            </div>

            {/* Glossy Reflection Effect */}
            <div
                className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl mix-blend-overlay"
                style={{ transform: "translateZ(30px)" }}
            />
        </motion.div>
    );
};
