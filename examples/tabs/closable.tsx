import { useRef, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

const FIRST_DRAFTS = [
  { id: "welcome", label: "Welcome email" },
  { id: "reset", label: "Password reset" },
  { id: "invoice", label: "Invoice" },
]

export default function TabsClosable() {
  const [drafts, setDrafts] = useState(FIRST_DRAFTS)
  const [value, setValue] = useState("welcome")
  const count = useRef(1)

  function addDraft() {
    const draft = { id: `draft-${count.current}`, label: `Draft ${count.current}` }
    count.current += 1
    setDrafts((list) => [...list, draft])
    setValue(draft.id)
  }

  return (
    <Tabs value={value} onValueChange={setValue} className="w-full max-w-md">
      <div className="flex">
        <TabsList scrollable aria-label="Open drafts" className="flex-1">
          {drafts.map((draft) => (
            <TabsTrigger
              key={draft.id}
              value={draft.id}
              onClose={() => setDrafts((list) => list.filter((item) => item.id !== draft.id))}
            >
              {draft.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex items-center border-b px-1">
          <Button variant="ghost" size="icon-sm" aria-label="Open a new draft" onClick={addDraft}>
            <PlusIcon />
          </Button>
        </div>
      </div>
      {drafts.map((draft) => (
        <TabsContent key={draft.id} value={draft.id} className="text-sm">
          Editing “{draft.label}”.
        </TabsContent>
      ))}
      {drafts.length === 0 ? <p className="px-4 pt-3 text-sm text-muted-foreground">No drafts are open.</p> : null}
    </Tabs>
  )
}
