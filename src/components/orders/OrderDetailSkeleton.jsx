export default function OrderDetailSkeleton() {
  return (
    <div>
      <div className="skeleton h-24 w-full rounded-3xl" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="skeleton h-64 w-full rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-48 w-full rounded-3xl" />
          <div className="skeleton h-32 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
