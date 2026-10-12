import { useCallback, useMemo, useRef, useState } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { Preview } from './components/Preview'
import { Toolbar } from './components/Toolbar'
import { useDiagramState } from './hooks/useDiagramState'
import { copyText, downloadPng, downloadSvg } from './lib/export'
import './App.css'

function App() {
  const {
    code,
    debouncedCode,
    theme,
    savedAt,
    setCode,
    applyCodeImmediate,
    setTheme,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useDiagramState()

  const previewRef = useRef<HTMLDivElement>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const statusText = useMemo(() => {
    if (flash) return flash
    if (savedAt) return 'Tersimpan'
    return 'Siap'
  }, [flash, savedAt])

  const showFlash = useCallback((message: string) => {
    setFlash(message)
    window.setTimeout(() => setFlash(null), 1800)
  }, [])

  const handleTemplateSelect = useCallback(
    (templateCode: string) => {
      if (code.trim() && code !== templateCode) {
        const ok = window.confirm(
          'Mengganti dengan template akan menimpa kode saat ini. Lanjutkan?',
        )
        if (!ok) return
      }
      applyCodeImmediate(templateCode)
      showFlash('Template diterapkan')
    },
    [applyCodeImmediate, code, showFlash],
  )

  const handleCopyCode = useCallback(async () => {
    try {
      await copyText(code)
      showFlash('Kode disalin')
    } catch {
      showFlash('Gagal menyalin kode')
    }
  }, [code, showFlash])

  const handleDownloadSvg = useCallback(() => {
    try {
      if (!previewRef.current) throw new Error('Preview belum siap')
      downloadSvg(previewRef.current)
      showFlash('SVG diunduh')
    } catch (err) {
      showFlash(err instanceof Error ? err.message : 'Gagal unduh SVG')
    }
  }, [showFlash])

  const handleDownloadPng = useCallback(async () => {
    try {
      if (!previewRef.current) throw new Error('Preview belum siap')
      await downloadPng(previewRef.current)
      showFlash('PNG diunduh')
    } catch (err) {
      showFlash(err instanceof Error ? err.message : 'Gagal unduh PNG')
    }
  }, [showFlash])

  return (
    <div className="app">
      <Toolbar
        theme={theme}
        canUndo={canUndo}
        canRedo={canRedo}
        statusText={statusText}
        onThemeChange={setTheme}
        onTemplateSelect={handleTemplateSelect}
        onUndo={undo}
        onRedo={redo}
        onCopyCode={handleCopyCode}
        onDownloadSvg={handleDownloadSvg}
        onDownloadPng={handleDownloadPng}
      />
      <main className="workspace">
        <CodeEditor value={code} onChange={setCode} />
        <Preview code={debouncedCode} theme={theme} containerRef={previewRef} />
      </main>
    </div>
  )
}

export default App
