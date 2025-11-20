import React, { useEffect, useRef, useState } from 'react';
import { ButtonType } from '../../types';

interface Props {
  isPressed: (btn: ButtonType) => boolean;
}

export const RacingGame: React.FC<Props> = ({ isPressed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  
  // Game state refs to avoid re-renders in loop
  const playerX = useRef(0); // -1 to 1
  const speed = useRef(0);
  const roadOffset = useRef(0);
  const enemies = useRef<{x: number, z: number}[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const loop = () => {
      // Input
      if (isPressed(ButtonType.A)) speed.current = Math.min(speed.current + 0.02, 1.5);
      else speed.current = Math.max(speed.current - 0.01, 0);

      if (speed.current > 0) {
        if (isPressed(ButtonType.LEFT)) playerX.current = Math.max(playerX.current - 0.05, -1);
        if (isPressed(ButtonType.RIGHT)) playerX.current = Math.min(playerX.current + 0.05, 1);
      }

      // Logic
      roadOffset.current += speed.current;
      
      // Spawn enemies
      if (Math.random() < 0.01 * speed.current) {
        enemies.current.push({ x: (Math.random() * 2 - 1) * 0.8, z: 100 });
      }

      // Update enemies
      enemies.current.forEach(e => e.z -= speed.current);
      enemies.current = enemies.current.filter(e => e.z > 0);

      // Drawing
      ctx.fillStyle = '#87CEEB'; // Sky
      ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
      ctx.fillStyle = '#2E7D32'; // Grass
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

      // Pseudo-3D Road
      const w = canvas.width;
      const h = canvas.height;
      const halfH = h / 2;

      for (let i = 0; i < 50; i++) {
        const z = 50 - i; // depth
        const scale = 100 / (z + 1); // perspective
        const yScreen = halfH + (scale * halfH);
        const wScreen = w * scale * 2;
        
        // Alternating colors for road effect
        const segmentIdx = Math.floor((i + roadOffset.current) % 2);
        ctx.fillStyle = segmentIdx === 0 ? '#616161' : '#757575';
        
        const xOffset = 0; // curve could go here
        ctx.fillRect((w/2) - (wScreen/2) + xOffset, yScreen, wScreen, scale * 5);
        
        // Road markings
        if (i % 2 === 0) {
           ctx.fillStyle = 'white';
           ctx.fillRect((w/2) - (wScreen * 0.02), yScreen, wScreen * 0.04, scale * 5);
        }
      }

      // Draw Enemies
      enemies.current.forEach(e => {
        const scale = 100 / (e.z + 1);
        const yScreen = halfH + (scale * halfH);
        const xScreen = (w/2) + (e.x * w * scale);
        const size = 50 * scale;
        
        ctx.fillStyle = 'blue';
        ctx.fillRect(xScreen - size/2, yScreen - size, size, size);
      });

      // Draw Player Car
      const playerScale = 1.5;
      const playerScreenX = (w/2) + (playerX.current * w * 0.5);
      const playerScreenY = h - 60;
      
      // Car Body
      ctx.fillStyle = 'red';
      ctx.fillRect(playerScreenX - 30, playerScreenY, 60, 40);
      // Wheels
      ctx.fillStyle = 'black';
      ctx.fillRect(playerScreenX - 32, playerScreenY + 20, 10, 20);
      ctx.fillRect(playerScreenX + 22, playerScreenY + 20, 10, 20);
      // Windshield
      ctx.fillStyle = '#ADD8E6';
      ctx.beginPath();
      ctx.moveTo(playerScreenX - 25, playerScreenY);
      ctx.lineTo(playerScreenX + 25, playerScreenY);
      ctx.lineTo(playerScreenX + 20, playerScreenY - 15);
      ctx.lineTo(playerScreenX - 20, playerScreenY - 15);
      ctx.fill();

      // Speedometer
      setScore(Math.floor(speed.current * 200));

      animationFrame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPressed]);

  return (
    <div className="w-full h-full relative font-retro overflow-hidden">
       <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
       <div className="absolute top-4 right-4 text-yellow-400 text-2xl drop-shadow-md italic font-bold">
         {score} km/h
       </div>
       <div className="absolute bottom-4 left-4 text-white text-xs drop-shadow-md">
         [A] Accelerate | [L/R] Steer
       </div>
    </div>
  );
};