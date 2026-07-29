import { type Metadata } from "next";
import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "daily - reposurge",
  description: "fastest-rising repos last 24 hours",
};

export default function DailyPage() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");

  const empty = day.length === 0;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto">
        {empty ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">no data for the last 24 hours</p>
            <p className="text-text-muted/40 text-xs mt-1">Daily data is updated once per day. Check back tomorrow.</p>
          </div>
        ) : (
          <RepoList repos={{ day, week, month }} defaultPeriod="day" />
        )}
      </main>
    </>
  );
}
