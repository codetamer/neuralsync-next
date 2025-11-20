# **Product Requirements Document: NeuralSync Comprehensive Evaluator (v4.0)**

| Attribute | Detail |
| :---- | :---- |
| **Project Name** | NeuralSync Comprehensive Evaluator |
| **Version** | 4.0 (Comprehensive Strategy) |
| **Owner** | \[TBD\] |
| **Date** | November 2025 |
| **Core Platform** | Single Page Application (SPA) \- Fully Responsive |
| **Priority 1 (Mandatory)** | **Maximum Accuracy:** Utilize state-of-the-art psychometric models (CHC, HEXACO, IAT) and Item Response Theory (IRT) scaling. |
| **Priority 2 (Mandatory)** | **Maximum Ad Engagement:** Implement a high-value, high-commitment ad funnel, including a mandatory Gated Result Screen. |
| **Priority 3 (Mandatory)** | **Beautiful UI:** Deliver a modern, dark-themed, and visually rewarding user experience. |

## **1\. Executive Summary: Forged in Science, Baked in UI**

The NeuralSync Evaluator is a high-value psychometric testing application designed for professional and personal development users. Our competitive edge lies in the scientific rigor of our evaluation (CHC/HEXACO models) combined with highly precise data capture (response latency via Canvas). Monetization is maximized through strategic ad placement that capitalizes on user commitment and engagement, primarily via rewarded video.

### **Success Metrics**

* **Result Accuracy:** User-reported satisfaction score of 9/10 minimum on result relevance.  
* **Ad Revenue:** Target 85% Rewarded Video Completion Rate (Slot D).  
* **User Experience:** **Zero Cumulative Layout Shift (CLS)** across all devices.  
* **Viral Loop:** Share rate of 12%+ on final results.

## **2\. Scientific Foundation: State-of-the-Art Evaluation Methods**

Accuracy is achieved by moving beyond simple Likert scales and implementing tasks that measure implicit bias and cognitive performance under pressure. **Item Response Theory (IRT)** will be used for final score scaling to provide highly accurate, differentiated results.

### **A. Cognitive Processing (IQ)**

* **Model:** **Cattell–Horn–Carroll (CHC) Theory** (Focus on Fluid Reasoning (Gf) and Visual Processing (Gv)).  
* **Measurement:** **Adaptive Testing:** Difficulty scales dynamically based on user latency and accuracy.  
* **Mandatory Task:** Implement advanced non-verbal **Matrix Reasoning** tasks using the Canvas element for pixel-perfect timing.

### **B. Emotional Intelligence & Regulation (EQ)**

* **Model:** Focus on Affective Empathy and Response Regulation.  
* **Measurement:** **Implicit Association Testing (IAT) principles:** User must rapidly categorize abstract emotional stimuli (words/images) to measure subconscious association speed and bias toward emotional valence.  
* **Mandatory Task:** **Emotional Stroop Test** (color-word interference adapted for emotional words) to track regulation failure under pressure.

### **C. Core Personality & Behavioral Drivers**

* **Model:** **HEXACO** (Honesty-Humility is essential) and assessment of high-stakes behavioral drivers (Risk/Reward).  
* **Measurement:** **Behavioral Economics Tasks:** Users play a simplified version of the **Balloon Analogue Risk Task (BART)** where precise risk/utility calculations are required, and the Canvas tracks the exact millisecond of their "cash out" decision.  
* **Data Integrity:** Raw response latency (ms) for *every* choice must be recorded and stored for IRT scaling and bias detection.

## **3\. High-Engagement Ad Placement Strategy**

Monetization is driven by aggressively capturing the user's high-commitment state at critical transition points. **CLS mitigation is mandatory.**

### **A. Ad Slot Specification**

| Slot Name | Location/Trigger | Type | Technical Requirement (CLS Mitigation) | Engagement Strategy |
| :---- | :---- | :---- | :---- | :---- |
| **Slot A: Header** | Sticky across all test stages. | Banner (H: 50px) | Must be housed in a **fixed, pre-allocated 50px container** at all times. | Passive CPM; dynamic content updates based on the current test block (e.g., career ads during cognitive testing). |
| **Slot B: High-Intent Interstitial** | Between Block 2 (EQ) and Block 3 (Behavior). | Full-Screen Video/Ad | Dedicated, modal component that prevents any underlying content shift. | **Mandatory 3-second delay timer** before the "Skip Ad" button appears. |
| **Slot C: Post-Commitment Anchor** | Fixed footer, appearing below the Canvas during the *last* question of each block (Stages 5, 10, 15, 20). | Large Banner (H: 120px) | Fixed minimum height container (h-\[120px\]). Must not overlap navigation. | Captures attention when the user is mentally "exhaling" after a tough section, before clicking to the next stage. |
| **Slot D: The Gated Result Screen** | **CRITICAL: Full-screen modal after data processing, before final results.** | Rewarded Video/CPA | Full-screen overlay; prevents results display until action is taken. | **Highest Revenue.** User must choose: **1\) Watch 15-second rewarded video** (Preferred) OR **2\) Wait 30 seconds for non-skippable ad load**. |

## **4\. UI/UX and Aesthetic Requirements (The "Beautiful UI")**

The application must feel sophisticated, secure, and intuitive.

### **A. Aesthetics and Branding**

* **Theme:** **Dark Mode** is the default and only theme. Use deep blues (\#1a202c) and vibrant accent colors (e.g., electric teal or neon green) for scores and interactive elements.  
* **Typography:** Use the **Inter** font family. Ensure high contrast (White text on dark backgrounds).  
* **Design Language:** Minimalist, highly functional, and visually rewarding. **Heavy use of rounded-xl and subtle gradients/shadows** to lift interactive elements (buttons, scores) off the dark background.  
* **Motion Design:** Use smooth, minimal CSS transitions (transition-all duration-300) for score updates and button hovers.

### **B. Functional UI Requirements**

* **Progress Tracking:** A prominent, persistent progress bar indicating "X of 20 Stages Complete."  
* **In-Test Focus:** During testing stages (Blocks 1-4), the UI must be minimal, centering the **Canvas 2D element** to minimize cognitive distraction.  
* **Visual Feedback:** Provide immediate, subtle visual feedback (e.g., a brief green pulse for correct, a red glow for incorrect) on every interaction within the Canvas.  
* **Result Presentation:** The final result screen must look like a high-value, shareable **"Certificate"**, using a clean structure and advanced data visualizations (simple bar charts or radar plots for domain scores).

## **5\. Detailed Functional Requirements**

| Requirement ID | Description | Scientific Mandate |
| :---- | :---- | :---- |
| **FR-S1** | The application shall dynamically adjust the difficulty of cognitive tasks (Gf, Gv) based on the running average of the user's last 5 response times. | CHC Model, Adaptive Testing |
| **FR-S2** | The app must capture and persist the millisecond latency between stimulus presentation and user response for *all* 20 stages. | IRT Scaling, Bias Detection |
| **FR-S3** | The BART simulation (Block 3\) must visually display the calculated probability of failure (risk value) and track the user's risk tolerance setting. | Behavioral Economics, HEXACO |
| **FR-M1** | The Gated Result Screen (Slot D) must be impossible to bypass without completing the required ad interaction (Video Watch or 30-sec Wait). | Maximum Ad Engagement |
| **FR-M2** | All ad containers (Slots A, B, C) must utilize fixed, reserved screen space to ensure **zero CLS**. | UX/CLS Mitigation |
| **FR-U1** | The final result screen must generate a concise, shareable image/text summary of the user's top three percentile scores. | Viral Loop |

## **6\. Technical Requirements & Architecture**

The application will be built as a self-contained Single Page Application (SPA) using React for component structure, Firebase Firestore for data persistence, and Canvas 2D for high-precision game mechanics.

### **A. Tech Stack**

* **Frontend:** React (JSX/TSX), Tailwind CSS (for rapid styling and responsiveness).  
* **Game Engine:** HTML \<canvas\> \+ Vanilla JavaScript/React Hooks for high-precision timing and input tracking.

### **B. Data Model (Firestore)**

* **Private User Sessions:** All raw session data (inputs, latency, scores) is stored privately.  
  * **Collection Path:** /artifacts/{\_\_app\_id}/users/{userId}/sessions  
  * **Document Structure:** Contains sessionID, userID, timestamp, rawResponses: \[{stage, choice, latency\_ms}\], finalScores: {iq, eq, hexaco, percentile}.  
* **Initialization & Authentication:** Firebase services are initialized on component mount, and the user is authenticated using \_\_initial\_auth\_token or signInAnonymously() as a fallback.

### **C. Responsiveness**

* The entire application, especially the Canvas element, must be **fully responsive**, resizing gracefully to fit mobile, tablet, and desktop viewports without horizontal scrolling. Use Tailwind's responsive prefixes (sm:, md:, lg:).

## **7\. Non-Functional Requirements**

* **Performance:** All visual elements must load under 1 second. Canvas tasks must maintain a minimum of 60 FPS on modern devices.  
* **Security:** Data transmission to Firestore must use HTTPS/WSS. No sensitive personal data (PII) is collected or stored; results are based purely on anonymous session data.  
* **Maintenance:** Code must be modular (React components) and well-commented for future iteration on psychometric models.