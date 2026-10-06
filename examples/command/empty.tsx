import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@booleanpress/ui/command"

export default function CommandEmptyExample() {
  return (
    <Command label="Search mailers" className="max-w-sm border">
      <CommandInput placeholder="Search mailers" defaultValue="postmark" />
      <CommandList>
        <CommandEmpty>No mailer matches that name.</CommandEmpty>
        <CommandItem>Amazon SES</CommandItem>
        <CommandItem>Mailgun</CommandItem>
        <CommandItem>SendGrid</CommandItem>
      </CommandList>
    </Command>
  )
}
