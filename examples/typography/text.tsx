import { Text } from "@booleanpress/ui/typography"

export default function TypographyText() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Text size="lg" tone="muted">
        A lead paragraph: what this page is for, in one sentence.
      </Text>
      <Text size="base">Running text, for help pages and articles: 16 pixels on a 24 pixel line.</Text>
      <Text>Component text, the default: 14 pixels on a 21 pixel line.</Text>
      <Text size="xs" tone="muted">
        Small print: last synced 5 October 2026.
      </Text>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <Text tone="strong" weight="semibold">
          Strong
        </Text>
        <Text tone="muted">Muted</Text>
        <Text tone="success" weight="medium">
          Delivered
        </Text>
        <Text tone="destructive" weight="medium">
          Bounced
        </Text>
      </div>
    </div>
  )
}
