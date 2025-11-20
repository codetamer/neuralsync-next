'use client';

import { useMemo } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

const generateParticles = (count: number): Particle[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
    }));
};

export const AnimatedBackground = () => {
    const particles = useMemo(() => generateParticles(25), []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-neural-bg">
            {/* Base gradient mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-neural-bg via-black to-neural-bg opacity-90" />

            {/* Enhanced Floating Orbs - Using inline styles for guaranteed animation */}
            <div
                className="absolute top-[-15%] left-[-15%] w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-40"
                style={{
                    background: 'linear-gradient(135deg, rgba(189, 0, 255, 0.3), rgba(59, 130, 246, 0.2))',
                    animation: 'float1 22s ease-in-out infinite',
                }}
            />

            <div
                className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] rounded-full blur-[160px] opacity-30"
                style={{
                    background: 'linear-gradient(225deg, rgba(59, 130, 246, 0.3), rgba(0, 240, 255, 0.2))',
                    animation: 'float2 28s ease-in-out infinite',
                }}
            />

            <div
                className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] rounded-full blur-[120px] opacity-35"
                style={{
                    background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.2), rgba(189, 0, 255, 0.15))',
                    animation: 'float3 18s ease-in-out infinite',
                }}
            />

            <div
                className="absolute top-[60%] right-[15%] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-28"
                style={{
                    background: 'linear-gradient(180deg, rgba(255, 0, 85, 0.2), rgba(189, 0, 255, 0.15))',
                    animation: 'float4 25s ease-in-out infinite',
                }}
            />

            <div
                className="absolute bottom-[20%] left-[40%] w-[40vw] h-[40vw] rounded-full blur-[110px] opacity-32"
                style={{
                    background: 'linear-gradient(45deg, rgba(0, 255, 148, 0.15), rgba(0, 240, 255, 0.2))',
                    animation: 'float5 20s ease-in-out infinite',
                }}
            />

            {/* Floating Particles - Simple CSS version */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-white/40"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        animation: `particleFloat ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
                    }}
                />
            ))}

            {/* Neural Network Connections - Simplified */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgb(0, 240, 255)', stopOpacity: 0.4 }} />
                        <stop offset="50%" style={{ stopColor: 'rgb(189, 0, 255)', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0.4 }} />
                    </linearGradient>
                </defs>
                {particles.slice(0, 12).map((p1, i) =>
                    particles.slice(i + 1, 12).map((p2) => {
                        const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                        if (distance < 25) {
                            return (
                                <line
                                    key={`${p1.id}-${p2.id}`}
                                    x1={`${p1.x}%`}
                                    y1={`${p1.y}%`}
                                    x2={`${p2.x}%`}
                                    y2={`${p2.y}%`}
                                    stroke="url(#lineGradient)"
                                    strokeWidth="0.5"
                                    className="animate-pulse"
                                    style={{ opacity: 0.3 }}
                                />
                            );
                        }
                        return null;
                    })
                )}
            </svg>

            {/* Enhanced Grid Overlay with pulsing animation */}
            <div
                className="absolute inset-0 animate-pulse-slow"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
                    opacity: 0.3
                }}
            />

            {/* Subtle vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)'
                }}
            />

            {/* Add CSS keyframes */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(120px, -80px) scale(1.3); }
                    66% { transform: translate(60px, -40px) scale(1.15); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-150px, 120px) scale(1.6); }
                    66% { transform: translate(-75px, 60px) scale(1.3); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
                    50% { transform: translate(40px, -30px) scale(1.2) rotate(180deg); }
                }
                @keyframes float4 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(80px, -60px) scale(1.4); }
                }
                @keyframes float5 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-90px, 70px) scale(1.3); }
                }
                @keyframes particleFloat {
                    0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.2; }
                    25% { transform: translateY(-30px) translateX(10px) scale(1.2); opacity: 0.4; }
                    50% { transform: translateY(-15px) translateX(-5px) scale(1.5); opacity: 0.6; }
                    75% { transform: translateY(-25px) translateX(5px) scale(1.1); opacity: 0.4; }
                }
            `}} />
        </div>
    );
};
