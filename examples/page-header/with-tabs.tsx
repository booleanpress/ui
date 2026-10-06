import { PlusIcon } from "lucide-react"
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderActions,
  PageHeaderHeading,
  PageHeaderTitle,
} from "@booleanpress/ui/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

export default function PageHeaderWithTabs() {
  return (
    <div className="flex w-full flex-col gap-4">
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle as="h2">Customers</PageHeaderTitle>
        </PageHeaderHeading>
        <PageHeaderActions>
          <PageHeaderAction pinned icon={<PlusIcon />}>
            Add customer
          </PageHeaderAction>
        </PageHeaderActions>
      </PageHeader>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="text-sm">2,418 customers.</TabsContent>
        <TabsContent value="active" className="text-sm">2,106 active customers.</TabsContent>
        <TabsContent value="archived" className="text-sm">312 archived customers.</TabsContent>
      </Tabs>
    </div>
  )
}
