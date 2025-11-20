'use client';

import { useThemeStore } from '../../store/useThemeStore';
import { cn } from '../../lib/utils';

interface LogoProps {
    className?: string;
}

export const Logo = ({ className }: LogoProps) => {
    const { theme } = useThemeStore();

    return (
        <svg
            width="512"
            height="512"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("transition-all duration-500", className)}
        >
            <defs>
                <linearGradient id="hex-gradient" x1="256" y1="56" x2="256" y2="456" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={theme === 'zenith' ? '#6EE7B7' : '#00F3FF'} className="transition-colors duration-500" />
                    <stop offset="50%" stopColor={theme === 'zenith' ? '#38BDF8' : '#0066FF'} className="transition-colors duration-500" />
                    <stop offset="100%" stopColor={theme === 'zenith' ? '#A78BFA' : '#BD00FF'} className="transition-colors duration-500" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Central Hexagon Group */}
            <g transform="translate(256 256)">
                {/* Outer Glow Hexagon */}
                <path d="M0 -200 L173.2 -100 L173.2 100 L0 200 L-173.2 100 L-173.2 -100 Z"
                    stroke="url(#hex-gradient)"
                    strokeWidth="4"
                    fill="none"
                    filter="url(#glow)"
                    opacity="0.5" />

                {/* Main Hexagon */}
                <path d="M0 -180 L155.88 -90 L155.88 90 L0 180 L-155.88 90 L-155.88 -90 Z"
                    stroke="url(#hex-gradient)"
                    strokeWidth="8"
                    fill="none" />

                {/* Inner Hexagon */}
                <path d="M0 -120 L103.92 -60 L103.92 60 L0 120 L-103.92 60 L-103.92 -60 Z"
                    stroke="url(#hex-gradient)"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.8" />

                {/* Core Crystal/Diamond */}
                <path d="M0 -60 L51.96 -30 L51.96 30 L0 60 L-51.96 30 L-51.96 -30 Z"
                    fill="url(#hex-gradient)"
                    opacity="0.3" />

                {/* Center Dot */}
                <circle cx="0" cy="0" r="10" fill="#FFFFFF" filter="url(#glow)" />
            </g>
        </svg>
    );
};
