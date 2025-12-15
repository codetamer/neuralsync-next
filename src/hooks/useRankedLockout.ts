'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'neuralsync_last_ranked_attempt';

interface LockoutState {
    isLocked: boolean;
    timeRemaining: string; // Formatting HH:MM:SS
}

export const useRankedLockout = () => {
    const [status, setStatus] = useState<LockoutState>({ isLocked: false, timeRemaining: '' });

    useEffect(() => {
        const checkLockout = () => {
            const lastAttempt = localStorage.getItem(STORAGE_KEY);
            if (!lastAttempt) {
                setStatus({ isLocked: false, timeRemaining: '' });
                return;
            }

            const lastDate = new Date(lastAttempt);
            const now = new Date();

            // Check if it's the same day (naive implemented reset at midnight)
            const isSameDay = lastDate.getDate() === now.getDate() &&
                lastDate.getMonth() === now.getMonth() &&
                lastDate.getFullYear() === now.getFullYear();

            if (isSameDay) {
                // Calculate time until midnight
                const tomorrow = new Date(now);
                tomorrow.setHours(24, 0, 0, 0);
                const diff = tomorrow.getTime() - now.getTime();

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                setStatus({
                    isLocked: true,
                    timeRemaining: `${hours}h ${minutes}m`
                });
            } else {
                setStatus({ isLocked: false, timeRemaining: '' });
            }
        };

        checkLockout();
        const interval = setInterval(checkLockout, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const recordAttempt = () => {
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
        setStatus({ isLocked: true, timeRemaining: '23h 59m' });
    };

    return { ...status, recordAttempt };
};
