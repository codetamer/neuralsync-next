'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { NeonButton } from './NeonButton';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
}

export const ConfirmationModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary'
}: ConfirmationModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-neural-bg/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-neural-bg border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50 overflow-hidden"
                    >
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-neon-red/10 text-neon-red' : 'bg-neon-teal/10 text-neon-teal'}`}>
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-display font-bold text-white">{title}</h3>
                                    <p className="text-neural-muted leading-relaxed">{message}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-2">
                                <NeonButton onClick={onCancel} variant="secondary" size="sm">
                                    {cancelLabel}
                                </NeonButton>
                                <NeonButton onClick={onConfirm} variant={variant} size="sm">
                                    {confirmLabel}
                                </NeonButton>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
