import { useCallback, useRef } from 'react'

/**
 * Keyboard behaviour for the WAI-ARIA radiogroup pattern, shared by every
 * single-choice control (segmented buttons, theme cards, anything next).
 *
 * The group is one tab stop; arrow keys move focus and change the selection,
 * Home/End jump to the ends, and disabled options are skipped.
 *
 *   const radio = useRovingRadio({ options, value, onChange, disabled })
 *   <div role="radiogroup">
 *     {options.map((o, i) => <button key={o.value} {...radio.getOptionProps(i)}>{o.label}</button>)}
 *   </div>
 */
export default function useRovingRadio({ options = [], value, onChange, disabled = false }) {
  const refs = useRef([])

  const enabledIndexes = options.reduce((acc, option, index) => {
    if (!option.disabled) acc.push(index)
    return acc
  }, [])

  const select = useCallback(
    (index) => {
      const option = options[index]
      if (!option || option.disabled || disabled) return
      refs.current[index]?.focus()
      if (option.value !== value) onChange?.(option.value)
    },
    [disabled, onChange, options, value],
  )

  const handleKeyDown = (event, index) => {
    const position = enabledIndexes.indexOf(index)
    if (position === -1 || enabledIndexes.length === 0) return

    let next
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = enabledIndexes[(position + 1) % enabledIndexes.length]
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        next = enabledIndexes[(position - 1 + enabledIndexes.length) % enabledIndexes.length]
        break
      case 'Home':
        next = enabledIndexes[0]
        break
      case 'End':
        next = enabledIndexes[enabledIndexes.length - 1]
        break
      default:
        return
    }

    event.preventDefault()
    select(next)
  }

  const selectedIndex = options.findIndex((option) => option.value === value)
  // Roving tabindex: only the selected option (or the first usable one) is tabbable.
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : (enabledIndexes[0] ?? -1)

  const getOptionProps = (index) => {
    const option = options[index]
    return {
      ref: (node) => {
        refs.current[index] = node
      },
      type: 'button',
      role: 'radio',
      'aria-checked': option.value === value,
      tabIndex: index === tabbableIndex ? 0 : -1,
      disabled: disabled || option.disabled,
      onClick: () => select(index),
      onKeyDown: (event) => handleKeyDown(event, index),
    }
  }

  return { refs, select, handleKeyDown, tabbableIndex, getOptionProps }
}
