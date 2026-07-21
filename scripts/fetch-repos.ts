import { fetchTopRepos } from "../lib/github";
import {
  insertRepo,
  insertStarHistory,
} from "../lib/db";

const LANGUAGES = [
  "javascript",
  "python",
  "rust",
  "go",
  "typescript",
  "java",
];

const REPOS_PER_LANGUAGE = 100;

async function main() {
  const today = new Date().toISOString();

  for (const language of LANGUAGES) {
    console.log(`Fetching top ${REPOS_PER_LANGUAGE} ${language} repos...`);
    try {
      const repos = await fetchTopRepos(language, REPOS_PER_LANGUAGE);
      for (const repo of repos) {
        const id =
          getRepoId(repo.full_name) ??
          insertRepo({
            full_name: repo.full_name,
            name: repo.name,
            owner: repo.owner.login,
            description: repo.description,
            language: repo.language,
            url: repo.html_url,
            stars: repo.stargazers_count,
            fetched_at: today,
          });
        insertStarHistory(id, repo.stargazers_count, today);
      }
      console.log(`  saved ${repos.length} ${language} repos`);
    } catch (err) {
      console.error(`  failed ${language}:`, (err as Error).message);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
