import { CopyIcon, PauseIcon, PencilIcon, Trash2Icon } from "lucide-react"
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from "@booleanpress/ui/page-header"

export default function PageHeaderNarrow() {
  return (
    <PageHeader className="w-full max-w-sm rounded-md border p-4">
      <PageHeaderHeading>
        <PageHeaderTitle as="h2">Transactional SES</PageHeaderTitle>
      </PageHeaderHeading>
      <PageHeaderDescription>Under 36rem the actions fold into “More actions”.</PageHeaderDescription>
      <PageHeaderActions>
        <PageHeaderAction icon={<CopyIcon />}>Duplicate</PageHeaderAction>
        <PageHeaderAction icon={<PauseIcon />}>Pause</PageHeaderAction>
        <PageHeaderAction icon={<Trash2Icon />} variant="destructive">
          Delete
        </PageHeaderAction>
        <PageHeaderAction pinned icon={<PencilIcon />}>
          Edit
        </PageHeaderAction>
      </PageHeaderActions>
    </PageHeader>
  )
}
