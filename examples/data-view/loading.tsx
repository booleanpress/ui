import { DataView } from "@booleanpress/ui/data-view"

export default function DataViewLoading() {
  return (
    <DataView
      aria-label="Mailers"
      items={[]}
      loading
      defaultLayout="grid"
      skeletonCount={6}
      itemMinWidth="11rem"
      className="w-full"
      renderItem={() => null}
    />
  )
}
