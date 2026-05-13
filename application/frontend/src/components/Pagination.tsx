interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  const btn =
    'inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <nav className="flex items-center gap-1">
      <button className={btn} disabled={current === 1} onClick={() => onChange(current - 1)}>
        Prev
      </button>

      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              page === current
                ? 'bg-primary-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        ),
      )}

      <button className={btn} disabled={current === total} onClick={() => onChange(current + 1)}>
        Next
      </button>
    </nav>
  );
}
