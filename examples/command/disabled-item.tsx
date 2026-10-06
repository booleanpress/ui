import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@booleanpress/ui/command"

export default function CommandDisabledItem() {
  return (
    <Command label="Search actions" className="max-w-sm border">
      <CommandInput placeholder="Search actions" />
      <CommandList>
        <CommandGroup heading="Actions">
          <CommandItem>Send a test email</CommandItem>
          <CommandItem disabled>Export the log (needs Pro)</CommandItem>
          <CommandItem>Clear the cache</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
