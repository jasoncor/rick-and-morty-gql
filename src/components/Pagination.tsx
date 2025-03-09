interface PaginationProps {
  /** The current active page number */
  currentPage: number;
  /** The total number of available pages */
  totalPages: number;
  /** Callback function triggered when the page number changes */
  onPageChange: (page: number) => void;
  /** Whether data is currently being fetched */
  loading: boolean;
  /** Callback function to prefetch the next page's data */
  prefetchNext?: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  loading,
  prefetchNext,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-between px-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || loading}
        className="disabled:opacity-50"
        data-testid="previous-button"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        onMouseOver={() =>
          prefetchNext?.(Math.min(totalPages, currentPage + 1))
        }
        disabled={currentPage >= totalPages || loading}
        className="disabled:opacity-50"
        data-testid="next-button"
      >
        Next
      </button>
    </div>
  );
};
