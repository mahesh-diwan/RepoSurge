const LOGOS = [
  { slug: "github", alt: "GitHub" },
  { slug: "vercel", alt: "Vercel" },
  { slug: "rust", alt: "Rust" },
  { slug: "go", alt: "Go" },
  { slug: "python", alt: "Python" },
  { slug: "typescript", alt: "TypeScript" },
];

export default function TrustLogos() {
  return (
    <section className="border-t border-bone/20 py-6">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 flex-wrap">
        {LOGOS.map((logo) => (
          <img
            key={logo.slug}
            src={`https://cdn.simpleicons.org/${logo.slug}/F5F5F0`}
            alt={logo.alt}
            width={20}
            height={20}
            className="opacity-40 hover:opacity-70 transition-opacity"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
