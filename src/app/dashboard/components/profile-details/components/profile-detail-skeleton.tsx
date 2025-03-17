export default function ProfileDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Profile</h1>

      <div className="relative h-48 w-48 overflow-hidden rounded-lg border border-zinc-300 shadow-sm">
        <div className="flex h-full w-full animate-pulse items-center justify-center rounded-lg bg-zinc-400">
          <svg
            className="h-10 w-10 text-zinc-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="block h-6 w-full animate-pulse rounded-lg bg-zinc-400"></div>
        <div className="block h-6 w-full animate-pulse rounded-lg bg-zinc-400"></div>
        <div className="block h-6 w-full animate-pulse rounded-lg bg-zinc-400"></div>
        <div className="block h-6 w-full animate-pulse rounded-lg bg-zinc-400"></div>
      </div>
    </div>
  );
}
