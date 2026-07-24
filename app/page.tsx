import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  const repos = getRepos("week");

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6">
        <RepoList repos={repos} />
      </main>
    </>
  );
}
