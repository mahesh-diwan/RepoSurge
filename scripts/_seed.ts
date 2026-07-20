import {
  insertRepo,
  insertStarHistory,
} from "../lib/db";

const now = Date.now();
const samples = [
  { full_name: "vercel/next.js", name: "next.js", owner: "vercel", language: "typescript", stars: 125000, desc: "The React Framework" },
  { full_name: "facebook/react", name: "react", owner: "facebook", language: "javascript", stars: 228000, desc: "The library for web UIs" },
  { full_name: "rust-lang/rust", name: "rust", owner: "rust-lang", language: "rust", stars: 98000, desc: "Empowering everyone" },
  { full_name: "golang/go", name: "go", owner: "golang", language: "go", stars: 122000, desc: "Go programming language" },
  { full_name: "python/cpython", name: "cpython", owner: "python", language: "python", stars: 63000, desc: "Python language" },
  { full_name: "spring-projects/spring-boot", name: "spring-boot", owner: "spring-projects", language: "java", stars: 75000, desc: "Spring Boot" },
  { full_name: "oven-sh/bun", name: "bun", owner: "oven-sh", language: "typescript", stars: 73000, desc: "Fast JS runtime" },
  { full_name: "tokio-rs/tokio", name: "tokio", owner: "tokio-rs", language: "rust", stars: 27000, desc: "Async runtime" },
];

for (const s of samples) {
  const id = insertRepo({
    full_name: s.full_name,
    name: s.name,
    owner: s.owner,
    description: s.desc,
    language: s.language,
    url: `https://github.com/${s.full_name}`,
    stars: s.stars,
    fetched_at: new Date(now).toISOString(),
  });
  for (let d = 6; d >= 0; d--) {
    const day = new Date(now - d * 86400000).toISOString();
    const stars = Math.round(s.stars - d * (50 + Math.floor(Math.random() * 200)));
    insertStarHistory(id, stars, day);
  }
}
console.log("seeded", samples.length);
