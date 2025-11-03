import React, { useState, useEffect } from 'react';
import { Session, ExerciseResponse, ComparisonMethod } from '../types';
import { Instruction } from './Instruction';
import { AdaptivePractice } from './AdaptivePractice';
import { MasteryAssessment } from './MasteryAssessment';
import { 
  saveSession, 
  getOrInitializeProgress, 
  saveProgress,
  calculateMetrics 
} from '../utils/storage';

interface SessionViewProps {
  sessionNumber: number;
  onSessionComplete: () => void;
}

type SessionPhase = 'instruction' | 'practice' | 'assessment' | 'complete' | 'retry';

const METHODS: ComparisonMethod[] = ['benchmark', 'common-denominator', 'cross-multiplication'];

export const SessionView: React.FC<SessionViewProps> = ({ 
  sessionNumber, 
  onSessionComplete 
}) => {
  const [phase, setPhase] = useState<SessionPhase>('instruction');
  const [currentMethodIndex, setCurrentMethodIndex] = useState(0);
  const [session, setSession] = useState<Session>({
    id: `session-${sessionNumber}-${Date.now()}`,
    sessionNumber,
    startTime: Date.now(),
    completed: false,
    exercises: [],
  });
  const [difficulty, setDifficulty] = useState(1);

  useEffect(() => {
    const progress = getOrInitializeProgress();
    setDifficulty(progress.adaptiveDifficulty);
  }, []);

  const handleInstructionComplete = () => {
    if (currentMethodIndex < METHODS.length - 1) {
      setCurrentMethodIndex(currentMethodIndex + 1);
    } else {
      setPhase('practice');
    }
  };

  const handlePracticeComplete = (responses: ExerciseResponse[]) => {
    const accuracy = responses.length > 0
      ? (responses.filter(r => r.isCorrect).length / responses.length) * 100
      : 0;
    
    // Update progress with practice accuracy
    const progress = getOrInitializeProgress();
    progress.lastPracticeAccuracy = accuracy;
    saveProgress(progress);

    setSession(prev => ({
      ...prev,
      exercises: [...prev.exercises, ...responses],
    }));
    
    setPhase('assessment');
  };

  const handleDifficultyChange = (newDifficulty: number) => {
    setDifficulty(newDifficulty);
    const progress = getOrInitializeProgress();
    progress.adaptiveDifficulty = newDifficulty;
    saveProgress(progress);
  };

  const handleAssessmentComplete = (score: number, passed: boolean, responses: ExerciseResponse[]) => {
    const updatedSession: Session = {
      ...session,
      endTime: Date.now(),
      completed: true,
      exercises: [...session.exercises, ...responses],
      quizScore: score,
      quizPassed: passed,
    };

    setSession(updatedSession);
    saveSession(updatedSession);

    if (passed) {
      // Update progress - only add this specific session if not already completed
      const progress = getOrInitializeProgress();
      
      // Clean up: ensure completedSessions only contains valid, unique session numbers
      const validCompleted = progress.completedSessions
        .filter((s: number) => s >= 1 && s <= 5)
        .filter((s: number, index: number, arr: number[]) => arr.indexOf(s) === index);
      
      // Add this session if not already in the list
      if (!validCompleted.includes(sessionNumber)) {
        validCompleted.push(sessionNumber);
      }
      
      // Sort to keep them in order
      validCompleted.sort((a: number, b: number) => a - b);
      
      progress.completedSessions = validCompleted;
      
      // Set current session to the next uncompleted session
      // If all sessions 1-5 are completed, set to 6 (which will show completion screen)
      const maxCompleted = validCompleted.length > 0 ? Math.max(...validCompleted) : 0;
      progress.currentSession = Math.min(maxCompleted + 1, 6);
      
      saveProgress(progress);
      
      setPhase('complete');
    } else {
      // Needs retry/re-teaching
      setPhase('retry');
    }
  };

  const handleRetry = () => {
    // Reset to instruction with focus on areas that need work
    setCurrentMethodIndex(0);
    setPhase('instruction');
  };

  const handleSessionComplete = () => {
    onSessionComplete();
  };

  if (phase === 'instruction') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Session {sessionNumber}: Learning to Compare Fractions
            </h1>
            <p className="text-gray-600">
              Learning Method {currentMethodIndex + 1} of {METHODS.length}
            </p>
          </div>
          <Instruction 
            method={METHODS[currentMethodIndex]} 
            onComplete={handleInstructionComplete}
          />
        </div>
      </div>
    );
  }

  if (phase === 'practice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Session {sessionNumber}: Practice Time
            </h1>
            <p className="text-gray-600">
              Complete 10 practice problems. Try your best!
            </p>
          </div>
          <AdaptivePractice
            difficulty={difficulty}
            targetAccuracy={82.5}
            onComplete={handlePracticeComplete}
            onDifficultyChange={handleDifficultyChange}
          />
        </div>
      </div>
    );
  }

  if (phase === 'assessment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Session {sessionNumber}: Mastery Assessment
            </h1>
            <p className="text-gray-600">
              Get 90% or higher to pass! Make sure to show your work on each problem.
            </p>
          </div>
          <MasteryAssessment
            sessionNumber={sessionNumber}
            onComplete={handleAssessmentComplete}
          />
        </div>
      </div>
    );
  }

  if (phase === 'retry') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              More Practice Needed
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              You got {session.quizScore?.toFixed(0)}% correct. To pass, you need to get 90% or higher.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
              <p className="text-gray-700">
                <strong>No worries!</strong> Let's go back and review what we learned, then practice some more.
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              Review and Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    const duration = session.endTime && session.startTime
      ? ((session.endTime - session.startTime) / (1000 * 60)).toFixed(0)
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Session {sessionNumber} Complete!
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Great job! You got {session.quizScore?.toFixed(0)}% correct on the test!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{session.quizScore?.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Test Score</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{duration} min</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{session.exercises.length}</div>
              <div className="text-sm text-gray-600">Problems Solved</div>
            </div>
          </div>

          {sessionNumber < 5 ? (
            <div className="text-center">
              <button
                onClick={handleSessionComplete}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
              >
                Continue to Next Session →
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
                <p className="text-gray-700">
                  <strong>Congratulations!</strong> You've completed all 5 sessions. Check your progress below.
                </p>
              </div>
              <button
                onClick={handleSessionComplete}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
              >
                View Final Results
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

