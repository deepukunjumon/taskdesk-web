import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PaginatedMeta } from '@/types'

export interface DataTablePaginationProps {
  meta: PaginatedMeta
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  perPageOptions?: number[]
}

const DEFAULT_PER_PAGE_OPTIONS = [10, 15, 25, 50]

/**
 * Windowed page-number list with ellipsis, e.g. for page 10 of 20:
 * 1 … 8 9 [10] 11 12 … 20
 */
function getPageNumbers(current: number, last: number): (number | 'ellipsis')[] {
  const delta = 2
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

/**
 * Generic, fully backend-driven pagination bar for any Laravel paginator
 * response — reads current_page/last_page/per_page/total straight from
 * `meta` and never recomputes page math itself. Fully controlled: no
 * internal page/perPage state, so the same component backs Work Register,
 * the Employee Directory, or any future paginated list by wiring `meta` and
 * onPageChange/onPerPageChange to that list's own state (see
 * usePaginatedQuery). Render it only when `meta` actually exists — a
 * non-paginated response has nothing for this component to read.
 */
export function DataTablePagination({
  meta,
  onPageChange,
  onPerPageChange,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
}: DataTablePaginationProps) {
  const { current_page: current, last_page: last, total, per_page: perPage } = meta

  const pages = getPageNumbers(current, last)
  const from = total === 0 ? 0 : (current - 1) * perPage + 1
  const to = Math.min(current * perPage, total)

  function go(page: number) {
    if (page >= 1 && page <= last && page !== current) {
      onPageChange(page)
    }
  }

  function handlePerPageChange(value: string) {
    onPerPageChange(Number(value))
    // Belt-and-braces: guarantees the reset even if a caller's own
    // onPerPageChange doesn't already do it.
    onPageChange(1)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {from}–{to} of {total}
        </p>

        <div className="flex items-center gap-1.5">
          <label htmlFor="data-table-per-page" className="text-sm text-muted-foreground">
            Rows per page
          </label>
          <Select value={String(perPage)} onValueChange={handlePerPageChange}>
            <SelectTrigger id="data-table-per-page" size="sm" className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
