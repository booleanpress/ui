import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

export default function TabsBasic() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm">1,284 emails delivered today.</TabsContent>
      <TabsContent value="logs" className="text-sm">The 50 most recent emails.</TabsContent>
      <TabsContent value="settings" className="text-sm">Retry and retention settings.</TabsContent>
    </Tabs>
  )
}
