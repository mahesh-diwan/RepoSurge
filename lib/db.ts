import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "repos.db");

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  initializeDb(db);
  dbInstance = db;
  return db;
}

function initializeDb(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS repos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      owner TEXT NOT NULL,
      description TEXT,
      language TEXT,
      url TEXT,
      stars INTEGER NOT NULL DEFAULT 0,
      fetched_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS star_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repo_id INTEGER NOT NULL,
      stars INTEGER NOT NULL,
      recorded_at TEXT NOT NULL,
      UNIQUE(repo_id, recorded_at),
      FOREIGN KEY (repo_id) REFERENCES repos(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_star_history_repo ON star_history(repo_id);
  `);
}

export type RepoRow = {
  id: number;
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  fetched_at: string;
};

export type RepoWithVelocity = RepoRow & {
  stars_gained: number;
  sparkline: number[];
  velocity: number;
};

const PERIOD_TO_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
  "6m": 180,
  year: 365,
};

export function getRepos(period: string): RepoWithVelocity[] {
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const db = getDb();
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();

  const rows = db
    .prepare(
      `
      SELECT r.*,
        COALESCE(
          (SELECT sh.stars FROM star_history sh
           WHERE sh.repo_id = r.id AND sh.recorded_at <= ?
           ORDER BY sh.recorded_at DESC LIMIT 1),
          r.stars
        ) AS baseline_stars,
        r.stars - COALESCE(
          (SELECT sh.stars FROM star_history sh
           WHERE sh.repo_id = r.id AND sh.recorded_at <= ?
           ORDER BY sh.recorded_at DESC LIMIT 1),
          r.stars
        ) AS stars_gained,
        (SELECT GROUP_CONCAT(sh.stars, ',') FROM (
           SELECT stars FROM star_history sh2
           WHERE sh2.repo_id = r.id
           ORDER BY sh2.recorded_at ASC LIMIT 7
         ) sh) AS sparkline_csv
      FROM repos r
      ORDER BY stars_gained DESC
    `
    )
    .all(cutoff, cutoff) as Array<RepoRow & { baseline_stars: number; stars_gained: number; sparkline_csv: string | null }>;

  return rows.map((row) => {
    const velocity =
      row.baseline_stars > 0
        ? (row.stars_gained / row.baseline_stars) * 1000
        : row.stars_gained;
    const sparkline = row.sparkline_csv
      ? row.sparkline_csv.split(",").map(Number)
      : [row.stars];
    return {
      ...row,
      stars_gained: row.stars_gained,
      sparkline,
      velocity,
    };
  });
}

export function insertRepo(repo: {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  fetched_at: string;
}): number {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM repos WHERE full_name = ?")
    .get(repo.full_name) as { id: number } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE repos SET name = ?, owner = ?, description = ?, language = ?,
       url = ?, stars = ?, fetched_at = ? WHERE id = ?`
    ).run(
      repo.name,
      repo.owner,
      repo.description,
      repo.language,
      repo.url,
      repo.stars,
      repo.fetched_at,
      existing.id
    );
    return existing.id;
  }

  const res = db
    .prepare(
      `INSERT INTO repos (full_name, name, owner, description, language, url, stars, fetched_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      repo.full_name,
      repo.name,
      repo.owner,
      repo.description,
      repo.language,
      repo.url,
      repo.stars,
      repo.fetched_at
    );
  return res.lastInsertRowid as number;
}

export function getRepoId(fullName: string): number | null {
  const db = getDb();
  const row = db
    .prepare("SELECT id FROM repos WHERE full_name = ?")
    .get(fullName) as { id: number } | undefined;
  return row ? row.id : null;
}

export function insertStarHistory(
  repoId: number,
  stars: number,
  recordedAt: string
): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO star_history (repo_id, stars, recorded_at) VALUES (?, ?, ?)
     ON CONFLICT(repo_id, recorded_at) DO UPDATE SET stars = excluded.stars`
  ).run(repoId, stars, recordedAt);
}
