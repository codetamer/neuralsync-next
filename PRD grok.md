# **Product Requirements Document: NeuralSync Apex Evaluator (v5.0)**

| Attribute | Detail |
| Foresight | **Project Name** | NeuralSync Apex Evaluator |
| **Version** | 5.0 (The Ultimate Psychometric Engine) |
| **Owner** | You, the visionary |
| **Date** | November 2025 |
| **Core Platform** | Progressive Web App (PWA) – Offline-capable, installable, buttery-smooth on every device |
| **Priority 1** | God-tier scientific accuracy (CHC + HEXACO + OCEAN + real IRT + latency forensics) |
| **Priority 2** | Ruthless monetization without feeling dirty (gated rewards that users actually thank you for) |
| **Priority 3** | Drop-dead gorgeous dark UI that makes users screenshot just to flex |
| **Priority 4** | Built-in virality & recurrence loops so strong the app grows itself |

### **1. Executive Summary – This Isn’t a Quiz. It’s a Mirror Forged in Science.**

NeuralSync Apex is the final boss of self-discovery apps.  
We take the user’s brain, heart, and gut impulses, run them through adaptive cognitive matrices, implicit bias gauntlets, risk balloons, and a full 60-item forced-choice inventory — then spit out a hyper-personalized “Apex Profile” so accurate people will pay to see it twice.

We monetize at peak emotional commitment. We look like a million-dollar cyberpunk certificate. And we keep them coming back with micro-Tune-Ups, gamified growth arcs, and referral dopamine hits that would make TikTok blush.

**Success Metrics (non-negotiable)**
- 9.4/10 user-reported “holy crap that’s me” score
- 88 % rewarded-video completion on the Gate
- Zero CLS, <1.2 s Time-to-Interactive, 100 Lighthouse performance
- 18 % share rate + K-factor ≥ 0.2
- 30-day retention ≥ 22 % via Tune-Ups

### **2. Scientific Foundation – We Don’t Guess, We Calibrate**

Everything is adaptive, latency-tracked at the millisecond level, and scaled with 2-parameter logistic IRT. No more “mostly A’s” nonsense.

| Domain              | Model(s) Used                              | Core Tasks (all Canvas-based)                              | What We Actually Measure                                  |
|---------------------|--------------------------------------------|------------------------------------------------------------|-------------------------------------------------------------------|
| Fluid Intelligence  | CHC (Gf + Gv heavy)                        | Progressive Matrix Reasoning (20 levels, adaptive)         | Raw problem-solving horsepower + processing speed                |
| Emotional Processing| IAT principles + Emotional Stroop          | Rapid categorization + color-word interference             | Implicit valence bias + regulation under cognitive load          |
| Personality         | HEXACO (6 factors, 24 facets) + Big Five (30 facets) | Forced-choice IPIP-NEO/HEXACO items + BART risk task       | Full trait map + behavioral risk calibration                     |
| Decision Style      | Behavioral economics                       | Balloon Analogue Risk Task (real-time probability display)| Exact risk/reward utility curve via cash-out latency             |

All 24 stages (up from 20) capture:
- choice
- latency_ms (from stimulus onset)
- touch/click pressure & movement vector (mobile bonus data)

### **3. Monetization – The Velvet Hammer**

| Slot | Trigger                                 | Type                     | CLS Trick                  | Why It Converts                                      |
|------|-----------------------------------------|--------------------------|----------------------------|------------------------------------------------------|
| A    | Sticky header everywhere               | 50 px adaptive banner    | Fixed container from <body> start | Passive drip + contextual (e.g. MBA ads during Gf)   |
| B    | Between Block 2 → 3                     | Full-screen video        | Modal with reserved viewport height | User already invested 12 min                        |
| C    | Last question of each block (6,12,18,24)| 120 px anchor banner     | Fixed footer reservation   | Mental exhale moment                                 |
| D    | **The Gate** – before any result        | Rewarded 15 s video OR 30 s non-skip | Full overlay, no escape    | Peak curiosity → 88 % watch the ad willingly         |

### **4. UI/UX – Cyberpunk Cathedral Vibes**

- One theme to rule them all: Obsidian dark (#0f1117 → #1a202c gradients)
- Accents: Electric teal (#00f5ff) + neon violet pulses
- Font: Inter + display fallback to system-ui
- Motion: 60 fps micro-interactions, spring physics on correct answers (feels like dopamine confetti)
- Canvas: Always centered, letterboxed perfectly on every aspect ratio
- Result screen: Auto-generates a 1:1 shareable “Apex Persona Card” + OG image with radar chart, top 3 percentiles in giant glowing text, and 4 AI-crafted Fun Facts (Gemini 1.5 Flash)

### **5. The Recurrence Engine – They Will Return**

1. Growth Plan Dashboard – auto-assigns two weakest facets as “Focus Quests”
2. Daily 3–5 min Tune-Up modules (new matrices, mini-BART, micro-IATs)
3. XP → Badges → Rank titles (e.g. “Quantum Thinker”, “Empathic Titan”)
4. Referral both-sides reward: referrer + friend unlock a “Deep Dive” trait report + exclusive badge
5. Web Push + OS notifications (personalized: “Your Conscientiousness grew 11 % – one quick Tune-Up to lock it in?”)

## **6\. Detailed Functional Requirements (Updated)**

| Requirement ID | Description | Scientific Mandate |
| :---- | :---- | :---- |
| **FR-S1** | The application shall dynamically adjust the difficulty of cognitive tasks (Gf, Gv) based on the running average of the user's last 5 response times. | CHC Model, Adaptive Testing |
| **FR-S2** | The app must capture and persist the millisecond latency between stimulus presentation and user response for *all* 20 stages. | IRT Scaling, Bias Detection |
| **FR-S3** | The BART simulation (Block 3\) must visually display the calculated probability of failure (risk value) and track the user's risk tolerance setting. | Behavioral Economics, HEXACO |
| **FR-S4 (New)** | The final data processing pipeline must calculate and persist the **Big Five/OCEAN** scores using the explicit trait inventory data. | Comprehensive Psychometrics |
| **FR-R5 (New)** | The application must use the **Gemini API** to generate the 3-5 personalized "Fun Facts" based on the user's specific IRT-scaled raw scores (Gf, HEXACO facets, etc.) | Data-Driven Results |
| **FR-M1** | The Gated Result Screen (Slot D) must be impossible to bypass without completing the required ad interaction (Video Watch or 30-sec Wait). | Maximum Ad Engagement |
| **FR-M2** | All ad containers (Slots A, B, C) must utilize fixed, reserved screen space to ensure **zero CLS**. | UX/CLS Mitigation |
| **FR-U1** | The final result screen must generate a concise, shareable image/text summary of the user's top three percentile scores. | Viral Loop |
| **FR-R1** | Implement a **"Growth Plan" view** that programmatically assigns focus areas based on the user's two lowest HEXACO/EQ sub-factor scores. | Recurrence, Personalization |
| **FR-R2** | The system must queue and present new, specialized **5-minute "Tune-Up" modules** (Canvas elements) on a daily or weekly schedule. | Habit Building, Retention |
| **FR-R3** | Implement a user **progression/gamification system** (XP/Badges/Tier Ranks) based on the completion of Tune-Ups and Growth Plan milestones. | Gamification, Recurrence |
| **FR-R4** | Implement a dual-sided referral mechanism that provides **bonus deep-dive content** to both the referrer and the referred user upon the latter's first assessment completion. | Viral Loop, Dual Incentive |
| **FR-T1** | The app must integrate with the OS notification service (iOS/Android) to send deep-linked, personalized push notifications reminding users about their pending **Tune-Up** or **Growth Plan goal**. | Re-Engagement |


### **7. Tech Stack – Future-Proof & Blazing Fast**

- React 19 + Next.js 15 App Router (SSR for SEO + instant splash)
- Tailwind + shadcn/ui + framer-motion
- Canvas 2D + requestAnimationFrame timing (sub-millisecond precision)
- Firebase Auth (anonymous + Google one-tap) + Firestore + Storage
- Gemini 1.5 Flash API for Fun Facts & narrative strengths/weaknesses
- Workbox PWA + offline fallback
- IRT scaling library in WebAssembly (custom Rust → WASM for heavy math)

### **8. Data Model (Firestore)**

```
/users/{uid}
   ├── profile: {rank, xp, badges, referrals}
   ├── sessions/{sessionId}: {rawResponses[], finalScores{CHC, HEXACO, OCEAN, percentiles}, funFacts[], personaImageUrl}
   └── growthPlan: {focusFacets[], tuneUpStreak, nextReminderTs}
```

### **9. Non-Functional Requirements – We Ship Perfection**

- 100/100 Lighthouse on mobile (real devices, not emulators)
- < 50 ms input latency on canvas tasks
- GDPR-by-design (no PII, anonymous by default)
- A/B testing hooks baked in for every ad slot and copy block

This is not another personality quiz.  
This is the app people will talk about in 2026 when someone asks, “How did you figure your life out?”

Let’s build the mirror humanity didn’t know it needed. 🚀