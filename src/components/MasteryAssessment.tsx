import React, { useState, useEffect } from 'react';
import { Exercise, ExerciseResponse, ComparisonMethod } from '../types';
import { 
  generateExercisePair, 
  compareFractions, 
  formatFraction 
} from '../utils/fractionUtils';
import { NumberLine } from './NumberLine';
import { PieChart } from './PieChart';
import { saveErrorLog, getSessions } from '../utils/storage';

interface MasteryAssessmentProps {
  sessionNumber: number;
  onComplete: (score: number, passed: boolean, responses: ExerciseResponse[]) => void;
}

const QUIZ_EXERCISE_COUNT = 12;
const MASTERY_THRESHOLD = 90;

export const MasteryAssessment: React.FC<MasteryAssessmentProps> = ({
  sessionNumber,
  onComplete,
}) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<ExerciseResponse[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<'>' | '<' | '=' | null>(null);
  const [justification, setJustification] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    // Generate all quiz exercises upfront
    const generated: Exercise[] = [];
    const methods: ComparisonMethod[] = ['benchmark', 'common-denominator', 'cross-multiplication'];
    
    // Mix difficulties and methods
    for (let i = 0; i < QUIZ_EXERCISE_COUNT; i++) {
      const difficulty = 2 + (i % 3); // Cycle through difficulties 2, 3, 4
      const { fraction1, fraction2 } = generateExercisePair(difficulty);
      const method = methods[i % methods.length];
      
      generated.push({
        id: `quiz-${sessionNumber}-${i}`,
        fraction1,
        fraction2,
        correctAnswer: compareFractions(fraction1, fraction2, method),
        method,
        difficulty,
      });
    }
    
    // Add spaced repetition: include some from previous sessions
    const previousSessions = getSessions().filter(s => s.sessionNumber < sessionNumber);
    if (previousSessions.length > 0 && generated.length > 2) {
      // Replace last 2 exercises with review from previous sessions
      const allPreviousExercises = previousSessions.flatMap(s => s.exercises);
      const incorrectPrevious = allPreviousExercises.filter(e => !e.isCorrect);
      if (incorrectPrevious.length > 0) {
        // This is simplified - in a real app, we'd reconstruct the original exercises
        // For now, we'll just note that spaced repetition should happen
      }
    }
    
    setExercises(generated);
    setCurrentExercise(generated[0]);
  }, [sessionNumber]);

  const handleSubmit = () => {
    if (!currentExercise || !selectedAnswer || !justification.trim()) {
      alert('Please select an answer and provide a justification. Both are required for the assessment.');
      return;
    }

    const timeSpent = Date.now() - startTime;
    const isCorrect = selectedAnswer === currentExercise.correctAnswer;
    
    const response: ExerciseResponse = {
      exerciseId: currentExercise.id,
      answer: selectedAnswer,
      justification,
      isCorrect,
      timeSpent,
      errorType: !isCorrect ? 'incorrect-comparison' : undefined,
    };

    if (!isCorrect) {
      saveErrorLog({
        sessionNumber,
        exerciseId: currentExercise.id,
        errorType: 'incorrect-comparison',
        timestamp: Date.now(),
      });
    }

    const newResponses = [...responses, response];
    setResponses(newResponses);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_EXERCISE_COUNT - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentExercise(exercises[currentIndex + 1]);
      setSelectedAnswer(null);
      setJustification('');
      setShowFeedback(false);
      setStartTime(Date.now());
    } else {
      // Quiz complete - calculate score
      const correctCount = responses.filter(r => r.isCorrect).length;
      const score = (correctCount / QUIZ_EXERCISE_COUNT) * 100;
      const passed = score >= MASTERY_THRESHOLD;
      onComplete(score, passed, responses);
    }
  };

  if (!currentExercise || exercises.length === 0) {
    return <div className="text-center p-8">Preparing assessment...</div>;
  }

  const isCorrect = selectedAnswer === currentExercise.correctAnswer;
  const currentScore = responses.length > 0
    ? (responses.filter(r => r.isCorrect).length / responses.length) * 100
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Mastery Assessment</h2>
          <div className="text-sm text-gray-600">
            Question {currentIndex + 1} of {QUIZ_EXERCISE_COUNT} | Current Score: {currentScore.toFixed(0)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              currentScore >= MASTERY_THRESHOLD ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${((currentIndex + 1) / QUIZ_EXERCISE_COUNT) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <strong>Goal:</strong> Score ≥{MASTERY_THRESHOLD}% to pass
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Compare: {formatFraction(currentExercise.fraction1)} ? {formatFraction(currentExercise.fraction2)}
        </h3>
        <div className="mb-4">
          <NumberLine fraction1={currentExercise.fraction1} fraction2={currentExercise.fraction2} />
        </div>
        <div className="mb-4">
          <PieChart fraction1={currentExercise.fraction1} fraction2={currentExercise.fraction2} />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => !showFeedback && setSelectedAnswer('<')}
            disabled={showFeedback}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all ${
              selectedAnswer === '<'
                ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${showFeedback ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            &lt;
          </button>
          <button
            onClick={() => !showFeedback && setSelectedAnswer('=')}
            disabled={showFeedback}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all ${
              selectedAnswer === '='
                ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${showFeedback ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            =
          </button>
          <button
            onClick={() => !showFeedback && setSelectedAnswer('>')}
            disabled={showFeedback}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all ${
              selectedAnswer === '>'
                ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${showFeedback ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <strong>Required:</strong> Explain your answer with justification:
        </label>
        <textarea
          value={justification}
          onChange={(e) => !showFeedback && setJustification(e.target.value)}
          disabled={showFeedback}
          placeholder="Provide a clear explanation of how you compared these fractions. For example: 'I used common denominators. 3/4 = 9/12 and 5/6 = 10/12, so 3/4 < 5/6.'"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          Your justification must show your reasoning process.
        </p>
      </div>

      {!showFeedback ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || !justification.trim()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      ) : (
        <div>
          <div className={`p-4 rounded-lg mb-4 ${
            isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`text-2xl mr-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </span>
              <span className="font-semibold">
                The correct answer is: <strong>{formatFraction(currentExercise.fraction1)} {currentExercise.correctAnswer} {formatFraction(currentExercise.fraction2)}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {currentIndex < QUIZ_EXERCISE_COUNT - 1 ? 'Next Question →' : 'View Results'}
          </button>
        </div>
      )}
    </div>
  );
};

