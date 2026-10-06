import { CloudIcon, MailIcon, ServerIcon } from "lucide-react"
import { ChoiceCard, ChoiceCardGroup } from "@booleanpress/ui/choice-card"

export default function ChoiceCardWithIcons() {
  return (
    <ChoiceCardGroup type="single" defaultValue="api" aria-label="Connection type" className="w-full max-w-xs">
      <ChoiceCard value="api" icon={<CloudIcon />} title="API" description="Send through the provider's HTTP API." />
      <ChoiceCard value="smtp" icon={<ServerIcon />} title="SMTP" description="Send through any SMTP server." />
      <ChoiceCard value="php" icon={<MailIcon />} title="PHP mail" description="Send with the server's own mail function." />
    </ChoiceCardGroup>
  )
}
