// Data persistence utility - localStorage implementation (Firebase-ready architecture)

export interface ResponseData {
    stage: number;
    choice: string | number;
    latency_ms: number;
    timestamp: string;
    accuracy?: boolean;
}

export interface FinalScores {
    iq: number;
    iqPercentile: number;
    eq: number;
    eqPercentile: number;
    riskTolerance: number;
    riskPercentile: number;
    hexaco: {
        honesty: number;
        emotionality: number;
        extraversion: number;
        agreeableness: number;
        conscientiousness: number;
        openness: number;
    };
    ocean: {
        openness: number;
        conscientiousness: number;
        extraversion: number;
        agreeableness: number;
        neuroticism: number;
    };
    apexTraits: {
        trait: string;
        score: number;
        description: string;
    }[];
}

export interface SessionData {
    sessionId: string;
    userId: string;
    timestamp: string;
    rawResponses: ResponseData[];
    finalScores?: FinalScores;
    completed: boolean;
}

// Generate UUID v4
export function generateSessionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// Generate or retrieve user ID
export function getUserId(): string {
    let userId = localStorage.getItem('neuralsync_userId');
    if (!userId) {
        userId = `user_${generateSessionId()}`;
        localStorage.setItem('neuralsync_userId', userId);
    }
    return userId;
}

// Save session data to localStorage
export function saveSession(data: SessionData): void {
    try {
        const key = `neuralsync_session_${data.sessionId}`;
        localStorage.setItem(key, JSON.stringify(data));
        // Also save as "current session" for easy retrieval
        localStorage.setItem('neuralsync_currentSession', data.sessionId);
    } catch (error) {
        console.error('Failed to save session:', error);
    }
}

// Load session data from localStorage
export function loadSession(sessionId?: string): SessionData | null {
    try {
        const id = sessionId || localStorage.getItem('neuralsync_currentSession');
        if (!id) return null;

        const key = `neuralsync_session_${id}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to load session:', error);
        return null;
    }
}

// Create new session
export function createSession(): SessionData {
    const session: SessionData = {
        sessionId: generateSessionId(),
        userId: getUserId(),
        timestamp: new Date().toISOString(),
        rawResponses: [],
        completed: false,
    };
    saveSession(session);
    return session;
}

// Update session with new response
export function addResponse(sessionId: string, response: ResponseData): void {
    const session = loadSession(sessionId);
    if (session) {
        session.rawResponses.push(response);
        saveSession(session);
    }
}

// Complete session with final scores
export function completeSession(sessionId: string, finalScores: FinalScores): void {
    const session = loadSession(sessionId);
    if (session) {
        session.finalScores = finalScores;
        session.completed = true;
        saveSession(session);
    }
}

// Clear all session data (for testing)
export function clearAllSessions(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('neuralsync_session_')) {
            localStorage.removeItem(key);
        }
    });
    localStorage.removeItem('neuralsync_currentSession');
}
