export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Star shape */}
      <path
        d="M16 2L19.09 11.27H29L20.95 17.73L23.82 27L16 20.5L8.18 27L11.05 17.73L3 11.27H12.91L16 2Z"
        fill="url(#star-gradient)"
        stroke="url(#star-stroke)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Surge arrow */}
      <path
        d="M8 24L12 20L15 22L24 14"
        stroke="url(#arrow-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="star-gradient" x1="3" y1="2" x2="29" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="star-stroke" x1="3" y1="2" x2="29" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="arrow-gradient" x1="8" y1="24" x2="24" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}
