import { Badge } from "@booleanpress/ui/badge"
import { DescriptionItem, DescriptionList } from "@booleanpress/ui/description-list"

export default function DescriptionListHorizontal() {
  return (
    <DescriptionList orientation="horizontal" className="w-full max-w-md">
      <DescriptionItem label="Provider">Amazon SES</DescriptionItem>
      <DescriptionItem label="From address">no-reply@acme.example</DescriptionItem>
      <DescriptionItem label="Status">
        <Badge variant="success">Active</Badge>
      </DescriptionItem>
      <DescriptionItem label="Last test sent">15 October 2026, 10:30</DescriptionItem>
    </DescriptionList>
  )
}
