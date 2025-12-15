'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Chrome, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            await signInWithGoogle();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                if (!username.trim()) throw new Error('Username is required');
                await signUpWithEmail(email, password, username);
            }
            onClose();
        } catch (err: any) {
            console.error(err);
            // Improve error messages
            let msg = err.message || 'Authentication failed';
            if (msg.includes('auth/invalid-email')) msg = 'Invalid email address';
            if (msg.includes('auth/user-not-found')) msg = 'No account found with this email';
            if (msg.includes('auth/wrong-password')) msg = 'Incorrect password';
            if (msg.includes('auth/email-already-in-use')) msg = 'Email is already registered';
            if (msg.includes('auth/weak-password')) msg = 'Password should be at least 6 characters';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md"
                >
                    <button
                        onClick={onClose}
                        className="absolute -top-4 -right-4 p-2 text-white/50 hover:text-white bg-black/50 rounded-full border border-white/10 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <GlassCard className="p-8 space-y-6 border-white/10 bg-black/90 relative overflow-hidden">

                        <div className="text-center space-y-2 mb-6">
                            <h2 className="text-2xl font-display font-bold text-white">
                                {isLogin ? 'Welcome Back' : 'Join NeuralSync'}
                            </h2>
                            <p className="text-sm text-white/50">
                                {isLogin
                                    ? 'Sign in to access your neural profile'
                                    : 'Create your permanent cognitive record'}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-200 text-sm"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-xs text-white/50 uppercase font-mono ml-1">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="NeuroNomad"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-teal/50 focus:bg-white/10 transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs text-white/50 uppercase font-mono ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="user@neuralsync.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-teal/50 focus:bg-white/10 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-white/50 uppercase font-mono ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-teal/50 focus:bg-white/10 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <NeonButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full mt-2 group"
                                glow
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? 'Sign In' : 'Sign Up'}
                                {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                            </NeonButton>
                        </form>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black/90 px-2 text-white/30">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            <Chrome className="w-5 h-5" />
                            Continue with Google
                        </button>

                        <div className="pt-2 text-center text-sm text-white/50">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-neon-teal hover:text-white transition-colors font-bold ml-1"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>

                        <div className="pt-2 text-center text-[10px] text-white/20">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </div>

                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
