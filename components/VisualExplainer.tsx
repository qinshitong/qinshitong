import React from 'react';
import { MultiplicationFact } from '../types';
import { ArrowLeft, Zap } from 'lucide-react';

interface VisualExplainerProps {
  fact: MultiplicationFact;
  onBack: () => void;
}

export const VisualExplainer: React.FC<VisualExplainerProps> = ({ fact, onBack }) => {
  const { a, b, result, chineseText } = fact;

  // Select a random emoji for this session of visualization
  const emojis = ['🍎', '⭐️', '🐱', '🎈', '🍪', '🌸', '🚙'];
  const emoji = emojis[(a + b) % emojis.length];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in-up">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center px-4 py-2 bg-white text-candy-pink font-bold rounded-full shadow-md hover:bg-candy-pink hover:text-white transition-colors"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Grid / 返回
      </button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-candy-green">
        <div className="bg-candy-green p-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-700 mb-2">
            {a} <span className="text-gray-400">×</span> {b} <span className="text-gray-400">=</span> {result}
          </h2>
          <p className="text-2xl font-bold text-green-700 tracking-widest mt-2">{chineseText}</p>
        </div>

        <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                
                {/* Explanation Text */}
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-600 mb-4 flex items-center justify-center md:justify-start">
                        <Zap className="text-yellow-400 mr-2" fill="currentColor" />
                        What does it mean?
                    </h3>
                    <p className="text-xl text-gray-600 mb-2">
                        It means <strong className="text-candy-pink">{a}</strong> groups of <strong className="text-candy-blue">{b}</strong>!
                    </p>
                    <p className="text-lg text-gray-400">
                        (也就是 {a} 个 {b})
                    </p>
                </div>

                {/* Visual Grid */}
                <div className="flex-1 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: a }).map((_, rowIdx) => (
                            <div key={rowIdx} className="flex items-center gap-2">
                                <span className="font-bold text-gray-400 w-6 text-right">{rowIdx + 1}:</span>
                                <div className="flex gap-2 flex-wrap bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-200">
                                    {Array.from({ length: b }).map((_, colIdx) => (
                                        <span key={colIdx} className="text-2xl animate-bounce-slight" style={{ animationDelay: `${(rowIdx * b + colIdx) * 50}ms` }}>
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-right text-gray-400 text-sm">
                        Total count: {result} {emoji}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
