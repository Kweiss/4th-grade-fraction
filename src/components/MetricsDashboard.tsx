import React from 'react';
import { calculateMetrics } from '../utils/storage';

export const MetricsDashboard: React.FC = () => {
  const metrics = calculateMetrics();

  const getMasteryStatus = () => {
    if (metrics.masteryRate >= 75) return { status: 'success', bgColor: 'bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-600', icon: '✓' };
    if (metrics.masteryRate < 50) return { status: 'failure', bgColor: 'bg-red-50', borderColor: 'border-red-500', textColor: 'text-red-600', icon: '✗' };
    return { status: 'warning', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500', textColor: 'text-yellow-600', icon: '⚠' };
  };

  const getErrorReductionStatus = () => {
    if (metrics.errorReduction >= 40) return { status: 'success', bgColor: 'bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-600', icon: '✓' };
    if (metrics.errorReduction < 20) return { status: 'failure', bgColor: 'bg-red-50', borderColor: 'border-red-500', textColor: 'text-red-600', icon: '✗' };
    return { status: 'warning', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500', textColor: 'text-yellow-600', icon: '⚠' };
  };

  const getEngagementStatus = () => {
    if (metrics.engagementEfficiency >= 90) return { status: 'success', bgColor: 'bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-600', icon: '✓' };
    if (metrics.engagementEfficiency < 70) return { status: 'failure', bgColor: 'bg-red-50', borderColor: 'border-red-500', textColor: 'text-red-600', icon: '✗' };
    return { status: 'warning', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500', textColor: 'text-yellow-600', icon: '⚠' };
  };

  const masteryStatus = getMasteryStatus();
  const errorStatus = getErrorReductionStatus();
  const engagementStatus = getEngagementStatus();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Learning Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Mastery Rate */}
        <div className={`${masteryStatus.bgColor} border-l-4 ${masteryStatus.borderColor} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Mastery Rate</h3>
            <span className={`text-2xl ${masteryStatus.textColor}`}>{masteryStatus.icon}</span>
          </div>
          <div className={`text-4xl font-bold ${masteryStatus.textColor} mb-2`}>
            {metrics.masteryRate.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600 mb-2">
            % achieving ≥90% by session 5
          </p>
          <div className="text-xs text-gray-500">
            {masteryStatus.status === 'success' && '✓ Success: ≥75%'}
            {masteryStatus.status === 'failure' && '✗ Failure: <50%'}
            {masteryStatus.status === 'warning' && '⚠ Needs Improvement'}
          </div>
        </div>

        {/* Error Reduction */}
        <div className={`${errorStatus.bgColor} border-l-4 ${errorStatus.borderColor} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Error Reduction</h3>
            <span className={`text-2xl ${errorStatus.textColor}`}>{errorStatus.icon}</span>
          </div>
          <div className={`text-4xl font-bold ${errorStatus.textColor} mb-2`}>
            {metrics.errorReduction.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Session-to-session drop
          </p>
          <div className="text-xs text-gray-500">
            {errorStatus.status === 'success' && '✓ Success: ≥40%'}
            {errorStatus.status === 'failure' && '✗ Failure: <20%'}
            {errorStatus.status === 'warning' && '⚠ Needs Improvement'}
          </div>
        </div>

        {/* Engagement Efficiency */}
        <div className={`${engagementStatus.bgColor} border-l-4 ${engagementStatus.borderColor} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Engagement Efficiency</h3>
            <span className={`text-2xl ${engagementStatus.textColor}`}>{engagementStatus.icon}</span>
          </div>
          <div className={`text-4xl font-bold ${engagementStatus.textColor} mb-2`}>
            {metrics.engagementEfficiency.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600 mb-2">
            % sessions in 30-60 min
          </p>
          <div className="text-xs text-gray-500">
            {engagementStatus.status === 'success' && '✓ Success: ≥90%'}
            {engagementStatus.status === 'failure' && '✗ Failure: <70%'}
            {engagementStatus.status === 'warning' && '⚠ Needs Improvement'}
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Session History</h3>
        {metrics.sessions.length === 0 ? (
          <p className="text-gray-600">No sessions completed yet.</p>
        ) : (
          <div className="space-y-3">
            {metrics.sessions.map((session) => {
              const duration = session.endTime && session.startTime
                ? ((session.endTime - session.startTime) / (1000 * 60)).toFixed(0)
                : '-';
              const practiceAccuracy = session.exercises.length > 0
                ? (session.exercises.filter(e => e.isCorrect).length / session.exercises.length) * 100
                : 0;

              return (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-800">
                        Session {session.sessionNumber}
                      </span>
                      <span className={`ml-4 px-2 py-1 rounded text-sm ${
                        session.quizPassed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {session.quizPassed ? 'Passed' : 'In Progress/Failed'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-x-4">
                      <span>Quiz: {session.quizScore?.toFixed(0) || '-'}%</span>
                      <span>Practice: {practiceAccuracy.toFixed(0)}%</span>
                      <span>Duration: {duration} min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Metric Table */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Success Criteria Reference</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success (≥)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Failure (&lt;)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Mastery Rate</td>
                <td className="px-4 py-3 text-sm text-gray-700">{metrics.masteryRate.toFixed(1)}%</td>
                <td className="px-4 py-3 text-sm text-green-600">≥75%</td>
                <td className="px-4 py-3 text-sm text-red-600">&lt;50%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Error Reduction</td>
                <td className="px-4 py-3 text-sm text-gray-700">{metrics.errorReduction.toFixed(1)}%</td>
                <td className="px-4 py-3 text-sm text-green-600">≥40%</td>
                <td className="px-4 py-3 text-sm text-red-600">&lt;20%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Engagement Efficiency</td>
                <td className="px-4 py-3 text-sm text-gray-700">{metrics.engagementEfficiency.toFixed(1)}%</td>
                <td className="px-4 py-3 text-sm text-green-600">≥90%</td>
                <td className="px-4 py-3 text-sm text-red-600">&lt;70%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

