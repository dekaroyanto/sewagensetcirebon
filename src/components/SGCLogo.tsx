import React from 'react';

interface SGCLogoProps {
  variant?: 'emblem' | 'horizontal' | 'vertical' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  showSubtitle?: boolean;
}

export const SGCLogo: React.FC<SGCLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showSubtitle = true
}) => {
  // Size presets
  const emblemSizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
    custom: ''
  };

  const textSizes = {
    xs: { title: 'text-xs', sub: 'text-[9px]', tracking: 'tracking-wider' },
    sm: { title: 'text-sm font-black', sub: 'text-[10px]', tracking: 'tracking-widest' },
    md: { title: 'text-base font-black sm:text-lg', sub: 'text-[11px]', tracking: 'tracking-widest' },
    lg: { title: 'text-xl font-black sm:text-2xl', sub: 'text-xs', tracking: 'tracking-widest' },
    xl: { title: 'text-2xl font-black sm:text-3xl', sub: 'text-sm', tracking: 'tracking-widest' },
    '2xl': { title: 'text-3xl font-black sm:text-4xl', sub: 'text-base', tracking: 'tracking-widest' },
    custom: { title: '', sub: '', tracking: '' }
  };

  // Pure SVG Emblem of the official SGC Gear + Lightning + SGC + INDONESIA badge
  const renderEmblem = (customClass = '') => (
    <div className={`relative shrink-0 ${customClass || emblemSizes[size] || 'w-10 h-10'}`}>
      <svg
        viewBox="0 0 260 260"
        className="w-full h-full drop-shadow-sm select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sgcOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="sgcBolt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="40%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* Center Group */}
        <g transform="translate(130, 130)">
          {/* Industrial Gear (Roda Gigi) - Theme responsive */}
          <path
            d="
              M -16 -95 L 16 -95 L 20 -76 
              A 78 78 0 0 1 54 -64 L 72 -72 L 92 -44 L 78 -30 
              A 78 78 0 0 1 85 8 L 103 18 L 95 49 L 76 49 
              A 78 78 0 0 1 54 80 L 62 98 L 34 110 L 20 97 
              A 78 78 0 0 1 -20 97 L -34 110 L -62 98 L -54 80 
              A 78 78 0 0 1 -76 49 L -95 49 L -103 18 L -85 8 
              A 78 78 0 0 1 -78 -30 L -92 -44 L -72 -72 L -54 -64 
              A 78 78 0 0 1 -20 -76 Z
              
              M 0 -56 
              A 56 56 0 1 0 0 56 
              A 56 56 0 1 0 0 -56 Z
            "
            className="fill-slate-900 dark:fill-white transition-colors duration-200"
            fillRule="evenodd"
          />

          {/* Lightning Bolt (Petir Listrik) */}
          <polygon
            points="-4,-115 15,-115 2,-62 20,-62 -12,4 2,-50 -15,-50"
            fill="url(#sgcBolt)"
          />

          {/* SGC Dynamic Lettermark */}
          {/* S letter */}
          <path
            d="
              M -86 -18 
              L -28 -18 
              L -36 4 
              L -70 4 
              L -72 15 
              L -31 15 
              L -39 39 
              L -98 39 
              L -90 16 
              L -57 16 
              L -55 6 
              L -94 6 Z
            "
            fill="url(#sgcOrange)"
          />

          {/* G letter */}
          <path
            d="
              M -33 -18 
              L 28 -18 
              L 20 2 
              L -8 2 
              L -11 15 
              L 16 15 
              L 12 26 
              L -4 26 
              L -7 39 
              L 37 39 
              L 45 8 
              L 47 -4 
              L -23 -4 
              L -20 -11 
              L 33 -11 
              L 39 -29 
              L -37 -29 Z
            "
            className="fill-slate-900 dark:fill-white transition-colors duration-200"
          />
          {/* Inner Accent in G */}
          <polygon
            points="-12,8 15,8 11,20 -16,20"
            fill="url(#sgcOrange)"
          />

          {/* C letter */}
          <path
            d="
              M 25 -18 
              L 86 -18 
              L 78 2 
              L 49 2 
              L 45 16 
              L 74 16 
              L 66 39 
              L 10 39 
              L 16 12 
              L 20 -4 Z
            "
            className="fill-slate-900 dark:fill-white transition-colors duration-200"
          />

          {/* INDONESIA beneath SGC in Gear */}
          <text
            x="0"
            y="54"
            fontFamily="'Outfit', 'Plus Jakarta Sans', 'Arial Black', sans-serif"
            fontSize="11"
            fontWeight="900"
            letterSpacing="4"
            fill="#EA580C"
            textAnchor="middle"
          >
            INDONESIA
          </text>
        </g>
      </svg>
    </div>
  );

  // Variant: Emblem only
  if (variant === 'emblem') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderEmblem()}</div>;
  }

  // Variant: Vertical Stack (Like the uploaded original image)
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {renderEmblem(size === '2xl' ? 'w-32 h-32 sm:w-40 sm:h-40' : size === 'xl' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-16 h-16 sm:w-20 sm:h-20')}

        <div className="mt-3">
          <h1 className={`font-display font-black tracking-wider text-slate-900 dark:text-white uppercase leading-tight ${textSizes[size].title}`}>
            SEWA GENSET CIREBON
          </h1>

          {showSubtitle && (
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-[2px] w-6 sm:w-10 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
              <span className={`font-extrabold tracking-widest text-amber-600 dark:text-amber-500 uppercase ${textSizes[size].sub}`}>
                INDONESIA
              </span>
              <span className="h-[2px] w-6 sm:w-10 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant: Full image-like presentation
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
        {renderEmblem('w-28 h-28 sm:w-36 sm:h-36')}
        <div className="mt-4">
          <div className="font-display font-black text-lg sm:text-2xl text-slate-900 dark:text-white tracking-wide uppercase leading-none">
            SEWA GENSET CIREBON
          </div>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="h-[2.5px] w-8 sm:w-16 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
            <span className="font-black text-xs sm:text-sm tracking-widest text-amber-600 dark:text-amber-500 uppercase">
              INDONESIA
            </span>
            <span className="h-[2.5px] w-8 sm:w-16 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
          </div>
        </div>
      </div>
    );
  }

  // Default Variant: Horizontal Navbar/Footer Style
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {renderEmblem()}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-display font-black text-slate-900 dark:text-white uppercase tracking-tight ${textSizes[size].title}`}>
            SEWA GENSET CIREBON
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1 leading-none">
            <span className="h-[1.5px] w-3 sm:w-5 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
            <span className={`font-extrabold tracking-widest text-amber-600 dark:text-amber-500 uppercase ${textSizes[size].sub}`}>
              INDONESIA
            </span>
            <span className="h-[1.5px] w-3 sm:w-5 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline ml-1 font-medium">
              • Rental Genset &amp; AC
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
