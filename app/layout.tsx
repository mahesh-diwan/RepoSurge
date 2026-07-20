export const metadata = {
  title: "RepoSurge — Repos rising. Fast.",
  description:
    "GitHub repositories ranked by star velocity. Brutalist. Fast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
