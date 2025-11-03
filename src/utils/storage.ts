import { Session, Progress, Metrics, ErrorLog } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'fraction_comparison_sessions',
  PROGRESS: 'fraction_comparison_progress',
  METRICS: 'fraction_comparison_metrics',
  ERROR_LOGS: 'fraction_comparison_error_logs',
};

export function saveSession(session: Session): void {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getSessions(): Session[] {
  const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export function getProgress(): Progress | null {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : null;
}

export function initializeProgress(): Progress {
  return {
    currentSession: 1,
    completedSessions: [],
    adaptiveDifficulty: 1,
    lastPracticeAccuracy: 0,
  };
}

export function getOrInitializeProgress(): Progress {
  const progress = getProgress();
  return progress || initializeProgress();
}

export function saveErrorLog(errorLog: ErrorLog): void {
  const logs = getErrorLogs();
  logs.push(errorLog);
  localStorage.setItem(STORAGE_KEYS.ERROR_LOGS, JSON.stringify(logs));
}

export function getErrorLogs(): ErrorLog[] {
  const data = localStorage.getItem(STORAGE_KEYS.ERROR_LOGS);
  return data ? JSON.parse(data) : [];
}

export function calculateMetrics(): Metrics {
  const sessions = getSessions();
  const errorLogs = getErrorLogs();
  
  // Calculate mastery rate (% achieving ≥90% by session 5)
  const session5Quizzes = sessions.filter(s => s.sessionNumber === 5 && s.quizScore !== undefined);
  const masteryCount = session5Quizzes.filter(s => (s.quizScore || 0) >= 90).length;
  const masteryRate = session5Quizzes.length > 0 ? (masteryCount / session5Quizzes.length) * 100 : 0;
  
  // Calculate error reduction (session-to-session drop)
  const errorRatesBySession: { [key: number]: number } = {};
  sessions.forEach(session => {
    if (session.exercises.length > 0) {
      const errorCount = session.exercises.filter(e => !e.isCorrect).length;
      errorRatesBySession[session.sessionNumber] = (errorCount / session.exercises.length) * 100;
    }
  });
  
  let errorReduction = 0;
  const sessionNumbers = Object.keys(errorRatesBySession).map(Number).sort((a, b) => a - b);
  if (sessionNumbers.length >= 2) {
    const firstRate = errorRatesBySession[sessionNumbers[0]];
    const lastRate = errorRatesBySession[sessionNumbers[sessionNumbers.length - 1]];
    errorReduction = firstRate > 0 ? ((firstRate - lastRate) / firstRate) * 100 : 0;
  }
  
  // Calculate engagement efficiency (% sessions in 30-60 min)
  const completedSessions = sessions.filter(s => s.completed && s.endTime && s.startTime);
  const durationInRange = completedSessions.filter(s => {
    const duration = ((s.endTime || 0) - s.startTime) / (1000 * 60); // minutes
    return duration >= 30 && duration <= 60;
  }).length;
  const engagementEfficiency = completedSessions.length > 0 
    ? (durationInRange / completedSessions.length) * 100 
    : 0;
  
  return {
    masteryRate,
    errorReduction,
    engagementEfficiency,
    sessions,
    errorLogs,
  };
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

