import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import type { PaginatedMeta } from '@/types'

function makeMeta(overrides: Partial<PaginatedMeta> = {}): PaginatedMeta {
  return {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    ...overrides,
  }
}

describe('DataTablePagination', () => {
  it('renders an ellipsis on both sides when the current page is in the middle of a long range', () => {
    render(
      <DataTablePagination
        meta={makeMeta({ current_page: 10, last_page: 20, total: 300 })}
        onPageChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    )

    // Windowed as: 1 … 8 9 [10] 11 12 … 20 — two distinct ellipsis markers.
    expect(screen.getAllByText('More pages')).toHaveLength(2)
    expect(screen.getByRole('link', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '20' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '10' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: '5' })).not.toBeInTheDocument()
  })

  it('renders only a trailing ellipsis when the current page is near the start', () => {
    render(
      <DataTablePagination
        meta={makeMeta({ current_page: 1, last_page: 20, total: 300 })}
        onPageChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    )

    expect(screen.getAllByText('More pages')).toHaveLength(1)
    expect(screen.getByRole('link', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '3' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '20' })).toBeInTheDocument()
  })

  it('renders no ellipsis for a short range', () => {
    render(
      <DataTablePagination
        meta={makeMeta({ current_page: 2, last_page: 4, total: 60 })}
        onPageChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    )

    expect(screen.queryByText('More pages')).not.toBeInTheDocument()
    for (const page of ['1', '2', '3', '4']) {
      expect(screen.getByRole('link', { name: page })).toBeInTheDocument()
    }
  })

  it('disables Previous on the first page and Next on the last page', () => {
    render(
      <DataTablePagination
        meta={makeMeta({ current_page: 1, last_page: 5, total: 75 })}
        onPageChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('link', { name: /previous/i })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('link', { name: /go to next page/i })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('calls onPageChange with the clicked page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <DataTablePagination
        meta={makeMeta({ current_page: 1, last_page: 5, total: 75 })}
        onPageChange={onPageChange}
        onPerPageChange={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('link', { name: '3' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('shows the "Showing X-Y of Z" summary computed from meta', () => {
    render(
      <DataTablePagination
        meta={makeMeta({ current_page: 2, last_page: 4, per_page: 10, total: 35 })}
        onPageChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Showing 11–20 of 35')).toBeInTheDocument()
  })

  it('resets to page 1 when the per-page selection changes', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const onPerPageChange = vi.fn()
    render(
      <DataTablePagination
        meta={makeMeta({ current_page: 3, last_page: 10, per_page: 15, total: 150 })}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />,
    )

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: '25' }))

    expect(onPerPageChange).toHaveBeenCalledWith(25)
    expect(onPageChange).toHaveBeenCalledWith(1)
  })
})
