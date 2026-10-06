import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@booleanpress/ui/avatar"
import { Badge } from "@booleanpress/ui/badge"
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderTitle,
} from "@booleanpress/ui/page-header"

/** A person's silhouette on a coloured square, as a stand-in photo. */
const photo = (ground: string, figure: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${ground}"/><circle cx="32" cy="25" r="11" fill="${figure}"/><path d="M10 64c2-16 12-24 22-24s20 8 22 24z" fill="${figure}"/></svg>`
  )

export default function PageHeaderWithMeta() {
  return (
    <PageHeader className="w-full">
      <PageHeaderHeading>
        <PageHeaderTitle as="h2">Ticket #1041</PageHeaderTitle>
        <PageHeaderMeta>
          <Badge variant="warning">Waiting on customer</Badge>
          <AvatarGroup>
            <Avatar size="sm">
              <AvatarImage src={photo("#6366f1", "#e0e7ff")} alt="Ana Ruiz" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarImage src={photo("#059669", "#d1fae5")} alt="Li Wei" />
              <AvatarFallback>LW</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <span>Updated 4 Oct 2026</span>
        </PageHeaderMeta>
      </PageHeaderHeading>
      <PageHeaderDescription>Cannot connect to SES from the staging site.</PageHeaderDescription>
      <PageHeaderActions>
        <PageHeaderAction>Assign</PageHeaderAction>
        <PageHeaderAction pinned>Reply</PageHeaderAction>
      </PageHeaderActions>
    </PageHeader>
  )
}
