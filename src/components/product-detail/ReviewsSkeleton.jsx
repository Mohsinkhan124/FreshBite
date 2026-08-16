export default function ReviewsSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card-fb p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-3 w-16" />
              </div>
            </div>
            <div className="skeleton mt-4 h-3 w-full" />
            <div className="skeleton mt-2 h-3 w-2/3" />
          </div>
        ))}
      </div>
      <div className="card-fb p-6">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton mt-3 h-3 w-24" />
        <div className="skeleton mt-8 h-24 w-full rounded-2xl" />
        <div className="skeleton mt-4 h-11 w-full rounded-full" />
      </div>
    </div>
  );
}
