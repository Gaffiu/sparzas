export default function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M20 2L6 12V30L20 38L34 30V12L20 2Z" fill="#0f0f0f" stroke="#00e676" strokeWidth="2" filter="url(#glow)"/>
      <path d="M20 10L12 17V27L20 32L28 27V17L20 10Z" fill="#00e676" opacity="0.8"/>
      <text x="20" y="25" textAnchor="middle" fill="#0f0f0f" fontSize="10" fontWeight="900" fontFamily="Inter">S</text>
      <line x1="20" y1="30" x2="20" y2="36" stroke="#00e676" strokeWidth="2" strokeLinecap="round" filter="url(#glow)"/>
      <line x1="14" y1="34" x2="26" y2="34" stroke="#00e676" strokeWidth="2" strokeLinecap="round" filter="url(#glow)"/>
    </svg>
  );
}
