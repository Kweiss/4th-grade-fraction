import React, { useState } from 'react';
import { Fraction, ComparisonMethod, compareFractions } from '../utils/fractionUtils';
import { NumberLine } from './NumberLine';
import { PieChart } from './PieChart';

interface InstructionProps {
  method: ComparisonMethod;
  onComplete: () => void;
}

const exampleFractions: Record<ComparisonMethod, { f1: Fraction; f2: Fraction }> = {
  'benchmark': { f1: { numerator: 1, denominator: 3 }, f2: { numerator: 2, denominator: 3 } },
  'common-denominator': { f1: { numerator: 3, denominator: 4 }, f2: { numerator: 5, denominator: 6 } },
  'cross-multiplication': { f1: { numerator: 2, denominator: 5 }, f2: { numerator: 3, denominator: 7 } },
};

export const Instruction: React.FC<InstructionProps> = ({ method, onComplete }) => {
  const [step, setStep] = useState(0);
  const example = exampleFractions[method];
  
  const renderContent = () => {
    switch (method) {
      case 'benchmark':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Method 1: Using Benchmarks</h3>
            <p className="text-lg text-gray-700">
              Benchmarks are helpful reference points: <strong>0</strong>, <strong>½</strong>, and <strong>1</strong>.
            </p>
            
            {step >= 1 && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">Example: Compare 1/3 and 2/3</h4>
                <div className="mb-4">
                  <NumberLine fraction1={example.f1} fraction2={example.f2} />
                </div>
                <div className="mb-4">
                  <PieChart fraction1={example.f1} fraction2={example.f2} />
                </div>
                <div className="mt-4 space-y-2 text-gray-700">
                  <p>• 1/3 is less than ½ (benchmark)</p>
                  <p>• 2/3 is greater than ½ (benchmark)</p>
                  <p>• Since 1/3 &lt; ½ and 2/3 &gt; ½, we know: <strong>1/3 &lt; 2/3</strong></p>
                  <p className="text-sm text-gray-600 mt-2">💡 Notice how the pie charts show 1/3 fills less of the circle than 2/3!</p>
                </div>
              </div>
            )}
            
            {step >= 2 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Strategy:</strong> Compare each fraction to ½. If one is less than ½ and the other is greater, you immediately know which is larger!
                </p>
              </div>
            )}
          </div>
        );
        
      case 'common-denominator':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Method 2: Common Denominators</h3>
            <p className="text-lg text-gray-700">
              Make the denominators the same, then compare the numerators.
            </p>
            
            {step >= 1 && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">Example: Compare 3/4 and 5/6</h4>
                <div className="mb-4">
                  <NumberLine fraction1={example.f1} fraction2={example.f2} />
                </div>
                <div className="mb-4">
                  <PieChart fraction1={example.f1} fraction2={example.f2} />
                </div>
                <div className="mt-4 space-y-3 text-gray-700">
                  <div>
                    <p className="font-semibold">Step 1: Find a common denominator</p>
                    <p>4 and 6 → The LCM is 12</p>
                  </div>
                  <div>
                    <p className="font-semibold">Step 2: Convert both fractions</p>
                    <p>3/4 = (3 × 3)/(4 × 3) = <strong>9/12</strong></p>
                    <p>5/6 = (5 × 2)/(6 × 2) = <strong>10/12</strong></p>
                  </div>
                  <div>
                    <p className="font-semibold">Step 3: Compare numerators</p>
                    <p>Since 9 &lt; 10, we have: <strong>3/4 &lt; 5/6</strong></p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">💡 The pie charts visually show that 5/6 fills more of the circle than 3/4!</p>
                </div>
              </div>
            )}
            
            {step >= 2 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Tip:</strong> Always show your work! Write out the conversion steps clearly.
                </p>
              </div>
            )}
          </div>
        );
        
      case 'cross-multiplication':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Method 3: Cross-Multiplication</h3>
            <p className="text-lg text-gray-700">
              Multiply diagonally across and compare the products.
            </p>
            
            {step >= 1 && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">Example: Compare 2/5 and 3/7</h4>
                <div className="mb-4">
                  <NumberLine fraction1={example.f1} fraction2={example.f2} />
                </div>
                <div className="mb-4">
                  <PieChart fraction1={example.f1} fraction2={example.f2} />
                </div>
                <div className="mt-4 space-y-3 text-gray-700">
                  <div>
                    <p className="font-semibold">Step 1: Cross-multiply</p>
                    <div className="bg-white p-3 rounded border">
                      <p className="font-mono text-lg">
                        2/5 ? 3/7
                      </p>
                      <p className="mt-2">2 × 7 = <strong>14</strong> (left fraction)</p>
                      <p>3 × 5 = <strong>15</strong> (right fraction)</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Step 2: Compare the products</p>
                    <p>Since 14 &lt; 15, we have: <strong>2/5 &lt; 3/7</strong></p>
                    <p className="text-sm text-gray-600 mt-2">
                      Rule: If left product &lt; right product, then left fraction &lt; right fraction
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">💡 Both visual guides (number line and pie charts) confirm that 2/5 is smaller than 3/7!</p>
                </div>
              </div>
            )}
            
            {step >= 2 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Remember:</strong> Cross-multiplication works because you're comparing a/b with c/d by comparing a×d with b×c.
                </p>
              </div>
            )}
          </div>
        );
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {renderContent()}
      
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        
        <div className="flex space-x-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full ${
                s <= step ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {step < 2 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            I Understand ✓
          </button>
        )}
      </div>
    </div>
  );
};

