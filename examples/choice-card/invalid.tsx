import { ChoiceCard, ChoiceCardGroup } from "@booleanpress/ui/choice-card"

export default function ChoiceCardInvalid() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <ChoiceCardGroup type="single" aria-label="Sending domain" aria-invalid aria-describedby="domain-error">
        <ChoiceCard value="mail" title="mail.example.com" description="Verified on 2 October 2026." />
        <ChoiceCard value="news" title="news.example.com" description="Verified on 14 October 2026." />
      </ChoiceCardGroup>
      <p id="domain-error" className="text-sm/normal text-destructive-strong">
        Choose the domain to send from.
      </p>
    </div>
  )
}
