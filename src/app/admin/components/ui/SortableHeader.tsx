export default function SortableHeader({
  children,
  key: sortKey,
  currentSort,
  onSort,
}: {
  children: React.ReactNode;
  key: string;
  currentSort: { key: string; dir: "asc" | "desc" };
  onSort: (key: string) => void;
}) {
  const isActive = currentSort.key === sortKey;
  const dir = isActive ? currentSort.dir : "desc";
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1.5 w-full text-left font-medium text-brand-charcoal/70 hover:text-brand-charcoal transition-colors group"
      aria-sort={isActive ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <span>{children}</span>
      <span className="text-brand-charcoal/40 group-hover:text-brand-charcoal/70 transition-colors" aria-hidden="true">
        {isActive ? (dir === "asc" ? "▲" : "▼") : "⇅"}
      </span>
    </button>
  );
}
