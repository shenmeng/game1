import React, { useEffect, useState } from 'react';
import { ButtonType } from '../../types';

interface Props {
  isPressed: (btn: ButtonType) => boolean;
}

// 0: grass, 1: path, 2: tree (blocked), 3: water (blocked)
const MAP_DATA = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,2,0,0,1,1,1,0,0,0,0,2],
  [2,0,3,3,2,0,0,1,0,1,0,2,2,0,2],
  [2,0,3,3,2,0,0,1,0,1,0,2,0,0,2],
  [2,0,0,0,0,0,0,1,1,1,0,2,0,0,2],
  [2,0,2,2,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,0,0,2,2,2,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

export const PokemonGame: React.FC<Props> = ({ isPressed }) => {
  const [pos, setPos] = useState({ x: 7, y: 4 }); // Start in middle
  const [facing, setFacing] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('DOWN');
  const [text, setText] = useState("PALLET TOWN");
  const [moveCooldown, setMoveCooldown] = useState(false);

  useEffect(() => {
    if (moveCooldown) return;

    let newX = pos.x;
    let newY = pos.y;
    let moved = false;

    if (isPressed(ButtonType.UP)) { newY--; setFacing('UP'); moved = true; }
    else if (isPressed(ButtonType.DOWN)) { newY++; setFacing('DOWN'); moved = true; }
    else if (isPressed(ButtonType.LEFT)) { newX--; setFacing('LEFT'); moved = true; }
    else if (isPressed(ButtonType.RIGHT)) { newX++; setFacing('RIGHT'); moved = true; }

    if (moved) {
      // Collision check
      if (MAP_DATA[newY] && MAP_DATA[newY][newX] !== undefined && MAP_DATA[newY][newX] < 2) {
        setPos({ x: newX, y: newY });
        setMoveCooldown(true);
        setTimeout(() => setMoveCooldown(false), 150); // Walk speed
        
        // Random Encounter Check
        if (MAP_DATA[newY][newX] === 0 && Math.random() < 0.1) {
           setText("A wild PIDGEY appeared!");
           setTimeout(() => setText("PALLET TOWN"), 2000);
        }
      }
    }
  }, [isPressed, moveCooldown, pos]);

  const getTileColor = (type: number) => {
    switch(type) {
      case 0: return 'bg-green-400'; // Grass
      case 1: return 'bg-yellow-200'; // Path
      case 2: return 'bg-green-800'; // Tree
      case 3: return 'bg-blue-400'; // Water
      default: return 'bg-black';
    }
  }

  return (
    <div className="w-full h-full bg-black font-retro flex flex-col items-center justify-center relative">
      <div className="border-4 border-gray-300 bg-white p-1 rounded mb-2 w-3/4 text-center text-black text-xs uppercase shadow-lg h-12 flex items-center justify-center">
        {text}
      </div>
      
      <div className="relative w-[240px] h-[128px] overflow-hidden bg-green-400 border-2 border-gray-600 shadow-inner">
        {/* Render Map relative to player to center camera */}
        <div 
          className="absolute transition-all duration-150 ease-linear"
          style={{ 
            left: 120 - (pos.x * 16) - 8, 
            top: 64 - (pos.y * 16) - 8 
          }}
        >
          {MAP_DATA.map((row, y) => (
            <div key={y} className="flex">
              {row.map((tile, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`w-4 h-4 ${getTileColor(tile)} border-[0.5px] border-black/10`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Player Sprite (Centered) */}
        <div className="absolute top-[56px] left-[112px] w-4 h-4 bg-red-500 border border-red-800 z-10 flex items-center justify-center">
          <div className={`w-3 h-1 bg-black opacity-50 ${facing === 'UP' ? 'mb-3' : facing === 'DOWN' ? 'mt-3' : ''}`} />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] text-gray-400">
        [D-PAD] Move
      </div>
    </div>
  );
};