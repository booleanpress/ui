import * as React from "react"
import { ChatBubble, ChatMessage, ChatThread, ChatTypingIndicator, type ChatMessageStatus } from "@booleanpress/ui/chat"

export default function ChatStatuses() {
  const [retried, setRetried] = React.useState<ChatMessageStatus>("failed")

  const retry = () => {
    setRetried("sending")
    // A fake request: the message goes through after a fixed delay.
    window.setTimeout(() => setRetried("sent"), 1200)
  }

  return (
    <ChatThread aria-label="Ticket #4835: API key rotation" className="h-96 w-full max-w-xl rounded-lg border bg-card">
      <ChatMessage side="end" author="You" time={new Date(2026, 9, 5, 11, 2)} status="sent">
        <ChatBubble>Your old API key stops working at midnight UTC.</ChatBubble>
      </ChatMessage>
      <ChatMessage side="end" author="You" time={new Date(2026, 9, 5, 11, 3)} status={retried} onRetry={retry}>
        <ChatBubble>The new key is in Settings → API keys, under “Production”.</ChatBubble>
      </ChatMessage>
      <ChatMessage side="end" author="You" time={new Date(2026, 9, 5, 11, 4)} status="sending">
        <ChatBubble>Let me know once your mailer uses it.</ChatBubble>
      </ChatMessage>
      <ChatTypingIndicator name="Leo Martin" />
    </ChatThread>
  )
}
