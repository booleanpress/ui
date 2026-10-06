import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

export default function TabsVertical() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="w-full max-w-sm flex-row">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="mailers">Mailers</TabsTrigger>
        <TabsTrigger value="logging">Logging</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="text-sm">Sender name and address.</TabsContent>
      <TabsContent value="mailers" className="text-sm">The connections that send email.</TabsContent>
      <TabsContent value="logging" className="text-sm">What is kept, and for how long.</TabsContent>
    </Tabs>
  )
}
