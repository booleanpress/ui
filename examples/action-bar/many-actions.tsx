import { ArchiveIcon, EllipsisIcon, MailIcon, TagIcon, Trash2Icon, UserPlusIcon } from "lucide-react"
import { useState } from "react"
import { ActionBar, ActionBarButton, ActionBarSeparator } from "@booleanpress/ui/action-bar"
import { Checkbox } from "@booleanpress/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@booleanpress/ui/dropdown-menu"

const CUSTOMERS = ["Ana Ruiz", "Li Wei", "Sam Okoye", "Grace Hall"]

export default function ActionBarManyActions() {
  const [selected, setSelected] = useState<string[]>(["Li Wei", "Sam Okoye"])
  const toggle = (name: string, on: boolean) => setSelected((cur) => (on ? [...cur, name] : cur.filter((x) => x !== name)))

  return (
    <div className="relative h-72 w-full max-w-md rounded-md border">
      <ul className="divide-y">
        {CUSTOMERS.map((name) => (
          <li key={name} className="flex items-center gap-3 px-4 py-2.5 text-sm">
            <Checkbox id={`c-${name}`} checked={selected.includes(name)} onCheckedChange={(on) => toggle(name, on === true)} />
            <label htmlFor={`c-${name}`}>{name}</label>
          </li>
        ))}
      </ul>
      <ActionBar count={selected.length} onClear={() => setSelected([])} aria-label="Customer actions">
        <ActionBarButton>
          <MailIcon />
          Email
        </ActionBarButton>
        <ActionBarButton>
          <TagIcon />
          Tag
        </ActionBarButton>
        <ActionBarSeparator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionBarButton size="icon" aria-label="More actions">
              <EllipsisIcon />
            </ActionBarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top">
            <DropdownMenuItem>
              <UserPlusIcon />
              Assign to…
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArchiveIcon />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setSelected([])}>
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ActionBar>
    </div>
  )
}
