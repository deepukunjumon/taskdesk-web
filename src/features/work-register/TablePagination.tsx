import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { PaginatedMeta } from '@/types'

interface TablePaginationProps {
  meta: PaginatedMeta
  onPageChange: (page: number) => void
}

/**
 * Windowed page-number list with ellipsis, e.g. for page 5 of 20:
 * 1 … 4 [5] 6 … 20
 */
function getPageNumbers(current: number, last: number): (number | 'ellipsis')[] {
  const delta = 1
  const pages: number[] = []

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
      pages.push(i)
    }
  }

  const result: (number | 'ellipsis')[] = []
  let previous: number | undefined

  for (const page of pages) {
    if (previous !== undefined) {
      if (page - previous === 2) {
        result.push(previous + 1)
      } else if (page - previous > 2) {
        result.push('ellipsis')
      }
    }
    result.push(page)
    previous = page
  }

  return result
}

export function TablePagination({ meta, onPageChange }: TablePaginationProps) {
  const { current_page: current, last_page: last, total, per_page: perPage } = meta

  if (last <= 1) {
    return (
      <p className="text-sm text-muted-foreground">
        {total} {total === 1 ? 'item' : 'items'}
      </p>
    )
  }

  const pages = getPageNumbers(current, last)
  const from = (current - 1) * perPage + 1
  const to = Math.min(current * perPage, total)

  function go(page: number) {
    if (page >= 1 && page <= last && page !== current) {
      onPageChange(page)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {total}
      </p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={current <= 1}
              className={current <= 1 ? 'pointer-events-none opacity-50' : undefined}
              onClick={(e) => {
                e.preventDefault()
                go(current - 1)
              }}
            />
          </PaginationItem>

          {pages.map((page, i) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === current}
                  onClick={(e) => {
                    e.preventDefault()
                    go(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={current >= last}
              className={current >= last ? 'pointer-events-none opacity-50' : undefined}
              onClick={(e) => {
                e.preventDefault()
                go(current + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
