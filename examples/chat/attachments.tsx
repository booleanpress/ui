import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { ChatAttachment, ChatBubble, ChatMessage, ChatThread } from "@booleanpress/ui/chat"

// A stand-in for a screenshot the customer sent: a mail client's bounce notice, drawn inline so the example needs no file.
const SCREENSHOT =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#f8fafc"/><rect x="16" y="16" width="288" height="28" rx="4" fill="#e2e8f0"/><rect x="16" y="60" width="200" height="10" rx="5" fill="#fca5a5"/><rect x="16" y="80" width="260" height="10" rx="5" fill="#cbd5e1"/><rect x="16" y="100" width="230" height="10" rx="5" fill="#cbd5e1"/><rect x="16" y="140" width="96" height="24" rx="4" fill="#334155"/></svg>'
  )

export default function ChatAttachments() {
  return (
    <ChatThread aria-label="Ticket #4830: bounced invoices" className="h-96 w-full max-w-xl rounded-lg border bg-card">
      <ChatMessage
        author="Priya Nair"
        time={new Date(2026, 9, 5, 14, 2)}
        avatar={
          <Avatar>
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
        }
      >
        <ChatBubble>Here is the delivery log and what our customers see when an invoice bounces.</ChatBubble>
        <ChatAttachment name="delivery-log-october.csv" type="text/csv" size={48_200} href="#delivery-log" download />
        <ChatAttachment src={SCREENSHOT} alt="A bounce notice in a mail client, with the error line highlighted" name="bounce.png" />
      </ChatMessage>
      <ChatMessage
        side="end"
        author="Sam Ortiz"
        time={new Date(2026, 9, 5, 14, 9)}
        status="sent"
        avatar={
          <Avatar>
            <AvatarFallback>SO</AvatarFallback>
          </Avatar>
        }
      >
        <ChatAttachment name="dkim-records.txt" type="text/plain" size={1_240} href="#dkim-records" download />
        <ChatBubble>Add these two records at your DNS host; the bounces stop once they are live.</ChatBubble>
      </ChatMessage>
    </ChatThread>
  )
}
