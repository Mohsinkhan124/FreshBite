export default function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="card-fb flex flex-col items-center gap-3 p-5">
          <div className="skeleton h-20 w-20 rounded-2xl" />
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
