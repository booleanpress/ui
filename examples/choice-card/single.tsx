import { Badge } from "@booleanpress/ui/badge"
import { ChoiceCard, ChoiceCardGroup } from "@booleanpress/ui/choice-card"

export default function ChoiceCardSingle() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <span id="plan-label" className="text-base/normal font-medium text-foreground">
        Choose a plan:
      </span>
      <ChoiceCardGroup type="single" defaultValue="pro" aria-labelledby="plan-label">
        <ChoiceCard value="starter" title="Starter" aside={<Price amount="$0" />} description="For one site sending its own receipts." />
        <ChoiceCard
          value="pro"
          title={
            <>
              Pro <Badge>Popular</Badge>
            </>
          }
          aside={<Price amount="$29" />}
          description="For teams sending from several sites."
        />
        <ChoiceCard value="agency" title="Agency" aside={<span className="font-semibold">Custom</span>} description="For agencies running mail for their clients." />
      </ChoiceCardGroup>
    </div>
  )
}

function Price({ amount }: { amount: string }) {
  return (
    <>
      <span className="font-semibold">{amount}</span>
      <span className="text-muted-foreground">/month</span>
    </>
  )
}
