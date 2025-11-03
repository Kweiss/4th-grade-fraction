import React from 'react';
import { Fraction, formatFraction, toDecimal } from '../utils/fractionUtils';

interface NumberLineProps {
  fraction1: Fraction;
  fraction2: Fraction;
  width?: number;
  height?: number;
  showDecimals?: boolean; // If false, hides decimal values that reveal the answer
}

export const NumberLine: React.FC<NumberLineProps> = ({ 
  fraction1, 
  fraction2, 
  width = 600, 
  height = 150,
  showDecimals = true 
}) => {
  const value1 = toDecimal(fraction1);
  const value2 = toDecimal(fraction2);
  const padding = 40;
  const lineY = height / 2;
  const lineStart = padding;
  const lineEnd = width - padding;
  const lineLength = lineEnd - lineStart;
  
  const position1 = lineStart + (value1 * lineLength);
  const position2 = lineStart + (value2 * lineLength);
  
  const maxValue = Math.max(value1, value2, 1);
  const displayMax = Math.ceil(maxValue * 2) / 2; // Round up to nearest 0.5
  const tickCount = Math.ceil(displayMax * 2) + 1;
  
  return (
    <div className="w-full flex flex-col items-center">
      <svg width={width} height={height} className="border border-gray-300 rounded-lg bg-white">
        {/* Main line */}
        <line
          x1={lineStart}
          y1={lineY}
          x2={lineEnd}
          y2={lineY}
          stroke="#2563eb"
          strokeWidth="3"
        />
        
        {/* Ticks and labels */}
        {Array.from({ length: tickCount }).map((_, i) => {
          const tickValue = (i / (tickCount - 1)) * displayMax;
          const tickX = lineStart + (tickValue / displayMax) * lineLength;
          const isWhole = tickValue % 1 === 0;
          
          return (
            <g key={i}>
              <line
                x1={tickX}
                y1={lineY - (isWhole ? 10 : 5)}
                x2={tickX}
                y2={lineY + (isWhole ? 10 : 5)}
                stroke={isWhole ? "#1e40af" : "#60a5fa"}
                strokeWidth={isWhole ? "2" : "1"}
              />
              {isWhole && (
                <text
                  x={tickX}
                  y={lineY + 30}
                  textAnchor="middle"
                  className="text-sm fill-gray-700"
                >
                  {tickValue}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Benchmark markers */}
        {displayMax >= 0.5 && (
          <>
            <line
              x1={lineStart + (0.5 / displayMax) * lineLength}
              y1={lineY - 15}
              x2={lineStart + (0.5 / displayMax) * lineLength}
              y2={lineY + 15}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.7"
            />
            <text
              x={lineStart + (0.5 / displayMax) * lineLength}
              y={lineY - 20}
              textAnchor="middle"
              className="text-xs fill-amber-600 font-semibold"
            >
              ½
            </text>
          </>
        )}
        
        {/* Fraction 1 marker */}
        <circle
          cx={position1}
          cy={lineY}
          r="8"
          fill="#ef4444"
          stroke="white"
          strokeWidth="2"
        />
        <text
          x={position1}
          y={lineY - 20}
          textAnchor="middle"
          className="text-sm font-bold fill-red-600"
        >
          {formatFraction(fraction1)}
        </text>
        {showDecimals && (
          <text
            x={position1}
            y={lineY + 45}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {value1.toFixed(2)}
          </text>
        )}
        
        {/* Fraction 2 marker */}
        <circle
          cx={position2}
          cy={lineY}
          r="8"
          fill="#10b981"
          stroke="white"
          strokeWidth="2"
        />
        <text
          x={position2}
          y={lineY - 20}
          textAnchor="middle"
          className="text-sm font-bold fill-green-600"
        >
          {formatFraction(fraction2)}
        </text>
        {showDecimals && (
          <text
            x={position2}
            y={lineY + 45}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {value2.toFixed(2)}
          </text>
        )}
      </svg>
    </div>
  );
};

