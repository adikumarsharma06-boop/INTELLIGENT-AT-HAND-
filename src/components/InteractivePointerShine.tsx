import React, { useState, useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  hue: number;
  opacity: number;
}

export default function InteractivePointerShine() {
  const [coords, setCoords] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [clickForce, setClickForce] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number | null>(null);

  // Initialize beautiful floating premium particles
  useEffect(() => {
    const list: Particle[] = [];
    for (let i = 0; i < 45; i++) {
      list.push({
        id: i,
        x: Math.random() * 100, // percentage x
        y: Math.random() * 100, // percentage y
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        hue: Math.random() > 0.5 ? 185 : 160, // Cyan and Emerald highlights
        opacity: Math.random() * 0.4 + 0.15
      });
    }
    setParticles(list);
  }, []);

  // Update particles positions continuously for an active, dreaming background look
  useEffect(() => {
    const animate = () => {
      setParticles(prev => 
        prev.map(p => {
          let nextX = p.x + p.speedX;
          let nextY = p.y + p.speedY;
          
          // boundary wrap
          if (nextX < 0) nextX = 100;
          if (nextX > 100) nextX = 0;
          if (nextY < 0) nextY = 100;
          if (nextY > 100) nextY = 0;

          return {
            ...p,
            x: nextX,
            y: nextY
          };
        })
      );
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        setCoords({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        setIsHovered(true);
        // generate a quick interactive shockwave aura on click
        setClickForce(1.5);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        setCoords({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        setIsHovered(true);
      }
    };

    const handleTouchEnd = () => {
      // fade out gradually
      setTimeout(() => {
        setIsHovered(false);
      }, 1000);
    };

    const handleMouseDown = () => {
      setClickForce(2.0);
    };

    const handleMouseUp = () => {
      setTimeout(() => setClickForce(0), 400);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden">
      
      {/* 1. SEAMLESS DYNAMIC DRIFTING STAR SYSTEM */}
      <svg className="absolute inset-0 w-full h-full opacity-60">
        <g>
          {particles.map(p => (
            <circle
              key={p.id}
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={p.size}
              fill={p.hue === 185 ? '#00E5FF' : '#00FFB2'}
              fillOpacity={p.opacity}
              className="transition-all duration-1000 ease-linear"
              style={{
                filter: `drop-shadow(0 0 ${p.size * 2.5}px ${p.hue === 185 ? 'rgba(0,229,255,0.4)' : 'rgba(0,255,178,0.4)'})`
              }}
            />
          ))}
        </g>
      </svg>

      {/* 2. GLOWING RADIAL SPOTLIGHT FOLLOWING THE Mouse (DEEP SENSORY VISUALS) */}
      {isHovered && (
        <div 
          className="absolute rounded-full pointer-events-none mix-blend-screen transition-all duration-100 ease-out"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            width: `${clickForce > 0 ? 550 * clickForce : 450}px`,
            height: `${clickForce > 0 ? 550 * clickForce : 450}px`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(ellipse at center, rgba(0, 229, 255, 0.12) 0%, rgba(124, 58, 237, 0.04) 40%, transparent 70%)`,
            filter: 'blur(15px)'
          }}
        />
      )}

      {/* 2b. CORE SHINING BULLET (Provides high-contrast physical target spot feedback) */}
      {isHovered && (
        <div 
          className="absolute w-28 h-28 rounded-full pointer-events-none transition-all duration-300 ease-out opacity-25"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, #00FFB2 0%, rgba(0, 229, 255, 0.2) 50%, transparent 100%)',
          }}
        />
      )}

      {/* 2c. COMPACT SHINIER BOURBON DOT FOR BOLD VISUAL STRIKE */}
      {isHovered && (
        <div 
          className="absolute w-2 h-2 rounded-full pointer-events-none transition-transform duration-75 text-[#00E5FF] shadow-[0_0_15px_#00E5FF] bg-white"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            transform: 'translate(-50%, -50%) scale(1.1)',
          }}
        />
      )}

      {/* CSS overrides to inject spotlight reactivity into normal interactive buttons & cards */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Add modern magnetic hover indicators to all layout cards automatically */
        .grid-cols-1 > div,
        header,
        button:not(#header-notif-bell),
        input {
          position: relative;
          transition: border-color 0.4s ease, transform 0.3s ease, box-shadow 0.4s ease !important;
        }
        
        button:not(#header-notif-bell):hover {
          box-shadow: 0 0 16px rgba(0, 229, 255, 0.25) !important;
          transform: translateY(-2px) scale(1.02) !important;
          border-color: rgba(0, 229, 255, 0.5) !important;
        }

        .grid-cols-1 > div:hover {
          border-color: rgba(0, 255, 178, 0.35) !important;
          box-shadow: 0 0 24px rgba(0, 255, 178, 0.08) !important;
        }

        /* Ambient floating stars animation keyframe list */
        @keyframes starryDream {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.7; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
        }
      `}} />

    </div>
  );
}
