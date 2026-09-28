import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const currentHeight = heightClasses[size];

  if (!showText) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <svg
          viewBox="0 0 155 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentHeight} w-auto transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]`}
          aria-label="Yorleidys Ruiz Logo Monograma"
        >
          <defs>
            <linearGradient id="yrIconGradOnly" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <g>
            {/* Sparkle Star at Top Left */}
            <path
              d="M38 4 Q38 18 24 18 Q38 18 38 32 Q38 18 52 18 Q38 18 38 4 Z"
              fill="#c084fc"
            />
            {/* Left Diagonal of Y */}
            <polygon points="6,34 32,34 68,90 42,90" fill="url(#yrIconGradOnly)" />
            {/* Bottom Vertical Leg */}
            <rect x="42" y="90" width="24" height="52" fill="url(#yrIconGradOnly)" />
            {/* R Loop & Leg with Transparent Counter (evenodd) */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M54,82 L80,34 L110,34 C134,34 145,46 145,66 C145,82 134,92 112,94 L142,142 L116,142 L90,94 L68,94 Z
                 M78,52 L104,52 C116,52 121,57 121,66 C121,73 116,78 104,78 L72,78 Z"
              fill="url(#yrIconGradOnly)"
            />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 530 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentHeight} w-auto max-w-full transition-all duration-200 group-hover:brightness-110 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]`}
        aria-label="Yorleidys Ruiz | Desarrolladora Web & Diseñadora Digital"
      >
        <defs>
          <linearGradient id="yrFullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* Monograma YR */}
        <g id="yr-brand-monogram">
          {/* Sparkle Star at Top Left */}
          <path
            d="M38 4 Q38 18 24 18 Q38 18 38 32 Q38 18 52 18 Q38 18 38 4 Z"
            fill="#c084fc"
          />

          {/* Left Diagonal of Y */}
          <polygon points="6,34 32,34 68,90 42,90" fill="url(#yrFullGrad)" />

          {/* Bottom Vertical Leg */}
          <rect x="42" y="90" width="24" height="52" fill="url(#yrFullGrad)" />

          {/* R Loop & Leg with Transparent Counter (evenodd) */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M54,82 L80,34 L110,34 C134,34 145,46 145,66 C145,82 134,92 112,94 L142,142 L116,142 L90,94 L68,94 Z
               M78,52 L104,52 C116,52 121,57 121,66 C121,73 116,78 104,78 L72,78 Z"
            fill="url(#yrFullGrad)"
          />
        </g>

        {/* Línea vertical divisoria */}
        <rect x="168" y="24" width="4" height="118" rx="2" fill="#7c3aed" />

        {/* Bloque tipográfico */}
        <g fontFamily="'Poppins', 'Montserrat', 'Inter', -apple-system, sans-serif">
          <text x="192" y="62" fill="#ffffff" fontWeight="800" fontSize="33" letterSpacing="1.5">
            YORLEIDYS
          </text>
          <text x="192" y="98" fill="#ffffff" fontWeight="800" fontSize="33" letterSpacing="1.5">
            RUIZ
          </text>
          <text x="192" y="122" fill="#ffffff" fontWeight="600" fontSize="12.5" letterSpacing="2.8">
            DESARROLLADORA WEB
          </text>
          <text x="192" y="139" fill="#c084fc" fontWeight="600" fontSize="12.5" letterSpacing="2.8">
            &amp; DISEÑADORA DIGITAL
          </text>
        </g>
      </svg>
    </div>
  );
};
