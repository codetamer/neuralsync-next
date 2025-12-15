'use client';

import { useState, useRef, useEffect } from 'react';
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
    const dropdownRef = useRef<HTMLDivElement>(null);
    let timeoutId: NodeJS.Timeout;

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseEnter = () => {
        clearTimeout(timeoutId);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        // Small delay to prevent accidental closing when moving to dropdown
        timeoutId = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    return (
        <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
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
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-neural-card border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 backdrop-blur-xl"
                    >
                        {/* Mobile User Info (Only visible on small screens inside menu) */}
                        <div className="sm:hidden p-4 border-b border-white/10 bg-white/5">
                            <p className="text-sm font-bold text-white">{user.displayName}</p>
                            <p className="text-xs text-white/50">{user.email}</p>
                        </div>

                        <div className="p-2">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 w-full p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                                onClick={() => setIsOpen(false)}
                            >
                                <LayoutDashboard className="w-4 h-4 text-neon-teal group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>

                            {/* Profile placeholder */}
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
                )}
            </AnimatePresence>
        </div>
    );
};
