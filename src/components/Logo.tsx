import React from 'react';

export default function Logo({ className = "text-[28px]", inverted = false }: { className?: string, inverted?: boolean }) {
  return (
    <div className={`font-black tracking-tighter uppercase flex gap-1.5 items-center ${className}`}>
      <span 
        className={inverted ? "text-white" : "text-black"} 
        style={{ 
          WebkitTextStroke: inverted ? '1px white' : '1.5px black',
          textShadow: inverted ? 'none' : '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white'
        }}
      >
        FUN
      </span>
      <span style={{ WebkitTextStroke: inverted ? '1px white' : '1px black', color: 'transparent' }}>FIND</span>
    </div>
  );
}
