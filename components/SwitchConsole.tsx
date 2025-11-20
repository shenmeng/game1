import React, { useState, useEffect } from 'react';
import { useControls } from '../hooks/useControls';
import { ButtonType, AppState } from '../types';
import { GAMES } from '../constants';
import { MarioGame } from './games/MarioGame';
import { PokemonGame } from './games/PokemonGame';
import { RacingGame } from './games/RacingGame';
import { FighterGame } from './games/FighterGame';
import { Wifi, Battery, Volume2, Settings, RotateCcw, Maximize } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const SwitchConsole: React.FC = () => {
  const controls = useControls();
  const [currentApp, setCurrentApp] = useState<AppState>(AppState.HOME);
  const [selectedGameIdx, setSelectedGameIdx] = useState(0);
  const [isSleep, setIsSleep] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  // Navigation Logic for Home Screen
  useEffect(() => {
    if (currentApp !== AppState.HOME || isSleep) return;

    if (controls.isPressed(ButtonType.RIGHT)) {
       setSelectedGameIdx(prev => (prev + 1) % GAMES.length);
       controls.release(ButtonType.RIGHT); // Debounce hack
    }
    if (controls.isPressed(ButtonType.LEFT)) {
       setSelectedGameIdx(prev => (prev - 1 + GAMES.length) % GAMES.length);
       controls.release(ButtonType.LEFT);
    }
    if (controls.isPressed(ButtonType.A)) {
       setCurrentApp(GAMES[selectedGameIdx].id);
       controls.release(ButtonType.A);
    }
  }, [controls.activeButtons, currentApp, isSleep, selectedGameIdx, controls]);

  // Global Shortcuts
  useEffect(() => {
    if (controls.isPressed(ButtonType.HOME)) {
      setCurrentApp(AppState.HOME);
    }
    if (controls.isPressed(ButtonType.PLUS)) {
       // Simulate Sleep Toggle
       setIsSleep(prev => !prev);
       controls.release(ButtonType.PLUS);
    }
  }, [controls.activeButtons, controls]);

  const renderScreenContent = () => {
    if (isSleep) return <div className="w-full h-full bg-black flex items-center justify-center"><Battery className="text-green-500 w-12 h-12 animate-pulse"/></div>;

    switch (currentApp) {
      case AppState.HOME:
        return (
          <div className="w-full h-full bg-[#ebebeb] flex flex-col relative overflow-hidden">
            {/* Status Bar */}
            <div className="h-12 flex justify-between items-center px-6 pt-2 text-gray-800 z-10">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border border-gray-400">
                    <img src={`https://picsum.photos/50/50?random=1`} alt="User" />
                 </div>
               </div>
               <div className="flex items-center gap-4 text-sm font-bold">
                 <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                 <Wifi size={18} />
                 <div className="flex items-center gap-1"><span className="text-xs">89%</span><Battery size={18} /></div>
               </div>
            </div>
            
            {/* Game Carousel */}
            <div className="flex-1 flex items-center pl-16 gap-8 overflow-visible">
              {GAMES.map((game, idx) => {
                const isSelected = idx === selectedGameIdx;
                return (
                  <motion.div 
                    key={game.id}
                    className={`relative transition-all duration-300 ${isSelected ? 'w-64 h-64' : 'w-48 h-48 opacity-70'}`}
                    animate={{ scale: isSelected ? 1.1 : 1 }}
                  >
                     <div className={`w-full h-full rounded-xl shadow-xl bg-gradient-to-br ${game.color} flex flex-col items-center justify-center text-white border-4 ${isSelected ? 'border-[#00c3e3]' : 'border-transparent'}`}>
                        <span className="text-6xl mb-4">{game.icon}</span>
                        {isSelected && (
                          <div className="absolute -bottom-12 left-0 right-0 text-center">
                            <h3 className="text-gray-800 font-bold text-xl truncate">{game.title}</h3>
                            <div className="text-gray-500 text-xs font-bold tracking-wider">NINTENDO</div>
                          </div>
                        )}
                     </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom Actions */}
            <div className="h-16 border-t border-gray-300 flex items-center justify-between px-8">
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-500"><RotateCcw size={20}/></div>
                 <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-500"><Settings size={20}/></div>
               </div>
               <div className="flex gap-6 text-gray-600 text-sm font-bold">
                  <span className="flex items-center gap-1"><span className="bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">A</span> Start</span>
               </div>
            </div>
          </div>
        );
      case AppState.GAME_MARIO: return <MarioGame isPressed={controls.isPressed} />;
      case AppState.GAME_POKEMON: return <PokemonGame isPressed={controls.isPressed} />;
      case AppState.GAME_RACING: return <RacingGame isPressed={controls.isPressed} />;
      case AppState.GAME_FIGHTER: return <FighterGame isPressed={controls.isPressed} />;
      default: return null;
    }
  };

  // Helper to render buttons
  const JoyBtn = ({ type, className, label }: { type: ButtonType, className: string, label?: string }) => (
    <motion.button 
       className={`${className} absolute flex items-center justify-center text-[10px] font-bold text-white/80 transition-colors 
                   ${controls.isPressed(type) ? 'bg-white/40 scale-95 shadow-inner' : 'bg-gray-900/20 shadow-lg'}`}
       onMouseDown={() => controls.press(type)}
       onMouseUp={() => controls.release(type)}
       whileTap={{ scale: 0.9 }}
    >
      {label || type}
    </motion.button>
  );

  return (
    <div className="relative w-full max-w-[900px] aspect-[1.8] bg-gray-900 rounded-[40px] shadow-2xl flex p-2 select-none border-b-8 border-gray-800">
      {/* Top Buttons */}
      <div className="absolute -top-2 left-24 w-24 h-2 bg-gray-800 rounded-t-lg border-t border-gray-600"></div>
      <div className="absolute -top-2 left-8 w-12 h-3 bg-gradient-to-b from-red-500 to-red-700 rounded-t hover:mt-1 transition-all cursor-pointer border-t border-red-400 shadow z-[-1]" /> {/* L */}
      <div className="absolute -top-2 right-8 w-12 h-3 bg-gradient-to-b from-blue-500 to-blue-700 rounded-t hover:mt-1 transition-all cursor-pointer border-t border-blue-400 shadow z-[-1]" /> {/* R */}
      
      {/* Volume Rocker */}
      <div className="absolute -top-[2px] left-48 flex gap-1">
         <div className="w-8 h-1 bg-gray-800 rounded-t cursor-pointer active:mt-[1px]"></div>
         <div className="w-8 h-1 bg-gray-800 rounded-t cursor-pointer active:mt-[1px]"></div>
      </div>

      {/* LEFT JOYCON */}
      <div className="w-28 h-full rounded-l-[32px] rounded-r-none joycon-blue relative flex flex-col items-center pt-12 border-r border-black/20">
         {/* Stick */}
         <div className="w-12 h-12 rounded-full bg-gray-800 shadow-xl relative flex items-center justify-center border-2 border-black mb-8">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] shadow-inner border border-gray-700 box-border relative overflow-hidden">
               <div className="absolute inset-0 plastic-texture opacity-30"></div>
            </div>
         </div>
         
         {/* D-PAD (Buttons) */}
         <div className="relative w-20 h-20 mb-8">
            <JoyBtn type={ButtonType.UP} className="top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full" label="▲" />
            <JoyBtn type={ButtonType.DOWN} className="bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full" label="▼" />
            <JoyBtn type={ButtonType.LEFT} className="left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" label="◀" />
            <JoyBtn type={ButtonType.RIGHT} className="right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" label="▶" />
         </div>

         {/* Capture */}
         <JoyBtn type={ButtonType.CAPTURE} className="bottom-12 right-6 w-4 h-4 rounded bg-[#333] shadow-sm" label="" />
         {/* Minus */}
         <JoyBtn type={ButtonType.MINUS} className="top-4 right-4 w-6 h-1.5 rounded-full bg-[#333]" label="" />
      </div>

      {/* SCREEN */}
      <div className="flex-1 h-full bg-black rounded-sm border-[12px] border-black relative overflow-hidden shadow-inner">
         <div className="w-full h-full bg-white relative overflow-hidden">
            {renderScreenContent()}
            
            {/* Screen Reflection Overlay */}
            <div className="absolute inset-0 pointer-events-none screen-glare opacity-30 mix-blend-overlay"></div>
         </div>
      </div>

      {/* RIGHT JOYCON */}
      <div className="w-28 h-full rounded-r-[32px] rounded-l-none joycon-red relative flex flex-col items-center pt-12 border-l border-black/20">
         {/* Plus */}
         <JoyBtn type={ButtonType.PLUS} className="top-4 left-4 w-6 h-6 rounded-full bg-transparent text-gray-800 text-2xl font-black flex items-center justify-center" label="+" />
         
         {/* ABXY */}
         <div className="relative w-20 h-20 mb-8 mt-2">
            <JoyBtn type={ButtonType.X} className="top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full" label="X" />
            <JoyBtn type={ButtonType.B} className="bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full" label="B" />
            <JoyBtn type={ButtonType.Y} className="left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" label="Y" />
            <JoyBtn type={ButtonType.A} className="right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full" label="A" />
         </div>

         {/* Stick */}
         <div className="w-12 h-12 rounded-full bg-gray-800 shadow-xl relative flex items-center justify-center border-2 border-black mb-8">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] shadow-inner border border-gray-700 box-border relative overflow-hidden">
              <div className="absolute inset-0 plastic-texture opacity-30"></div>
            </div>
         </div>

         {/* Home */}
         <JoyBtn type={ButtonType.HOME} className="bottom-12 left-6 w-6 h-6 rounded-full bg-[#333] ring-4 ring-gray-700/50" label="" />
      </div>

    </div>
  );
};