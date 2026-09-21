import React from 'react';
import { Activity, ShieldCheck, Terminal, Sparkles, Cpu, Layers } from 'lucide-react';

export const KineticTicker = () => {
  const items = [
    { icon: <Terminal className="w-3.5 h-3.5 text-primary" />, text: 'GITHUB REST TELEMETRY v3' },
    { icon: <Layers className="w-3.5 h-3.5 text-secondary" />, text: 'THE KINETIC MONOLITH DESIGN SYSTEM' },
    { icon: <Activity className="w-3.5 h-3.5 text-primary" />, text: 'NO-LINE TONAL ARCHITECTURE' },
    { icon: <Cpu className="w-3.5 h-3.5 text-secondary" />, text: 'DUAL-FONT INTER & SPACE GROTESK' },
    { icon: <ShieldCheck className="w-3.5 h-3.5 text-primary" />, text: 'BEARER TOKEN SUPPORT (5,000 REQ/HR)' },
    { icon: <Sparkles className="w-3.5 h-3.5 text-primary" />, text: 'ZERO STATIC MOCKS — 100% LIVE REST' },
  ];

  return (
    <div className="w-full bg-surface-container-low/80 backdrop-blur-sm border-none py-2.5 overflow-hidden select-none">
      <div className="animate-kinetic-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Render items multiple times for seamless infinite loop */}
        {[...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 font-label text-[10px] font-bold tracking-widest uppercase text-secondary/90 hover:text-on-surface transition-colors"
          >
            {item.icon}
            <span>{item.text}</span>
            <span className="text-secondary/40 text-[8px] ml-4">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
