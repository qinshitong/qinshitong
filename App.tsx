import React, { useState } from 'react';
import { AppMode, MultiplicationFact } from './types';
import { MultiplicationGrid } from './components/MultiplicationGrid';
import { VisualExplainer } from './components/VisualExplainer';
import { QuizMode } from './components/QuizMode';
import { AITutor } from './components/AITutor';
import { Grid, GraduationCap, BrainCircuit, MessageCircleHeart } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GRID);
  const [selectedFact, setSelectedFact] = useState<MultiplicationFact | null>(null);

  const handleSelectFact = (fact: MultiplicationFact) => {
    setSelectedFact(fact);
    setMode(AppMode.LEARN);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.GRID:
        return <MultiplicationGrid onSelectFact={handleSelectFact} />;
      case AppMode.LEARN:
        return selectedFact 
          ? <VisualExplainer fact={selectedFact} onBack={() => setMode(AppMode.GRID)} />
          : <div className="text-center p-8">Select a number from the grid first!</div>;
      case AppMode.QUIZ:
        return <QuizMode />;
      case AppMode.TUTOR:
        return <AITutor />;
      default:
        return <MultiplicationGrid onSelectFact={handleSelectFact} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-candy-pink tracking-tight">
            Tangtang's Math <span className="text-candy-blue">Adventure</span>
          </h1>
          <div className="hidden md:flex space-x-4">
             {/* Desktop Nav */}
             <NavButton active={mode === AppMode.GRID} onClick={() => setMode(AppMode.GRID)} icon={<Grid size={18}/>} label="Table" />
             <NavButton active={mode === AppMode.QUIZ} onClick={() => setMode(AppMode.QUIZ)} icon={<GraduationCap size={18}/>} label="Quiz" />
             <NavButton active={mode === AppMode.TUTOR} onClick={() => setMode(AppMode.TUTOR)} icon={<MessageCircleHeart size={18}/>} label="AI Tutor" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50 pb-safe">
        <MobileNavButton active={mode === AppMode.GRID || mode === AppMode.LEARN} onClick={() => setMode(AppMode.GRID)} icon={<Grid size={24}/>} label="Table" />
        <MobileNavButton active={mode === AppMode.QUIZ} onClick={() => setMode(AppMode.QUIZ)} icon={<GraduationCap size={24}/>} label="Quiz" />
        <MobileNavButton active={mode === AppMode.TUTOR} onClick={() => setMode(AppMode.TUTOR)} icon={<MessageCircleHeart size={24}/>} label="AI Tutor" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-full font-bold transition-all
      ${active ? 'bg-candy-pink text-white shadow-md transform scale-105' : 'text-gray-500 hover:bg-gray-100'}
    `}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-1
      ${active ? 'text-candy-pink' : 'text-gray-400'}
    `}
  >
    <div className={`${active ? 'transform scale-110 transition-transform' : ''}`}>{icon}</div>
    <span className="text-[10px] font-bold mt-1">{label}</span>
  </button>
);

export default App;
