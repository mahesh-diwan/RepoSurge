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
      <section className="border-y border-[#1a1a1a] py-4 mb-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 flex-wrap">
          {LOGOS.map((logo) => (
            <img
              key={logo.slug}
              src={`https://cdn.simpleicons.org/${logo.slug}/666666`}
              alt={logo.alt}
              width={14}
              height={14}
              className="hover:brightness-150 transition-all duration-300"
              loading="lazy"
            />
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
