import React, { useState, useEffect } from 'react';
import { Exercise, ExerciseResponse, ComparisonMethod } from '../types';
import { 
  generateExercisePair, 
  compareFractions, 
  formatFraction 
} from '../utils/fractionUtils';
import { NumberLine } from './NumberLine';
import { PieChart } from './PieChart';
import { saveErrorLog } from '../utils/storage';

interface AdaptivePracticeProps {
  difficulty: number;
  targetAccuracy: number; // 80-85%
  onComplete: (responses: ExerciseResponse[]) => void;
  onDifficultyChange: (newDifficulty: number) => void;
}

const PRACTICE_EXERCISE_COUNT = 10;

export const AdaptivePractice: React.FC<AdaptivePracticeProps> = ({
  difficulty,
  targetAccuracy,
  onComplete,
  onDifficultyChange,
}) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<ExerciseResponse[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<'>' | '<' | '=' | null>(null);
  const [justification, setJustification] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  const [recentAccuracy, setRecentAccuracy] = useState<number[]>([]);

  useEffect(() => {
    generateNewExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentDifficulty !== difficulty) {
      onDifficultyChange(currentDifficulty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDifficulty]);

  const generateNewExercise = () => {
    const { fraction1, fraction2 } = generateExercisePair(currentDifficulty);
    const methods: ComparisonMethod[] = ['benchmark', 'common-denominator', 'cross-multiplication'];
    const method = methods[Math.floor(Math.random() * methods.length)];
    
    const exercise: Exercise = {
      id: `exercise-${Date.now()}-${Math.random()}`,
      fraction1,
      fraction2,
      correctAnswer: compareFractions(fraction1, fraction2, method),
      method,
      difficulty: currentDifficulty,
    };
    
    setCurrentExercise(exercise);
    setSelectedAnswer(null);
    setJustification('');
    setShowFeedback(false);
    setStartTime(Date.now());
  };

  const handleSubmit = () => {
    if (!currentExercise || !selectedAnswer || !justification.trim()) {
      alert('Please select an answer and provide a justification.');
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
        sessionNumber: 0, // Will be updated by parent
        exerciseId: currentExercise.id,
        errorType: 'incorrect-comparison',
        timestamp: Date.now(),
      });
    }

    const newResponses = [...responses, response];
    setResponses(newResponses);
    setShowFeedback(true);

    // Track recent accuracy for adaptive adjustment
    const recent = newResponses.slice(-5); // Last 5 exercises
    const recentCorrect = recent.filter(r => r.isCorrect).length;
    const accuracy = (recentCorrect / recent.length) * 100;
    setRecentAccuracy(prev => [...prev, accuracy].slice(-5));
  };

  const handleNext = () => {
    if (currentIndex < PRACTICE_EXERCISE_COUNT - 1) {
      setCurrentIndex(currentIndex + 1);
      
      // Adjust difficulty based on recent performance
      if (recentAccuracy.length >= 3) {
        const avgAccuracy = recentAccuracy.slice(-3).reduce((a, b) => a + b, 0) / 3;
        if (avgAccuracy > targetAccuracy + 5 && currentDifficulty < 5) {
          setCurrentDifficulty(prev => Math.min(5, prev + 0.5));
        } else if (avgAccuracy < targetAccuracy - 10 && currentDifficulty > 1) {
          setCurrentDifficulty(prev => Math.max(1, prev - 0.5));
        }
      }
      
      generateNewExercise();
    } else {
      // Practice complete
      onComplete(responses);
    }
  };

  if (!currentExercise) {
    return <div className="text-center p-8">Loading exercise...</div>;
  }

  const isCorrect = selectedAnswer === currentExercise.correctAnswer;
  const currentAccuracy = responses.length > 0
    ? (responses.filter(r => r.isCorrect).length / responses.length) * 100
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Practice Exercise {currentIndex + 1} of {PRACTICE_EXERCISE_COUNT}</h2>
          <div className="text-sm text-gray-600">
            Difficulty: {currentDifficulty.toFixed(1)} | Accuracy: {currentAccuracy.toFixed(0)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / PRACTICE_EXERCISE_COUNT) * 100}%` }}
          />
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
          Explain your answer:
        </label>
        <textarea
          value={justification}
          onChange={(e) => !showFeedback && setJustification(e.target.value)}
          disabled={showFeedback}
          placeholder="Example: I compared both fractions to ½. Since 1/3 < ½ and 2/3 > ½, I know 1/3 < 2/3."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          rows={3}
        />
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
            {!isCorrect && (
              <p className="text-sm text-gray-700 mt-2">
                <strong>Explanation:</strong> Use {currentExercise.method === 'benchmark' ? 'benchmarks (0, ½, 1)' : currentExercise.method === 'common-denominator' ? 'common denominators' : 'cross-multiplication'} to compare these fractions.
              </p>
            )}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {currentIndex < PRACTICE_EXERCISE_COUNT - 1 ? 'Next Exercise →' : 'Complete Practice'}
          </button>
        </div>
      )}
    </div>
  );
};

