export interface Fraction {
  numerator: number;
  denominator: number;
}

export type ComparisonMethod = 'benchmark' | 'common-denominator' | 'cross-multiplication';

export interface Exercise {
  id: string;
  fraction1: Fraction;
  fraction2: Fraction;
  correctAnswer: '>' | '<' | '=';
  method: ComparisonMethod;
  difficulty: number; // 1-5 scale
}

export interface ExerciseResponse {
  exerciseId: string;
  answer: '>' | '<' | '=';
  justification: string;
  isCorrect: boolean;
  timeSpent: number; // milliseconds
  errorType?: string;
}

export interface Session {
  id: string;
  sessionNumber: number;
  startTime: number;
  endTime?: number;
  completed: boolean;
  exercises: ExerciseResponse[];
  quizScore?: number;
  quizPassed?: boolean;
}

export interface Metrics {
  masteryRate: number; // % achieving ≥90% by session 5
  errorReduction: number; // % drop session-to-session
  engagementEfficiency: number; // % sessions in 30-60 min
  sessions: Session[];
  errorLogs: ErrorLog[];
}

export interface ErrorLog {
  sessionNumber: number;
  exerciseId: string;
  errorType: string;
  timestamp: number;
}

export interface Progress {
  currentSession: number;
  completedSessions: number[];
  adaptiveDifficulty: number; // Current difficulty level (1-5)
  lastPracticeAccuracy: number; // Running average
}

