import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

export default function TabsControlled() {
  const [tab, setTab] = useState("overview")

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      <Button size="sm" onClick={() => setTab("logs")} disabled={tab === "logs"}>
        Show the logs
      </Button>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-sm">1,284 emails delivered today.</TabsContent>
        <TabsContent value="logs" className="text-sm">The 50 most recent emails.</TabsContent>
        <TabsContent value="settings" className="text-sm">Retry and retention settings.</TabsContent>
      </Tabs>
    </div>
  )
}
