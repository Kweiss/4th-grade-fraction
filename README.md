# 4th Grade Fraction Comparison Mastery

An interactive educational web application designed to teach 4th-grade students how to compare fractions using three evidence-based methods: benchmarks, common denominators, and cross-multiplication.

## Features

### Core Functionality

- **5 Structured Sessions**: Each session includes direct instruction, adaptive practice, and mastery assessment
- **Three Comparison Methods**: 
  - Benchmarks (0, ½, 1)
  - Common Denominators
  - Cross-Multiplication
- **Interactive Number Lines**: Visual representations to aid understanding
- **Adaptive Practice**: Difficulty adjusts dynamically to maintain 80-85% accuracy
- **Mastery Assessments**: 12-problem quizzes requiring ≥90% to pass with justifications
- **Automatic Re-teaching**: If assessment threshold not met, system provides review
- **Spaced Repetition**: Incorporates previous material in later sessions

### Metrics & Analytics

The application tracks three key success metrics:

1. **Mastery Rate**: % of students achieving ≥90% by session 5
   - Success: ≥75%
   - Failure: <50%

2. **Error Reduction**: Session-to-session error rate reduction
   - Success: ≥40% reduction
   - Failure: <20% reduction

3. **Engagement Efficiency**: % of sessions completed in 30-60 minutes
   - Success: ≥90%
   - Failure: <70%

## Technology Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **LocalStorage** for data persistence
- **SVG** for interactive number line visualizations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 4th-grade-fractions
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `build` folder.

## Project Structure

```
src/
├── components/          # React components
│   ├── AdaptivePractice.tsx      # Adaptive practice exercises
│   ├── Instruction.tsx           # Direct instruction lessons
│   ├── MasteryAssessment.tsx     # End-of-session quizzes
│   ├── MetricsDashboard.tsx      # Analytics dashboard
│   ├── NumberLine.tsx            # Interactive number line visualization
│   └── SessionView.tsx           # Session orchestrator
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── fractionUtils.ts         # Fraction math and generation
│   └── storage.ts               # LocalStorage management and metrics
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## How It Works

### Session Flow

1. **Instruction Phase**: Students learn one comparison method at a time through interactive examples
2. **Practice Phase**: 10 adaptive exercises adjust difficulty to maintain optimal challenge
3. **Assessment Phase**: 12-problem quiz requiring ≥90% accuracy with justifications
4. **Re-teaching**: If assessment not passed, system provides review and retry opportunity

### Adaptive Difficulty

The system adjusts exercise difficulty based on recent performance:
- If accuracy > target + 5%, difficulty increases
- If accuracy < target - 10%, difficulty decreases
- Maintains optimal challenge zone for learning

### Data Persistence

All progress, sessions, and metrics are stored in browser localStorage:
- Session data persists across page reloads
- Progress tracking enables continuation
- Analytics computed from stored session history

## Educational Principles

This application follows evidence-based educational practices:

- **Explicit Instruction**: Direct teaching of comparison methods with worked examples
- **Scaffolded Learning**: Gradual introduction of concepts with support
- **Mastery Learning**: Requires demonstrated proficiency before progression
- **Spaced Practice**: Incorporates review of previous concepts
- **Immediate Feedback**: Instant correction and explanation

## Common Core Alignment

Aligns with Common Core State Standards:
- 4.NF.A.2: Compare two fractions with different numerators and denominators

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[Specify your license here]

## Contributing

[Contributing guidelines if applicable]

## Acknowledgments

Built with evidence-based pedagogical principles for effective fraction instruction.
