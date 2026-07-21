import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import TrustLogos from "@/components/TrustLogos";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import SortSelect from "@/components/SortSelect";
import RepoCard from "@/components/RepoCard";


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
    <>
      <Header />
      <TrustLogos />

      <main className="max-w-7xl mx-auto px-4" id="repos">
        <div className="reveal">
          <FilterBar period={period} language={language} />
        </div>
        <SearchBar />
        <SortSelect />

        <div id="repo-list" className="reveal-stagger">
          {repos.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-bone/40 text-sm">no repos for this filter.</p>
            </div>
          ) : (
            repos.map((repo, i) => (
              <RepoCard
                key={repo.full_name}
                rank={repo.rank}
                full_name={repo.full_name}
                description={repo.description}
                language={repo.language}
                url={repo.url}
                stars={repo.stars}
                stars_gained={repo.stars_gained}
                velocity={repo.velocity}
                sparkline={repo.sparkline}
                slug={repo.slug}
                style={{ "--stagger": i } as React.CSSProperties}
              />
            ))
          )}
        </div>
      </main>
    </>
  );
}
