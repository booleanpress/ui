import { FileTextIcon, MailIcon, PlugIcon, SettingsIcon, UserIcon } from "lucide-react"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandEmpty,
} from "@booleanpress/ui/command"

export default function CommandBasic() {
  return (
    <Command label="Search pages and actions" className="max-w-sm border">
      <CommandInput placeholder="Search for a page or action" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem>
            <MailIcon />
            Email log
            <CommandShortcut>⌘L</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <PlugIcon />
            Mailers
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <FileTextIcon />
            Routing rules
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Account">
          <CommandItem>
            <UserIcon />
            Profile
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            Settings
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
