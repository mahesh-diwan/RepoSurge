export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="arrow-grad" x1="10" y1="30" x2="30" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Hexagon base */}
      <path
        d="M20 2L34 10V28L20 36L6 28V10L20 2Z"
        fill="url(#logo-grad)"
        fillOpacity="0.15"
        stroke="url(#logo-grad)"
        strokeWidth="1.5"
      />
      {/* Star */}
      <path
        d="M20 8L22.5 15.5H30L24 20L26 27.5L20 23L14 27.5L16 20L10 15.5H17.5L20 8Z"
        fill="url(#logo-grad)"
      />
      {/* Surge line */}
      <path
        d="M11 30L16 25L19 27L29 18"
        stroke="url(#arrow-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
