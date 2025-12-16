'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { User } from 'firebase/auth';

interface UserDropdownProps {
    user: User;
    userProfile: any; // Using any for simplicity here, but should replace with UserProfile type if available
    onSignOut: () => void;
}

export const UserDropdown = ({ user, userProfile, onSignOut }: UserDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    let timeoutId: NodeJS.Timeout;

    // Update position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Position: below the button, aligned to the right
            setMenuPosition({
                top: rect.bottom + 8, // 8px gap
                right: window.innerWidth - rect.right
            });
        }
    }, [isOpen]);

    // Handle resize to update position
    useEffect(() => {
        const handleResize = () => {
            if (isOpen && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setMenuPosition({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right
                });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    // Close on click outside (modified for portal)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            // Check if click is outside both button and menu
            if (
                isOpen &&
                buttonRef.current &&
                !buttonRef.current.contains(target) &&
                menuRef.current &&
                !menuRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleMouseEnter = () => {
        clearTimeout(timeoutId);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                ref={buttonRef}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-teal to-blue-600 p-[1px]">
                    <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm font-bold text-white">{user.displayName?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                </div>
                <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-neon-teal transition-colors">
                        {user.displayName || 'Neural Agent'}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                        <p className="text-[10px] text-white/50 font-mono">
                            {userProfile?.tier || 'NO TIER'}
                        </p>
                        <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <Portal>
                        <div
                            className="fixed inset-0 z-[99999] pointer-events-none"
                        >
                            {/* Invisible Backdrop for click outside */}
                            {/* Actually, if we use hover, we don't strictly need a click backdrop if mouse leave handles it.
                                But for mobile where there is no hover, we need click outside.
                                Let's assume desktop hover for now, but keep click toggle support.
                            */}

                            <motion.div
                                ref={menuRef}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    top: menuPosition.top,
                                    right: menuPosition.right,
                                }}
                                className="w-56 bg-neural-card border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl pointer-events-auto"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* Mobile User Info */}
                                <div className="sm:hidden p-4 border-b border-white/10 bg-white/5">
                                    <p className="text-sm font-bold text-white">{user.displayName}</p>
                                    <p className="text-xs text-white/50">{user.email}</p>
                                </div>

                                <div className="p-2">
                                    <Link
                                        href="/dashboard"
                                        prefetch={false}
                                        className="flex items-center gap-3 w-full p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <LayoutDashboard className="w-4 h-4 text-neon-teal group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium">Dashboard</span>
                                    </Link>

                                    <button
                                        className="flex items-center gap-3 w-full p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all group opacity-50 cursor-not-allowed"
                                        title="Coming Soon"
                                    >
                                        <UserIcon className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm font-medium">Profile Settings</span>
                                    </button>
                                </div>

                                <div className="border-t border-white/10 p-2">
                                    <button
                                        onClick={() => {
                                            onSignOut();
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                                    >
                                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        <span className="text-sm font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </Portal>
                )}
            </AnimatePresence>
        </div>
    );
};

// Simple Portal Component
const Portal = ({ children }: { children: ReactNode }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return createPortal(children, document.body);
};
