import { Heading } from "@booleanpress/ui/typography"

export default function TypographyHeadings() {
  return (
    <div className="flex flex-col gap-3">
      <Heading level={1}>Delivery log</Heading>
      <Heading level={2}>Failed deliveries</Heading>
      <Heading level={3}>Bounced by the receiving server</Heading>
      <Heading level={4}>Soft bounces</Heading>
      <Heading level={5}>Mailbox full</Heading>
      <Heading level={6}>Last checked 4 October 2026</Heading>
      <Heading level={2} size={4} className="text-muted-foreground">
        An h2 drawn at size 4
      </Heading>
    </div>
  )
}
