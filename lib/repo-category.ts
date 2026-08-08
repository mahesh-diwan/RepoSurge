const CATEGORY_KEYWORDS: Record<string, string[]> = {
  ai: [
    "gpt", "llm", "transformer", "neural", "machine learning", "deep learning",
    "ai", "artificial intelligence", "language model", "token", "embedding",
    "rag", "diffusion", "stable diffusion",
  ],
  database: [
    "database", "sql", "postgres", "mysql", "sqlite", "redis", "mongodb",
    "cockroach", "dynamo", "cassandra", "neo4j", "duckdb",
  ],
  devtools: [
    "cli", "terminal", "compiler", "linter", "formatter", "debugger",
    "package manager", "bundler", "build tool", "ide", "editor",
  ],
  framework: [
    "framework", "react", "vue", "angular", "svelte", "nextjs", "next.js",
    "nuxt", "django", "rails", "spring", "laravel",
  ],
  infra: [
    "kubernetes", "k8s", "docker", "terraform", "ansible", "cloud",
    "aws", "gcp", "azure", "container", "orchestrator",
  ],
};

/**
 * Pure: maps a repo description to a category slug via keyword matching.
 * Returns null when no category matches.
 */
export function detectCategory(description: string | null): string | null {
  if (!description) return null;
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return category;
    }
  }
  return null;
}
