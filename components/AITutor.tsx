import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getTutorResponse } from '../services/geminiService';
import { Send, Cat, Sparkles } from 'lucide-react';

export const AITutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello Tangtang! I am Smarty Cat 🐱. Ask me anything about math!' }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    // Construct history for context (last 5 messages)
    const history = messages.slice(-5).map(m => m.text);
    
    const responseText = await getTutorResponse(userText, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-candy-purple">
      {/* Header */}
      <div className="bg-candy-purple p-4 flex items-center text-white">
        <div className="bg-white p-2 rounded-full mr-3">
            <Cat className="text-candy-purple" size={24} />
        </div>
        <div>
            <h3 className="font-bold text-lg">Smarty Cat Tutor</h3>
            <p className="text-xs text-purple-100">Ask me "Why is 2x2=4?"</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-purple-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm md:text-base leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-candy-purple text-white rounded-tr-none' 
                : 'bg-white text-gray-700 shadow-sm rounded-tl-none border border-purple-100'
              }`}
            >
               {msg.text}
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                   <Sparkles className="animate-spin text-yellow-400" size={16} />
                   <span className="text-gray-400 text-xs">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-purple-100">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a math question..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`ml-2 p-2 rounded-full transition-colors ${input.trim() ? 'bg-candy-purple text-white hover:bg-purple-400' : 'bg-gray-200 text-gray-400'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
