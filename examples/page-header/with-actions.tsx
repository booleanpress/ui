import { DownloadIcon, PlusIcon, SendIcon } from "lucide-react"
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from "@booleanpress/ui/page-header"

export default function PageHeaderWithActions() {
  return (
    <PageHeader className="w-full">
      <PageHeaderHeading>
        <PageHeaderTitle as="h2">Mailers</PageHeaderTitle>
      </PageHeaderHeading>
      <PageHeaderDescription>The connections your sites send email through.</PageHeaderDescription>
      <PageHeaderActions>
        <PageHeaderAction icon={<DownloadIcon />}>Export</PageHeaderAction>
        <PageHeaderAction icon={<SendIcon />}>Send test</PageHeaderAction>
        <PageHeaderAction pinned icon={<PlusIcon />}>
          Add mailer
        </PageHeaderAction>
      </PageHeaderActions>
    </PageHeader>
  )
}
