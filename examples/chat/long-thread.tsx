import * as React from "react"
import { Button } from "@booleanpress/ui/button"
import { ChatBubble, ChatMessage, ChatThread } from "@booleanpress/ui/chat"

const EVENTS = ["Queued", "Sent", "Delivered", "Opened", "Clicked", "Deferred", "Bounced"]

// A delivery log read as a thread: one message per event, a minute apart.
const event = (index: number) => ({
  id: index,
  text: `Campaign “October newsletter”: ${EVENTS[index % EVENTS.length].toLowerCase()} for recipient ${1040 + index}.`,
})

export default function ChatLongThread() {
  const [messages, setMessages] = React.useState(() => Array.from({ length: 24 }, (_, index) => event(index)))

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <ChatThread aria-label="Delivery events" className="h-80 rounded-lg border bg-card">
        {messages.map((message) => (
          <ChatMessage key={message.id} author="Delivery log" time={new Date(2026, 9, 5, 8, message.id)}>
            <ChatBubble>{message.text}</ChatBubble>
          </ChatMessage>
        ))}
      </ChatThread>
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>Scroll up, then add an event: the thread stays put and offers a jump.</span>
        <Button variant="outline" size="sm" onClick={() => setMessages((current) => [...current, event(current.length)])}>
          Add an event
        </Button>
      </div>
    </div>
  )
}
