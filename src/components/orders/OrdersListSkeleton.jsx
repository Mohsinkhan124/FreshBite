export default function OrdersListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="card-fb flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="skeleton h-11 w-11 rounded-2xl" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
