import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkItemsTable } from '@/features/work-register/WorkItemsTable'
import type { PaginatedMeta, WorkItem } from '@/types'

function makeWorkItem(overrides: Partial<WorkItem> = {}): WorkItem {
  return {
    id: 'item-1',
    task_id: 'T0001',
    department: { id: 'dept-1', name: 'Technical', code: 'TECH', is_active: true },
    entry_type: 'task',
    assigned_by: { id: 'user-1', name: 'Manager' },
    assigned_to: { id: 'user-2', name: 'Employee' },
    created_by: { id: 'user-1', name: 'Manager' },
    source: 'internal',
    branch: null,
    category: null,
    priority: 'low',
    subject: 'Fix the thing',
    description: 'Details',
    status: 'open',
    start_time: null,
    end_time: null,
    resolution: null,
    remarks: null,
    sla_due_at: null,
    created_at: '2026-08-01T00:00:00.000000Z',
    updated_at: '2026-08-01T00:00:00.000000Z',
    permissions: { can_update: true, can_update_status: true, can_reassign: true, can_delete: true },
    editable_fields: [],
    next_statuses: ['in_progress', 'closed'],
    ...overrides,
  }
}

function makeMeta(overrides: Partial<PaginatedMeta> = {}): PaginatedMeta {
  return { current_page: 1, last_page: 1, per_page: 15, total: 1, ...overrides }
}

describe('WorkItemsTable', () => {
  it('does not render a pagination bar when meta is absent (e.g. a non-paginated response)', () => {
    render(
      <WorkItemsTable
        items={[makeWorkItem()]}
        meta={undefined}
        isLoading={false}
        isError={false}
        onRowClick={vi.fn()}
        onPageChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    )

    expect(screen.getByText('T0001')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/rows per page/i)).not.toBeInTheDocument()
  })

  it('renders the pagination bar when meta is present', () => {
    render(
      <WorkItemsTable
        items={[makeWorkItem()]}
        meta={makeMeta({ current_page: 1, last_page: 3, total: 45 })}
        isLoading={false}
        isError={false}
        onRowClick={vi.fn()}
        onPageChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
    expect(screen.getByText(/rows per page/i)).toBeInTheDocument()
  })

  it('shows the empty state and no pagination bar when there are no items', () => {
    render(
      <WorkItemsTable
        items={[]}
        meta={makeMeta({ total: 0 })}
        isLoading={false}
        isError={false}
        onRowClick={vi.fn()}
        onPageChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    )

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument()
  })
})
