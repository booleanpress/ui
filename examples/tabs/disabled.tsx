import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

export default function TabsDisabled() {
  return (
    <Tabs defaultValue="rules" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="rules">Rules</TabsTrigger>
        <TabsTrigger value="history" disabled>
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="rules" className="text-sm">3 routing rules are active.</TabsContent>
      <TabsContent value="history" className="text-sm">Rule history.</TabsContent>
    </Tabs>
  )
}
