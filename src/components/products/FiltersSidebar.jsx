import FiltersPanel from "./FiltersPanel";

export default function FiltersSidebar({ categories, filters }) {
  return (
    <aside className="hidden lg:block">
      <div className="card-fb sticky top-24 p-6">
        <FiltersPanel categories={categories} filters={filters} />
      </div>
    </aside>
  );
}
