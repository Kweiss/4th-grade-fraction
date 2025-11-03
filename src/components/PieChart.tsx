import React from 'react';
import { Fraction, toDecimal, formatFraction } from '../utils/fractionUtils';

interface PieChartProps {
  fraction1: Fraction;
  fraction2: Fraction;
  size?: number;
  showComparison?: boolean; // If false, hides the answer comparison (for practice exercises)
}

export const PieChart: React.FC<PieChartProps> = ({ 
  fraction1, 
  fraction2, 
  size = 200,
  showComparison = true 
}) => {
  const value1 = toDecimal(fraction1);
  const value2 = toDecimal(fraction2);
  const center = size / 2;
  const radius = size * 0.4;
  
  // Calculate angles for pie slices (in radians)
  const angle1 = value1 * 2 * Math.PI;
  const angle2 = value2 * 2 * Math.PI;
  
  // Helper function to create SVG arc path
  const createArc = (startAngle: number, endAngle: number, fill: string, stroke: string) => {
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    
    return (
      <path
        d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
        opacity="0.8"
      />
    );
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-8">
        {/* Pie Chart for Fraction 1 */}
        <div className="flex flex-col items-center">
          <div className="text-lg font-bold text-red-600 mb-2">
            {formatFraction(fraction1)}
          </div>
          <svg width={size} height={size} className="border border-gray-300 rounded-lg bg-white shadow-sm">
            {/* Background circle (full 1) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="2"
            />
            {/* Filled portion for fraction 1 */}
            {createArc(
              -Math.PI / 2, // Start at top (12 o'clock)
              -Math.PI / 2 + angle1,
              '#ef4444',
              '#dc2626'
            )}
            {/* Value percentage in center */}
            <text
              x={center}
              y={center + 5}
              textAnchor="middle"
              className="text-sm font-semibold fill-gray-700"
              dominantBaseline="middle"
            >
              {(value1 * 100).toFixed(0)}%
            </text>
          </svg>
        </div>
        
        {/* Pie Chart for Fraction 2 */}
        <div className="flex flex-col items-center">
          <div className="text-lg font-bold text-green-600 mb-2">
            {formatFraction(fraction2)}
          </div>
          <svg width={size} height={size} className="border border-gray-300 rounded-lg bg-white shadow-sm">
            {/* Background circle (full 1) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="2"
            />
            {/* Filled portion for fraction 2 */}
            {createArc(
              -Math.PI / 2, // Start at top (12 o'clock)
              -Math.PI / 2 + angle2,
              '#10b981',
              '#059669'
            )}
            {/* Value percentage in center */}
            <text
              x={center}
              y={center + 5}
              textAnchor="middle"
              className="text-sm font-semibold fill-gray-700"
              dominantBaseline="middle"
            >
              {(value2 * 100).toFixed(0)}%
            </text>
          </svg>
        </div>
      </div>
      
      {/* Comparison indicator - only show if showComparison is true */}
      {showComparison && (
        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
          <span className={`px-3 py-1 rounded ${value1 < value2 ? 'bg-red-100 text-red-700' : value1 > value2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {formatFraction(fraction1)}
          </span>
          <span className="text-gray-500">
            {value1 < value2 ? '<' : value1 > value2 ? '>' : '='}
          </span>
          <span className={`px-3 py-1 rounded ${value2 < value1 ? 'bg-red-100 text-red-700' : value2 > value1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {formatFraction(fraction2)}
          </span>
        </div>
      )}
      {!showComparison && (
        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
          <span className="px-3 py-1 rounded bg-gray-100 text-gray-700">
            {formatFraction(fraction1)}
          </span>
          <span className="text-gray-500">?</span>
          <span className="px-3 py-1 rounded bg-gray-100 text-gray-700">
            {formatFraction(fraction2)}
          </span>
        </div>
      )}
    </div>
  );
};

