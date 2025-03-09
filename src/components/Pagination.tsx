interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  fetchNext: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  loading,
  fetchNext,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-between px-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || loading}
        className="disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        onMouseOver={() => fetchNext(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || loading}
        className="disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};
