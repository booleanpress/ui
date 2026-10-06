import { ChoiceCard, ChoiceCardGroup } from "@booleanpress/ui/choice-card"

export default function ChoiceCardMultiple() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <span id="notify-label" className="text-base/normal font-medium text-foreground">
        Notify me about:
      </span>
      <ChoiceCardGroup type="multiple" defaultValue={["bounces"]} aria-labelledby="notify-label" className="sm:grid-cols-3">
        <ChoiceCard value="bounces" title="Bounces" description="A message could not be delivered and was returned." />
        <ChoiceCard value="complaints" title="Complaints" description="A recipient marked a message as spam." />
        <ChoiceCard value="digest" title="Weekly digest" description="A summary of sends, opens and clicks each Monday." />
      </ChoiceCardGroup>
    </div>
  )
}
