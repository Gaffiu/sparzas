export default function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'neonPulse 2s infinite' }}>
      <defs>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M22 2L6 14V34L22 42L38 34V14L22 2Z" fill="#0f0f0f" stroke="#00e676" strokeWidth="2.5" filter="url(#logoGlow)"/>
      <path d="M22 10L12 18V30L22 36L32 30V18L22 10Z" fill="#00e676" opacity="0.85"/>
      <text x="22" y="27" textAnchor="middle" fill="#0a0a0a" fontSize="11" fontWeight="900" fontFamily="Inter">S</text>
      <line x1="22" y1="32" x2="22" y2="39" stroke="#00e676" strokeWidth="2.5" strokeLinecap="round" filter="url(#logoGlow)"/>
      <line x1="16" y1="37" x2="28" y2="37" stroke="#00e676" strokeWidth="2.5" strokeLinecap="round" filter="url(#logoGlow)"/>
    </svg>
  );
}
