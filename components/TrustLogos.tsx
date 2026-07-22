import ScrollReveal from "./ScrollReveal";

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
    <ScrollReveal>
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-10 flex-wrap">
          {LOGOS.map((logo) => (
            <img
              key={logo.slug}
              src={`https://cdn.simpleicons.org/${logo.slug}/F5F5F0`}
              alt={logo.alt}
              width={18}
              height={18}
              className="opacity-20 hover:opacity-50 transition-opacity duration-700"
              style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
              loading="lazy"
            />
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
