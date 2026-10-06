import { GlobeIcon, KeyRoundIcon, MailIcon, ServerIcon } from "lucide-react"
import { Chip } from "@booleanpress/ui/chip"

export default function ChipIcon() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Chip icon={<MailIcon />} label="SMTP" />
      <Chip icon={<ServerIcon />} label="Amazon SES" />
      <Chip icon={<GlobeIcon />} label="mail.example.com" />
      <Chip icon={<KeyRoundIcon />} label="API key" />
    </div>
  )
}
