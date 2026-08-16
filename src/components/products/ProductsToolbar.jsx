import ProductsSearchInput from "./ProductsSearchInput";
import SortDropdown from "./SortDropdown";
import MobileFiltersDrawer from "./MobileFiltersDrawer";

export default function ProductsToolbar({ filters, categories, activeFilterCount }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <ProductsSearchInput filters={filters} />
      <div className="flex items-center gap-3">
        <MobileFiltersDrawer categories={categories} filters={filters} activeCount={activeFilterCount} />
        <SortDropdown filters={filters} />
      </div>
    </div>
  );
}
