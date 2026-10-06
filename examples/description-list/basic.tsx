import { DescriptionItem, DescriptionList } from "@booleanpress/ui/description-list"

export default function DescriptionListBasic() {
  return (
    <DescriptionList className="w-full max-w-sm">
      <DescriptionItem label="Provider">Amazon SES</DescriptionItem>
      <DescriptionItem label="From address">no-reply@acme.example</DescriptionItem>
      <DescriptionItem label="Region">eu-west-1</DescriptionItem>
      <DescriptionItem label="Daily limit">50,000 emails</DescriptionItem>
    </DescriptionList>
  )
}
