import React, { useState } from 'react';
import { MultiplicationFact } from '../types';
import { X, MousePointerClick } from 'lucide-react';

interface MultiplicationGridProps {
  onSelectFact: (fact: MultiplicationFact) => void;
}

const CHINESE_NUMBERS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

const getChineseMultiplicationText = (a: number, b: number): string => {
  const product = a * b;
  const aText = CHINESE_NUMBERS[a];
  const bText = CHINESE_NUMBERS[b];
  
  let productText = '';
  if (product < 10) {
    productText = '得' + CHINESE_NUMBERS[product];
  } else if (product === 10) {
     productText = '一十'; // Though usually displayed as just 十 in some contexts, usually 一二得二, 二五一十
  } else {
     const tens = Math.floor(product / 10);
     const units = product % 10;
     productText = (tens > 1 ? CHINESE_NUMBERS[tens] : '') + '十' + (units > 0 ? CHINESE_NUMBERS[units] : '');
     
     // Specific traditional phrasing adjustments
     if (product === 10) productText = '一十';
     if (product === 20) productText = '二十';
     // etc. simplified: usually we just want the result number for the grid, 
     // but for the chant:
  }
  
  // Simplified Logic for the "Chant" (Kou Jue)
  // Rules: Small number first. e.g. 3*4 -> 三四十二
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  
  const minChar = CHINESE_NUMBERS[min];
  const maxChar = CHINESE_NUMBERS[max];
  
  let resultPart = '';
  if (min * max < 10) {
      resultPart = '得' + CHINESE_NUMBERS[min * max];
  } else {
      resultPart = (min * max).toString().split('').map(d => {
          if(d === '0') return '十'; // 20 -> 二十
          return CHINESE_NUMBERS[parseInt(d)];
      }).join('');
      if((min*max) % 10 === 0) resultPart = CHINESE_NUMBERS[(min*max)/10] + '十';
      else {
        // 12 -> 一二 (Incorrect for result), should be 十二
        // Re-mapping strictly for standard koujue
        const p = min * max;
        if (p < 20) resultPart = '十' + CHINESE_NUMBERS[p%10];
        else {
            const t = Math.floor(p/10);
            const u = p%10;
            resultPart = CHINESE_NUMBERS[t] + '十' + (u>0?CHINESE_NUMBERS[u]:'');
        }
      }
  }

  return `${minChar}${maxChar}${resultPart}`;
};


export const MultiplicationGrid: React.FC<MultiplicationGridProps> = ({ onSelectFact }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-candy-blue max-w-full overflow-x-auto">
        <div className="flex items-center justify-center mb-4 space-x-2 text-gray-500">
            <MousePointerClick size={20} />
            <span className="text-sm">点击格子查看详情 / Click a box to learn!</span>
        </div>
        
        <div className="inline-block min-w-max">
            {/* Header Row */}
            <div className="flex">
            <div className="w-12 h-12 flex items-center justify-center font-bold text-gray-400">
                <X size={20} />
            </div>
            {numbers.map((col) => (
                <div
                key={`h-${col}`}
                className={`w-12 h-12 flex items-center justify-center font-bold text-xl rounded-t-lg transition-colors
                    ${hoveredCol === col ? 'bg-candy-orange text-white' : 'text-candy-pink'}`}
                >
                {col}
                </div>
            ))}
            </div>

            {/* Grid Body */}
            {numbers.map((row) => (
            <div key={`row-${row}`} className="flex">
                {/* Row Header */}
                <div
                className={`w-12 h-12 flex items-center justify-center font-bold text-xl rounded-l-lg transition-colors
                    ${hoveredRow === row ? 'bg-candy-orange text-white' : 'text-candy-pink'}`}
                >
                {row}
                </div>

                {/* Cells */}
                {numbers.map((col) => {
                    // Staircase effect: typically Chinese tables show only col <= row or row <= col. 
                    // Let's show full grid but dim the duplicates for clarity, or keep full for symmetry.
                    // Let's do full grid for interaction.
                    const isDiagonal = row === col;
                    const isActive = (hoveredRow === row && hoveredCol && hoveredCol >= col) || (hoveredCol === col && hoveredRow && hoveredRow >= row);
                    
                    return (
                        <button
                        key={`${row}-${col}`}
                        className={`w-12 h-12 border-2 m-0.5 rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-200
                            ${isDiagonal ? 'border-candy-purple bg-candy-purple/20' : 'border-gray-100 bg-white'}
                            ${hoveredRow === row || hoveredCol === col ? 'bg-candy-blue/30 scale-105 shadow-md z-10' : ''}
                            hover:bg-candy-orange hover:text-white hover:border-candy-orange
                        `}
                        onMouseEnter={() => {
                            setHoveredRow(row);
                            setHoveredCol(col);
                        }}
                        onMouseLeave={() => {
                            setHoveredRow(null);
                            setHoveredCol(null);
                        }}
                        onClick={() => onSelectFact({
                            a: row,
                            b: col,
                            result: row * col,
                            chineseText: getChineseMultiplicationText(row, col)
                        })}
                        >
                        {row * col}
                        </button>
                    );
                })}
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};
