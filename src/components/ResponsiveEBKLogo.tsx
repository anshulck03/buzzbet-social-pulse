
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveEBKLogoProps {
  className?: string;
  onClick?: () => void;
}

const ResponsiveEBKLogo = ({ className = "", onClick }: ResponsiveEBKLogoProps) => {
  const isMobile = useIsMobile();
  const height = isMobile ? 35 : 45;
  const width = (height * 300) / 200; // Maintain aspect ratio

  return (
    <div 
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      <svg 
        viewBox="0 0 300 200" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full hover:opacity-80 transition-opacity duration-200"
      >
        <defs>
          <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#5eead4', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0f766e', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main background shape - modern rounded rectangle */}
        <rect x="30" y="20" width="240" height="160" rx="25" ry="25" fill="#0f172a" stroke="url(#tealGrad)" strokeWidth="4"/>
        
        {/* Inner accent frame */}
        <rect x="40" y="30" width="220" height="140" rx="20" ry="20" fill="none" stroke="#14b8a6" strokeWidth="1" opacity="0.3"/>
        
        {/* Data visualization elements */}
        <g opacity="0.4">
          {/* Signal bars */}
          <rect x="60" y="50" width="6" height="20" fill="#14b8a6"/>
          <rect x="70" y="45" width="6" height="25" fill="#14b8a6"/>
          <rect x="80" y="40" width="6" height="30" fill="#14b8a6"/>
          <rect x="90" y="35" width="6" height="35" fill="#14b8a6"/>
          
          {/* Data flow lines */}
          <path d="M 220 50 Q 240 60 235 80 Q 230 100 245 120" stroke="#14b8a6" strokeWidth="2" fill="none"/>
          <circle cx="225" cy="55" r="2" fill="#14b8a6"/>
          <circle cx="240" cy="75" r="2" fill="#14b8a6"/>
          <circle cx="235" cy="110" r="2" fill="#14b8a6"/>
        </g>
        
        {/* Main EBK text */}
        <text x="150" y="100" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="48" fontWeight="900" fill="#ffffff" filter="url(#glow)">EBK</text>
        
        {/* Elite Ball Knowledge subtitle - only show on desktop */}
        {!isMobile && (
          <text x="150" y="125" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="600" fill="#14b8a6" letterSpacing="1.5px">ELITE BALL KNOWLEDGE</text>
        )}
        
        {/* Decorative elements */}
        <g opacity="0.6">
          {/* Corner accents */}
          <polygon points="50,40 60,40 55,50" fill="#14b8a6"/>
          <polygon points="250,40 240,40 245,50" fill="#14b8a6"/>
          <polygon points="50,160 60,160 55,150" fill="#14b8a6"/>
          <polygon points="250,160 240,160 245,150" fill="#14b8a6"/>
          
          {/* Side indicators */}
          <rect x="120" y="140" width="60" height="2" fill="#14b8a6" opacity="0.8"/>
          
          {/* Tech dots */}
          <circle cx="110" cy="60" r="1.5" fill="#5eead4"/>
          <circle cx="190" cy="60" r="1.5" fill="#5eead4"/>
          <circle cx="110" cy="140" r="1.5" fill="#5eead4"/>
          <circle cx="190" cy="140" r="1.5" fill="#5eead4"/>
        </g>
      </svg>
    </div>
  );
};

export default ResponsiveEBKLogo;
