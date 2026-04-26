"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let ship = { y: 110, vy: 0, radius: 8 };
    let obstacles: {x: number, y: number, w: number, h: number}[] = [];
    let frameCount = 0;
    let currentScore = 0;
    let startedFlying = false;

    const reset = () => {
      ship = { y: 110, vy: 0, radius: 8 };
      obstacles = [];
      frameCount = 0;
      currentScore = 0;
      startedFlying = false;
      setGameOver(false);
      setScore(0);
    };

    const handleJump = (e?: Event) => {
      if (e) e.preventDefault();
      if (gameOver) {
        reset();
      } else {
        startedFlying = true;
        ship.vy = -5.5; // Jump
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        handleJump(e);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("pointerdown", handleJump);

    const loop = () => {
      if (gameOver) return;

      // Physics
      if (startedFlying) {
        ship.vy += 0.3; // Gravity
        ship.y += ship.vy;
      }

      // Cap at ceiling
      if (ship.y < ship.radius) {
        ship.y = ship.radius;
        ship.vy = 0;
      }

      // Die at floor
      if (ship.y > canvas.height) {
        setGameOver(true);
      }

      // Obstacles
      if (startedFlying && frameCount % 100 === 0) {
        const gap = 90;
        const topH = Math.random() * (canvas.height - gap - 40) + 20;
        obstacles.push({ x: canvas.width, y: 0, w: 30, h: topH }); // Top pipe
        obstacles.push({ x: canvas.width, y: topH + gap, w: 30, h: canvas.height - topH - gap }); // Bottom pipe
      }

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid (Basement vibe)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i += 30) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
      for (let i = 0; i < canvas.height; i += 30) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
      ctx.stroke();

      // Draw ship
      ctx.fillStyle = "#3B82F6";
      ctx.shadowColor = "#3B82F6";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(60, ship.y, ship.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw & Move Obstacles
      ctx.fillStyle = "#FF3366";
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        if (startedFlying) {
          obs.x -= 4; // Speed
        }
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

        // Collision
        if (
          60 + ship.radius > obs.x &&
          60 - ship.radius < obs.x + obs.w &&
          ship.y + ship.radius > obs.y &&
          ship.y - ship.radius < obs.y + obs.h
        ) {
          setGameOver(true);
        }

        if (obs.x + obs.w < 0) {
          obstacles.splice(i, 1);
          if (i % 2 === 0) {
            currentScore++;
            setScore(currentScore);
          }
        }
      }

      if (startedFlying) {
        frameCount++;
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("pointerdown", handleJump);
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, gameOver]);

  return (
    <div 
      className="relative w-full h-[220px] bg-[#030712] border border-white/10 rounded-[20px] overflow-hidden group cursor-pointer shadow-2xl" 
      onClick={() => {
        if (!isPlaying) setIsPlaying(true);
        else if (gameOver) setGameOver(false);
      }}
    >
      <canvas ref={canvasRef} width={800} height={220} className="w-full h-full object-cover" />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 pointer-events-none">
          <div className="w-10 h-10 mb-4 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping" />
          </div>
          <p className="font-mono text-xs sm:text-sm text-blue-400 uppercase tracking-widest">Initialising Flight Simulator</p>
          <p className="font-mono text-[10px] text-white mt-2">CLICK ANYWHERE TO START ENGINE</p>
        </div>
      )}

      {isPlaying && score === 0 && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
           <p className="font-mono text-lg text-white animate-pulse bg-black/50 px-4 py-2 rounded-lg">PRESS SPACE OR CLICK TO FLY</p>
        </div>
      )}

      {isPlaying && (
        <div className="absolute top-4 right-5 font-mono text-2xl text-blue-400 font-bold opacity-50 pointer-events-none">
          {score.toString().padStart(4, '0')}
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/90 backdrop-blur-md z-20">
          <p className="font-mono text-2xl md:text-3xl font-black text-red-500 mb-2 uppercase tracking-widest text-center">Hull Breach</p>
          <p className="font-mono text-xs text-white/70">CLICK OR PRESS SPACE TO REBOOT</p>
        </div>
      )}
    </div>
  );
}
