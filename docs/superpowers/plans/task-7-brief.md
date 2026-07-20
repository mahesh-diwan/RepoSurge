### Task 7: End-to-End Test

**Files:**

- None (verification only)

**Interfaces:**

- Consumes: all previous tasks
- Produces: working application verified locally

- [ ] **Step 1: Test database layer**

```bash
cd reposurge
npx tsx -e "
const { getDb, insertRepo, insertStarHistory, getRepos } = require('./lib/db');
const db = getDb();
insertRepo({ github_id: 1, name: 'test', owner: 'test', description: 'test', language: 'javascript', stars: 100, forks: 10 });
const id = db.prepare('SELECT id FROM repos WHERE github_id = 1').get().id;
insertStarHistory(id, '2026-07-19', 95);
insertStarHistory(id, '2026-07-20', 100);
const repos = getRepos('week');
console.log(repos);
"
```

Expected: Array with test repo, stars_gained = 5

- [ ] **Step 2: Build and verify Next.js app**

```bash
cd reposurge
npm run build
```

Expected: Build succeeds without errors

- [ ] **Step 3: Start dev server and verify**

```bash
cd reposurge
npm run dev
```

Expected: App starts, shows "REPØSURGE" header, empty state message

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: verify end-to-end functionality"
```

---

