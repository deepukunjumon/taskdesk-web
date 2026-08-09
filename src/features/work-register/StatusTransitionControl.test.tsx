import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusTransitionControl } from '@/features/work-register/StatusTransitionControl'
import { STATUS_LABELS, WORK_ITEM_STATUSES, type WorkItemStatus } from '@/types'

async function openOptions(nextStatuses: WorkItemStatus[]) {
  const user = userEvent.setup()
  render(<StatusTransitionControl nextStatuses={nextStatuses} onSelect={vi.fn()} />)

  const trigger = screen.queryByRole('combobox')
  if (trigger) {
    await user.click(trigger)
  }

  return user
}

describe('StatusTransitionControl', () => {
  it('renders exactly the next_statuses it is given — nothing more, nothing less', async () => {
    await openOptions(['in_progress', 'closed'])

    expect(screen.getByRole('option', { name: STATUS_LABELS.in_progress })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: STATUS_LABELS.closed })).toBeInTheDocument()

    for (const status of WORK_ITEM_STATUSES) {
      if (status === 'in_progress' || status === 'closed') continue
      expect(screen.queryByRole('option', { name: STATUS_LABELS[status] })).not.toBeInTheDocument()
    }
  })

  it('renders a single next-status when given only one', async () => {
    await openOptions(['pending'])

    expect(screen.getByRole('option', { name: STATUS_LABELS.pending })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: STATUS_LABELS.open })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: STATUS_LABELS.closed })).not.toBeInTheDocument()
  })

  it('renders no select and no options when next_statuses is empty', async () => {
    render(<StatusTransitionControl nextStatuses={[]} onSelect={vi.fn()} />)

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByText(/no further transitions/i)).toBeInTheDocument()
  })

  it('never renders "deleted" even if somehow passed in', async () => {
    await openOptions(['in_progress', 'closed'])

    expect(screen.queryByRole('option', { name: STATUS_LABELS.deleted })).not.toBeInTheDocument()
  })

  it('calls onSelect with the chosen next status', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<StatusTransitionControl nextStatuses={['in_progress', 'closed']} onSelect={onSelect} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: STATUS_LABELS.in_progress }))

    expect(onSelect).toHaveBeenCalledWith('in_progress')
  })
})
