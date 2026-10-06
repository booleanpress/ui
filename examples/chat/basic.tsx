import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { ChatBubble, ChatDateSeparator, ChatMessage, ChatThread } from "@booleanpress/ui/chat"

const maya = (
  <Avatar>
    <AvatarFallback>MC</AvatarFallback>
  </Avatar>
)
const sam = (
  <Avatar>
    <AvatarFallback>SO</AvatarFallback>
  </Avatar>
)

export default function ChatBasic() {
  return (
    <ChatThread aria-label="Ticket #4821: reset emails not arriving" className="h-96 w-full max-w-xl rounded-lg border bg-card">
      <ChatDateSeparator date={new Date(2026, 9, 5)} />
      <ChatMessage author="Maya Chen" avatar={maya} time={new Date(2026, 9, 5, 9, 12)}>
        <ChatBubble>Hi, our password reset emails stopped arriving this morning. Sign-up emails still go out.</ChatBubble>
      </ChatMessage>
      <ChatMessage side="end" author="Sam Ortiz" avatar={sam} time={new Date(2026, 9, 5, 9, 18)}>
        <ChatBubble>
          Thanks, Maya. I can see 14 bounces from the reset template since 08:40. Did its sender address change?
        </ChatBubble>
      </ChatMessage>
      <ChatMessage author="Maya Chen" avatar={maya} time={new Date(2026, 9, 5, 9, 21)}>
        <ChatBubble>Yes, we moved it to accounts@northwind.test yesterday.</ChatBubble>
      </ChatMessage>
      <ChatMessage author="Maya Chen" avatar={maya} time={new Date(2026, 9, 5, 9, 21)} continued>
        <ChatBubble>Is that domain not verified yet?</ChatBubble>
      </ChatMessage>
      <ChatMessage side="end" author="Sam Ortiz" avatar={sam} time={new Date(2026, 9, 5, 9, 26)} status="sent">
        <ChatBubble>That is it: the new domain has no DKIM record. I have sent you the two records to add.</ChatBubble>
      </ChatMessage>
    </ChatThread>
  )
}
