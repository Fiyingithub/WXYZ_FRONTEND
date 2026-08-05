// ============================================
// EmptyCartRunner.tsx
// Original animated "runner" illustration for empty-cart states.
// No third-party IP — custom character, brand-colored (#f2592b).
// ============================================
import React from 'react';

export const EmptyCartRunner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <style>{`
        @keyframes runnerBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes armSwingFront {
          0%, 100% { transform: rotate(35deg); }
          50% { transform: rotate(-30deg); }
        }
        @keyframes armSwingBack {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(35deg); }
        }
        @keyframes legSwingFront {
          0%, 100% { transform: rotate(-35deg); }
          50% { transform: rotate(40deg); }
        }
        @keyframes legSwingBack {
          0%, 100% { transform: rotate(40deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes dustFade {
          0% { opacity: 0.55; transform: translateX(0) scaleX(1); }
          100% { opacity: 0; transform: translateX(-18px) scaleX(0.6); }
        }
        @keyframes capBob {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        .runner-body {
          animation: runnerBounce 0.6s ease-in-out infinite;
          transform-origin: center;
        }
        .runner-arm-front {
          animation: armSwingFront 0.6s ease-in-out infinite;
          transform-origin: 138px 118px;
        }
        .runner-arm-back {
          animation: armSwingBack 0.6s ease-in-out infinite;
          transform-origin: 96px 118px;
        }
        .runner-leg-front {
          animation: legSwingFront 0.6s ease-in-out infinite;
          transform-origin: 120px 168px;
        }
        .runner-leg-back {
          animation: legSwingBack 0.6s ease-in-out infinite;
          transform-origin: 104px 168px;
        }
        .runner-cap {
          animation: capBob 0.6s ease-in-out infinite;
          transform-origin: 118px 62px;
        }
        .dust-line {
          animation: dustFade 0.9s ease-out infinite;
        }
        .dust-line:nth-child(2) { animation-delay: 0.15s; }
        .dust-line:nth-child(3) { animation-delay: 0.3s; }

        @media (prefers-reduced-motion: reduce) {
          .runner-body, .runner-arm-front, .runner-arm-back,
          .runner-leg-front, .runner-leg-back, .runner-cap, .dust-line {
            animation: none !important;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 260 220"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', maxWidth: 220 }}
      >
        {/* Ground shadow */}
        <ellipse cx="115" cy="205" rx="55" ry="8" fill="#000" opacity="0.08" />

        {/* Motion / dust lines */}
        <g>
          <rect className="dust-line" x="30" y="150" width="26" height="4" rx="2" fill="#f2592b" opacity="0.5" />
          <rect className="dust-line" x="20" y="165" width="34" height="4" rx="2" fill="#f2592b" opacity="0.4" />
          <rect className="dust-line" x="34" y="180" width="20" height="4" rx="2" fill="#f2592b" opacity="0.3" />
        </g>

        {/* Runner body group */}
        <g className="runner-body">
          {/* Back leg */}
          <g className="runner-leg-back">
            <rect x="98" y="150" width="14" height="42" rx="7" fill="#3a3a3a" />
            <ellipse cx="105" cy="196" rx="14" ry="8" fill="#f2592b" />
          </g>

          {/* Back arm */}
          <g className="runner-arm-back">
            <rect x="90" y="100" width="12" height="38" rx="6" fill="#e8794f" />
            <circle cx="96" cy="140" r="7" fill="#e8794f" />
          </g>

          {/* Torso (hoodie) */}
          <path
            d="M92 95 Q118 78 146 95 L150 150 Q118 165 88 150 Z"
            fill="#4b5563"
          />
          {/* Hoodie pocket detail */}
          <path d="M104 128 Q118 138 134 128 L134 142 Q118 150 104 142 Z" fill="#3f4653" />
          {/* Hoodie drawstrings */}
          <line x1="112" y1="98" x2="110" y2="112" stroke="#f2592b" strokeWidth="2" strokeLinecap="round" />
          <line x1="126" y1="98" x2="128" y2="112" stroke="#f2592b" strokeWidth="2" strokeLinecap="round" />

          {/* Front leg */}
          <g className="runner-leg-front">
            <rect x="114" y="150" width="14" height="42" rx="7" fill="#4b5563" />
            <ellipse cx="121" cy="196" rx="14" ry="8" fill="#f2592b" />
          </g>

          {/* Head */}
          <circle cx="118" cy="70" r="26" fill="#e8794f" />

          {/* Face — simple happy expression */}
          <circle cx="109" cy="72" r="2.6" fill="#2d2d2d" />
          <circle cx="127" cy="72" r="2.6" fill="#2d2d2d" />
          <path d="M107 82 Q118 90 129 82" stroke="#2d2d2d" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Cap */}
          <g className="runner-cap">
            <path d="M92 60 Q118 34 144 60 L144 58 Q118 44 92 58 Z" fill="#f2592b" />
            <path d="M90 58 Q118 42 146 58 Q146 66 118 66 Q92 66 90 58 Z" fill="#f2592b" />
            <path d="M138 58 Q158 58 160 66 Q146 68 136 64 Z" fill="#d9481f" />
          </g>

          {/* Front arm */}
          <g className="runner-arm-front">
            <rect x="132" y="100" width="12" height="38" rx="6" fill="#4b5563" />
            <circle cx="140" cy="140" r="7" fill="#e8794f" />
          </g>
        </g>
      </svg>
    </div>
  );
};