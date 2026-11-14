/**
 * Ilustración de gorra usada cuando un producto no tiene imagen.
 * variant: 'dark' (gorra negra) | 'light' (gorra blanca)
 */
export default function CapArt({ variant = 'dark', label = 'GC' }) {
  const body = variant === 'dark' ? '#0a0a0a' : '#ffffff';
  const line = variant === 'dark' ? '#ffffff' : '#0a0a0a';
  return (
    <svg viewBox="0 0 240 180" className="cap-art" aria-hidden="true">
      <ellipse cx="128" cy="150" rx="92" ry="10" fill="#000" opacity="0.18" />
      {/* domo */}
      <path
        d="M40 122 C40 58 92 36 130 38 C176 42 196 80 196 122 Z"
        fill={body}
        stroke={line}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* costuras */}
      <path d="M128 40 C112 66 108 94 112 122" stroke={line} strokeWidth="2.5" fill="none" opacity="0.7" />
      <path d="M128 40 C150 66 158 94 160 122" stroke={line} strokeWidth="2.5" fill="none" opacity="0.5" />
      <circle cx="129" cy="38" r="6" fill={line} />
      {/* banda */}
      <path d="M40 122 L196 122" stroke={line} strokeWidth="4" />
      {/* visera */}
      <path
        d="M150 120 C186 112 226 116 234 130 C222 144 176 142 148 134 Z"
        fill={line}
        stroke={line}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* parche */}
      <circle cx="140" cy="88" r="20" fill={line} />
      <text
        x="140"
        y="96"
        textAnchor="middle"
        fontFamily="var(--font-display), Impact, sans-serif"
        fontSize="22"
        fill={body}
      >
        {label}
      </text>
    </svg>
  );
}
