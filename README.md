# NeuralSync Next

**NeuralSync** is a next-generation cognitive assessment platform built with high-performance web technologies. It provides a suite of psychometric tests designed to analyze various facets of human cognition, including memory, processing speed, executive function, and risk tolerance.

The application features a premium, immersive user experience with dynamic theming, procedural audio, and smooth animations found in high-end gaming interfaces.

## 🚀 Features

### core Cognitive Assessments
NeuralSync includes a library of digitized neuropsychological tasks:

*   **N-Back Task**: Measures working memory and fluid intelligence.
*   **Reaction Time**: Tests simple and choice reaction speeds (milliseconds).
*   **Trail Making Test (A & B)**: Evaluates visual attention and task switching.
*   **Digit Span (Forward & Backward)**: assesses auditory working memory capacity.
*   **Spatial Span**: Tests visual-spatial short-term memory.
*   **Symbol Match**: Measures processing speed and pattern recognition.
*   **BART (Balloon Analogue Risk Task)**: Quantifies risk-taking behavior.
*   **Matrix Reasoning**: Assesses non-verbal fluid intelligence.
*   **Advanced Vocabulary**: Evaluates crystallized intelligence.

### 🎨 Immersive UX
*   **Dynamic Theming**: Switch instantly between 'Zenith' (Modern, light, ethereal) and 'Original' (Dark, cyberpunk, mechanical) modes.
*   **Procedural Audio Engine**: A custom `AudioEngine` generates real-time sound effects (hover, click, success, error) using the Web Audio API, tailored to the active theme.
*   **Animated Visuals**: Built with `framer-motion` for fluid transitions and game-like feedback.

### 📊 Deep Analytics
*   **Neural Signature**: A unique visual fingerprint of the user's cognitive profile.
*   **Trait Radar**: Interactive charts visualizing performance across 5 key dimensions (OCEAN model).
*   **Detailed Metrics**: Precision tracking of latency, accuracy, and decision patterns.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Core**: [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Vanilla CSS variables
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) with persistence
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Visualization**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/codetamer/neuralsync-next.git
    cd neuralsync-next
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the app**
    Navigate to `http://localhost:3000` in your browser.

## 📁 Project Structure

```
src/
├── components/
│   ├── stages/        # Individual cognitive assessment components
│   ├── ui/            # Reusable UI elements (NeonButton, GlassCard)
│   ├── results/       # various results visualizations
│   └── layout/        # AppShell and global layout
├── engine/            # Core logic (AudioEngine, Test computations)
├── store/             # Zustand stores (useTestStore, useThemeStore)
├── lib/               # Utilities and constants
└── app/               # Next.js App Router pages
```

## 🔊 Audio System

The project uses a singleton `AudioEngine` class (`src/engine/AudioEngine.ts`). It mostly avoids pre-recorded assets in favor of `OscillatorNode` and `GainNode` synthesis to keep the bundle size small and the experience responsive.

-   **Zenith Theme**: Uses Sine waves, soft ramps, and harmonic chords.
-   **Original Theme**: Uses Square/Triangle waves, sharp decays, and 8-bit style chimes.

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

© 2025 NeuralSync • Advanced Psychometrics Division
