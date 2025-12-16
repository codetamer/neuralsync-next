'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Logo } from '../ui/Logo';
import { AdSlotA } from '../ads/AdSlotA';
import { useTestStore } from '../../store/useTestStore';
import { useThemeStore } from '../../store/useThemeStore';
import { NeonButton } from '../ui/NeonButton';
import { Home, RotateCcw, Volume2, VolumeX, User, LogOut } from 'lucide-react';
import { ConfirmationModal } from '../ui/ConfirmationModal';

import { audio } from '../../engine/AudioEngine';
import { DevControls } from '../dev/DevControls';
import { FocusMonitor } from './FocusMonitor';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { UserDropdown } from './UserDropdown';
import { ProgressBar } from '../ui/ProgressBar';


interface AppShellProps {
    children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
    const { resetTest, returnToHome, getProgress, currentStage, isTestComplete, xp, isPaused, currentSection, stages } = useTestStore();
    const { user, signOut } = useAuth();
    const [muted, setMuted] = useState(false);
    const [showDevControls, setShowDevControls] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant: 'danger' | 'primary';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        variant: 'primary'
    });

    // Toggle Dev Controls with Shift+D
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.shiftKey && e.key.toLowerCase() === 'd') {
                setShowDevControls(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleResetClick = () => {
        setModalConfig({
            isOpen: true,
            title: 'Reset Assessment',
            message: 'Are you sure you want to reset the test? All progress will be lost.',
            onConfirm: () => {
                resetTest();
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            },
            variant: 'danger'
        });
    };

    const handleHomeClick = () => {
        if (currentStage > 0) {
            setModalConfig({
                isOpen: true,
                title: 'Return to Home',
                message: 'Return to the main screen? Your current progress will be saved.',
                onConfirm: () => {
                    returnToHome();
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                },
                variant: 'primary'
            });
        }
    };

    const progress = getProgress();

    const { theme } = useThemeStore();

    // Apply theme to document root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Initialize audio on first interaction
    useEffect(() => {
        const initAudio = () => {
            audio.initialize();
            window.removeEventListener('click', initAudio);
            window.removeEventListener('keydown', initAudio);
        };

        window.addEventListener('click', initAudio);
        window.addEventListener('keydown', initAudio);

        return () => {
            window.removeEventListener('click', initAudio);
            window.removeEventListener('keydown', initAudio);
        };
    }, []);

    return (
        <div className="min-h-screen w-full text-white overflow-x-hidden font-sans selection:bg-neon-teal/30">
            <FocusMonitor />
            <AnimatedBackground />
            <AnimatedBackground />

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                variant={modalConfig.variant}
            />

            <div className="relative z-10 flex flex-col min-h-screen">
                <AdSlotA />

                <header className="w-full p-4 flex justify-between items-center border-b border-white/5 bg-neural-card backdrop-blur-sm relative z-[999]">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Logo className="w-12 h-12" />
                        <h1 className="text-xl font-display font-bold tracking-wide">
                            NEURAL<span className="text-neon-teal">SYNC</span>
                        </h1>
                    </Link>

                    {/* Gamification Controls */}
                    <div className="flex items-center gap-4">


                        {user ? (
                            <UserDropdown
                                user={user}
                                userProfile={{ tier: 'SILVER' }} // In a real app we might want to fetch this globally or from a store
                                onSignOut={signOut}
                            />
                        ) : (
                            <NeonButton
                                onClick={() => setIsAuthModalOpen(true)}
                                variant="primary"
                                size="sm"
                                glow
                            >
                                <User className="w-4 h-4 mr-2" />
                                Login
                            </NeonButton>
                        )}

                        <div className="w-px h-8 bg-white/10 mx-1"></div>


                        <button
                            onClick={() => {
                                audio.playClick();
                                const newMuted = !muted;
                                setMuted(newMuted);
                                audio.setMuted(newMuted);
                            }}
                            onMouseEnter={() => audio.playHover()}
                            className="p-2 rounded-full hover:bg-white/5 text-neural-muted hover:text-white transition-colors"
                        >
                            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                    </div>
                </header>

                {/* Enhanced Progress Bar - Only show during active test */}
                {currentStage > 0 && !isTestComplete && !isPaused && (
                    <div className="w-full bg-neural-card backdrop-blur-sm border-b border-white/5">
                        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <ProgressBar
                                    currentStage={currentStage}
                                    totalStages={stages.length}
                                    currentSection={currentSection}
                                    estimatedTotalMinutes={8}
                                />
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <NeonButton
                                    onClick={handleHomeClick}
                                    variant="secondary"
                                    size="sm"
                                    className="hidden sm:flex h-8 text-xs"
                                >
                                    <Home className="w-3.5 h-3.5 sm:mr-2" />
                                    <span className="hidden sm:inline">Home</span>
                                </NeonButton>
                                <NeonButton
                                    onClick={handleResetClick}
                                    variant="danger"
                                    size="sm"
                                    className="h-8 text-xs"
                                >
                                    <RotateCcw className="w-3.5 h-3.5 sm:mr-2" />
                                    <span className="hidden sm:inline">Reset</span>
                                </NeonButton>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 flex flex-col justify-center p-4 md:p-8">
                    {children}
                </main>

                <footer className="border-t border-white/5 bg-neural-card backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        {/* Social Links - Centered */}
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-neon-teal/10 border border-white/10 hover:border-neon-teal/30 flex items-center justify-center text-neural-muted hover:text-neon-teal transition-all"
                                title="GitHub"
                            >
                                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-neon-teal/10 border border-white/10 hover:border-neon-teal/30 flex items-center justify-center text-neural-muted hover:text-neon-teal transition-all"
                                title="Twitter"
                            >
                                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-neon-teal/10 border border-white/10 hover:border-neon-teal/30 flex items-center justify-center text-neural-muted hover:text-neon-teal transition-all"
                                title="Instagram"
                            >
                                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-neon-teal/10 border border-white/10 hover:border-neon-teal/30 flex items-center justify-center text-neural-muted hover:text-neon-teal transition-all"
                                title="Facebook"
                            >
                                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>

                        {/* Bottom: Copyright & Status */}
                        <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-neural-muted font-mono">
                            <p>© 2025 NeuralSync • Advanced Psychometrics Division</p>
                            <div className="flex items-center gap-6">
                                <ThemeToggle />
                                <button
                                    onClick={() => window.location.reload()}
                                    className="hover:text-neon-teal transition-colors"
                                >
                                    Restart Assessment
                                </button>
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    <span>ONLINE</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Dev Controls Overlay - Toggle with Shift+D */}
            {showDevControls && <DevControls />}

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};
