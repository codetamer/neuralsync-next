# **Product Requirements Document: NeuralSync Comprehensive Evaluator (v4.2)**

| Attribute | Detail |
| :---- | :---- |
| **Project Name** | NeuralSync Comprehensive Evaluator |
| **Version** | **4.2 (Maximized Psychometrics & Results)** |
| **Owner** | \[TBD\] |
| **Date** | November 2025 |
| **Core Platform** | Single Page Application (SPA) \- Fully Responsive |
| **Priority 1 (Mandatory)** | **Maximum Accuracy:** Utilize state-of-the-art psychometric models (CHC, HEXACO, IAT, **OCEAN**) and Item Response Theory (IRT) scaling. |
| **Priority 2 (Mandatory)** | **Maximum Ad Engagement:** Implement a high-value, high-commitment ad funnel, including a mandatory Gated Result Screen. |
| **Priority 3 (Mandatory)** | **Beautiful UI:** Deliver a modern, dark-themed, and visually rewarding user experience. |
| **Priority 4 (Mandatory)** | **Maximum Recurrence:** Implement an intrinsic loop for long-term user engagement and viral growth. |

## **1\. Executive Summary: Forged in Science, Baked in UI, Built for Growth**

The NeuralSync Evaluator is a high-value psychometric testing application designed for professional and personal development users. Our competitive edge lies in the scientific rigor of our evaluation, now enhanced to include a **triple-layered personality and cognitive assessment** (CHC/IAT/HEXACO/**OCEAN**) combined with highly precise data capture (response latency via Canvas). Version 4.2 focuses on delivering the most comprehensive result card possible, explicitly detailing complete personality traits, strengths, and weaknesses to maximize user value and shareability.

### **Success Metrics**

* **Result Accuracy:** User-reported satisfaction score of 9/10 minimum on result relevance.  
* **Ad Revenue:** Target 85% Rewarded Video Completion Rate (Slot D).  
* **User Experience:** **Zero Cumulative Layout Shift (CLS)** across all devices.  
* **Viral Loop:** Share rate of 12%+ on final results **AND 5%+ viral coefficient (K-factor)**.  
* **Recurrence Rate:** Target **30-day retention of 15%**, driven by "Tune-Up" completion.

## **2\. Scientific Foundation: State-of-the-Art Evaluation Methods (Expanded)**

Accuracy is achieved by moving beyond simple Likert scales and implementing tasks that measure implicit bias and cognitive performance under pressure. **Item Response Theory (IRT)** will be used for final score scaling to provide highly accurate, differentiated results.

### **A. Cognitive Processing (IQ)**

* **Model:** **Cattell–Horn–Carroll (CHC) Theory** (Focus on Fluid Reasoning (Gf) and Visual Processing (Gv)).  
* **Measurement:** **Adaptive Testing:** Difficulty scales dynamically based on user latency and accuracy.  
* **Mandatory Task:** Implement advanced non-verbal **Matrix Reasoning** tasks using the Canvas element for pixel-perfect timing.

### **B. Emotional Intelligence & Regulation (EQ)**

* **Model:** Focus on Affective Empathy and Response Regulation.  
* **Measurement:** **Implicit Association Testing (IAT) principles:** User must rapidly categorize abstract emotional stimuli (words/images) to measure subconscious association speed and bias toward emotional valence.  
* **Mandatory Task:** **Emotional Stroop Test** (color-word interference adapted for emotional words) to track regulation failure under pressure.

### **C. Comprehensive Personality & Behavioral Drivers (Enhanced Scope)**

* **Models:** **HEXACO** (Honesty-Humility is essential) **AND Big Five/OCEAN** (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) for complete trait coverage.  
* **Measurement:**  
  1. **Behavioral Economics Tasks (BART):** Users play a simplified version of the **Balloon Analogue Risk Task (BART)** where precise risk/utility calculations are required, and the Canvas tracks the exact millisecond of their "cash out" decision (feeds into C/N traits).  
  2. **Explicit Trait Inventory:** A scientifically validated, forced-choice inventory is required to capture all 12 facets of HEXACO and 30 facets of OCEAN (in the final block).  
* **Data Integrity:** Raw response latency (ms) for *every* choice must be recorded and stored for IRT scaling and bias detection.

## **3\. High-Engagement Ad Placement & Recurrence Strategy**

*(No changes to Ad Slot Specification (Section 3.A) or Recurrence Engine (Section 3.B))*

## **4\. UI/UX and Aesthetic Requirements (The "Beautiful UI")**

The application must feel sophisticated, secure, and intuitive.

### **A. Aesthetics and Branding**

*(No changes to Aesthetics and Branding (Section 4.A))*

### **B. Functional UI Requirements**

* **Progress Tracking:** A prominent, persistent progress bar indicating "X of 20 Stages Complete."  
* **In-Test Focus:** During testing stages (Blocks 1-4), the UI must be minimal, centering the **Canvas 2D element** to minimize cognitive distraction.  
* **Visual Feedback:** Provide immediate, subtle visual feedback (e.g., a brief green pulse for correct, a red glow for incorrect) on every interaction within the Canvas.  
* **Result Presentation (Enhanced):** The final result screen must look like a high-value, shareable **"Certificate"**, using a clean structure and advanced data visualizations (simple bar charts or radar plots for domain scores). **It must explicitly display a dedicated, data-driven section for Strengths and Weaknesses derived from the composite OCEAN and HEXACO scores.**

### **C. Viral & Social UI (New Subsection \- Enhanced)**

* **Shareable Persona Card:** The final result screen must generate a beautiful, dark-themed **"Persona Card"** image/text summary that highlights the user's top three percentile scores with a prominent **electric teal accent** and a clear call-to-action to share.  
* **Fun Facts Generation (New):** The result card must contain a dedicated block of **3-5 "Fun Facts"** about the user's personality or cognitive style. These facts must be dynamically generated from the IRT-scaled data (e.g., "Your high Gf score suggests you solve complex problems 25% faster than the average test taker."). The generation of these facts must be performed by the Gemini API using the raw data as context.  
* **Progress Visualization:** The "Your Growth Plan Dashboard" must use clear, motivating data visualizations (progress bars, radar plots) for the user's goal progress and time until the next Tune-Up.  
* **Comparison Module:** The UI must include an option for **Anonymous Peer Comparison**, allowing users to see how their core scores compare to an anonymized sample of the user base or their invited friends.

## **5\. Detailed Functional Requirements (Updated)**

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

## **6\. Technical Requirements & Architecture (Updated)**

The application will be built as a self-contained Single Page Application (SPA) using React for component structure, Firebase Firestore for data persistence, and Canvas 2D for high-precision game mechanics.

### **A. Tech Stack**

* **Frontend:** React (JSX/TSX), Tailwind CSS (for rapid styling and responsiveness).  
* **Game Engine:** HTML \<canvas\> \+ Vanilla JavaScript/React Hooks for high-precision timing and input tracking.  
* **Content Generation:** Integration of the **Gemini API** for dynamic text generation (Fun Facts, Strengths/Weaknesses narratives).

### **B. Data Model (Firestore) \- Expanded**

* **Private User Sessions:** All raw session data (inputs, latency, scores) is stored privately.  
  * **Collection Path:** /artifacts/\_\_app\_id/users/{userId}/sessions  
  * **Document Structure:** Contains sessionID, userID, timestamp, rawResponses: \[{stage, choice, latency\_ms}\], finalScores: {iq, eq, hexaco, \*\*ocean\*\*, percentile}, generatedFacts: string\[\].  
* **Recurrence & Referral Data:** All recurrence-related fields remain the same in the /artifacts/\_\_app\_id/users/{userId} document.  
* **Initialization & Authentication:** Firebase services are initialized on component mount, and the user is authenticated using \_\_initial\_auth\_token or signInAnonymously() as a fallback.

### **C. Responsiveness**

*(No changes to Responsiveness (Section 6.C))*

## **7\. Non-Functional Requirements**

*(No changes to Non-Functional Requirements (Section 7))*