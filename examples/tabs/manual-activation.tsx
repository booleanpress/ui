import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

export default function TabsManualActivation() {
  return (
    <Tabs defaultValue="sent" activationMode="manual" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="sent">Sent</TabsTrigger>
        <TabsTrigger value="failed">Failed</TabsTrigger>
        <TabsTrigger value="queued">Queued</TabsTrigger>
      </TabsList>
      <TabsContent value="sent" className="text-sm">1,284 emails sent today.</TabsContent>
      <TabsContent value="failed" className="text-sm">3 emails failed and wait for a retry.</TabsContent>
      <TabsContent value="queued" className="text-sm">12 emails are queued.</TabsContent>
    </Tabs>
  )
}
