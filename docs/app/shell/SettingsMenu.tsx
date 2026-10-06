import { SettingsIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@booleanpress/ui/popover"
import { SETTINGS, useSettings, type SettingKey, type Settings } from "~/lib/settings.tsx"
import { headerIconButton } from "./styles.ts"

const ORDER: SettingKey[] = ["theme", "palette", "dir", "frame", "exits", "strings"]

/** ⚙: the switches a product's screen can meet, applied to the examples (and to the site around them). */
export function SettingsMenu() {
  const { settings, update } = useSettings()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={headerIconButton} aria-label="Example settings">
          <SettingsIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-80 flex-col gap-4">
        <h2 className="text-sm font-semibold">Example settings</h2>
        {ORDER.map((key) => (
          <div key={key} role="group" aria-label={SETTINGS[key].label} className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">{SETTINGS[key].label}</span>
            <div className="flex flex-wrap gap-1.5">
              {SETTINGS[key].options.map(([value, label]) => (
                <Button
                  key={value}
                  size="xs"
                  variant={settings[key] === value ? "default" : "outline"}
                  aria-pressed={settings[key] === value}
                  onClick={() => update({ [key]: value } as Partial<Settings>)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
