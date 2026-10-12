import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  canRedo,
  canUndo,
  createHistory,
  pushHistory,
  redoHistory,
  undoHistory,
  type HistoryStack,
} from '../lib/history'
import { loadState, saveState, type MermaidTheme } from '../lib/storage'
import { useDebouncedValue } from './useDebouncedValue'

export function useDiagramState() {
  const initial = useMemo(() => loadState(), [])
  const [history, setHistory] = useState<HistoryStack<string>>(() =>
    createHistory(initial.code),
  )
  const [theme, setThemeState] = useState<MermaidTheme>(initial.theme)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const lastSnapshot = useRef(initial.code)
  const historyTimer = useRef<number | null>(null)

  const code = history.present
  const debouncedCode = useDebouncedValue(code, 300)

  useEffect(() => {
    saveState({ code, theme })
    setSavedAt(Date.now())
  }, [code, theme])

  const clearHistoryTimer = useCallback(() => {
    if (historyTimer.current !== null) {
      window.clearTimeout(historyTimer.current)
      historyTimer.current = null
    }
  }, [])

  const setCode = useCallback(
    (next: string) => {
      setHistory((prev) => ({ ...prev, present: next, future: [] }))

      clearHistoryTimer()
      historyTimer.current = window.setTimeout(() => {
        setHistory((prev) => {
          if (prev.present === lastSnapshot.current) {
            return prev
          }
          const updated = pushHistory(
            {
              past: prev.past,
              present: lastSnapshot.current,
              future: [],
            },
            prev.present,
          )
          lastSnapshot.current = updated.present
          return updated
        })
      }, 400)
    },
    [clearHistoryTimer],
  )

  const applyCodeImmediate = useCallback(
    (next: string) => {
      clearHistoryTimer()
      setHistory((prev) => {
        if (prev.present === next) return prev
        const updated = pushHistory(prev, next)
        lastSnapshot.current = updated.present
        return updated
      })
    },
    [clearHistoryTimer],
  )

  const undo = useCallback(() => {
    clearHistoryTimer()
    setHistory((prev) => {
      const next = undoHistory(prev)
      lastSnapshot.current = next.present
      return next
    })
  }, [clearHistoryTimer])

  const redo = useCallback(() => {
    clearHistoryTimer()
    setHistory((prev) => {
      const next = redoHistory(prev)
      lastSnapshot.current = next.present
      return next
    })
  }, [clearHistoryTimer])

  const setTheme = useCallback((next: MermaidTheme) => {
    setThemeState(next)
  }, [])

  useEffect(() => clearHistoryTimer, [clearHistoryTimer])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey
      if (!mod) return
      const key = event.key.toLowerCase()
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undo()
      } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
        event.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [undo, redo])

  return {
    code,
    debouncedCode,
    theme,
    savedAt,
    setCode,
    applyCodeImmediate,
    setTheme,
    undo,
    redo,
    canUndo: canUndo(history),
    canRedo: canRedo(history),
  }
}
