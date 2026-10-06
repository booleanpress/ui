import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@booleanpress/ui/breadcrumb"
import {
  PageHeader,
  PageHeaderBreadcrumb,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from "@booleanpress/ui/page-header"

export default function PageHeaderWithBreadcrumb() {
  return (
    <PageHeader className="w-full">
      <PageHeaderBreadcrumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Mailers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Primary SMTP</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </PageHeaderBreadcrumb>
      <PageHeaderHeading>
        <PageHeaderTitle as="h2">Primary SMTP</PageHeaderTitle>
      </PageHeaderHeading>
      <PageHeaderDescription>smtp.example.com, port 587, STARTTLS.</PageHeaderDescription>
    </PageHeader>
  )
}
