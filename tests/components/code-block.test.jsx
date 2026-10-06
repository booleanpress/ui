import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { CodeBlock } from '@/components/code-block';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const CODE = `const mailer = createMailer({
  host: "smtp.example.com",
  port: 587,
})
`;

function mockClipboard(clipboard) {
    Object.defineProperty(window.navigator, 'clipboard', { value: clipboard, configurable: true });
}

describe('CodeBlock', () => {
    it('shows the code in a focusable region named after its title, in a figure captioned by it', async () => {
        renderUi(<CodeBlock title="mailer.ts" code={CODE} language="ts" />);
        const region = screen.getByRole('region', { name: 'mailer.ts code' });
        expect(region.tagName).toBe('PRE');
        expect(region).toHaveAttribute('tabindex', '0');
        const figure = screen.getByRole('figure');
        expect(figure).toContainElement(region);
        expect(figure.querySelector('figcaption')).toHaveTextContent(/^mailer\.ts$/);
        const code = region.querySelector('code');
        expect(code).toHaveAttribute('data-language', 'ts');
        expect(code).toHaveClass('language-ts');
        expect(region.querySelectorAll('[data-slot=code-block-line]')).toHaveLength(4);
        expect(code).toHaveTextContent('host: "smtp.example.com"');
        await expectNoAxeViolations();
    });

    it('names the region from its language without a title, or from aria-label', () => {
        renderUi(
            <>
                <CodeBlock code="echo hi" language="bash" />
                <CodeBlock code="echo hi" aria-label="Install command" />
            </>,
        );
        expect(screen.getByRole('region', { name: 'bash code' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Install command' })).toBeInTheDocument();
    });

    it('reaches the wrap toggle, the copy button and the code region with Tab', async () => {
        const { user } = renderUi(<CodeBlock title="mailer.ts" code={CODE} wrapToggle />);
        await user.tab();
        expect(screen.getByRole('button', { name: 'Wrap lines' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Copy' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('region', { name: 'mailer.ts code' })).toHaveFocus();
    });

    it('wraps and unwraps long lines with Enter and Space on the wrap toggle', async () => {
        const onWrapChange = vi.fn();
        const { user } = renderUi(<CodeBlock code={CODE} wrapToggle onWrapChange={onWrapChange} />);
        const toggle = screen.getByRole('button', { name: 'Wrap lines' });
        expect(toggle).toHaveAttribute('aria-pressed', 'false');
        toggle.focus();
        await user.keyboard('{Enter}');
        expect(toggle).toHaveAttribute('aria-pressed', 'true');
        expect(document.querySelector('[data-slot=code-block]')).toHaveAttribute('data-wrap', 'true');
        expect(onWrapChange).toHaveBeenLastCalledWith(true);
        await user.keyboard(' ');
        expect(toggle).toHaveAttribute('aria-pressed', 'false');
        await expectNoAxeViolations();
    });

    it('copies the plain code with the copy button', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        const { user } = renderUi(<CodeBlock code={CODE} html="<span>ignored for copying</span>" />);
        mockClipboard({ writeText });
        await user.click(screen.getByRole('button', { name: 'Copy' }));
        expect(writeText).toHaveBeenCalledWith(CODE);
        expect(screen.getByRole('status')).toHaveTextContent('Copied');
    });

    it('numbers lines in a hidden gutter and marks highlighted lines', async () => {
        renderUi(<CodeBlock code={CODE} lineNumbers highlightLines={[2, 3]} copyable={false} />);
        const numbers = document.querySelectorAll('[data-slot=code-block-line-number]');
        expect([...numbers].map((n) => n.textContent)).toEqual(['1', '2', '3', '4']);
        numbers.forEach((n) => expect(n).toHaveAttribute('aria-hidden', 'true'));
        const lines = document.querySelectorAll('[data-slot=code-block-line]');
        expect([...lines].map((l) => l.hasAttribute('data-highlighted'))).toEqual([false, true, true, false]);
        expect(screen.queryByRole('button', { name: 'Copy' })).toBeNull();
        await expectNoAxeViolations();
    });

    it('splits highlighted HTML into well-formed lines, dropping the highlighter’s pre and code', () => {
        const html =
            '<pre class="shiki"><code><span class="token comment">/* one\ntwo */</span>\n<span class="token keyword">const</span> a = 1</code></pre>';
        renderUi(<CodeBlock code={'/* one\ntwo */\nconst a = 1'} html={html} lineNumbers />);
        const contents = document.querySelectorAll('[data-slot=code-block-line-content]');
        expect(contents).toHaveLength(3);
        expect(contents[0].innerHTML).toBe('<span class="token comment">/* one</span>');
        expect(contents[1].innerHTML).toBe('<span class="token comment">two */</span>');
        expect(contents[2].querySelector('.token.keyword')).toHaveTextContent('const');
        expect(document.querySelector('pre.shiki')).toBeNull();
    });

    it('takes its words from the provider', () => {
        renderUi(<CodeBlock title="mailer.ts" code="x" wrapToggle />, {
            strings: { codeBlock: 'Code: {title}', wrapLines: 'Zeilen umbrechen', copy: 'Kopieren' },
        });
        expect(screen.getByRole('region', { name: 'Code: mailer.ts' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Zeilen umbrechen' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Kopieren' })).toBeInTheDocument();
    });

    it('keeps the buttons at the code’s right-hand end without a title, so a right-to-left page does not cover the first line', () => {
        renderUi(
            <>
                <CodeBlock code="echo hi" language="bash" />
                <CodeBlock code="echo hi" title="install.sh" />
            </>,
            { dir: 'rtl' },
        );
        const [bare, titled] = document.querySelectorAll('[data-slot=code-block-actions]');
        // Over the code, which reads left to right, the buttons take its physical right edge.
        expect(bare).toHaveClass('right-1.75');
        expect(bare).not.toHaveClass('end-1.75');
        // In the title bar they follow the page's direction.
        expect(titled).toHaveClass('end-1.75');
        expect(document.querySelector('[data-slot=code-block-content]')).toHaveAttribute('dir', 'ltr');
    });

    it('caps its height with maxHeight', () => {
        renderUi(<CodeBlock code={CODE} maxHeight={240} />);
        expect(document.querySelector('[data-slot=code-block-content]')).toHaveStyle({ maxHeight: '240px' });
    });
});
