import { DEFAULT_CODE } from './templates'

export type MermaidTheme =
  | 'default'
  | 'base'
  | 'dark'
  | 'forest'
  | 'neutral'
  | 'neo'
  | 'neo-dark'
  | 'redux'
  | 'redux-dark'
  | 'redux-color'
  | 'redux-dark-color'
  | 'null'

export type PersistedState = {
  code: string
  theme: MermaidTheme
}

const STORAGE_KEY = 'mermaid-diagram-editor'

export const VALID_THEMES: MermaidTheme[] = [
  'default',
  'base',
  'dark',
  'forest',
  'neutral',
  'neo',
  'neo-dark',
  'redux',
  'redux-dark',
  'redux-color',
  'redux-dark-color',
  'null',
]

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { code: DEFAULT_CODE, theme: 'default' }
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    const theme = VALID_THEMES.includes(parsed.theme as MermaidTheme)
      ? (parsed.theme as MermaidTheme)
      : 'default'
    return {
      code: typeof parsed.code === 'string' ? parsed.code : DEFAULT_CODE,
      theme,
    }
  } catch {
    return { code: DEFAULT_CODE, theme: 'default' }
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota / private mode errors
  }
}
