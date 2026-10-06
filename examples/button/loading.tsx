import { useState } from "react"
import { SaveIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"

export default function ButtonLoading() {
  const [saving, setSaving] = useState(false)

  function save() {
    setSaving(true)
    window.setTimeout(() => setSaving(false), 2000)
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button loading={saving} onClick={save}>
        <SaveIcon />
        Save changes
      </Button>
      <Button loading={saving} onClick={save} size="icon" aria-label="Save changes">
        <SaveIcon />
      </Button>
    </div>
  )
}
