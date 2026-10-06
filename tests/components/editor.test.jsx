import { beforeAll, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { Editor } from '@/components/editor';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

// ProseMirror measures the selection to scroll it into view; jsdom has no layout, so ranges answer with empty boxes.
beforeAll(() => {
    const box = { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON() {} };
    Range.prototype.getClientRects ||= () => ({ length: 0, item: () => null, [Symbol.iterator]: [][Symbol.iterator] });
    Range.prototype.getBoundingClientRect ||= () => box;
    document.elementFromPoint ||= () => null;
});

/** Renders and waits for Tiptap to make its editor, which happens after mount (`immediatelyRender: false`). */
async function renderEditor(ui, providerProps) {
    const result = renderUi(ui, providerProps);
    const textbox = await waitFor(() => {
        const node = result.container.querySelector('[data-slot="editor-input"]');
        expect(node).not.toBeNull();
        return node;
    });
    return { ...result, textbox, editor: textbox.editor };
}

const tool = (name) => screen.getByRole('button', { name });

/**
 * Focuses the text and selects all of it, through the editor's commands: jsdom has no layout, so a selection made by
 * pointer or Shift+arrows does not reach ProseMirror.
 */
function selectAll(editor) {
    act(() => {
        editor.view.dom.focus();
        editor.commands.setTextSelection({ from: 1, to: editor.state.doc.content.size - 1 });
    });
}

describe('Editor', () => {
    it('renders a labelled multi-line textbox, a toolbar of format buttons and the text-style select', async () => {
        const { textbox } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />);
        expect(textbox).toHaveAttribute('role', 'textbox');
        expect(textbox).toHaveAttribute('aria-multiline', 'true');
        expect(textbox).toHaveAccessibleName('Reply');
        expect(textbox).toHaveAttribute('contenteditable', 'true');
        expect(screen.getByRole('toolbar', { name: 'Formatting' })).toHaveAttribute('aria-controls', textbox.id);
        for (const name of ['Bold', 'Italic', 'Underline', 'Strikethrough', 'Code', 'Bulleted list', 'Numbered list', 'Quote']) {
            expect(tool(name)).toHaveAttribute('aria-pressed', 'false');
        }
        expect(screen.getByRole('combobox', { name: 'Text style' })).toHaveTextContent('Paragraph');
        await expectNoAxeViolations();
    });

    it('toggles bold from the toolbar and reflects it with aria-pressed', async () => {
        const onChange = vi.fn();
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" onChange={onChange} />);
        selectAll(editor);
        await user.click(tool('Bold'));
        expect(editor.isActive('bold')).toBe(true);
        expect(tool('Bold')).toHaveAttribute('aria-pressed', 'true');
        expect(onChange).toHaveBeenLastCalledWith('<p><strong>Hello</strong></p>');
        await user.click(tool('Bold'));
        expect(tool('Bold')).toHaveAttribute('aria-pressed', 'false');
        expect(onChange).toHaveBeenLastCalledWith('<p>Hello</p>');
        await expectNoAxeViolations();
    });

    it('applies every toolbar format to the selection', async () => {
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />);
        const cases = [
            ['Italic', 'italic'],
            ['Underline', 'underline'],
            ['Strikethrough', 'strike'],
            ['Code', 'code'],
            ['Bulleted list', 'bulletList'],
            ['Numbered list', 'orderedList'],
            ['Quote', 'blockquote'],
        ];
        for (const [name, format] of cases) {
            selectAll(editor);
            await user.click(tool(name));
            expect(editor.isActive(format)).toBe(true);
            expect(tool(name)).toHaveAttribute('aria-pressed', 'true');
            await user.click(tool(name));
            expect(editor.isActive(format)).toBe(false);
        }
    });

    it('sets a heading level and back to a paragraph with the text-style select', async () => {
        const onChange = vi.fn();
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" onChange={onChange} />);
        selectAll(editor);
        await user.click(screen.getByRole('combobox', { name: 'Text style' }));
        await user.click(await screen.findByRole('option', { name: 'Heading 2' }));
        expect(editor.isActive('heading', { level: 2 })).toBe(true);
        expect(onChange).toHaveBeenLastCalledWith('<h2>Hello</h2>');
        expect(screen.getByRole('combobox', { name: 'Text style' })).toHaveTextContent('Heading 2');
        await user.click(screen.getByRole('combobox', { name: 'Text style' }));
        await user.click(await screen.findByRole('option', { name: 'Paragraph' }));
        expect(onChange).toHaveBeenLastCalledWith('<p>Hello</p>');
    });

    it('opens the text-style list with Enter and closes it with Escape, without a change', async () => {
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />);
        const select = screen.getByRole('combobox', { name: 'Text style' });
        select.focus();
        await user.keyboard('{Enter}');
        expect(await screen.findByRole('listbox')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(select).toHaveFocus();
        expect(editor.getHTML()).toBe('<p>Hello</p>');
    });

    it('is one tab stop: Tab enters the toolbar, then the text', async () => {
        const { user, textbox } = await renderEditor(
            <>
                <button type="button">Before</button>
                <Editor aria-label="Reply" defaultValue="<p>Hello</p>" />
            </>
        );
        screen.getByRole('button', { name: 'Before' }).focus();
        await user.tab();
        expect(screen.getByRole('combobox', { name: 'Text style' })).toHaveFocus();
        await user.tab();
        expect(textbox).toHaveFocus();
        await user.tab({ shift: true });
        expect(screen.getByRole('combobox', { name: 'Text style' })).toHaveFocus();
    });

    it('moves between toolbar controls with → and ←, Home and End, skipping disabled ones', async () => {
        const { user } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />);
        screen.getByRole('combobox', { name: 'Text style' }).focus();
        await user.keyboard('{ArrowRight}');
        expect(tool('Bold')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(tool('Italic')).toHaveFocus();
        await user.keyboard('{ArrowLeft}');
        expect(tool('Bold')).toHaveFocus();
        // Undo and redo are disabled while there is no history: End stops on Link.
        await user.keyboard('{End}');
        expect(tool('Link')).toHaveFocus();
        await user.keyboard('{Home}');
        expect(screen.getByRole('combobox', { name: 'Text style' })).toHaveFocus();
    });

    it('reverses the toolbar arrows in a right-to-left page', async () => {
        const { user } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />, { dir: 'rtl' });
        tool('Bold').focus();
        await user.keyboard('{ArrowLeft}');
        expect(tool('Italic')).toHaveFocus();
        await user.keyboard('{ArrowRight}');
        expect(tool('Bold')).toHaveFocus();
    });

    it('toggles a format with Enter and Space on a toolbar button, keeping focus there', async () => {
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />);
        selectAll(editor);
        tool('Italic').focus();
        await user.keyboard('{Enter}');
        expect(editor.isActive('italic')).toBe(true);
        expect(tool('Italic')).toHaveFocus();
        await user.keyboard(' ');
        expect(editor.isActive('italic')).toBe(false);
        expect(tool('Italic')).toHaveFocus();
    });

    it.each([
        ['Ctrl+B', '{Control>}b{/Control}', 'bold', 'Bold'],
        ['Ctrl+I', '{Control>}i{/Control}', 'italic', 'Italic'],
        ['Ctrl+U', '{Control>}u{/Control}', 'underline', 'Underline'],
        ['Ctrl+Shift+S', '{Control>}{Shift>}s{/Shift}{/Control}', 'strike', 'Strikethrough'],
        ['Ctrl+E', '{Control>}e{/Control}', 'code', 'Code'],
    ])('%s toggles the mark and its button', async (_label, keys, mark, button) => {
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />);
        selectAll(editor);
        await user.keyboard(keys);
        expect(editor.isActive(mark)).toBe(true);
        expect(tool(button)).toHaveAttribute('aria-pressed', 'true');
        await user.keyboard(keys);
        expect(editor.isActive(mark)).toBe(false);
    });

    it.each([
        ['Ctrl+Alt+1 makes a heading 1', '{Control>}{Alt>}1{/Alt}{/Control}', ['heading', { level: 1 }]],
        ['Ctrl+Alt+2 makes a heading 2', '{Control>}{Alt>}2{/Alt}{/Control}', ['heading', { level: 2 }]],
        ['Ctrl+Alt+3 makes a heading 3', '{Control>}{Alt>}3{/Alt}{/Control}', ['heading', { level: 3 }]],
        ['Ctrl+Shift+8 makes a bulleted list', '{Control>}{Shift>}8{/Shift}{/Control}', ['bulletList']],
        ['Ctrl+Shift+7 makes a numbered list', '{Control>}{Shift>}7{/Shift}{/Control}', ['orderedList']],
        ['Ctrl+Shift+B makes a quote', '{Control>}{Shift>}b{/Shift}{/Control}', ['blockquote']],
    ])('%s', async (_label, keys, active) => {
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />);
        selectAll(editor);
        await user.keyboard(keys);
        expect(editor.isActive(...active)).toBe(true);
    });

    it('Ctrl+Alt+0 turns a heading back into a paragraph', async () => {
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<h2>Hello</h2>" />);
        selectAll(editor);
        await user.keyboard('{Control>}{Alt>}0{/Alt}{/Control}');
        expect(editor.isActive('paragraph')).toBe(true);
    });

    it('undoes and redoes with Ctrl+Z and Ctrl+Shift+Z, and enables the toolbar buttons', async () => {
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />);
        expect(tool('Undo')).toBeDisabled();
        selectAll(editor);
        await user.keyboard('{Control>}b{/Control}');
        expect(tool('Undo')).toBeEnabled();
        await user.keyboard('{Control>}z{/Control}');
        expect(editor.isActive('bold')).toBe(false);
        expect(tool('Redo')).toBeEnabled();
        await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}');
        expect(editor.getHTML()).toBe('<p><strong>Hello</strong></p>');
        await user.keyboard('{Control>}z{/Control}');
        await user.keyboard('{Control>}y{/Control}');
        expect(editor.getHTML()).toBe('<p><strong>Hello</strong></p>');
        await user.click(tool('Undo'));
        expect(editor.getHTML()).toBe('<p>Hello</p>');
        await user.click(tool('Redo'));
        expect(editor.getHTML()).toBe('<p><strong>Hello</strong></p>');
    });

    it('opens the link popover with Ctrl+K, validates the address and links the selection', async () => {
        const onChange = vi.fn();
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Docs</p>" onChange={onChange} />);
        selectAll(editor);
        await user.keyboard('{Control>}k{/Control}');
        const field = await screen.findByLabelText('Link address');
        await waitFor(() => expect(field).toHaveFocus());
        await user.type(field, 'not a link{Enter}');
        expect(field).toHaveAttribute('aria-invalid', 'true');
        expect(field).toHaveAccessibleDescription('Enter a full address, such as https://example.com');
        await expectNoAxeViolations();
        await user.clear(field);
        await user.type(field, 'example.com/docs{Enter}');
        await waitFor(() => expect(screen.queryByLabelText('Link address')).toBeNull());
        expect(onChange).toHaveBeenLastCalledWith(
            '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://example.com/docs">Docs</a></p>'
        );
    });

    it('edits and removes a link from the toolbar button, and closes with Escape', async () => {
        const { user, editor } = await renderEditor(
            <Editor aria-label="Reply" defaultValue={'<p><a href="https://example.com">Docs</a></p>'} />
        );
        act(() => {
            editor.view.dom.focus();
            editor.commands.setTextSelection(2);
        });
        expect(tool('Link')).toHaveAttribute('data-active');
        await user.click(tool('Link'));
        expect(await screen.findByLabelText('Link address')).toHaveValue('https://example.com');
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByLabelText('Link address')).toBeNull());
        await user.click(tool('Link'));
        await user.click(await screen.findByRole('button', { name: 'Remove link' }));
        expect(editor.getHTML()).toBe('<p>Docs</p>');
    });

    it('links a bare e-mail address with mailto: and refuses a script address', async () => {
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Write</p>" />);
        selectAll(editor);
        await user.click(tool('Link'));
        const field = await screen.findByLabelText('Link address');
        await user.type(field, 'javascript:alert(1){Enter}');
        expect(field).toHaveAttribute('aria-invalid', 'true');
        await user.clear(field);
        await user.type(field, 'help@acme.test{Enter}');
        await waitFor(() => expect(editor.getHTML()).toContain('href="mailto:help@acme.test"'));
    });

    it('takes a controlled HTML value and reports changes', async () => {
        function Controlled() {
            const [html, setHtml] = useState('<p>Draft</p>');
            return (
                <>
                    <Editor aria-label="Reply" value={html} onChange={setHtml} />
                    <output data-testid="html">{html}</output>
                    <button type="button" onClick={() => setHtml('<p>Reset</p>')}>
                        Reset
                    </button>
                </>
            );
        }
        const { user, editor } = await renderEditor(<Controlled />);
        selectAll(editor);
        await user.click(tool('Bold'));
        expect(screen.getByTestId('html')).toHaveTextContent('<p><strong>Draft</strong></p>');
        await user.click(screen.getByRole('button', { name: 'Reset' }));
        expect(editor.getHTML()).toBe('<p>Reset</p>');
        act(() => editor.commands.clearContent(true));
        expect(screen.getByTestId('html')).toHaveTextContent(/^$/);
    });

    it('reports the content as JSON too', async () => {
        const onJsonChange = vi.fn();
        const { user, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hi</p>" onJsonChange={onJsonChange} />);
        selectAll(editor);
        await user.click(tool('Italic'));
        expect(onJsonChange).toHaveBeenLastCalledWith({
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hi', marks: [{ type: 'italic' }] }] }],
        });
    });

    it('shows the placeholder while empty and gives it to the textbox', async () => {
        const { container, textbox, editor } = await renderEditor(<Editor aria-label="Reply" placeholder="Write a reply…" />);
        expect(textbox).toHaveAttribute('aria-placeholder', 'Write a reply…');
        expect(container.querySelector('[data-slot="editor-placeholder"]')).toHaveTextContent('Write a reply…');
        act(() => editor.commands.setContent('<p>Hi</p>', { emitUpdate: true }));
        expect(container.querySelector('[data-slot="editor-placeholder"]')).toBeNull();
        await expectNoAxeViolations();
    });

    it('is read-only: no toolbar, the text reachable by Tab and not editable', async () => {
        const { user, textbox, container } = await renderEditor(<Editor aria-label="Release notes" readOnly defaultValue="<p>Fixed</p>" />);
        expect(screen.queryByRole('toolbar')).toBeNull();
        expect(textbox).toHaveAttribute('contenteditable', 'false');
        expect(textbox).toHaveAttribute('aria-readonly', 'true');
        expect(container.querySelector('[data-slot="editor"]')).toHaveAttribute('data-readonly');
        await user.tab();
        expect(textbox).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('is disabled: every control off, the text out of the tab order', async () => {
        const { textbox, container } = await renderEditor(<Editor aria-label="Reply" disabled defaultValue="<p>Hi</p>" />);
        expect(textbox).toHaveAttribute('contenteditable', 'false');
        expect(textbox).toHaveAttribute('aria-disabled', 'true');
        expect(textbox).not.toHaveAttribute('tabindex');
        expect(tool('Bold')).toBeDisabled();
        expect(screen.getByRole('combobox', { name: 'Text style' })).toBeDisabled();
        expect(container.querySelector('[data-slot="editor"]')).toHaveAttribute('data-disabled');
        await expectNoAxeViolations();
    });

    it('marks the textbox invalid with aria-invalid', async () => {
        const { textbox, container } = await renderEditor(
            <>
                <Editor aria-label="Reply" aria-invalid aria-describedby="reply-error" />
                <p id="reply-error">Write a reply before sending.</p>
            </>
        );
        expect(textbox).toHaveAttribute('aria-invalid', 'true');
        expect(textbox).toHaveAccessibleDescription('Write a reply before sending.');
        expect(container.querySelector('[data-slot="editor"]')).toHaveAttribute('data-invalid');
        await expectNoAxeViolations();
    });

    it('counts characters, describes the textbox with the count and refuses text past the limit', async () => {
        const { textbox, editor, container } = await renderEditor(
            <Editor aria-label="Summary" characterCount maxLength={10} defaultValue="<p>Hello</p>" />
        );
        const count = container.querySelector('[data-slot="editor-count"]');
        expect(count).toHaveTextContent('5 of 10 characters');
        expect(textbox).toHaveAccessibleDescription('5 of 10 characters');
        act(() => {
            editor.view.dom.focus();
            editor.commands.setTextSelection(6);
            editor.commands.insertContent(' world');
        });
        expect(editor.getText()).toBe('Hello');
        act(() => {
            editor.commands.insertContent(' you');
        });
        expect(editor.getText()).toBe('Hello you');
        expect(count).toHaveTextContent('9 of 10 characters');
        await expectNoAxeViolations();
    });

    it('counts without a limit', async () => {
        const { container } = await renderEditor(<Editor aria-label="Notes" characterCount defaultValue="<p>Hi there</p>" />);
        expect(container.querySelector('[data-slot="editor-count"]')).toHaveTextContent('8 characters');
    });

    it('shows a smaller toolbar of your choice', async () => {
        await renderEditor(<Editor aria-label="Note" toolbar={[['bold', 'italic'], ['link']]} />);
        expect(screen.getAllByRole('button').map((button) => button.getAttribute('aria-label'))).toEqual(['Bold', 'Italic', 'Link']);
        expect(screen.queryByRole('combobox')).toBeNull();
    });

    it('sets the size and variant as data attributes, and takes the provider\'s by default', async () => {
        const { container } = await renderEditor(
            <>
                <Editor aria-label="Short reply" size="sm" variant="filled" />
                <Editor aria-label="Long reply" />
            </>,
            { controlSize: 'lg' }
        );
        const [small, large] = container.querySelectorAll('[data-slot="editor"]');
        expect(small).toHaveAttribute('data-size', 'sm');
        expect(small).toHaveAttribute('data-variant', 'filled');
        expect(large).toHaveAttribute('data-size', 'lg');
        expect(large).toHaveAttribute('data-variant', 'default');
    });

    it('posts its HTML in a hidden field with a name', async () => {
        const { container, editor } = await renderEditor(<Editor aria-label="Reply" name="reply" defaultValue="<p>Hi</p>" />);
        const hidden = container.querySelector('input[type="hidden"][name="reply"]');
        expect(hidden).toHaveValue('<p>Hi</p>');
        act(() => editor.commands.setContent('<p>Bye</p>'));
        expect(hidden).toHaveValue('<p>Bye</p>');
    });

    it('translates its words through the provider', async () => {
        await renderEditor(<Editor aria-label="Antwort" toolbar={[['heading', 'bold'], ['link']]} />, {
            strings: { bold: 'Fett', link: 'Verknüpfung', editorToolbar: 'Formatierung', textStyle: 'Textstil', paragraph: 'Absatz' },
        });
        expect(screen.getByRole('toolbar', { name: 'Formatierung' })).toBeInTheDocument();
        expect(tool('Fett')).toBeInTheDocument();
        expect(tool('Verknüpfung')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Textstil' })).toHaveTextContent('Absatz');
    });

    it('keeps the editor focused when a toolbar button is pressed with the pointer', async () => {
        const { textbox, editor } = await renderEditor(<Editor aria-label="Reply" defaultValue="<p>Hello</p>" />);
        selectAll(editor);
        const event = fireEvent.mouseDown(tool('Bold'));
        expect(event).toBe(false);
        expect(textbox).toHaveFocus();
    });

    it('applies a link inside a form without submitting the form around the editor', async () => {
        const onSubmit = vi.fn((event) => event.preventDefault());
        const { user, editor } = await renderEditor(
            <form onSubmit={onSubmit}>
                <Editor aria-label="Reply" defaultValue="<p>Docs</p>" />
            </form>
        );
        selectAll(editor);
        await user.keyboard('{Control>}k{/Control}');
        const field = await screen.findByLabelText('Link address');
        await user.type(field, 'not a link{Enter}');
        await user.clear(field);
        await user.type(field, 'example.com{Enter}');
        await waitFor(() => expect(editor.getHTML()).toContain('href="https://example.com"'));
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('keeps scripts, event attributes and script addresses out of pasted or given HTML', async () => {
        const onChange = vi.fn();
        const { editor, textbox } = await renderEditor(<Editor aria-label="Reply" onChange={onChange} />);
        act(() => {
            editor.commands.setContent(
                '<p>Hi <img src="x" onerror="alert(1)"><a href="javascript:alert(1)">bad</a> <span onclick="alert(1)">span</span> <a href="https://example.com" onmouseover="alert(1)">ok</a></p><script>alert(1)</script>',
                { emitUpdate: true }
            );
        });
        const html = onChange.mock.lastCall[0];
        expect(html).not.toMatch(/script|onerror|onclick|onmouseover|<img/i);
        expect(html).toContain('href="https://example.com"');
        expect(textbox.querySelector('[onclick],[onerror],[onmouseover],script,img')).toBeNull();
    });
});

describe('Editor in a form', () => {
    const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));
    const ready = (container) =>
        waitFor(() => {
            const node = container.querySelector('[data-slot="editor-input"]');
            expect(node).not.toBeNull();
            return node;
        });

    it('submits nothing while disabled, and its HTML again once enabled', async () => {
        function Toggle() {
            const [disabled, setDisabled] = useState(true);
            return (
                <form>
                    <Editor aria-label="Reply" name="reply" defaultValue="<p>Saved reply</p>" disabled={disabled} />
                    <button type="button" onClick={() => setDisabled((d) => !d)}>
                        Toggle
                    </button>
                </form>
            );
        }
        const { container, user } = renderUi(<Toggle />);
        await ready(container);
        const form = container.querySelector('form');
        expect(new FormData(form).has('reply')).toBe(false);
        await user.click(screen.getByRole('button', { name: 'Toggle' }));
        expect(new FormData(form).get('reply')).toBe('<p>Saved reply</p>');
    });

    it('a form reset puts the starting content back', async () => {
        const { container } = renderUi(
            <form>
                <Editor aria-label="Reply" name="reply" defaultValue="<p>Initial</p>" />
            </form>
        );
        const node = await ready(container);
        const form = container.querySelector('form');
        act(() => node.editor.commands.setContent('<p>Edited</p>'));
        expect(new FormData(form).get('reply')).toBe('<p>Edited</p>');
        act(() => form.reset());
        await settle();
        expect(new FormData(form).get('reply')).toBe('<p>Initial</p>');
        expect(node).toHaveTextContent('Initial');
    });

    it('belongs to the form its form attribute names', async () => {
        const { container } = renderUi(
            <>
                <form id="ticket" />
                <Editor aria-label="Reply" name="reply" form="ticket" defaultValue="<p>Hello</p>" />
            </>
        );
        await ready(container);
        expect(new FormData(document.getElementById('ticket')).get('reply')).toBe('<p>Hello</p>');
    });
});
