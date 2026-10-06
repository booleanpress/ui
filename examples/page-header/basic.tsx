import { PageHeader, PageHeaderDescription, PageHeaderHeading, PageHeaderTitle } from "@booleanpress/ui/page-header"

export default function PageHeaderBasic() {
  return (
    <PageHeader className="w-full">
      <PageHeaderHeading>
        <PageHeaderTitle as="h2">Email log</PageHeaderTitle>
      </PageHeaderHeading>
      <PageHeaderDescription>Every email your sites sent in the last 30 days.</PageHeaderDescription>
    </PageHeader>
  )
}
