import { DescriptionItem, DescriptionList } from "@booleanpress/ui/description-list"

export default function DescriptionListBordered() {
  return (
    <div className="flex w-full flex-col gap-6">
      <DescriptionList bordered orientation="horizontal" columns={2}>
        <DescriptionItem label="Organisation">Acme Ltd</DescriptionItem>
        <DescriptionItem label="Plan">Business</DescriptionItem>
        <DescriptionItem label="Seats">12 of 15</DescriptionItem>
        <DescriptionItem label="Renews">1 January 2027</DescriptionItem>
        <DescriptionItem label="Billing email">billing@acme.example</DescriptionItem>
      </DescriptionList>
      <DescriptionList bordered columns={3}>
        <DescriptionItem label="Organisation">Acme Ltd</DescriptionItem>
        <DescriptionItem label="Plan">Business</DescriptionItem>
        <DescriptionItem label="Seats">12 of 15</DescriptionItem>
        <DescriptionItem label="Renews">1 January 2027</DescriptionItem>
        <DescriptionItem label="Billing email">billing@acme.example</DescriptionItem>
      </DescriptionList>
    </div>
  )
}
