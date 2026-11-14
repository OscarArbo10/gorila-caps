'use client';

/**
 * Cara de gorila con gorra (logo de Gorila Caps).
 * - Usa currentColor para el pelaje y var(--face) para la cara / gorra.
 * - Las pupilas se mueven con las variables CSS --px y --py.
 */
export default function GorillaFace({ size = 48, className = '', title = 'Gorila Caps' }) {
  return (
    <svg
      viewBox="0 0 220 200"
      width={size}
      height={size}
      className={`gorilla-face ${className}`}
      role="img"
      aria-label={title}
    >
      {/* orejas */}
      <circle cx="40" cy="112" r="18" fill="currentColor" />
      <circle cx="160" cy="112" r="18" fill="currentColor" />
      <circle cx="40" cy="112" r="8" fill="var(--face)" opacity="0.25" />
      <circle cx="160" cy="112" r="8" fill="var(--face)" opacity="0.25" />

      {/* cabeza */}
      <path
        d="M100 34 C150 34 168 72 166 112 C164 160 136 186 100 186 C64 186 36 160 34 112 C32 72 50 34 100 34Z"
        fill="currentColor"
      />

      {/* máscara facial */}
      <path
        d="M100 84 C124 76 146 86 145 110 C144 126 137 133 139 149 C141 168 122 179 100 179 C78 179 59 168 61 149 C63 133 56 126 55 110 C54 86 76 76 100 84Z"
        fill="var(--face)"
      />

      {/* ceja / frente */}
      <path
        d="M50 104 C60 86 88 86 100 97 C112 86 140 86 150 104 C138 99 118 101 100 109 C82 101 62 99 50 104Z"
        fill="currentColor"
      />

      {/* ojos */}
      <g className="gorilla-eyes">
        <ellipse cx="80" cy="117" rx="9" ry="9" fill="currentColor" />
        <ellipse cx="120" cy="117" rx="9" ry="9" fill="currentColor" />
        <g className="gorilla-pupils">
          <circle cx="82" cy="115" r="3.2" fill="var(--face)" />
          <circle cx="122" cy="115" r="3.2" fill="var(--face)" />
        </g>
      </g>

      {/* nariz */}
      <path
        d="M82 142 C82 130 118 130 118 142 C118 151 109 153 100 153 C91 153 82 151 82 142Z"
        fill="currentColor"
      />
      <ellipse cx="92" cy="144" rx="4" ry="3" fill="var(--face)" />
      <ellipse cx="108" cy="144" rx="4" ry="3" fill="var(--face)" />

      {/* boca */}
      <path
        d="M84 166 Q100 174 116 166"
        stroke="currentColor"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* gorra */}
      <g className="gorilla-cap">
        <path
          d="M46 78 C44 20 156 14 156 78 Z"
          fill="var(--face)"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M100 22 C96 40 95 60 98 78" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="100" cy="21" r="5" fill="currentColor" />
        <path
          d="M42 76 H158 C190 76 214 84 208 92 C196 102 150 96 120 92 L42 88 Z"
          fill="currentColor"
        />
        <text
          x="72"
          y="66"
          fontFamily="var(--font-display), Impact, sans-serif"
          fontSize="26"
          fill="currentColor"
        >
          GC
        </text>
      </g>
    </svg>
  );
}
