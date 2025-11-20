import React from 'react';
import { SwitchConsole } from './components/SwitchConsole';
import { Keyboard } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#222] text-white overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#111] to-transparent"></div>
      </div>

      <div className="z-10 scale-[0.8] md:scale-100 transition-transform">
        <SwitchConsole />
      </div>

      <div className="mt-12 z-10 opacity-60 text-sm flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
          <Keyboard size={16} />
          <span>Keyboard Controls Supported</span>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-400">
          <span>WASD / Arrows : Move</span>
          <span>L/K/J/I : A/B/Y/X</span>
          <span>Enter : Start (+)</span>
          <span>Backspace : Select (-)</span>
        </div>
      </div>
    </div>
  );
};

export default App;