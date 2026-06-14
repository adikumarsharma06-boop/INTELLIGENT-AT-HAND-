import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  index?: number;
  key?: React.Key;
  layoutId?: string;
}

export default function ThreeDCard({ children, className = '', id, onClick, index = 0, layoutId }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineStyle, setShineStyle] = useState({ opacity: 0, x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Percent from center
    const percentX = (x / rect.width - 0.5) * 2; // -1 to 1
    const percentY = (y / rect.height - 0.5) * 2; // -1 to 1

    // Rotation angles (max 15 degrees)
    setRotateX(-percentY * 12);
    setRotateY(percentX * 12);

    // Dynamic light shine overlay positioning
    setShineStyle({
      opacity: 0.25,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShineStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      layoutId={layoutId}
      initial={{ opacity: 0, y: 40, scale: 0.92, rotateX: 12, z: -100 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, z: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 130,
        damping: 20,
        delay: index * 0.07 
      }}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
      }}
      className={`relative cursor-pointer transition-shadow hover:shadow-[0_20px_45px_rgba(0,229,255,0.15)] ${className}`}
    >
      {/* Light shine glare overlay reflection */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 120px at ${shineStyle.x}% ${shineStyle.y}%, rgba(0, 229, 255, 0.45), transparent 70%)`,
          opacity: shineStyle.opacity,
          zIndex: 5
        }}
      />
      
      {/* The interior card content gets projected in 3D spacer space */}
      <div style={{ transform: "translateZ(25px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
