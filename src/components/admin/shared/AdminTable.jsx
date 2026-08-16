export default function AdminTable({ children }) {
  return (
    <div className="card-fb overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
      </div>
    </div>
  );
}
