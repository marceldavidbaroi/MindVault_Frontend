"use client";

export default function AccountsListSkeleton({
  mode = "normal",
}: {
  mode?: "normal" | "mini";
}) {
  // MINI MODE
  if (mode === "mini") {
    return (
      <div className="w-40">
        <div
          className="
            h-10 w-full rounded-md 
            bg-chart-1 dark:bg-white/5 
            backdrop-blur-md border border-white/20 
            animate-pulse
          "
        />
      </div>
    );
  }

  // NORMAL MODE
  return (
    <div className="w-full overflow-hidden rounded-lg bg-background/40 backdrop-blur-md border border-primary/20 shadow-sm animate-pulse">
      <ul className="divide-y divide-primary/10">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} className="px-3 py-3">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-28 rounded bg-chart-1 dark:bg-white/5" />
              <div className="h-3 w-16 rounded bg-chart-1 dark:bg-white/5" />
            </div>

            <div className="flex justify-between items-center">
              <div className="h-3 w-20 rounded bg-chart-1 dark:bg-white/5" />
              <div className="h-3 w-12 rounded bg-chart-1 dark:bg-white/5" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
