import React, { useMemo } from 'react';

export default function MoonBackground({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  // Generate deterministic stars once so they never jump around or re-render
  const stars = useMemo(() => {
    const starList = [];
    const count = 55;
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random distribution
      const top = ((i * 37) % 100);
      const left = ((i * 73) % 100);
      const size = (i % 3 === 0) ? 2.5 : (i % 2 === 0 ? 1.8 : 1.2);
      const duration = 2.5 + ((i % 5) * 0.8);
      const delay = (i % 7) * 0.6;
      const opacity = 0.35 + ((i % 4) * 0.2);
      const isWarm = i % 6 === 0; // occasional warm star
      starList.push({ id: i, top, left, size, duration, delay, opacity, isWarm });
    }
    return starList;
  }, []);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700 select-none ${
        isDark 
          ? 'bg-gradient-to-b from-[#060814] via-[#0c122b] to-[#121633]' 
          : 'bg-gradient-to-b from-[#f8f5ff] via-[#fff1f5] to-[#f0f4ff]'
      }`}
      aria-hidden="true"
    >
      {/* Subtle Cosmic Ambient Nebula Glows */}
      {isDark ? (
        <>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] transform-gpu -translate-y-1/3" />
          <div className="absolute top-1/3 left-10 w-[420px] h-[420px] bg-purple-600/10 rounded-full blur-[110px] transform-gpu" />
          <div className="absolute bottom-10 right-10 w-[480px] h-[480px] bg-rose-600/10 rounded-full blur-[130px] transform-gpu" />
        </>
      ) : (
        <>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[100px] transform-gpu -translate-y-1/3" />
          <div className="absolute top-1/3 left-10 w-[420px] h-[420px] bg-indigo-100/50 rounded-full blur-[100px] transform-gpu" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-amber-100/40 rounded-full blur-[110px] transform-gpu" />
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
            boxShadow: isDark && star.size > 2 
              ? '0 0 6px rgba(255, 255, 255, 0.8)' 
              : 'none',
          }}
        />
      ))}

      {/* Shooting Stars (Dark Mode Only) */}
      {isDark && (
        <>
          <div 
            className="absolute top-12 right-20 w-32 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 pointer-events-none transform-gpu"
            style={{
              animation: 'shootingStar 9s linear infinite',
              animationDelay: '2s',
            }}
          />
          <div 
            className="absolute top-36 right-1/3 w-40 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-0 pointer-events-none transform-gpu"
            style={{
              animation: 'shootingStar 13s linear infinite',
              animationDelay: '7s',
            }}
          />
          <div 
            className="absolute top-24 left-1/3 w-28 h-[1.5px] bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-0 pointer-events-none transform-gpu"
            style={{
              animation: 'shootingStar 17s linear infinite',
              animationDelay: '11s',
            }}
          />
        </>
      )}

      {/* THE HD REALISTIC MOON */}
      <div 
        className={`absolute transition-all duration-1000 transform-gpu ${
          isDark 
            ? 'top-8 right-6 sm:top-14 sm:right-20 md:right-32 scale-100 opacity-100' 
            : 'top-10 right-6 sm:top-16 sm:right-20 md:right-32 scale-95 opacity-80'
        }`}
        style={{ animation: 'moonGlow 6s ease-in-out infinite' }}
      >
        {/* Deep Atmospheric Halo Bloom */}
        <div 
          className={`absolute -inset-10 sm:-inset-16 rounded-full blur-3xl transition-colors duration-1000 ${
            isDark 
              ? 'bg-indigo-300/25 sm:bg-indigo-200/30' 
              : 'bg-amber-100/40 sm:bg-rose-100/50'
          }`} 
        />
        
        {/* Soft Secondary Corona Ring */}
        <div 
          className={`absolute -inset-4 sm:-inset-6 rounded-full blur-xl transition-colors duration-1000 ${
            isDark 
              ? 'bg-blue-100/30' 
              : 'bg-orange-100/35'
          }`} 
        />

        {/* The Moon Sphere with Realistic High-Definition Texture */}
        <div className={`relative w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl transition-all duration-700 ${
          isDark
            ? 'shadow-indigo-500/40 border border-slate-200/30'
            : 'shadow-pink-300/40 border border-amber-100/50'
        }`}>
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
              {/* Mare Tranquillitatis & Serenity (Large Lunar Seas) */}
              <path 
                d="M60 45 Q75 35 95 42 Q115 50 120 70 Q122 88 105 95 Q88 102 70 90 Q52 78 60 45 Z" 
                fill="#64748b" 
                opacity="0.32" 
                filter="blur(3px)"
              />
              <path 
                d="M100 80 Q130 75 145 100 Q155 125 135 140 Q115 155 95 135 Q75 115 100 80 Z" 
                fill="#475569" 
                opacity="0.28" 
                filter="blur(4px)"
              />
              <path 
                d="M40 95 Q60 85 75 110 Q85 130 65 145 Q45 155 35 130 Q28 110 40 95 Z" 
                fill="#64748b" 
                opacity="0.25" 
                filter="blur(3px)"
              />

              {/* Oceanus Procellarum */}
              <path 
                d="M30 40 Q55 25 70 50 Q75 75 50 80 Q25 80 30 40 Z" 
                fill="#475569" 
                opacity="0.22" 
                filter="blur(3px)"
              />

              {/* Realistic Tycho Crater with Ray System */}
              <circle cx="115" cy="155" r="7" fill="#cbd5e1" opacity="0.9" />
              <circle cx="115" cy="155" r="4" fill="#64748b" opacity="0.5" />
              {/* Tycho ejecta rays */}
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
                  ? 'inset -14px -14px 28px rgba(15, 23, 42, 0.75), inset 6px 6px 16px rgba(255, 255, 255, 0.45)'
                  : 'inset -12px -12px 24px rgba(148, 163, 184, 0.55), inset 6px 6px 14px rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Ethereal Mist & Clouds */}
      <div 
        className="absolute top-16 -left-20 w-[650px] h-32 opacity-25 pointer-events-none transform-gpu"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.35) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 80%)'
            : 'radial-gradient(ellipse at center, rgba(253, 164, 175, 0.4) 0%, rgba(254, 205, 211, 0.2) 50%, transparent 80%)',
          filter: 'blur(30px)',
          animation: 'driftSlow 28s ease-in-out infinite alternate',
        }}
      />

      <div 
        className="absolute top-28 -right-24 w-[750px] h-36 opacity-30 pointer-events-none transform-gpu"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(199, 210, 254, 0.35) 0%, rgba(129, 140, 248, 0.15) 50%, transparent 80%)'
            : 'radial-gradient(ellipse at center, rgba(254, 215, 170, 0.45) 0%, rgba(251, 146, 60, 0.15) 50%, transparent 80%)',
          filter: 'blur(35px)',
          animation: 'driftSlow 36s ease-in-out infinite alternate-reverse',
        }}
      />
    </div>
  );
}
