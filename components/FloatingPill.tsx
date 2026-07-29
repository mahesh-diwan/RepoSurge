import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import { NAV_LINKS } from "@/lib/nav-links";

export default function FloatingPill() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="sm:max-w-lg mx-auto mt-2 mx-2 sm:mx-auto">
        <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 sm:py-2 py-1.5 bg-surface border border-border rounded-full shadow-accent">
          <a href="/" className="font-mono text-accent font-bold tracking-wider" title="RepoSurge">
            [RS]
          </a>
          <NavLinks links={NAV_LINKS} />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
