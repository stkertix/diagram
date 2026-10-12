import { TemplatePicker } from './TemplatePicker'
import type { MermaidTheme } from '../lib/storage'

type ToolbarProps = {
  theme: MermaidTheme
  canUndo: boolean
  canRedo: boolean
  statusText: string
  onThemeChange: (theme: MermaidTheme) => void
  onTemplateSelect: (code: string) => void
  onUndo: () => void
  onRedo: () => void
  onCopyCode: () => void
  onDownloadSvg: () => void
  onDownloadPng: () => void
}

const THEMES: { value: MermaidTheme; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'base', label: 'Base' },
  { value: 'dark', label: 'Dark' },
  { value: 'forest', label: 'Forest' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'neo', label: 'Neo' },
  { value: 'neo-dark', label: 'Neo Dark' },
  { value: 'redux', label: 'Redux' },
  { value: 'redux-dark', label: 'Redux Dark' },
  { value: 'redux-color', label: 'Redux Color' },
  { value: 'redux-dark-color', label: 'Redux Dark Color' },
  { value: 'null', label: 'Tanpa tema' },
]

export function Toolbar({
  theme,
  canUndo,
  canRedo,
  statusText,
  onThemeChange,
  onTemplateSelect,
  onUndo,
  onRedo,
  onCopyCode,
  onDownloadSvg,
  onDownloadPng,
}: ToolbarProps) {
  return (
    <header className="toolbar">
      <div className="toolbar-brand">
        <span className="brand-mark">M</span>
        <div>
          <h1>Mermaid Diagram Editor</h1>
          <p className="brand-sub">Editor kode &amp; preview langsung</p>
        </div>
      </div>

      <div className="toolbar-actions">
        <TemplatePicker onSelect={onTemplateSelect} />

        <label className="field">
          <span className="field-label">Tema</span>
          <select
            className="select"
            value={theme}
            onChange={(event) => onThemeChange(event.target.value as MermaidTheme)}
          >
            {THEMES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <div className="button-group">
          <button type="button" className="btn" onClick={onUndo} disabled={!canUndo}>
            Undo
          </button>
          <button type="button" className="btn" onClick={onRedo} disabled={!canRedo}>
            Redo
          </button>
        </div>

        <div className="button-group">
          <button type="button" className="btn" onClick={onCopyCode}>
            Salin kode
          </button>
          <button type="button" className="btn btn-primary" onClick={onDownloadSvg}>
            Unduh SVG
          </button>
          <button type="button" className="btn btn-primary" onClick={onDownloadPng}>
            Unduh PNG
          </button>
        </div>
      </div>

      <div className="toolbar-status" aria-live="polite">
        {statusText}
      </div>
    </header>
  )
}
