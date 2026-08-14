import { useState } from 'react'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { PaginatedMeta, PaginatedResponse } from '@/types'

export interface UsePaginatedQueryOptions<TItem, TFilters extends object> {
  /** Prefix for the TanStack Query cache key — keep this stable and matching
   * whatever key existing mutations already invalidate for this list. */
  queryKey: readonly unknown[]
  /** The raw API function for this endpoint — takes the merged filters +
   * page/per_page and returns a Laravel-shaped paginated response. */
  queryFn: (params: TFilters & { page: number; per_page: number }) => Promise<PaginatedResponse<TItem>>
  /** Non-pagination filters (status, search, etc). Changing this object does
   * NOT reset the page on its own — call setPage(1) alongside it if that's
   * the desired behavior, since only the caller knows when a filter change
   * should reset pagination vs. when it shouldn't. */
  filters?: TFilters
  initialPage?: number
  initialPerPage?: number
  enabled?: boolean
}

export interface UsePaginatedQueryResult<TItem> {
  data: TItem[] | undefined
  meta: PaginatedMeta | undefined
  isLoading: boolean
  isError: boolean
  error: UseQueryResult['error']
  page: number
  perPage: number
  setPage: (page: number) => void
  /** Also resets page to 1 — changing how many rows fit per page invalidates
   * whatever "page N" meant under the old page size. */
  setPerPage: (perPage: number) => void
}

/**
 * Wraps a paginated Laravel endpoint (`{ data, meta, links }`) so any list
 * page can get page/per-page state, query-building, and refetching without
 * hand-rolling useState/useEffect per page. Pass the result straight to
 * DataTablePagination via `meta`/`setPage`/`setPerPage`.
 */
export function usePaginatedQuery<TItem, TFilters extends object = Record<string, never>>({
  queryKey,
  queryFn,
  filters,
  initialPage = 1,
  initialPerPage = 15,
  enabled = true,
}: UsePaginatedQueryOptions<TItem, TFilters>): UsePaginatedQueryResult<TItem> {
  const [page, setPage] = useState(initialPage)
  const [perPage, setPerPageState] = useState(initialPerPage)

  const params = { ...(filters ?? ({} as TFilters)), page, per_page: perPage } as TFilters & {
    page: number
    per_page: number
  }

  const query = useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => queryFn(params),
    enabled,
    placeholderData: (previous) => previous,
  })

  function setPerPage(next: number) {
    setPerPageState(next)
    setPage(1)
  }

  return {
    data: query.data?.data,
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    page,
    perPage,
    setPage,
    setPerPage,
  }
}
