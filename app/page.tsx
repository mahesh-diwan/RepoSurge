import { getRepos } from "@/lib/db";
import TimeTabs from "@/components/TimeTabs";
import LanguageFilter from "@/components/LanguageFilter";
import RepoCard from "@/components/RepoCard";

export const revalidate = 3600;

export default function Home({
  searchParams,
}: {
  searchParams: { period?: string; language?: string };
}) {
  const period = searchParams.period ?? "week";
  const language = searchParams.language ?? "all";

  const repos = getRepos(period).filter(
    (r) => language === "all" || (r.language ?? "").toLowerCase() === language
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6 text-left">
        <h1 className="text-3xl font-bold tracking-tight">
          REP<span className="text-electric">Ø</span>SURGE
        </h1>
        <p className="text-bone/50 text-xs mt-1">
          repos rising. fast. ranked by star velocity.
        </p>
      </header>

      <div className="flex flex-col gap-3 mb-6">
        <TimeTabs selected={period} language={language} />
        <LanguageFilter selected={language} period={period} />
      </div>

      <section>
        {repos.length === 0 ? (
          <p className="text-bone/40 text-sm">no repos for this filter.</p>
        ) : (
          repos.map((repo, i) => (
            <RepoCard
              key={repo.full_name}
              rank={i + 1}
              full_name={repo.full_name}
              description={repo.description}
              language={repo.language}
              url={repo.url}
              stars={repo.stars}
              stars_gained={repo.stars_gained}
              velocity={repo.velocity}
              sparkline={repo.sparkline}
            />
          ))
        )}
      </section>

      <footer className="mt-10 text-bone/30 text-xs border-t border-bone/20 pt-4">
        data: github api · refreshed daily
      </footer>
    </main>
  );
}
