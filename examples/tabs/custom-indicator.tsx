import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

export default function TabsCustomIndicator() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList variant="line">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="account" className="text-sm">Your name, email address and password.</TabsContent>
      <TabsContent value="billing" className="text-sm">The plan, the invoices and the card on file.</TabsContent>
      <TabsContent value="notifications" className="text-sm">Which emails you get from us.</TabsContent>
    </Tabs>
  )
}
