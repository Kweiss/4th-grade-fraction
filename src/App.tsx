import React, { useState, useEffect } from 'react';
import { SessionView } from './components/SessionView';
import { MetricsDashboard } from './components/MetricsDashboard';
import { getOrInitializeProgress } from './utils/storage';

type AppView = 'home' | 'session' | 'metrics';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [currentSession, setCurrentSession] = useState(1);
  const progress = getOrInitializeProgress();

  useEffect(() => {
    if (progress.currentSession > 1) {
      setCurrentSession(progress.currentSession);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartSession = (sessionNumber: number) => {
    setCurrentSession(sessionNumber);
    setView('session');
  };

  const handleSessionComplete = () => {
    if (currentSession < 5) {
      setCurrentSession(currentSession + 1);
    } else {
      setView('metrics');
    }
  };

  if (view === 'session') {
    return <SessionView sessionNumber={currentSession} onSessionComplete={handleSessionComplete} />;
  }

  if (view === 'metrics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8">
        <div className="max-w-6xl mx-auto mb-6 text-center">
          <button
            onClick={() => setView('home')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
        <MetricsDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            4th Grade fraction example work exercise - kbw
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Learn to compare fractions using three easy methods
          </p>
          <p className="text-lg text-gray-500">
            Fun lessons with pictures • Practice problems • Final tests
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Program Overview</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📚</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">5 Learning Sessions</h3>
                <p>Each session teaches you how to compare fractions, then you practice, and finally take a test.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Three Ways to Compare</h3>
                <p>Learn to use benchmarks (0, ½, 1), make the bottom numbers the same, or multiply across.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🧠</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Practice That Helps You Learn</h3>
                <p>The practice problems get harder or easier based on how you're doing, so you're always learning!</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">✓</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Final Tests</h3>
                <p>Get 90% or higher to pass! If you need more help, we'll review and practice together.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">⏱️</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Time Limits</h3>
                <p>Sessions are designed to take 30-60 minutes to complete.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[1, 2, 3, 4, 5].map((sessionNum) => {
              const isCompleted = progress.completedSessions.includes(sessionNum);
              const isCurrent = progress.currentSession === sessionNum;
              const isLocked = sessionNum > progress.currentSession;

              return (
                <button
                  key={sessionNum}
                  onClick={() => !isLocked && handleStartSession(sessionNum)}
                  disabled={isLocked}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : isLocked
                      ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-2xl font-bold mb-1">{sessionNum}</div>
                  <div className="text-sm">
                    {isCompleted ? '✓ Complete' : isCurrent ? 'Continue' : isLocked ? 'Locked' : 'Start'}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-center">
            <button
              onClick={() => setView('metrics')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              See How You're Doing
            </button>
          </div>
        </div>

        {progress.currentSession > 1 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Ready to Continue?</h3>
            <p className="text-blue-800 mb-4">
              You're on Session {progress.currentSession}. Click the session card above to continue your learning journey!
            </p>
            <button
              onClick={() => handleStartSession(progress.currentSession)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Session {progress.currentSession}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
