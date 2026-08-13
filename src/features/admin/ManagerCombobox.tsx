import { useState } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { useAdminUsers } from '@/features/admin/hooks'
import type { UserRef } from '@/types'

export const NO_MANAGER = '__none__'

interface ManagerComboboxProps {
  /** Excluded from its own candidate list. */
  userId: string
  value: string | null
  /** Guarantees the currently-assigned manager always resolves to a label,
   * even when a search has narrowed the fetched candidate page past them. */
  currentManager: UserRef | null
  onChange: (managerId: string | null) => void
  disabled?: boolean
  className?: string
}

export function ManagerCombobox({
  userId,
  value,
  currentManager,
  onChange,
  disabled,
  className,
}: ManagerComboboxProps) {
  const [query, setQuery] = useState('')
  const { data, isLoading } = useAdminUsers({ is_active: true, q: query, per_page: 20 })

  const candidates = (data?.data ?? []).filter((candidate) => candidate.id !== userId)
  const selectedNotInCandidates =
    currentManager && !candidates.some((candidate) => candidate.id === currentManager.id)

  return (
    <Combobox
      className={className}
      value={value ?? NO_MANAGER}
      onValueChange={(v) => onChange(v === NO_MANAGER ? null : v)}
      onSearchChange={setQuery}
      isLoading={isLoading}
      disabled={disabled}
      searchPlaceholder="Search people..."
      options={[
        { value: NO_MANAGER, label: 'No manager' },
        ...(selectedNotInCandidates
          ? [{ value: currentManager!.id, label: currentManager!.name }]
          : []),
        ...candidates.map((candidate) => ({ value: candidate.id, label: candidate.name })),
      ]}
    />
  )
}
