import { BellIcon, CheckIcon, HeartIcon, SearchIcon, StarIcon, UserIcon, XIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"

const ACTIONS = [
  { label: "Confirm", icon: CheckIcon, severity: undefined },
  { label: "Search", icon: SearchIcon, severity: "success" },
  { label: "Profile", icon: UserIcon, severity: "info" },
  { label: "Notifications", icon: BellIcon, severity: "warning" },
  { label: "Favourite", icon: HeartIcon, severity: "help" },
  { label: "Remove", icon: XIcon, severity: "danger" },
  { label: "Star", icon: StarIcon, severity: "contrast" },
] as const

const ROWS = [
  { name: "solid", props: {} },
  { name: "rounded", props: { rounded: true } },
  { name: "outlined", props: { rounded: true, variant: "outline" } },
  { name: "raised", props: { rounded: true, raised: true } },
  { name: "text", props: { rounded: true, variant: "ghost" } },
] as const

export default function ButtonIconOnly() {
  return (
    <div className="flex flex-col items-center gap-6">
      {ROWS.map((row) => (
        <div key={row.name} className="flex flex-wrap justify-center gap-4">
          {ACTIONS.map(({ label, icon: Icon, severity }) => (
            <Button key={label} size="icon" severity={severity} aria-label={`${label}, ${row.name}`} {...row.props}>
              <Icon />
            </Button>
          ))}
        </div>
      ))}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button size="icon-sm" aria-label="Search, small">
          <SearchIcon />
        </Button>
        <Button size="icon" aria-label="Search, default">
          <SearchIcon />
        </Button>
        <Button size="icon-lg" aria-label="Search, large">
          <SearchIcon />
        </Button>
        <Button size="icon-sm" rounded variant="outline" severity="info" aria-label="Profile, small">
          <UserIcon />
        </Button>
        <Button size="icon" rounded variant="outline" severity="info" aria-label="Profile, default">
          <UserIcon />
        </Button>
        <Button size="icon-lg" rounded variant="outline" severity="info" aria-label="Profile, large">
          <UserIcon />
        </Button>
      </div>
    </div>
  )
}
