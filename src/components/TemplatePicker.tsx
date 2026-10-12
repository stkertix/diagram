import { TEMPLATES } from '../lib/templates'

type TemplatePickerProps = {
  onSelect: (code: string) => void
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  return (
    <label className="field">
      <span className="field-label">Template</span>
      <select
        className="select"
        defaultValue=""
        onChange={(event) => {
          const id = event.target.value
          if (!id) return
          const template = TEMPLATES.find((item) => item.id === id)
          if (!template) return
          onSelect(template.code)
          event.target.value = ''
        }}
      >
        <option value="" disabled>
          Pilih template…
        </option>
        {TEMPLATES.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
    </label>
  )
}
