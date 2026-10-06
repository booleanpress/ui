import { DescriptionItem, DescriptionList } from "@booleanpress/ui/description-list"

const SIZES = ["sm", "default", "lg"] as const

export default function DescriptionListSizes() {
  return (
    <div className="flex w-full flex-col gap-6">
      {SIZES.map((size) => (
        <DescriptionList key={size} size={size} bordered orientation="horizontal">
          <DescriptionItem label="Provider">Postmark</DescriptionItem>
          <DescriptionItem label="Region">us-east-1</DescriptionItem>
          <DescriptionItem label="From address">receipts@acme.example</DescriptionItem>
          <DescriptionItem label="Daily limit">10,000 emails</DescriptionItem>
        </DescriptionList>
      ))}
    </div>
  )
}
