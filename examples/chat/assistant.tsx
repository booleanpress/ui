import * as React from "react"
import { SparklesIcon, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { ChatBubble, ChatComposer, ChatMessage, ChatThread } from "@booleanpress/ui/chat"

const assistant = (
  <Avatar size="sm">
    <AvatarFallback className="bg-primary text-primary-foreground">
      <SparklesIcon />
    </AvatarFallback>
  </Avatar>
)
const you = (
  <Avatar size="sm">
    <AvatarFallback>
      <UserIcon />
    </AvatarFallback>
  </Avatar>
)

const ANSWER = "Open Settings → Domains, choose the domain and copy the two DKIM records into your DNS host. Checks run every 10 minutes."

export default function ChatAssistant() {
  const [questions, setQuestions] = React.useState(["How do I verify a sending domain?"])

  return (
    <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            <SparklesIcon />
          </AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <div className="font-semibold text-foreground">Mailer assistant</div>
          <div className="text-muted-foreground">Ask about domains, templates and delivery logs</div>
        </div>
      </div>
      <ChatThread aria-label="Mailer assistant" className="h-72">
        {questions.map((question, index) => (
          <React.Fragment key={index}>
            <ChatMessage side="end" author="You" avatar={you} time={new Date(2026, 9, 5, 15, index * 2)}>
              <ChatBubble>{question}</ChatBubble>
            </ChatMessage>
            <ChatMessage author="Assistant" avatar={assistant} time={new Date(2026, 9, 5, 15, index * 2 + 1)}>
              <ChatBubble variant="plain">{ANSWER}</ChatBubble>
            </ChatMessage>
          </React.Fragment>
        ))}
      </ChatThread>
      <ChatComposer className="m-3 mt-0" placeholder="Ask a question" onSend={(text) => setQuestions((current) => [...current, text])} />
    </div>
  )
}
