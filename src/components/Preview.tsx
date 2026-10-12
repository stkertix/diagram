import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import mermaid from 'mermaid'
import type { MermaidTheme } from '../lib/storage'

type PreviewProps = {
  code: string
  theme: MermaidTheme
  containerRef: RefObject<HTMLDivElement | null>
}

export function Preview({ code, theme, containerRef }: PreviewProps) {
  const reactId = useId().replace(/:/g, '')
  const renderId = useRef(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme,
      securityLevel: 'strict',
      fontFamily: 'IBM Plex Sans, Segoe UI, sans-serif',
    })
  }, [theme])

  useEffect(() => {
    let cancelled = false
    const currentId = ++renderId.current
    const container = containerRef.current

    async function renderDiagram() {
      if (!container) return

      const trimmed = code.trim()
      if (!trimmed) {
        container.innerHTML = ''
        setError('Tulis kode Mermaid untuk melihat preview')
        return
      }

      try {
        const { svg } = await mermaid.render(
          `mermaid-preview-${reactId}-${currentId}`,
          trimmed,
        )
        if (!cancelled && currentId === renderId.current && containerRef.current) {
          containerRef.current.innerHTML = svg
          setError(null)
        }
      } catch (err) {
        if (!cancelled && currentId === renderId.current && containerRef.current) {
          containerRef.current.innerHTML = ''
          setError(err instanceof Error ? err.message : 'Gagal merender diagram')
        }
      }
    }

    void renderDiagram()
    return () => {
      cancelled = true
    }
  }, [code, theme, reactId, containerRef])

  return (
    <div className="panel preview-panel">
      <div className="panel-label">Preview</div>
      {error ? (
        <div className="preview-error" role="alert">
          <strong>Error</strong>
          <pre>{error}</pre>
        </div>
      ) : null}
      <div
        ref={containerRef}
        className={`preview-canvas${error ? ' is-hidden' : ''}`}
      />
    </div>
  )
}
