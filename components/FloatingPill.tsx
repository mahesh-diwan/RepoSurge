import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import { NAV_LINKS } from "@/lib/nav-links";

export default function FloatingPill() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-5 py-2 bg-surface border border-border rounded-full shadow-accent">
        <a href="/" className="text-accent font-bold tracking-wider" title="RepoSurge">
          RS
        </a>
        <NavLinks links={NAV_LINKS} />
        <MobileNav />
      </div>
    </div>
  );
}
