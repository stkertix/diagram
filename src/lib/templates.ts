export type MermaidTemplate = {
  id: string
  name: string
  code: string
}

export const TEMPLATES: MermaidTemplate[] = [
  {
    id: 'flowchart',
    name: 'Flowchart',
    code: `flowchart TD
    A[Mulai] --> B{Ada data?}
    B -->|Ya| C[Proses data]
    B -->|Tidak| D[Minta input]
    C --> E[Simpan hasil]
    D --> B
    E --> F[Selesai]`,
  },
  {
    id: 'sequence',
    name: 'Sequence',
    code: `sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as Backend
    participant DB as Database

    User->>UI: Buka halaman
    UI->>API: GET /diagrams
    API->>DB: Query data
    DB-->>API: Hasil
    API-->>UI: JSON response
    UI-->>User: Tampilkan diagram`,
  },
  {
    id: 'class',
    name: 'Class',
    code: `classDiagram
    class DiagramEditor {
      +string code
      +string theme
      +setCode(code)
      +setTheme(theme)
      +exportSvg()
      +exportPng()
    }
    class Preview {
      +render(code)
      +showError(msg)
    }
    class Storage {
      +load()
      +save(state)
    }
    DiagramEditor --> Preview : menampilkan
    DiagramEditor --> Storage : menyimpan`,
  },
  {
    id: 'er',
    name: 'ER Diagram',
    code: `erDiagram
    USER ||--o{ DIAGRAM : membuat
    USER {
      string id PK
      string name
      string email
    }
    DIAGRAM {
      string id PK
      string title
      string code
      string theme
      string user_id FK
    }
    DIAGRAM ||--|{ TEMPLATE : memakai
    TEMPLATE {
      string id PK
      string name
      string code
    }`,
  },
  {
    id: 'gantt',
    name: 'Gantt',
    code: `gantt
    title Jadwal Proyek Diagram Editor
    dateFormat  YYYY-MM-DD
    section Setup
    Scaffold proyek       :done,    s1, 2026-10-01, 2d
    Install dependensi    :done,    s2, after s1, 1d
    section Fitur
    Editor + Preview      :active,  f1, 2026-10-04, 3d
    Template & Export     :         f2, after f1, 2d
    Persistensi           :         f3, after f2, 2d
    section Rilis
    Uji & polish          :         r1, after f3, 2d`,
  },
  {
    id: 'state',
    name: 'State',
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Editing : ketik kode
    Editing --> Rendering : debounce selesai
    Rendering --> Preview : sukses
    Rendering --> Error : gagal parse
    Preview --> Editing : ubah kode
    Error --> Editing : perbaiki kode
    Preview --> [*]`,
  },
  {
    id: 'pie',
    name: 'Pie Chart',
    code: `pie showData
    title Distribusi tipe diagram
    "Flowchart" : 35
    "Sequence" : 25
    "Class" : 15
    "ER" : 12
    "Lainnya" : 13`,
  },
]

export const DEFAULT_CODE = TEMPLATES[0].code
