export type HistoryStack<T> = {
  past: T[]
  present: T
  future: T[]
}

const MAX_HISTORY = 50

export function createHistory<T>(present: T): HistoryStack<T> {
  return { past: [], present, future: [] }
}

export function pushHistory<T>(stack: HistoryStack<T>, next: T): HistoryStack<T> {
  if (Object.is(stack.present, next)) {
    return stack
  }
  const past = [...stack.past, stack.present].slice(-MAX_HISTORY)
  return { past, present: next, future: [] }
}

export function undoHistory<T>(stack: HistoryStack<T>): HistoryStack<T> {
  if (stack.past.length === 0) {
    return stack
  }
  const previous = stack.past[stack.past.length - 1]
  return {
    past: stack.past.slice(0, -1),
    present: previous,
    future: [stack.present, ...stack.future],
  }
}

export function redoHistory<T>(stack: HistoryStack<T>): HistoryStack<T> {
  if (stack.future.length === 0) {
    return stack
  }
  const next = stack.future[0]
  return {
    past: [...stack.past, stack.present],
    present: next,
    future: stack.future.slice(1),
  }
}

export function canUndo<T>(stack: HistoryStack<T>): boolean {
  return stack.past.length > 0
}

export function canRedo<T>(stack: HistoryStack<T>): boolean {
  return stack.future.length > 0
}
