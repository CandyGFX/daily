import React, { useMemo } from 'react';

export default function MoonBackground({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  // Generate deterministic stars once with zero re-rendering overhead
  const stars = useMemo(() => {
    const starList = [];
    const count = 45; // lightweight & crisp count for high mobile FPS
    for (let i = 0; i < count; i++) {
      const top = ((i * 37) % 100);
      const left = ((i * 73) % 100);
      const size = (i % 3 === 0) ? 2.2 : (i % 2 === 0 ? 1.6 : 1.1);
      const duration = 2.8 + ((i % 5) * 0.9);
      const delay = (i % 7) * 0.5;
      const opacity = 0.4 + ((i % 4) * 0.18);
      const isWarm = i % 6 === 0;
      starList.push({ id: i, top, left, size, duration, delay, opacity, isWarm });
    }
    return starList;
  }, []);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700 select-none ${
        isDark 
          ? 'bg-gradient-to-b from-[#050713] via-[#0b1028] to-[#101432]' 
          : 'bg-gradient-to-b from-[#f8f5ff] via-[#fff1f5] to-[#f0f4ff]'
      }`}
      style={{
        contain: 'strict',
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
      aria-hidden="true"
    >
      {/* Hardware-accelerated soft nebula gradients (Zero GPU Gaussian blur overhead) */}
      {isDark ? (
        <>
          <div 
            className="absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full pointer-events-none -translate-y-1/3"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 75%)',
              transform: 'translateZ(0)'
            }}
          />
          <div 
            className="absolute top-1/3 left-4 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.03) 50%, transparent 75%)',
              transform: 'translateZ(0)'
            }}
          />
          <div 
            className="absolute bottom-10 right-4 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(244, 63, 94, 0.12) 0%, rgba(244, 63, 94, 0.03) 50%, transparent 75%)',
              transform: 'translateZ(0)'
            }}
          />
        </>
      ) : (
        <>
          <div 
            className="absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full pointer-events-none -translate-y-1/3"
            style={{
              background: 'radial-gradient(circle, rgba(254, 205, 211, 0.35) 0%, rgba(254, 205, 211, 0.1) 50%, transparent 75%)',
              transform: 'translateZ(0)'
            }}
          />
          <div 
            className="absolute top-1/3 left-4 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(224, 231, 255, 0.4) 0%, rgba(224, 231, 255, 0.1) 50%, transparent 75%)',
              transform: 'translateZ(0)'
            }}
          />
        </>
      )}

      {/* Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full transition-opacity duration-700 ${
            isDark 
              ? (star.isWarm ? 'bg-amber-100' : 'bg-white') 
              : 'bg-indigo-300'
          }`}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: isDark ? star.opacity : star.opacity * 0.35,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            transform: 'translateZ(0)',
          }}
        />
      ))}

      {/* Shooting Stars (Dark Mode Only) */}
      {isDark && (
        <>
          <div 
            className="absolute top-12 right-20 w-32 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 pointer-events-none"
            style={{
              animation: 'shootingStar 9s linear infinite',
              animationDelay: '2s',
              transform: 'translateZ(0)',
            }}
          />
          <div 
            className="absolute top-36 right-1/3 w-36 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-0 pointer-events-none"
            style={{
              animation: 'shootingStar 14s linear infinite',
              animationDelay: '8s',
              transform: 'translateZ(0)',
            }}
          />
        </>
      )}

      {/* THE HD REALISTIC MOON */}
      <div 
        className={`absolute transition-all duration-1000 ${
          isDark 
            ? 'top-8 right-5 sm:top-14 sm:right-20 md:right-32 scale-100 opacity-100' 
            : 'top-10 right-5 sm:top-16 sm:right-20 md:right-32 scale-95 opacity-80'
        }`}
        style={{ 
          animation: 'moonGlow 6s ease-in-out infinite',
          transform: 'translateZ(0)'
        }}
      >
        {/* Soft Moon Halo */}
        <div 
          className="absolute -inset-8 sm:-inset-12 rounded-full pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(199, 210, 254, 0.25) 0%, rgba(165, 180, 252, 0.1) 45%, transparent 70%)'
              : 'radial-gradient(circle, rgba(254, 215, 170, 0.3) 0%, rgba(253, 164, 175, 0.1) 45%, transparent 70%)',
            transform: 'translateZ(0)'
          }}
        />

        {/* The Moon Sphere with Realistic Surface Texture */}
        <div className={`relative w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-2xl transition-all duration-700 ${
          isDark
            ? 'shadow-indigo-500/30 border border-slate-200/30'
            : 'shadow-pink-300/30 border border-amber-100/50'
        }`}
        style={{ transform: 'translateZ(0)' }}
        >
          {/* Base Lunar Gradient Sphere */}
          <div 
            className="w-full h-full"
            style={{
              background: isDark
                ? 'radial-gradient(circle at 35% 35%, #ffffff 0%, #edf2f7 35%, #cbd5e1 70%, #94a3b8 100%)'
                : 'radial-gradient(circle at 35% 35%, #fffef8 0%, #fef3c7 40%, #fed7aa 75%, #e2e8f0 100%)'
            }}
          >
            {/* SVG High-Definition Lunar Maria & Craters Layer */}
            <svg 
              className="w-full h-full opacity-60 mix-blend-multiply" 
              viewBox="0 0 200 200" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Mare Tranquillitatis & Serenity */}
              <path 
                d="M60 45 Q75 35 95 42 Q115 50 120 70 Q122 88 105 95 Q88 102 70 90 Q52 78 60 45 Z" 
                fill="#64748b" 
                opacity="0.32" 
              />
              <path 
                d="M100 80 Q130 75 145 100 Q155 125 135 140 Q115 155 95 135 Q75 115 100 80 Z" 
                fill="#475569" 
                opacity="0.28" 
              />
              <path 
                d="M40 95 Q60 85 75 110 Q85 130 65 145 Q45 155 35 130 Q28 110 40 95 Z" 
                fill="#64748b" 
                opacity="0.25" 
              />
              <path 
                d="M30 40 Q55 25 70 50 Q75 75 50 80 Q25 80 30 40 Z" 
                fill="#475569" 
                opacity="0.22" 
              />

              {/* Realistic Tycho Crater with Ray System */}
              <circle cx="115" cy="155" r="7" fill="#cbd5e1" opacity="0.9" />
              <circle cx="115" cy="155" r="4" fill="#64748b" opacity="0.5" />
              <line x1="115" y1="155" x2="160" y2="185" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />
              <line x1="115" y1="155" x2="80" y2="180" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />
              <line x1="115" y1="155" x2="140" y2="120" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
              <line x1="115" y1="155" x2="70" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.4" />

              {/* Copernicus Crater */}
              <circle cx="68" cy="85" r="6" fill="#94a3b8" opacity="0.4" />
              <circle cx="68" cy="85" r="3" fill="#cbd5e1" opacity="0.7" />

              {/* Kepler Crater */}
              <circle cx="45" cy="80" r="4" fill="#94a3b8" opacity="0.4" />
              <circle cx="45" cy="80" r="2" fill="#ffffff" opacity="0.6" />

              {/* Subtle smaller impact craters */}
              <circle cx="140" cy="65" r="5" fill="#64748b" opacity="0.25" />
              <circle cx="155" cy="90" r="4" fill="#64748b" opacity="0.2" />
              <circle cx="90" cy="30" r="4" fill="#64748b" opacity="0.3" />
              <circle cx="130" cy="40" r="3" fill="#64748b" opacity="0.25" />
              <circle cx="50" cy="130" r="3" fill="#64748b" opacity="0.25" />
              <circle cx="85" cy="165" r="3" fill="#64748b" opacity="0.3" />
            </svg>

            {/* Inner Limb 3D Shadow for spherical depth */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow: isDark
                  ? 'inset -12px -12px 24px rgba(15, 23, 42, 0.75), inset 5px 5px 12px rgba(255, 255, 255, 0.45)'
                  : 'inset -10px -10px 20px rgba(148, 163, 184, 0.55), inset 5px 5px 10px rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Ethereal Mist & Clouds (Zero Blur Filter for 120fps scrolling) */}
      <div 
        className="absolute top-16 -left-20 w-[550px] h-28 opacity-25 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.35) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(253, 164, 175, 0.35) 0%, rgba(254, 205, 211, 0.1) 45%, transparent 70%)',
          animation: 'driftSlow 28s ease-in-out infinite alternate',
          transform: 'translateZ(0)'
        }}
      />

      <div 
        className="absolute top-28 -right-24 w-[600px] h-32 opacity-25 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(199, 210, 254, 0.35) 0%, rgba(129, 140, 248, 0.1) 45%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(254, 215, 170, 0.4) 0%, rgba(251, 146, 60, 0.1) 45%, transparent 70%)',
          animation: 'driftSlow 36s ease-in-out infinite alternate-reverse',
          transform: 'translateZ(0)'
        }}
      />
    </div>
  );
}
