import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoSurge — repos rising. fast.",
  description: "GitHub repositories ranked by star velocity. Brutalist. Fast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <nav className="border-b border-bone/20 sticky top-0 z-40 bg-midnight/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight text-bone hover:text-electric transition-colors">
              REP<span className="text-electric">Ø</span>SURGE
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="/#repos" className="text-bone/70 text-sm tracking-widest hover:text-electric transition-colors">Rankings</a>
              <a href="/about" className="text-bone/70 text-sm tracking-widest hover:text-electric transition-colors">About</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-bone/70 text-sm tracking-widest hover:text-electric transition-colors">GitHub</a>
            </div>
            <button id="mobile-toggle" className="md:hidden text-bone hover:text-electric transition-colors" aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
          <div id="mobile-menu" className="hidden md:hidden py-4 border-t border-bone/20">
            <nav className="flex flex-col gap-4 px-4">
              <a href="/#repos" className="text-bone/70 text-sm tracking-widest hover:text-electric transition-colors">Rankings</a>
              <a href="/about" className="text-bone/70 text-sm tracking-widest hover:text-electric transition-colors">About</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-bone/70 text-sm tracking-widest hover:text-electric transition-colors">GitHub</a>
            </nav>
          </div>
        </nav>

        {children}

        <footer className="mt-10 text-bone/30 text-xs border-t border-bone/20 pt-4 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            data: github api | refreshed daily
          </div>
        </footer>

        <script dangerouslySetInnerHTML={{ __html: `
          document.getElementById('mobile-toggle')?.addEventListener('click', function() {
            document.getElementById('mobile-menu')?.classList.toggle('hidden');
          });
        `}} />

        <script dangerouslySetInnerHTML={{ __html: `
          var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
          }, { threshold: 0.1 });
          revealEls.forEach(function(el) { observer.observe(el); });

          var stored = localStorage.getItem('reposurge-prefs');
          if (stored) {
            try {
              var prefs = JSON.parse(stored);
              var params = new URLSearchParams(window.location.search);
              if (!params.has('period') && prefs.period) params.set('period', prefs.period);
              if (!params.has('language') && prefs.language) params.set('language', prefs.language);
              if (params.toString() !== window.location.search.slice(1)) {
                window.location.search = params.toString();
              }
            } catch(e) {}
          }

          document.querySelectorAll('a[href*="period="]').forEach(function(link) {
            link.addEventListener('click', function() {
              var url = new URL(link.href);
              var period = url.searchParams.get('period');
              var language = url.searchParams.get('language');
              if (period || language) {
                localStorage.setItem('reposurge-prefs', JSON.stringify({
                  period: period || 'week',
                  language: language || 'all',
                }));
              }
            });
          });
        `}} />
      </body>
    </html>
  );
}
