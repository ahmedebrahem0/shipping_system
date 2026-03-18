// Pagination.tsx
// Reusable pagination component used across all list pages

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">

      {/* Info */}
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
        {" "}-{" "}
        <span className="font-medium">
          {Math.min(currentPage * pageSize, totalCount)}
        </span>
        {" "}of{" "}
        <span className="font-medium">{totalCount}</span> results
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {/* Pages */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) =>
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
          )
          .reduce<(number | string)[]>((acc, page, index, arr) => {
            if (index > 0 && (page as number) - (arr[index - 1] as number) > 1) {
              acc.push("...");
            }
            acc.push(page);
            return acc;
          }, [])
          .map((page, index) =>
            page === "..." ? (
              <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

    </div>
  );
}