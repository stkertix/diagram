# Mermaid Diagram Editor

Aplikasi editor diagram berbasis [Mermaid](https://mermaid.js.org/) dengan Vite, React, dan TypeScript.

## Fitur

- Editor kode (Monaco) + live preview
- Template contoh: flowchart, sequence, class, ER, gantt, state, pie
- Export SVG / PNG dan salin kode
- Auto-save ke `localStorage`
- Undo / Redo (toolbar atau Ctrl+Z / Ctrl+Y)
- Pilihan tema Mermaid: default, base, dark, forest, neutral, neo, neo-dark, redux, redux-dark, redux-color, redux-dark-color, null

## Menjalankan

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Struktur

- `src/components` — Toolbar, editor, preview, template picker
- `src/hooks` — state diagram, debounce
- `src/lib` — templates, storage, history, export
