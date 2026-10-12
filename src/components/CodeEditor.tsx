import Editor from '@monaco-editor/react'

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <div className="panel editor-panel">
      <div className="panel-label">Kode Mermaid</div>
      <Editor
        height="100%"
        defaultLanguage="markdown"
        theme="vs-dark"
        value={value}
        onChange={(next) => onChange(next ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 12 },
        }}
      />
    </div>
  )
}
