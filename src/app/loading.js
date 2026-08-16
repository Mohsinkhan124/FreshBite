export default function RootLoading() {
  return (
    <div className="container-fb space-y-6 py-16">
      <div className="skeleton h-10 w-64" />
      <div className="skeleton h-72 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
