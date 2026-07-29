export default function Header() {
  return (
    <div className="px-6 pt-4 pb-2 text-left relative z-[2]">
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight leading-none text-text-body">
        REPOSURGE
      </h1>
      <p className="text-text-muted/50 text-xs mt-0.5">
        track github repo velocity &mdash; see which projects are rising fastest
      </p>
    </div>
  );
}
