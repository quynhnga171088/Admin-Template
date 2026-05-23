import { useNavigate } from 'react-router-dom';

import type { IPagination } from '@/types/types.ts';

interface PaginationProps {
  pagination: IPagination;
}

/**
 * Generates the list of page items to display.
 * Returns numbers (page indices) and the string 'ellipsis' as separators.
 *
 * Example for page 5 of 20 (delta = 1):
 * [ 0, 'ellipsis', 3, 4, 5, 6, 7, 'ellipsis', 19 ]
 */
const buildPageItems = (currentPage: number, totalPages: number): (number | 'ellipsis')[] => {
  const delta = 1; // pages to show on each side of current page
  const items: (number | 'ellipsis')[] = [];

  const rangeStart = Math.max(1, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 2, currentPage + delta);

  /* Always add first page */
  items.push(0);

  /* Ellipsis after first page */
  if (rangeStart > 1) {
    items.push('ellipsis');
  }

  /* Middle range */
  for (let i = rangeStart; i <= rangeEnd; i++) {
    items.push(i);
  }

  /* Ellipsis before last page */
  if (rangeEnd < totalPages - 2) {
    items.push('ellipsis');
  }

  /* Always add last page (only if totalPages > 1) */
  if (totalPages > 1) {
    items.push(totalPages - 1);
  }

  return items;
};

const Pagination = ({ pagination }: PaginationProps) => {
  const navigate = useNavigate();

  if (!pagination || pagination.totalPages <= 1) return null;

  const search = pagination.search;
  const currentPage = pagination.page ?? 0;
  const pageSize = pagination.size ?? 5;
  const { totalPages, totalElements } = pagination;
  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <div className="card-footer flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Total: <span className="font-medium text-gray-700">{totalElements}</span> items
        {'     '}Keyword: <span className="font-medium text-gray-700">{search}</span>
      </div>
      <div className="flex items-center gap-1">
        {/* Prev button */}
        <button
          type="button"
          className="btn btn-sm btn-light-secondary"
          disabled={currentPage === 0}
          onClick={() => navigate(`?search=${search}&page=${currentPage - 1}&size=${pageSize}`)}
        >
          <i className="fa-regular fa-chevron-left" />
        </button>

        {/* Page items with ellipsis */}
        {pageItems.map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="btn btn-sm btn-secondary cursor-default opacity-60">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`btn btn-sm ${item === currentPage ? 'btn-primary' : 'btn-light-secondary'}`}
              onClick={() => navigate(`?search=${search}&page=${item}&size=${pageSize}`)}
            >
              {item + 1}
            </button>
          )
        )}

        {/* Next button */}
        <button
          type="button"
          className="btn btn-sm btn-light-secondary"
          disabled={pagination.last}
          onClick={() => navigate(`?search=${search}&page=${currentPage + 1}&size=${pageSize}`)}
        >
          <i className="fa-regular fa-chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
