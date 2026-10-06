import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { DescriptionItem, DescriptionList } from "@booleanpress/ui/description-list"

const SETTINGS = [
  { label: "SMTP host", value: "smtp.acme.example" },
  { label: "Port", value: "587" },
  { label: "Username", value: "mailer@acme.example" },
  { label: "API key", value: "bp_live_4f9a…c21e" },
]

export default function DescriptionListWithActions() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (label: string, value: string) => {
    void navigator.clipboard?.writeText(value)
    setCopied(label)
  }

  return (
    <DescriptionList bordered orientation="horizontal" className="w-full max-w-md">
      {SETTINGS.map(({ label, value }) => (
        <DescriptionItem
          key={label}
          label={label}
          action={
            <Button variant="ghost" size="icon-sm" aria-label={`Copy ${label}`} onClick={() => copy(label, value)}>
              {copied === label ? <CheckIcon /> : <CopyIcon />}
            </Button>
          }
        >
          <code className="font-mono text-[0.8125rem]">{value}</code>
        </DescriptionItem>
      ))}
    </DescriptionList>
  )
}
