import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

export default function TabsLine() {
  return (
    <Tabs defaultValue="open" className="w-full max-w-sm">
      <TabsList variant="line">
        <TabsTrigger value="open">Open</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="closed">Closed</TabsTrigger>
      </TabsList>
      <TabsContent value="open" className="text-sm">12 open tickets.</TabsContent>
      <TabsContent value="pending" className="text-sm">4 tickets wait for a reply.</TabsContent>
      <TabsContent value="closed" className="text-sm">230 closed tickets.</TabsContent>
    </Tabs>
  )
}
