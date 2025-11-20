import React, { useEffect, useState, useRef } from 'react';
import { ButtonType } from '../../types';
import { motion } from 'framer-motion';

interface Props {
  isPressed: (btn: ButtonType) => boolean;
}

export const FighterGame: React.FC<Props> = ({ isPressed }) => {
  const [p1State, setP1State] = useState<'IDLE' | 'ATTACK' | 'BLOCK'>('IDLE');
  const [cpuState, setCpuState] = useState<'IDLE' | 'ATTACK' | 'HIT'>('IDLE');
  const [p1Health, setP1Health] = useState(100);
  const [cpuHealth, setCpuHealth] = useState(100);
  const [msg, setMsg] = useState("FIGHT!");

  const attackCooldown = useRef(false);

  useEffect(() => {
    if (p1Health <= 0) setMsg("CPU WINS!");
    if (cpuHealth <= 0) setMsg("YOU WIN!");
  }, [p1Health, cpuHealth]);

  // Input Loop
  useEffect(() => {
    if (p1Health <= 0 || cpuHealth <= 0) return;

    const interval = setInterval(() => {
      if (isPressed(ButtonType.Y) && !attackCooldown.current) {
        setP1State('ATTACK');
        attackCooldown.current = true;
        
        // Hit logic
        if (Math.random() > 0.3) { // 70% hit rate
           setCpuState('HIT');
           setCpuHealth(h => Math.max(0, h - 10));
           setTimeout(() => setCpuState('IDLE'), 300);
        }

        setTimeout(() => {
          setP1State('IDLE');
          attackCooldown.current = false;
        }, 400);
      } else if (isPressed(ButtonType.DOWN)) {
        setP1State('BLOCK');
      } else if (p1State === 'BLOCK' && !isPressed(ButtonType.DOWN)) {
        setP1State('IDLE');
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPressed, p1State, p1Health, cpuHealth]);

  // CPU AI Loop
  useEffect(() => {
    if (p1Health <= 0 || cpuHealth <= 0) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.05) { // Random attack
        setCpuState('ATTACK');
        setTimeout(() => {
            if (p1State !== 'BLOCK') {
                setP1Health(h => Math.max(0, h - 8));
            }
            setCpuState('IDLE');
        }, 400);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [p1State, p1Health, cpuHealth]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-orange-900 to-purple-900 relative overflow-hidden font-retro">
      
      {/* HUD */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-20">
        <div className="w-1/3">
          <div className="text-yellow-400 text-xs mb-1">RYU</div>
          <div className="h-4 w-full bg-gray-800 border-2 border-white">
            <div className="h-full bg-yellow-500 transition-all duration-200" style={{ width: `${p1Health}%` }}></div>
          </div>
        </div>
        <div className="text-red-500 text-2xl font-bold mt-2 bg-black px-2 rounded">{msg}</div>
        <div className="w-1/3 text-right">
          <div className="text-blue-400 text-xs mb-1">KEN</div>
          <div className="h-4 w-full bg-gray-800 border-2 border-white flex justify-end">
            <div className="h-full bg-yellow-500 transition-all duration-200" style={{ width: `${cpuHealth}%` }}></div>
          </div>
        </div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-12 bg-gray-700 border-t-4 border-gray-500" />

      {/* Player 1 */}
      <motion.div 
        className="absolute bottom-8 left-20 w-24 h-32"
        animate={p1State}
        variants={{
          IDLE: { x: 0, scale: 1 },
          ATTACK: { x: 50, scale: 1.1 },
          BLOCK: { scale: 0.9, filter: 'brightness(0.8)' }
        }}
      >
         <div className="w-full h-full bg-white relative">
             <div className="w-full h-1/3 bg-red-600" /> {/* Headband */}
             <div className="w-full h-2/3 bg-white" /> {/* Gi */}
             <div className="absolute top-8 -right-4 w-12 h-8 bg-yellow-900" 
                  style={{ opacity: p1State === 'ATTACK' ? 1 : 0 }}></div> {/* Punch */}
         </div>
      </motion.div>

      {/* CPU */}
      <motion.div 
        className="absolute bottom-8 right-20 w-24 h-32"
        animate={cpuState}
        variants={{
          IDLE: { x: 0, rotate: 0 },
          ATTACK: { x: -50 },
          HIT: { x: 20, rotate: 10, filter: 'grayscale(100%) bg-red-500' }
        }}
      >
          <div className="w-full h-full bg-red-600 relative">
             <div className="w-full h-1/3 bg-yellow-400" /> {/* Hair */}
             <div className="w-full h-2/3 bg-red-600" /> {/* Gi */}
          </div>
      </motion.div>

      <div className="absolute bottom-2 left-2 text-[10px] text-gray-400">
         [Y] Punch | [DOWN] Block
      </div>

    </div>
  );
};