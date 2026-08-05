// ============================================
// NotFoundPage.tsx
// 404 page — reuses the runner character's visual language
// (same palette, same "on-the-move" energy) but lost/confused.
// ============================================
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <style>{`
        @keyframes scratchHead {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes questionFloat {
          0%, 100% { transform: translateY(0) rotate(-4deg); opacity: 0.9; }
          50% { transform: translateY(-8px) rotate(4deg); opacity: 1; }
        }
        @keyframes signSwing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .nf-arm {
          animation: scratchHead 1.4s ease-in-out infinite;
          transform-origin: 96px 100px;
        }
        .nf-question {
          animation: questionFloat 2.2s ease-in-out infinite;
        }
        .nf-sign {
          animation: signSwing 3s ease-in-out infinite;
          transform-origin: 130px 90px;
        }
        .nf-eyes {
          animation: blink 3.6s ease-in-out infinite;
          transform-origin: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-arm, .nf-question, .nf-sign, .nf-eyes { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 300 240"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", maxWidth: 280, height: "auto" }}
      >
        {/* Ground shadow */}
        <ellipse cx="150" cy="220" rx="90" ry="10" fill="#000" opacity="0.07" />

        {/* Crooked signpost */}
        <g className="nf-sign">
          <rect x="196" y="70" width="8" height="130" rx="3" fill="#8a8f98" />
          <rect
            x="170"
            y="80"
            width="70"
            height="24"
            rx="4"
            fill="#f2592b"
            transform="rotate(-8 205 92)"
          />
          <text
            x="205"
            y="97"
            transform="rotate(-8 205 92)"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#fff"
            fontFamily="sans-serif"
          >
            ???
          </text>
          <rect
            x="180"
            y="112"
            width="60"
            height="20"
            rx="4"
            fill="#4b5563"
            transform="rotate(6 210 122)"
          />
          <text
            x="210"
            y="127"
            transform="rotate(6 210 122)"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#fff"
            fontFamily="sans-serif"
          >
            HOME →
          </text>
        </g>

        {/* Floating question mark */}
        <g className="nf-question">
          <text
            x="130"
            y="46"
            fontSize="34"
            fontWeight="800"
            fill="#f2592b"
            fontFamily="sans-serif"
          >
            ?
          </text>
        </g>

        {/* Character body (seated, puzzled) */}
        <g>
          {/* legs, crossed/seated */}
          <ellipse cx="80" cy="190" rx="16" ry="9" fill="#f2592b" />
          <ellipse cx="112" cy="190" rx="16" ry="9" fill="#f2592b" />
          <rect x="70" y="150" width="16" height="42" rx="8" fill="#4b5563" />
          <rect x="98" y="150" width="16" height="42" rx="8" fill="#3f4653" />

          {/* torso (hoodie) */}
          <path
            d="M62 100 Q94 82 126 100 L130 155 Q94 172 58 155 Z"
            fill="#4b5563"
          />
          <path
            d="M76 132 Q94 142 112 132 L112 146 Q94 154 76 146 Z"
            fill="#3f4653"
          />
          <line
            x1="84"
            y1="102"
            x2="82"
            y2="116"
            stroke="#f2592b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="102"
            x2="102"
            y2="116"
            stroke="#f2592b"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* resting arm */}
          <rect x="112" y="112" width="12" height="34" rx="6" fill="#4b5563" />
          <circle cx="118" cy="148" r="7" fill="#e8794f" />

          {/* head */}
          <circle cx="94" cy="72" r="26" fill="#e8794f" />

          {/* cap, pushed back like scratching underneath */}
          <path
            d="M68 62 Q94 38 120 62 Q120 68 94 70 Q68 68 68 62 Z"
            fill="#f2592b"
          />
          <path d="M112 60 Q130 60 132 68 Q120 70 110 66 Z" fill="#d9481f" />

          {/* scratching arm (over head) */}
          <g className="nf-arm">
            <rect x="64" y="66" width="12" height="34" rx="6" fill="#e8794f" />
            <circle cx="70" cy="64" r="7" fill="#e8794f" />
          </g>

          {/* face */}
          <g className="nf-eyes">
            <circle cx="85" cy="74" r="2.6" fill="#2d2d2d" />
            <circle cx="103" cy="74" r="2.6" fill="#2d2d2d" />
          </g>
          <path
            d="M86 86 Q94 82 102 86"
            stroke="#2d2d2d"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <h1 className="text-6xl font-extrabold text-[#f2592b] mt-2 tracking-tight">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">
        Page not found
      </h2>
      <p className="text-gray-400 mt-2 max-w-sm">
        The page you're looking for doesn't exist, moved, or took a wrong turn
        somewhere.
      </p>

      <div className="flex items-center gap-3 mt-8 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          <FaArrowLeft /> Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-[#f2592b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e04a1f] transition-colors"
        >
          <FaHome /> Back to Home
        </button>
      </div>
    </div>
  );
};
