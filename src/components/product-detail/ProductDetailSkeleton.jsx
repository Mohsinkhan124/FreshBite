export default function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="skeleton aspect-square w-full rounded-3xl" />
        <div className="mt-4 flex gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-20 w-20 rounded-2xl" />
          ))}
        </div>
      </div>
      <div>
        <div className="skeleton h-3 w-20" />
        <div className="skeleton mt-3 h-9 w-3/4" />
        <div className="skeleton mt-4 h-4 w-32" />
        <div className="skeleton mt-6 h-8 w-28" />
        <div className="skeleton mt-6 h-4 w-full" />
        <div className="skeleton mt-2 h-4 w-full" />
        <div className="skeleton mt-2 h-4 w-2/3" />
        <div className="skeleton mt-8 h-12 w-full max-w-sm rounded-full" />
      </div>
    </div>
  );
}
