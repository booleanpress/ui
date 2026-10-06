import * as React from "react"
import { ChatBubble, ChatComposer, ChatMessage, ChatThread, type ChatMessageStatus } from "@booleanpress/ui/chat"

type Message = { id: number; side: "start" | "end"; text: string; status?: ChatMessageStatus }

export default function ChatComposerExample() {
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 1, side: "start", text: "Hello! Can I add a second sending domain on the Starter plan?" },
    { id: 2, side: "end", text: "Yes, Starter includes two domains.", status: "sent" },
  ])

  const send = (text: string) => {
    const id = messages.length + 1
    setMessages((current) => [...current, { id, side: "end", text, status: "sending" }])
    // A fake request: the message is marked sent after a fixed delay.
    window.setTimeout(() => {
      setMessages((current) => current.map((message) => (message.id === id ? { ...message, status: "sent" } : message)))
    }, 800)
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <ChatThread aria-label="Chat with Omar Haddad" className="h-72 rounded-lg border bg-card">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            side={message.side}
            author={message.side === "end" ? "You" : "Omar Haddad"}
            // Fixed times: one minute apart from 10:00.
            time={new Date(2026, 9, 5, 10, message.id)}
            status={message.status}
          >
            <ChatBubble>{message.text}</ChatBubble>
          </ChatMessage>
        ))}
      </ChatThread>
      <ChatComposer placeholder="Write a reply… (Enter sends, Shift+Enter adds a line)" onSend={send} onAttach={() => {}} />
    </div>
  )
}
