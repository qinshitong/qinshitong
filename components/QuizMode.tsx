import React, { useState, useEffect, useCallback } from 'react';
import { Star, Trophy, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import ReactConfetti from 'react-confetti'; // Actually, I cannot add new packages. I will simulate confetti or just use CSS animations. I'll use simple CSS animation instead.

// Simple helper to get random int
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const QuizMode: React.FC = () => {
  const [question, setQuestion] = useState<{ a: number; b: number } | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showWin, setShowWin] = useState(false);

  const generateQuestion = useCallback(() => {
    const a = getRandomInt(1, 9);
    const b = getRandomInt(1, 9);
    const correct = a * b;
    
    // Generate distractors
    const wrong1 = correct + getRandomInt(1, 5);
    const wrong2 = Math.max(1, correct - getRandomInt(1, 5));
    const wrong3 = (a + 1) * b; // Common mistake pattern
    
    const opts = Array.from(new Set([correct, wrong1, wrong2, wrong3]))
        .filter(n => n !== correct)
        .slice(0, 3);
    
    opts.push(correct);
    // Shuffle
    setOptions(opts.sort(() => Math.random() - 0.5));
    setQuestion({ a, b });
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (ans: number) => {
    if (!question) return;
    if (feedback !== null) return; // Prevent double clicking

    if (ans === question.a * question.b) {
      setFeedback('correct');
      setScore(s => s + 10);
      setStreak(s => s + 1);
      if (streak + 1 > 0 && (streak + 1) % 5 === 0) {
          setShowWin(true);
          setTimeout(() => setShowWin(false), 3000);
      }
      setTimeout(generateQuestion, 1500);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setTimeout(generateQuestion, 2000);
    }
  };

  if (!question) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto w-full p-4 flex flex-col items-center relative">
      {showWin && (
         <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-50">
             <div className="text-6xl animate-bounce">🎉 ⭐ 🎉</div>
         </div>
      )}

      <div className="flex justify-between w-full mb-6 px-4">
        <div className="flex items-center text-yellow-500 font-bold text-xl">
            <Trophy className="mr-2" />
            {score}
        </div>
        <div className="flex items-center text-orange-400 font-bold text-xl">
            <span className="mr-2">🔥</span>
            {streak} Streak
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full text-center border-b-8 border-candy-pink relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-4 bg-candy-pink"></div>
         
         <h2 className="text-gray-500 mb-2 uppercase tracking-wider text-sm font-bold">Question</h2>
         <div className="text-6xl font-black text-gray-800 mb-8">
             {question.a} × {question.b} = ?
         </div>

         <div className="grid grid-cols-2 gap-4">
             {options.map((opt) => (
                 <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className={`p-4 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md
                        ${feedback === null 
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                            : (opt === question.a * question.b 
                                ? 'bg-green-400 text-white shadow-green-200' 
                                : (feedback === 'wrong' ? 'bg-gray-100 text-gray-300' : 'bg-blue-50 text-blue-600')
                            )
                        }
                        ${feedback === 'wrong' && opt !== question.a * question.b ? 'opacity-50' : ''}
                    `}
                    disabled={feedback !== null}
                 >
                    {opt}
                 </button>
             ))}
         </div>

         {feedback === 'correct' && (
             <div className="mt-6 text-green-500 font-bold text-xl animate-bounce flex justify-center items-center">
                 <CheckCircle className="mr-2" /> Awesome! (太棒了!)
             </div>
         )}
         {feedback === 'wrong' && (
             <div className="mt-6 text-red-400 font-bold text-xl animate-pulse flex justify-center items-center">
                 <XCircle className="mr-2" /> Try again! (The answer is {question.a * question.b})
             </div>
         )}
      </div>

      <button 
        onClick={generateQuestion}
        className="mt-8 text-gray-400 hover:text-gray-600 flex items-center text-sm font-bold"
      >
        <RefreshCw size={16} className="mr-1" /> Skip this one
      </button>
    </div>
  );
};
