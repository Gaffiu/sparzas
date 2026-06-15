export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L4 12V26L16 30L28 26V12L16 2Z" fill="#00c853" />
        <path d="M16 8L10 13V22L16 26L22 22V13L16 8Z" fill="#0a0a0a" />
        <path d="M18 14L16 12L14 14V20L16 22L18 20V14Z" fill="#00c853" />
      </svg>
      <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#00c853' }}>
        SPARZAS
      </span>
    </div>
  );
}
