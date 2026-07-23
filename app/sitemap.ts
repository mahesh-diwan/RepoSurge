import { type MetadataRoute } from "next";
import repos from "@/src/content/repos.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://reposurge.vercel.app";

  const staticPages = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${base}/daily`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${base}/weekly`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${base}/monthly`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  const repoPages = repos.repos.map(
    (r: { full_name?: string }) => ({
      url: `${base}/repo/${r.full_name?.replace("/", "-") ?? ""}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }),
  );

  return [...staticPages, ...repoPages];
}
