# Task 2: Database Layer — Report

## Status: DONE

## Commit

- `bab1119` — feat: SQLite database layer with star history queries

## Files Created/Modified

- `lib/db.ts` — database connection, schema init, query functions
- `.gitignore` — added `/data/repos.db` exclusion
- `data/.gitkeep` — ensures data directory tracked in git

## Functions Implemented

| Function                                 | Purpose                                                    |
| ---------------------------------------- | ---------------------------------------------------------- |
| `getDb()`                                | Singleton connection with WAL mode + auto schema init      |
| `getRepos(period)`                       | Ranked repos with stars_gained, sparkline, velocity        |
| `insertRepo(repo)`                       | Upsert via `ON CONFLICT DO UPDATE` (not INSERT OR REPLACE) |
| `insertStarHistory(repoId, date, stars)` | Insert daily star count                                    |
| `getRepoId(githubId)`                    | Lookup internal ID from GitHub ID                          |

## Test Summary

- Insert repo + star history: **PASS**
- getRepos with sparkline parsing: **PASS** (sparkline: [100, 95])
- Upsert on conflict: **PASS** (stars 100→110, description updated)
- stars_gained=0 for "week" with <7 days history: **PASS** (correct behavior)

## Deviations from Plan

1. **`INSERT OR REPLACE` → `ON CONFLICT DO UPDATE`**: `INSERT OR REPLACE` does DELETE+INSERT which triggers FK constraint from star_history→repos. Used upsert syntax instead — same behavior, FK-safe.

2. **Added `sub` alias to GROUP_CONCAT subquery**: Original query referenced undefined `sh` alias in the sparkline subquery. Fixed by aliasing inner subquery as `sub`.

3. **Added `data/.gitkeep`**: Plan didn't mention it, but needed to track empty data/ dir in git.

## Concerns

None. Database layer is functional and tested.
