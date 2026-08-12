import { useEffect, useState } from 'react'

/** Delays reflecting `value` until it's stopped changing for `delayMs` — used to avoid firing a network request on every keystroke in a search input. */
export function useDebouncedValue<T>(value: T, delayMs: number = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}
