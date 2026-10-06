import { ChoiceCard, ChoiceCardGroup } from "@booleanpress/ui/choice-card"

export default function ChoiceCardDisabled() {
  return (
    <ChoiceCardGroup type="single" defaultValue="daily" aria-label="Log retention" className="w-full max-w-xs">
      <ChoiceCard value="daily" title="30 days" description="Logs older than a month are removed." />
      <ChoiceCard value="quarter" title="90 days" description="Logs older than three months are removed." />
      <ChoiceCard value="forever" title="Keep forever" description="Available on the Agency plan." disabled />
    </ChoiceCardGroup>
  )
}
