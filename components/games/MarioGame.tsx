import React, { useEffect, useRef, useState } from 'react';
import { ButtonType } from '../../types';

interface Props {
  isPressed: (btn: ButtonType) => boolean;
}

export const MarioGame: React.FC<Props> = ({ isPressed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState({ score: 0, gameOver: false });
  
  const playerRef = useRef({ x: 50, y: 200, width: 30, height: 30, dx: 0, dy: 0, grounded: false });
  const coinsRef = useRef<{x: number, y: number, active: boolean}[]>([
    {x: 200, y: 250, active: true}, {x: 350, y: 200, active: true}, {x: 500, y: 250, active: true}, {x: 600, y: 150, active: true}
  ]);
  const goombasRef = useRef<{x: number, y: number, dir: number}[]>([
    {x: 400, y: 270, dir: -1}, {x: 700, y: 270, dir: 1}
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const gravity = 0.8;
    const friction = 0.8;
    const speed = 5;
    const jumpStrength = 15;

    const loop = () => {
      const player = playerRef.current;

      // Input
      if (isPressed(ButtonType.RIGHT)) player.dx = speed;
      else if (isPressed(ButtonType.LEFT)) player.dx = -speed;
      else player.dx *= friction;

      if (isPressed(ButtonType.B) && player.grounded) {
        player.dy = -jumpStrength;
        player.grounded = false;
      }

      // Physics
      player.dy += gravity;
      player.x += player.dx;
      player.y += player.dy;

      // Floor Collision
      if (player.y + player.height > 300) {
        player.y = 300 - player.height;
        player.dy = 0;
        player.grounded = true;
      }

      // Boundary
      if (player.x < 0) player.x = 0;
      if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

      // Coins
      coinsRef.current.forEach(coin => {
        if (coin.active && 
            player.x < coin.x + 20 && player.x + player.width > coin.x &&
            player.y < coin.y + 20 && player.y + player.height > coin.y) {
          coin.active = false;
          setGameState(p => ({ ...p, score: p.score + 100 }));
        }
      });

      // Drawing
      // Sky
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F7FA');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(0, 300, canvas.width, 60);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, 300, canvas.width, 10);

      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath(); ctx.arc(100, 50, 30, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(140, 60, 40, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(600, 80, 50, 0, Math.PI * 2); ctx.fill();

      // Coins
      coinsRef.current.forEach(coin => {
        if (coin.active) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#DAA520';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Goombas
      goombasRef.current.forEach(g => {
        g.x += g.dir * 2;
        if (g.x < 300 || g.x > 750) g.dir *= -1; // Patrol
        
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(g.x + 15, g.y + 15, 15, 0, Math.PI * 2, true); // Head
        ctx.fill();
        ctx.fillStyle = 'black'; // feet
        ctx.fillRect(g.x, g.y + 20, 10, 10);
        ctx.fillRect(g.x + 20, g.y + 20, 10, 10);
      });

      // Player
      ctx.fillStyle = '#F44336'; // Red shirt
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.fillStyle = '#1976D2'; // Blue overalls
      ctx.fillRect(player.x, player.y + 15, player.width, 15);
      
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPressed]);

  return (
    <div className="w-full h-full relative bg-blue-300 overflow-hidden font-retro">
      <canvas ref={canvasRef} width={800} height={360} className="w-full h-full" />
      <div className="absolute top-4 left-4 text-white text-shadow text-xl drop-shadow-md">
        SCORE: {gameState.score.toString().padStart(6, '0')}
      </div>
      <div className="absolute top-4 right-4 text-white text-xl drop-shadow-md">
        WORLD 1-1
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-white opacity-70">
        [D-PAD] Move | [B] Jump
      </div>
    </div>
  );
};