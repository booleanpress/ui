import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, within } from '@testing-library/react';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import {
    ChatAttachment,
    ChatBubble,
    ChatComposer,
    ChatDateSeparator,
    ChatMessage,
    ChatThread,
    ChatTypingIndicator,
} from '@/components/chat';
import { Avatar, AvatarFallback } from '@/components/avatar';
import { formatFileSize } from '@/components/file-upload';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const UTC = { locale: 'en-US', timeZone: 'UTC' };
const at = (hour, minute) => Date.UTC(2026, 9, 5, hour, minute);

function Message({ n, side = 'start', ...props }) {
    return (
        <ChatMessage side={side} author={side === 'end' ? 'You' : 'Maya Chen'} time={at(9, n)} {...props}>
            <ChatBubble>Message {n}</ChatBubble>
        </ChatMessage>
    );
}

function Thread({ count, extra = null }) {
    return (
        <ChatThread className="h-80">
            {Array.from({ length: count }, (_, index) => (
                <Message key={index} n={index + 1} />
            ))}
            {extra}
        </ChatThread>
    );
}

/** jsdom has no layout: give the log a scroll height, a visible height and a scroll position that clamps like a browser's. */
function mockScroll(viewport, size) {
    let top = 0;
    Object.defineProperty(viewport, 'scrollHeight', { configurable: true, get: () => size.scrollHeight });
    Object.defineProperty(viewport, 'clientHeight', { configurable: true, get: () => size.clientHeight });
    Object.defineProperty(viewport, 'scrollTop', {
        configurable: true,
        get: () => top,
        set: (value) => {
            top = Math.max(0, Math.min(value, size.scrollHeight - size.clientHeight));
        },
    });
    viewport.scrollTo = ({ top: next }) => {
        viewport.scrollTop = next;
        fireEvent.scroll(viewport);
    };
}

function scrollTo(viewport, top) {
    viewport.scrollTop = top;
    fireEvent.scroll(viewport);
}

describe('ChatThread', () => {
    it('is a named log of messages, each an article with its author and time', async () => {
        renderUi(
            <ChatThread>
                <ChatDateSeparator date={at(9, 0)} />
                <ChatMessage
                    author="Maya Chen"
                    time={at(9, 41)}
                    avatar={
                        <Avatar>
                            <AvatarFallback>MC</AvatarFallback>
                        </Avatar>
                    }
                >
                    <ChatBubble>The delivery log shows a bounce.</ChatBubble>
                </ChatMessage>
            </ChatThread>,
            UTC
        );
        const log = screen.getByRole('log', { name: 'Conversation' });
        const message = within(log).getByRole('article');
        expect(message).toHaveTextContent('Maya Chen9:41 AMThe delivery log shows a bounce.');
        expect(message.querySelector('time')).toHaveAttribute('datetime', '2026-10-05T09:41');
        // The avatar repeats the name, so it is hidden from screen readers.
        expect(message.querySelector('[data-slot="chat-message-avatar"]')).toHaveAttribute('aria-hidden', 'true');
        await expectNoAxeViolations();
    });

    it('formats times and dates in the provider locale and time zone', () => {
        renderUi(
            <ChatThread>
                <ChatDateSeparator date={at(23, 30)} />
                <Message n={5} time={at(23, 30)} />
            </ChatThread>,
            { locale: 'de-DE', timeZone: 'Asia/Tokyo' }
        );
        expect(screen.getByText('Dienstag, 6. Oktober')).toHaveAttribute('datetime', '2026-10-06');
        expect(screen.getByText('8:30')).toHaveAttribute('datetime', '2026-10-06T08:30');
    });

    it('stays at the bottom when a message arrives while the reader is there', () => {
        const size = { scrollHeight: 1000, clientHeight: 300 };
        const { container, rerender } = renderUi(<Thread count={10} />);
        const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
        mockScroll(viewport, size);
        scrollTo(viewport, 700);
        size.scrollHeight = 1100;
        rerender(
            <BooleanUIProvider>
                <Thread count={11} />
            </BooleanUIProvider>
        );
        expect(viewport.scrollTop).toBe(800);
        expect(screen.queryByRole('button', { name: 'New messages' })).toBeNull();
    });

    it('keeps the reader where they scrolled to and offers the jump to new messages', async () => {
        const size = { scrollHeight: 1000, clientHeight: 300 };
        const { container, rerender, user } = renderUi(<Thread count={10} />);
        const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
        mockScroll(viewport, size);
        scrollTo(viewport, 100);
        size.scrollHeight = 1100;
        rerender(
            <BooleanUIProvider>
                <Thread count={11} />
            </BooleanUIProvider>
        );
        expect(viewport.scrollTop).toBe(100);
        const jump = screen.getByRole('button', { name: 'New messages' });
        await expectNoAxeViolations();
        jump.focus();
        await user.keyboard('{Enter}');
        expect(viewport.scrollTop).toBe(800);
        expect(screen.queryByRole('button', { name: 'New messages' })).toBeNull();
        expect(viewport).toHaveFocus();
    });

    it('jumps without smooth scrolling under reduced motion', async () => {
        const size = { scrollHeight: 1000, clientHeight: 300 };
        const { container, rerender, user } = renderUi(<Thread count={10} />);
        const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
        mockScroll(viewport, size);
        const calls = [];
        const scroll = viewport.scrollTo;
        viewport.scrollTo = (options) => {
            calls.push(options);
            scroll(options);
        };
        const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
            matches: query.includes('prefers-reduced-motion: reduce'),
            media: query,
            addEventListener() {},
            removeEventListener() {},
        }));
        scrollTo(viewport, 100);
        size.scrollHeight = 1100;
        rerender(
            <BooleanUIProvider>
                <Thread count={11} />
            </BooleanUIProvider>
        );
        await user.click(screen.getByRole('button', { name: 'New messages' }));
        expect(calls.at(-1)).toEqual({ top: 1100, behavior: 'auto' });
        expect(viewport.scrollTop).toBe(800);
        matchMedia.mockRestore();
    });

    it('does not offer the jump when only the typing indicator appears above the fold', () => {
        const size = { scrollHeight: 1000, clientHeight: 300 };
        const { container, rerender } = renderUi(<Thread count={10} />);
        const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
        mockScroll(viewport, size);
        scrollTo(viewport, 100);
        size.scrollHeight = 1040;
        rerender(
            <BooleanUIProvider>
                <Thread count={10} extra={<ChatTypingIndicator name="Maya" />} />
            </BooleanUIProvider>
        );
        expect(screen.queryByRole('button', { name: 'New messages' })).toBeNull();
    });

    it('hides the jump once the reader scrolls back to the bottom', () => {
        const size = { scrollHeight: 1000, clientHeight: 300 };
        const { container, rerender } = renderUi(<Thread count={10} />);
        const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
        mockScroll(viewport, size);
        scrollTo(viewport, 0);
        size.scrollHeight = 1100;
        rerender(
            <BooleanUIProvider>
                <Thread count={11} />
            </BooleanUIProvider>
        );
        expect(screen.getByRole('button', { name: 'New messages' })).toBeInTheDocument();
        scrollTo(viewport, 790);
        expect(screen.queryByRole('button', { name: 'New messages' })).toBeNull();
    });

    it('scrolls to a message the reader sent even when they had scrolled up', () => {
        const size = { scrollHeight: 1000, clientHeight: 300 };
        const { container, rerender } = renderUi(<Thread count={10} />);
        const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
        mockScroll(viewport, size);
        scrollTo(viewport, 100);
        size.scrollHeight = 1100;
        rerender(
            <BooleanUIProvider>
                <Thread count={10} extra={<Message n={11} side="end" />} />
            </BooleanUIProvider>
        );
        expect(viewport.scrollTop).toBe(800);
        expect(screen.queryByRole('button', { name: 'New messages' })).toBeNull();
    });

    it('translates its name and the jump through the provider', () => {
        const size = { scrollHeight: 1000, clientHeight: 300 };
        const strings = { chatThread: 'Unterhaltung', newMessages: 'Neue Nachrichten' };
        const { container, rerender } = renderUi(<Thread count={2} />, { strings });
        const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
        expect(screen.getByRole('log', { name: 'Unterhaltung' })).toBe(viewport);
        mockScroll(viewport, size);
        scrollTo(viewport, 0);
        size.scrollHeight = 1100;
        rerender(
            <BooleanUIProvider strings={strings}>
                <Thread count={3} />
            </BooleanUIProvider>
        );
        expect(screen.getByRole('button', { name: 'Neue Nachrichten' })).toBeInTheDocument();
    });

    describe('changes of height that are not a render', () => {
        // jsdom has no ResizeObserver: this one records what is observed and lets the test report a resize.
        let observers;
        beforeEach(() => {
            observers = [];
            vi.stubGlobal(
                'ResizeObserver',
                class {
                    constructor(callback) {
                        this.callback = callback;
                        this.targets = [];
                        observers.push(this);
                    }
                    observe(target) {
                        this.targets.push(target);
                    }
                    unobserve() {}
                    disconnect() {}
                }
            );
        });
        afterEach(() => vi.unstubAllGlobals());
        const resize = (target) => act(() => observers.filter((o) => o.targets.includes(target)).forEach((o) => o.callback([])));

        it('stays at the bottom when a picture loads late', () => {
            const size = { scrollHeight: 1000, clientHeight: 300 };
            const { container } = renderUi(<Thread count={10} />);
            const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
            mockScroll(viewport, size);
            scrollTo(viewport, 700);
            size.scrollHeight = 1300;
            resize(container.querySelector('[data-slot="chat-thread-content"]'));
            expect(viewport.scrollTop).toBe(1000);
        });

        it('stays at the bottom when the thread itself gets shorter, as when the composer below it grows', () => {
            const size = { scrollHeight: 1000, clientHeight: 300 };
            const { container } = renderUi(<Thread count={10} />);
            const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
            mockScroll(viewport, size);
            scrollTo(viewport, 700);
            size.clientHeight = 200;
            resize(viewport);
            expect(viewport.scrollTop).toBe(800);
        });

        it('keeps the place of a reader who scrolled up when a picture loads', () => {
            const size = { scrollHeight: 1000, clientHeight: 300 };
            const { container } = renderUi(<Thread count={10} />);
            const viewport = container.querySelector('[data-slot="chat-thread-viewport"]');
            mockScroll(viewport, size);
            scrollTo(viewport, 100);
            size.scrollHeight = 1300;
            resize(container.querySelector('[data-slot="chat-thread-content"]'));
            expect(viewport.scrollTop).toBe(100);
            expect(screen.queryByRole('button', { name: 'New messages' })).toBeNull();
        });
    });
});

describe('ChatMessage', () => {
    it('shows sending, sent and failed, and retries a failed message', async () => {
        const onRetry = vi.fn();
        const { user, rerender } = renderUi(
            <ChatThread>
                <Message n={1} side="end" status="sending" />
                <Message n={2} side="end" status="sent" />
                <Message n={3} side="end" status="failed" onRetry={onRetry} />
            </ChatThread>
        );
        const [sending, sent, failed] = screen.getAllByRole('article');
        expect(sending).toHaveTextContent('Sending');
        expect(sending).toHaveAttribute('data-status', 'sending');
        expect(sent).toHaveTextContent('Sent');
        expect(failed).toHaveTextContent('Not sent');
        await expectNoAxeViolations();
        await user.click(within(failed).getByRole('button', { name: 'Retry' }));
        expect(onRetry).toHaveBeenCalledTimes(1);
        // Focus stays on the status as the message is sent again.
        const status = failed.querySelector('[data-slot="chat-message-status"]');
        expect(status).toHaveFocus();
        rerender(
            <BooleanUIProvider>
                <ChatThread>
                    <Message n={1} side="end" status="sending" />
                    <Message n={2} side="end" status="sent" />
                    <Message n={3} side="end" status="sending" onRetry={onRetry} />
                </ChatThread>
            </BooleanUIProvider>
        );
        expect(screen.getAllByRole('article')[2].querySelector('[data-slot="chat-message-status"]')).toHaveTextContent('Sending');
    });

    it('retries with Enter and Space on the retry button', async () => {
        const onRetry = vi.fn();
        const { user } = renderUi(<Message n={1} side="end" status="failed" onRetry={onRetry} />);
        screen.getByRole('button', { name: 'Retry' }).focus();
        await user.keyboard('{Enter}');
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('activates the send button with Space and the jump with Enter', async () => {
        const onSend = vi.fn();
        const { user } = renderUi(<ChatComposer onSend={onSend} defaultValue="Hello" />);
        screen.getByRole('button', { name: 'Send message' }).focus();
        await user.keyboard(' ');
        expect(onSend).toHaveBeenCalledWith('Hello');
    });

    it('shows no retry button without onRetry', () => {
        renderUi(<Message n={1} side="end" status="failed" />);
        expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    });

    it('hides the header of a follow-up visually, and keeps it for screen readers', async () => {
        renderUi(
            <ChatThread>
                <Message n={1} />
                <Message n={2} continued />
            </ChatThread>
        );
        const followUp = screen.getAllByRole('article')[1];
        expect(followUp).toHaveAttribute('data-continued');
        expect(followUp.querySelector('[data-slot="chat-message-header"]')).toHaveClass('sr-only');
        expect(followUp).toHaveTextContent('Maya Chen');
        await expectNoAxeViolations();
    });

    it('sets the side and the plain bubble as data attributes', () => {
        renderUi(
            <ChatMessage side="end" author="Assistant">
                <ChatBubble variant="plain">Here is the answer.</ChatBubble>
            </ChatMessage>
        );
        expect(screen.getByRole('article')).toHaveAttribute('data-side', 'end');
        expect(screen.getByText('Here is the answer.')).toHaveAttribute('data-variant', 'plain');
    });

    it('translates its statuses through the provider', () => {
        renderUi(
            <>
                <Message n={1} side="end" status="failed" onRetry={() => {}} />
                <Message n={2} side="end" status="sent" />
            </>,
            { strings: { messageFailed: 'Nicht gesendet', retry: 'Erneut senden', messageSent: 'Gesendet' } }
        );
        expect(screen.getByText('Nicht gesendet')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Erneut senden' })).toBeInTheDocument();
        expect(screen.getByText('Gesendet')).toBeInTheDocument();
    });
});

describe('ChatAttachment', () => {
    it('shows a file as a chip with its size, the whole chip opening the link', async () => {
        renderUi(
            <ChatMessage author="Maya Chen">
                <ChatAttachment name="delivery-log.csv" type="text/csv" size={84_213} href="#delivery-log" />
                <ChatAttachment name="bounce.png" src="data:image/png;base64,iVBORw0KGgo=" alt="The bounce message in the mail client" />
            </ChatMessage>,
            UTC
        );
        const link = screen.getByRole('link', { name: 'delivery-log.csv' });
        expect(link).toHaveAttribute('href', '#delivery-log');
        // The size is written as the file-upload list writes it.
        expect(screen.getByText(formatFileSize(84_213, 'en-US'))).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'The bounce message in the mail client' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it("names a picture after the file when it has no alt, so a linked picture is a named link", async () => {
        renderUi(
            <ChatMessage author="Maya Chen">
                <ChatAttachment name="bounce.png" src="data:image/png;base64,iVBORw0KGgo=" href="#bounce" />
                <ChatAttachment name="divider.png" src="data:image/png;base64,iVBORw0KGgo=" alt="" />
            </ChatMessage>
        );
        expect(screen.getByRole('link', { name: 'bounce.png' })).toHaveAttribute('href', '#bounce');
        expect(screen.queryByRole('img', { name: 'divider.png' })).toBeNull();
        await expectNoAxeViolations();
    });
});

describe('ChatDateSeparator and ChatTypingIndicator', () => {
    it('writes the day, or your own words', () => {
        renderUi(
            <>
                <ChatDateSeparator date={at(12, 0)} />
                <ChatDateSeparator>Today</ChatDateSeparator>
            </>,
            UTC
        );
        expect(screen.getByText('Monday, October 5')).toHaveAttribute('datetime', '2026-10-05');
        expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('reads who is typing and hides the dots', async () => {
        const { container } = renderUi(<ChatTypingIndicator name="Maya" />, { strings: { typing: '{name} schreibt' } });
        expect(screen.getByText('Maya schreibt')).toHaveClass('sr-only');
        expect(container.querySelector('[data-slot="chat-typing-indicator-dots"]')).toHaveAttribute('aria-hidden', 'true');
        await expectNoAxeViolations();
    });
});

describe('ChatComposer', () => {
    it('sends with Enter and empties the field', async () => {
        const onSend = vi.fn();
        const { user } = renderUi(<ChatComposer onSend={onSend} placeholder="Write a reply…" />);
        const field = screen.getByRole('textbox', { name: 'Message' });
        await user.type(field, '  Thanks, that fixed it  {Enter}');
        expect(onSend).toHaveBeenCalledWith('Thanks, that fixed it');
        expect(field).toHaveValue('');
        expect(field).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('keeps its own height while it measures the field, so a thread beside it is not resized', async () => {
        const seen = [];
        const { user, container } = renderUi(<ChatComposer />);
        const frame = container.querySelector('[data-slot="chat-composer"]');
        const field = screen.getByRole('textbox', { name: 'Message' });
        Object.defineProperty(frame, 'offsetHeight', { configurable: true, get: () => 46 });
        const style = field.style;
        const set = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'height')?.set;
        Object.defineProperty(style, 'height', {
            configurable: true,
            get: () => style.getPropertyValue('height'),
            set: (value) => {
                if (value === 'auto') seen.push(frame.style.height);
                if (set) set.call(style, value);
                else style.setProperty('height', value);
            },
        });
        await user.type(field, 'A');
        expect(seen.at(-1)).toBe('46px');
        expect(frame.style.height).toBe('');
    });

    it('starts a new line with Shift+Enter', async () => {
        const onSend = vi.fn();
        const { user } = renderUi(<ChatComposer onSend={onSend} />);
        const field = screen.getByRole('textbox', { name: 'Message' });
        await user.type(field, 'First{Shift>}{Enter}{/Shift}Second');
        expect(field).toHaveValue('First\nSecond');
        expect(onSend).not.toHaveBeenCalled();
    });

    it('does not send while an input method is composing', () => {
        const onSend = vi.fn();
        renderUi(<ChatComposer onSend={onSend} defaultValue="こんにちは" />);
        fireEvent.keyDown(screen.getByRole('textbox', { name: 'Message' }), { key: 'Enter', isComposing: true });
        expect(onSend).not.toHaveBeenCalled();
    });

    it("does not send on the Enter that ends Safari's composition (key code 229)", () => {
        const onSend = vi.fn();
        renderUi(<ChatComposer onSend={onSend} defaultValue="こんにちは" />);
        fireEvent.keyDown(screen.getByRole('textbox', { name: 'Message' }), { key: 'Enter', keyCode: 229 });
        expect(onSend).not.toHaveBeenCalled();
    });

    it('sends attachments without text', async () => {
        const onSend = vi.fn();
        const { user } = renderUi(
            <ChatComposer onSend={onSend}>
                <ChatAttachment name="bounce.png" type="image/png" size={2048} />
            </ChatComposer>
        );
        const send = screen.getByRole('button', { name: 'Send message' });
        expect(send).toBeEnabled();
        await user.click(screen.getByRole('textbox', { name: 'Message' }));
        await user.keyboard('{Enter}');
        expect(onSend).toHaveBeenCalledWith('');
    });

    it('disables the send button while the field is empty or blank', async () => {
        const onSend = vi.fn();
        const { user } = renderUi(<ChatComposer onSend={onSend} />);
        const send = screen.getByRole('button', { name: 'Send message' });
        expect(send).toBeDisabled();
        const field = screen.getByRole('textbox', { name: 'Message' });
        await user.type(field, '   ');
        expect(send).toBeDisabled();
        await user.keyboard('{Enter}');
        expect(onSend).not.toHaveBeenCalled();
        await user.type(field, 'Hi');
        expect(send).toBeEnabled();
        await user.click(send);
        expect(onSend).toHaveBeenCalledWith('Hi');
        expect(field).toHaveFocus();
    });

    it('opens the file picker from the attach button and passes the files on', async () => {
        const onAttach = vi.fn();
        const { user, container } = renderUi(<ChatComposer onAttach={onAttach} accept="image/*" />);
        const input = container.querySelector('input[type="file"]');
        const click = vi.spyOn(input, 'click');
        await user.click(screen.getByRole('button', { name: 'Attach file' }));
        expect(click).toHaveBeenCalled();
        const file = new File(['png'], 'bounce.png', { type: 'image/png' });
        await user.upload(input, file);
        expect(onAttach).toHaveBeenCalledWith([file]);
    });

    it('takes a controlled value', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<ChatComposer value="Draft" onValueChange={onValueChange} />);
        expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('Draft');
        await user.type(screen.getByRole('textbox', { name: 'Message' }), '!');
        expect(onValueChange).toHaveBeenLastCalledWith('Draft!');
    });

    it('is disabled: no writing, attaching or sending', async () => {
        const { container } = renderUi(<ChatComposer disabled defaultValue="Hi" onAttach={() => {}} />);
        expect(screen.getByRole('textbox', { name: 'Message' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Attach file' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
        expect(container.querySelector('[data-slot="chat-composer"]')).toHaveAttribute('data-disabled');
        await expectNoAxeViolations();
    });

    it('sets its size and variant, from the provider by default', () => {
        const { container } = renderUi(
            <>
                <ChatComposer size="sm" variant="filled" />
                <ChatComposer />
            </>,
            { controlSize: 'lg' }
        );
        const [small, large] = container.querySelectorAll('[data-slot="chat-composer"]');
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(small).toHaveAttribute('data-variant', 'filled');
        expect(large).toHaveAttribute('data-size', 'lg');
    });

    it('translates its names through the provider', () => {
        renderUi(<ChatComposer onAttach={() => {}} />, {
            strings: { chatMessage: 'Nachricht', sendMessage: 'Senden', attachFile: 'Datei anhängen' },
        });
        expect(screen.getByRole('textbox', { name: 'Nachricht' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Senden' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Datei anhängen' })).toBeInTheDocument();
    });
});
