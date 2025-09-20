import React, { useEffect, useRef, useLayoutEffect } from 'react';

const ROWS = 15;
const COLS = 20;
const WAVE_WIDTH = 5;
const SCAN_SPEED = 0.015;
const COLOR_CYCLE_SPEED = 0.02;
const BOUNCE_COMPRESSION = 0.6;

const Pattern = () => {
  const gridRef = useRef([]);
  const positionRef = useRef(0);
  const directionRef = useRef(1);
  const hueRef = useRef(120);
  const bounceFactorRef = useRef(1);
  const animationFrameId = useRef();
  const lastTimeRef = useRef();
  const containerRef = useRef();

  const animate = (timestamp) => {
    if (lastTimeRef.current === undefined) {
      lastTimeRef.current = timestamp;
    }
    const elapsedTime = timestamp - lastTimeRef.current;

    let newPosition = positionRef.current + directionRef.current * SCAN_SPEED * elapsedTime;
    const isAtEdge = newPosition >= COLS - 1 || newPosition <= 0;

    if (isAtEdge) {
      bounceFactorRef.current = Math.max(BOUNCE_COMPRESSION, bounceFactorRef.current - 0.005 * elapsedTime);
      if (bounceFactorRef.current <= BOUNCE_COMPRESSION) {
        directionRef.current *= -1;
      }
    } else {
      bounceFactorRef.current = Math.min(1, bounceFactorRef.current + 0.005 * elapsedTime);
    }

    newPosition = Math.max(0, Math.min(COLS - 1, newPosition));
    positionRef.current = newPosition;
    hueRef.current = (hueRef.current + COLOR_CYCLE_SPEED * elapsedTime) % 360;

    const effectiveWidth = WAVE_WIDTH * bounceFactorRef.current;
    const h = hueRef.current;
    const p = positionRef.current;
    const dir = directionRef.current;

    if (containerRef.current) {
      Array.from(containerRef.current.children).forEach((cell, i) => {
        const colIndex = i % COLS;
        const distance = dir === 1 ? p - colIndex : colIndex - p;

        if (distance >= 0 && distance < effectiveWidth) {
          const intensity = 1 - (distance / effectiveWidth);
          const lightness = 10 + 40 * Math.pow(intensity, 2);
          cell.style.backgroundColor = `hsl(${h}, 100%, ${lightness}%)`;
        } else {
          cell.style.backgroundColor = 'hsl(0, 0%, 5%)';
        }
      });
    }

    lastTimeRef.current = timestamp;
    animationFrameId.current = requestAnimationFrame(animate);
  };

  useLayoutEffect(() => {
    const initialGrid = Array.from({ length: ROWS * COLS }, () => 'hsl(0, 0%, 5%)');
    gridRef.current = initialGrid;
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div className="bg-gray-900 text-slate-300 min-h-screen flex flex-col items-center justify-center font-mono p-4 select-none">
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm shadow-2xl shadow-cyan-500/10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-cyan-400 tracking-wider drop-shadow-[0_0_8px_rgba(22,163,164,0.8)]">
            PATTERN
          </h1>
        </div>
        <div
          ref={containerRef}
          className="grid gap-[2px] bg-black p-2.5 border-2 border-slate-800 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 25px)`,
            gridTemplateRows: `repeat(${ROWS}, 25px)`,
          }}
        >
          {Array.from({ length: ROWS * COLS }).map((_, i) => (
            <div
              key={i}
              className="w-[25px] h-[25px] transition-colors duration-[16ms] linear"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pattern;