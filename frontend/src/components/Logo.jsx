export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'neonPulse 2.5s ease-in-out infinite' }}>
      <defs>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#00e676"/><stop offset="1" stopColor="#00c853"/>
        </linearGradient>
      </defs>
      <path d="M22 2L6 14V34L22 42L38 34V14L22 2Z" fill="#0f0f0f" stroke="url(#logoGrad)" strokeWidth="2.5" filter="url(#logoGlow)"/>
      <path d="M22 10L12 18V30L22 36L32 30V18L22 10Z" fill="url(#logoGrad)" opacity="0.9"/>
      <text x="22" y="27" textAnchor="middle" fill="#0a0a0a" fontSize="11" fontWeight="900" fontFamily="Inter, sans-serif">S</text>
    </svg>
  );
}
