import { DescriptionItem, DescriptionList } from "@booleanpress/ui/description-list"

export default function DescriptionListColumns() {
  return (
    <DescriptionList columns={3} className="w-full">
      <DescriptionItem label="Requester">Ana Lima</DescriptionItem>
      <DescriptionItem label="Assignee">Priya Shah</DescriptionItem>
      <DescriptionItem label="Priority">High</DescriptionItem>
      <DescriptionItem label="Opened">14 October 2026</DescriptionItem>
      <DescriptionItem label="Channel">Email</DescriptionItem>
      <DescriptionItem label="Organisation">Acme Ltd</DescriptionItem>
      <DescriptionItem label="Subject" span={3}>
        SMTP login fails after the password was changed on the provider's side
      </DescriptionItem>
    </DescriptionList>
  )
}
