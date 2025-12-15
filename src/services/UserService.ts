import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, arrayUnion, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { RankTier } from '../engine/EloEngine';
import { MatchResult } from '../types';

export interface UserProfile {
    uid: string;
    email: string;
    username?: string;
    photoURL?: string;
    elo: number;
    tier: RankTier;
    matchesPlayed: number;
    // Gamification
    streak: number;
    achievements?: string[]; // List of unlocked achievement IDs
    lastActive: any; // Timestamp
    createdAt: any; // Timestamp
    // Neural Profile (Optional)
    archetype?: string;
    archetypeDesc?: string;
    traits?: {
        iq: number;
        eq: number;
        risk: number;
        honesty: number;
        emotionality: number;
        extraversion: number;
        agreeableness: number;
        conscientiousness: number;
        openness: number;
        // Detailed Cognitive
        memory?: number;
        speed?: number;
        executive?: number;
        fluid?: number;
        crystallized?: number;
    };
}

export const UserService = {
    async createUserProfile(user: User, guestData?: { elo: number; matchesPlayed: number; tier: RankTier }) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const newProfile: UserProfile = {
                uid: user.uid,
                email: user.email || '',
                username: user.displayName || 'Anonymous',
                photoURL: user.photoURL || '',
                elo: guestData?.elo || 1000,
                tier: guestData?.tier || 'SILVER',
                matchesPlayed: guestData?.matchesPlayed || 0,
                streak: 0,
                achievements: [],
                lastActive: serverTimestamp(),
                createdAt: serverTimestamp(),
            };
            await setDoc(userRef, newProfile);
        }
    },

    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data() as UserProfile;
        }
        return null;
    },

    async saveMatchResult(uid: string, resultData: Partial<MatchResult>) {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        // Streak Logic: Check last active date
        let streakUpdate: any = undefined;
        if (userSnap.exists()) {
            const data = userSnap.data();
            const lastDate = data.lastActive; // Timestamp

            if (lastDate) {
                // Get start of today and start of yesterday to define the "Daily Window"
                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const yesterdayStart = new Date(todayStart);
                yesterdayStart.setDate(yesterdayStart.getDate() - 1);

                const last = lastDate.toDate ? lastDate.toDate() : new Date(lastDate);

                if (last >= yesterdayStart && last < todayStart) {
                    // Last played yesterday -> Increment Streak
                    streakUpdate = increment(1);
                } else if (last < yesterdayStart) {
                    // Last played before yesterday -> Reset to 1
                    streakUpdate = 1;
                }
                // Else: Played today already -> No change
            } else {
                streakUpdate = 1; // First time playing
            }
        }

        // Save the specific result
        const resultRef = doc(db, 'users', uid, 'results', Date.now().toString());
        await setDoc(resultRef, {
            ...resultData,
            timestamp: serverTimestamp()
        });

        const updateData: any = {
            matchesPlayed: increment(1),
            lastActive: serverTimestamp()
        };

        if (streakUpdate) {
            updateData.streak = streakUpdate;
        }

        if (resultData.newElo) {
            updateData.elo = resultData.newElo;
        }

        if (resultData.newTier) {
            updateData.tier = resultData.newTier;
        }

        await updateDoc(userRef, updateData);
    },

    async getUserResults(uid: string, limitCount: number = 10): Promise<MatchResult[]> {
        const resultsRef = collection(db, 'users', uid, 'results');
        const q = query(resultsRef, orderBy('timestamp', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore Timestamp to Date object if needed for charts
            timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate() : new Date(doc.data().timestamp)
        } as MatchResult));
    },

    async getLeaderboard(limitCount: number = 10): Promise<UserProfile[]> {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('elo', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            ...doc.data(),
            uid: doc.id
        } as UserProfile));
    },

    async getUserRank(elo: number): Promise<number> {
        // Count users with strictly higher ELO
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('elo', '>', elo));
        // Note: For large datasets, use distinct aggregation queries, but for now getting snapshot size is okay for < 1000 users.
        // Optimization: Use getCountFromServer if available in this firebase SDK version.
        // Falling back to simple size for compatibility.
        const snapshot = await getDocs(q);
        return snapshot.size + 1;
    },

    async saveNeuralProfile(uid: string, analysis: any): Promise<void> {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            archetype: analysis.archetype,
            archetypeDesc: analysis.archetypeDesc,
            traits: {
                iq: analysis.iqEstimate || 0, // Fallback if raw IQ not passed directly in analysis object
                eq: analysis.eqEstimate || 0,
                risk: analysis.riskEstimate || 0,
                ...analysis.hexaco,
                // New Detailed Cognitive Traits
                memory: analysis.cognitive?.memory || 0,
                speed: analysis.cognitive?.speed || 0,
                executive: analysis.cognitive?.executive || 0,
                fluid: analysis.cognitive?.fluid || 0,
                crystallized: analysis.cognitive?.crystallized || 0
            },
            lastAssessmentDate: serverTimestamp()
        });
    },

    async unlockAchievement(uid: string, achievementId: string) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            achievements: arrayUnion(achievementId)
        });
    }
};
