import { ChatBubble, ChatDateSeparator, ChatMessage, ChatThread } from "@booleanpress/ui/chat"

export default function ChatDateSeparators() {
  return (
    <ChatThread aria-label="Ticket #4790: monthly report" className="h-96 w-full max-w-xl rounded-lg border bg-card">
      <ChatDateSeparator date={new Date(2026, 9, 1)} />
      <ChatMessage author="Ana Silva" time={new Date(2026, 9, 1, 16, 45)}>
        <ChatBubble>Could the monthly delivery report include the open rate per template?</ChatBubble>
      </ChatMessage>
      <ChatMessage side="end" author="You" time={new Date(2026, 9, 1, 17, 5)}>
        <ChatBubble>Good idea. I have passed it to the product team.</ChatBubble>
      </ChatMessage>
      <ChatDateSeparator date={new Date(2026, 9, 5)} />
      <ChatMessage side="end" author="You" time={new Date(2026, 9, 5, 9, 30)}>
        <ChatBubble>It is in this morning's release: Reports → Templates → Open rate.</ChatBubble>
      </ChatMessage>
      <ChatMessage author="Ana Silva" time={new Date(2026, 9, 5, 9, 52)}>
        <ChatBubble>Found it. Thank you!</ChatBubble>
      </ChatMessage>
    </ChatThread>
  )
}
