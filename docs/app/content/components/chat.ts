import type { ComponentDoc } from "../types.ts"

export default {
  slug: "chat",
  title: "Chat",
  category: "Messages",
  purpose: "A conversation: messages with their authors and times, attachments, statuses, a typing indicator and a composer.",
  links: {
    apg: { label: "ARIA log role", href: "https://www.w3.org/TR/wai-aria-1.2/#log" },
    spec: "specs/004_full-suite-components.md#chat",
  },
  usage: `\`\`\`tsx
<ChatThread aria-label="Ticket #4821" className="h-96">
  {messages.map((m) => (
    <ChatMessage key={m.id} side={m.mine ? "end" : "start"} author={m.author} time={m.sentAt}>
      <ChatBubble>{m.text}</ChatBubble>
    </ChatMessage>
  ))}
</ChatThread>
<ChatComposer placeholder="Write a reply…" onSend={onSend} />
\`\`\``,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description: "A support ticket, with the customer on one side and the agent on the other.",
    },
    {
      id: "attachments",
      title: "With attachments",
      description: "A file, a picture and a reply with a file.",
    },
    {
      id: "statuses",
      title: "Typing and statuses",
      description: "Sent, sending and failed messages, and the other person typing.",
    },
    {
      id: "date-separators",
      title: "Date separators",
      description: "A day label between messages.",
    },
    {
      id: "composer",
      title: "Composer",
      description: "Enter sends the message and the thread scrolls to it.",
    },
    {
      id: "long-thread",
      title: "Long thread",
      description: "Scroll up and add a message: the thread keeps your place and offers a jump to the new one.",
    },
    {
      id: "assistant",
      title: "Assistant style",
      description: "Answers as plain text and questions in bubbles, above a composer.",
    },
  ],
  accessibility: {
    semantics:
      'The thread is a `role="log"`: new messages are read politely, without moving focus. Each message is an `article` that reads its author and time first.',
    labels:
      "Name the thread after the ticket or the person with `aria-label`. Give a picture attachment an `alt`; avatars are hidden because the author's name is read.",
    focus:
      "The thread is a tab stop while it scrolls with nothing focusable inside, so the arrow keys can scroll it. After a send, focus stays in the field.",
    limits: [
      "Every message added to the thread is announced, including the reader's own; statuses that change are announced too. A very busy thread may be better with the newest messages only.",
      "The jump appears for new messages only; a reader who scrolls up without new messages scrolls back themselves.",
      "The composer's height follows its text up to 160 px, then it scrolls.",
      "Enter that confirms an input method's composition (Japanese, Chinese, Korean) does not send.",
      "The thread does not load older messages as you scroll up; add them to the start of the list yourself.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "In the composer, sends the message and empties the field; nothing happens while it is blank and holds no attachments." },
    { keys: ["Shift", "Enter"], behaviour: "In the composer, starts a new line." },
    { keys: ["Enter", "Space"], behaviour: "On the send, attach, retry or New messages button, activates it." },
  ],
  theming:
    "Bubbles from others are `--muted` with `--foreground` text; the reader's are `--primary` with `--primary-foreground`. Names are `--foreground`, times, statuses and the date separator `--muted-foreground`, a failed status `--destructive-strong`. File chips are `--card` with the `--border` edge and the type icon on `--secondary`. The composer has the field look: `--field` (`--field-filled` when filled), the `--control` edge and `--ring` while focused.",
  props: {
    ChatThread: {
      className: "Classes for the thread; give it a height (`h-96`), as it scrolls on its own.",
      "aria-label": "The thread's name; the provider's `chatThread` string by default.",
    },
    ChatComposer: {
      "aria-label": "The field's name; the provider's `chatMessage` string by default.",
      children: "Shown above the field inside the frame: the attachments chosen for the next message.",
    },
  },
} satisfies ComponentDoc
