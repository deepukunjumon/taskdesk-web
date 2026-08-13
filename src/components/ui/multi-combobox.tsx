import * as React from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { ComboboxOption } from '@/components/ui/combobox'

interface MultiComboboxProps {
  value: string[]
  onValueChange: (value: string[]) => void
  options: ComboboxOption[]
  /** Fired with the debounced search text — wire this to a `q`-backed query. */
  onSearchChange?: (query: string) => void
  isLoading?: boolean
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
}

/**
 * Like Combobox, but lets more than one option be selected — each click
 * toggles that option and the popover stays open, so several picks in a row
 * don't require reopening it. The trigger shows the single selected label,
 * or "N selected" once more than one is picked.
 */
export function MultiCombobox({
  value,
  onValueChange,
  options,
  onSearchChange,
  isLoading = false,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results.',
  disabled = false,
  className,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  React.useEffect(() => {
    onSearchChange?.(debouncedQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setQuery('')
    }
  }

  function toggle(optionValue: string) {
    onValueChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    )
  }

  const selectedLabels = options.filter((option) => value.includes(option.value)).map((o) => o.label)
  const triggerLabel =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          data-slot="multi-combobox-trigger"
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50',
            selectedLabels.length === 0 && 'text-muted-foreground',
            className,
          )}
        >
          <span className="line-clamp-1 text-left">{triggerLabel}</span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          {onSearchChange && (
            <div className="flex items-center border-b px-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
              />
              {isLoading && <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />}
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1">
            {options.length === 0 ? (
              <p className="px-2 py-3 text-center text-sm text-muted-foreground">{emptyText}</p>
            ) : (
              options.map((option) => {
                const checked = value.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggle(option.value)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={checked}
                      className="size-3.5 shrink-0 rounded border-input accent-primary"
                    />
                    <span className="line-clamp-1">{option.label}</span>
                  </button>
                )
              })
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
