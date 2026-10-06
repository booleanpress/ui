import { StrictMode, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { CascadeSelect } from '@/components/cascade-select';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const OFFICES = [
    {
        value: 'au',
        label: 'Australia',
        children: [
            { value: 'au-nsw', label: 'New South Wales', children: [{ value: 'sydney', label: 'Sydney' }, { value: 'newcastle', label: 'Newcastle' }] },
            { value: 'au-qld', label: 'Queensland', children: [{ value: 'brisbane', label: 'Brisbane' }] },
        ],
    },
    {
        value: 'us',
        label: 'United States',
        children: [
            { value: 'us-ca', label: 'California', children: [{ value: 'los-angeles', label: 'Los Angeles' }, { value: 'san-francisco', label: 'San Francisco' }] },
            { value: 'us-ny', label: 'New York', children: [{ value: 'new-york-city', label: 'New York City' }], disabled: true },
        ],
    },
    { value: 'remote', label: 'Remote' },
    { value: 'canada', label: 'Canada', children: [{ value: 'toronto', label: 'Toronto' }] },
];

function Office({ label = 'Office', ...props }) {
    return (
        <>
            <Label htmlFor="office">{label}</Label>
            <CascadeSelect id="office" options={OFFICES} placeholder="Select a city" {...props} />
        </>
    );
}

const field = () => screen.getByRole('button', { name: /^Office/ });
const item = (name) => screen.getByRole('menuitem', { name });
const option = (name) => screen.getByRole('menuitemradio', { name });

async function openWithKeyboard(user, key = '{ArrowDown}') {
    field().focus();
    await user.keyboard(key);
    await screen.findAllByRole('menu');
}

describe('CascadeSelect', () => {
    afterEach(() => vi.restoreAllMocks());

    it('is a menu button named by its label and its value', async () => {
        renderUi(<Office defaultValue="sydney" />);
        const trigger = field();
        expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await waitFor(() => expect(trigger).toHaveAccessibleName('Office Sydney'));
        await expectNoAxeViolations();
    });

    it('opens with ArrowDown and focuses the first option', async () => {
        const { user } = renderUi(<Office />);
        const trigger = field();
        await openWithKeyboard(user, '{ArrowDown}');
        await waitFor(() => expect(item('Australia')).toHaveFocus());
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('menu')).toHaveAccessibleName('Office');
        await expectNoAxeViolations();
    });

    it('opens with Enter and with Space', async () => {
        const { user } = renderUi(<Office />);
        for (const key of ['{Enter}', ' ']) {
            await openWithKeyboard(user, key);
            await waitFor(() => expect(item('Australia')).toHaveFocus());
            await user.keyboard('{Escape}');
            await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        }
    });

    it('moves with ArrowDown and ArrowUp, skipping a disabled group and wrapping', async () => {
        const { user } = renderUi(<Office />);
        await openWithKeyboard(user);
        await waitFor(() => expect(item('Australia')).toHaveFocus());
        await user.keyboard('{ArrowDown}');
        expect(item('United States')).toHaveFocus();
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(item('Canada')).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(item('Australia')).toHaveFocus();
        await user.keyboard('{ArrowUp}');
        expect(item('Canada')).toHaveFocus();
        await user.keyboard('{Home}{ArrowDown}{ArrowRight}');
        await waitFor(() => expect(item('California')).toHaveFocus());
        expect(item('New York')).toHaveAttribute('aria-disabled', 'true');
        await user.keyboard('{ArrowDown}');
        expect(item('California')).toHaveFocus();
    });

    it('opens a group with ArrowRight and closes its level with ArrowLeft', async () => {
        const { user } = renderUi(<Office />);
        await openWithKeyboard(user);
        await user.keyboard('{ArrowDown}');
        expect(item('United States')).toHaveAttribute('aria-haspopup', 'menu');
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(item('California')).toHaveFocus());
        expect(item('United States')).toHaveAttribute('aria-expanded', 'true');
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(option('Los Angeles')).toHaveFocus());
        expect(screen.getAllByRole('menu')).toHaveLength(3);
        await user.keyboard('{ArrowLeft}');
        await waitFor(() => expect(screen.queryByRole('menuitemradio', { name: 'Los Angeles' })).toBeNull());
        expect(item('California')).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('mirrors ArrowRight and ArrowLeft in right-to-left pages', async () => {
        const { user } = renderUi(<Office />, { dir: 'rtl' });
        await openWithKeyboard(user);
        await waitFor(() => expect(item('Australia')).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        expect(screen.queryByRole('menuitem', { name: 'New South Wales' })).toBeNull();
        await user.keyboard('{ArrowLeft}');
        await waitFor(() => expect(item('New South Wales')).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'New South Wales' })).toBeNull());
        expect(item('Australia')).toHaveFocus();
    });

    it('opens a group with Enter and Space', async () => {
        const { user } = renderUi(<Office />);
        await openWithKeyboard(user);
        await waitFor(() => expect(item('Australia')).toHaveFocus());
        await user.keyboard('{Enter}');
        await waitFor(() => expect(item('New South Wales')).toHaveFocus());
        await user.keyboard(' ');
        await waitFor(() => expect(option('Sydney')).toHaveFocus());
    });

    it('chooses an option with Enter, closes, returns focus and reports the path', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Office onValueChange={onValueChange} />);
        await openWithKeyboard(user);
        await user.keyboard('{ArrowDown}{ArrowRight}');
        await waitFor(() => expect(item('California')).toHaveFocus());
        await user.keyboard('{ArrowRight}{ArrowDown}');
        await waitFor(() => expect(option('San Francisco')).toHaveFocus());
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        expect(onValueChange).toHaveBeenCalledTimes(1);
        const [value, path] = onValueChange.mock.calls[0];
        expect(value).toBe('san-francisco');
        expect(path.map((entry) => entry.label)).toEqual(['United States', 'California', 'San Francisco']);
        expect(field()).toHaveTextContent('San Francisco');
        await waitFor(() => expect(field()).toHaveFocus());
    });

    it('chooses a top-level option with Space', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Office onValueChange={onValueChange} />);
        await openWithKeyboard(user);
        await user.keyboard('{ArrowDown}{ArrowDown}');
        await waitFor(() => expect(option('Remote')).toHaveFocus());
        await user.keyboard(' ');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        expect(onValueChange).toHaveBeenCalledWith('remote', [expect.objectContaining({ value: 'remote' })]);
    });

    it('moves to the first and last option with Home and End', async () => {
        const { user } = renderUi(<Office />);
        await openWithKeyboard(user);
        await waitFor(() => expect(item('Australia')).toHaveFocus());
        await user.keyboard('{End}');
        expect(item('Canada')).toHaveFocus();
        await user.keyboard('{Home}');
        expect(item('Australia')).toHaveFocus();
    });

    it('moves to the option whose label starts with the letters typed', async () => {
        const { user } = renderUi(<Office />);
        await openWithKeyboard(user);
        await waitFor(() => expect(item('Australia')).toHaveFocus());
        await user.keyboard('r');
        await waitFor(() => expect(option('Remote')).toHaveFocus());
    });

    it('closes every level on Escape without changing the value', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Office defaultValue="sydney" onValueChange={onValueChange} />);
        await openWithKeyboard(user);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        await openWithKeyboard(user);
        await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(3));
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        expect(onValueChange).not.toHaveBeenCalled();
        expect(field()).toHaveTextContent('Sydney');
        await waitFor(() => expect(field()).toHaveFocus());
    });

    it('reopens on the chosen option, with every level of its path open', async () => {
        const { user } = renderUi(<Office defaultValue="san-francisco" />);
        await user.click(field());
        await waitFor(() => expect(option('San Francisco')).toHaveFocus());
        expect(option('San Francisco')).toHaveAttribute('aria-checked', 'true');
        expect(option('Los Angeles')).toHaveAttribute('aria-checked', 'false');
        expect(item('United States')).toHaveAttribute('aria-expanded', 'true');
        expect(item('California')).toHaveAttribute('aria-expanded', 'true');
        await expectNoAxeViolations();
    });

    it('reopens on the chosen option in strict mode too', async () => {
        const { user } = renderUi(
            <StrictMode>
                <Office defaultValue="los-angeles" />
            </StrictMode>
        );
        await user.click(field());
        await waitFor(() => expect(option('Los Angeles')).toHaveFocus());
        await user.keyboard('{ArrowLeft}');
        await waitFor(() => expect(screen.queryByRole('menuitemradio', { name: 'Los Angeles' })).toBeNull());
        expect(item('California')).toHaveFocus();
    });

    it('chooses with the pointer', async () => {
        const { user } = renderUi(<Office />);
        await user.click(field());
        await user.click(await screen.findByRole('menuitemradio', { name: 'Remote' }));
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        expect(field()).toHaveTextContent('Remote');
    });

    it('shows the whole path with showPath and a separator', () => {
        renderUi(<Office defaultValue="los-angeles" showPath separator=" › " />);
        expect(field()).toHaveTextContent('United States › California › Los Angeles');
    });

    it('stays in step with a controlled value', async () => {
        function Controlled() {
            const [value, setValue] = useState('sydney');
            return (
                <>
                    <Office value={value} onValueChange={setValue} />
                    <output>{value}</output>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(field()).toHaveTextContent('Sydney');
        await openWithKeyboard(user);
        await waitFor(() => expect(option('Sydney')).toHaveFocus());
        await user.keyboard('{ArrowDown}{Enter}');
        await waitFor(() => expect(document.querySelector('output')).toHaveTextContent('newcastle'));
        expect(field()).toHaveTextContent('Newcastle');
    });

    it('clears with the clear button by keyboard and returns focus to the field', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<Office defaultValue="sydney" clearable onValueChange={onValueChange} />);
        field().focus();
        await user.keyboard('{Tab}');
        const clear = screen.getByRole('button', { name: 'Clear' });
        expect(clear).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(onValueChange).toHaveBeenCalledWith('', []);
        expect(field()).toHaveTextContent('Select a city');
        expect(field()).toHaveAttribute('data-placeholder');
        expect(field()).toHaveFocus();
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
        await expectNoAxeViolations();
    });

    it('clears with Space too', async () => {
        const { user } = renderUi(<Office defaultValue="sydney" clearable />);
        screen.getByRole('button', { name: 'Clear' }).focus();
        await user.keyboard(' ');
        expect(field()).toHaveTextContent('Select a city');
    });

    it('loads a level the first time it opens', async () => {
        let resolve;
        const loadOptions = vi.fn(() => new Promise((done) => (resolve = done)));
        const options = [{ value: 'acme', label: 'Acme Mail', hasChildren: true }];
        const { user } = renderUi(
            <CascadeSelect aria-label="Project" options={options} loadOptions={loadOptions} placeholder="Choose a project" />
        );
        screen.getByRole('button', { name: /^Project/ }).focus();
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Acme Mail' })).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        const loading = await screen.findByRole('menuitem', { name: 'Loading' });
        expect(loading).toHaveAttribute('aria-disabled', 'true');
        expect(loading.closest('[role=menu]')).toHaveAttribute('aria-busy', 'true');
        expect(loadOptions).toHaveBeenCalledWith(expect.objectContaining({ value: 'acme' }));
        await expectNoAxeViolations();
        resolve([{ value: 'acme-newsletter', label: 'Newsletter' }]);
        expect(await screen.findByRole('menuitemradio', { name: 'Newsletter' })).toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: 'Loading' })).toBeNull();
        await user.keyboard('{ArrowLeft}{ArrowRight}');
        await screen.findByRole('menuitemradio', { name: 'Newsletter' });
        expect(loadOptions).toHaveBeenCalledTimes(1);
    });

    it('says when the top level is loading, and when a level is empty', async () => {
        const { user, rerender } = renderUi(<CascadeSelect aria-label="Project" options={[]} loading />);
        const trigger = screen.getByRole('button', { name: /^Project/ });
        expect(trigger).toHaveAttribute('aria-busy', 'true');
        await user.click(trigger);
        expect(await screen.findByRole('menuitem', { name: 'Loading' })).toBeInTheDocument();
        await user.keyboard('{Escape}');
        rerender(<CascadeSelect aria-label="Project" options={[]} />);
        await user.click(screen.getByRole('button', { name: /^Project/ }));
        expect(await screen.findByRole('menuitem', { name: 'No results' })).toBeInTheDocument();
    });

    it('does not open when disabled', async () => {
        const { user } = renderUi(<Office defaultValue="sydney" disabled />);
        expect(field()).toBeDisabled();
        await user.click(field());
        expect(screen.queryByRole('menu')).toBeNull();
        await expectNoAxeViolations();
    });

    it('marks an invalid field and reads its message', async () => {
        renderUi(
            <>
                <Office aria-invalid aria-describedby="office-error" />
                <p id="office-error">Choose an office.</p>
            </>
        );
        expect(field()).toHaveAttribute('aria-invalid', 'true');
        expect(field()).toHaveAccessibleDescription('Choose an office.');
        await expectNoAxeViolations();
    });

    it('sets data-size and data-variant from its props or the provider', () => {
        const { unmount } = renderUi(<Office size="lg" variant="filled" />);
        expect(field()).toHaveAttribute('data-size', 'lg');
        expect(field()).toHaveAttribute('data-variant', 'filled');
        unmount();
        renderUi(<Office />, { controlSize: 'sm', fieldVariant: 'filled' });
        expect(field()).toHaveAttribute('data-size', 'sm');
        expect(field()).toHaveAttribute('data-variant', 'filled');
    });

    it('fills its container with fluid', () => {
        renderUi(<Office fluid />);
        expect(field().className).toContain('w-full');
    });

    it('names itself from aria-label and its value', () => {
        renderUi(<CascadeSelect aria-label="Office" options={OFFICES} defaultValue="toronto" />);
        expect(screen.getByRole('button', { name: 'Office Toronto' })).toBeInTheDocument();
    });

    it('carries its value in a form through a hidden input', () => {
        const { container } = renderUi(<Office name="office" defaultValue="toronto" />);
        expect(container.querySelector('input[type=hidden][name=office]')).toHaveValue('toronto');
    });

    it('takes its words from the provider', async () => {
        const { user } = renderUi(
            <CascadeSelect
                aria-label="Projekt"
                options={[{ value: 'acme', label: 'Acme', hasChildren: true }]}
                loadOptions={() => new Promise(() => {})}
                defaultValue="x"
                clearable
            />,
            { strings: { clear: 'Leeren', loading: 'Wird geladen' } }
        );
        expect(screen.getByRole('button', { name: 'Leeren' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: /^Projekt/ }));
        await user.click(await screen.findByRole('menuitem', { name: 'Acme' }));
        expect(await screen.findByRole('menuitem', { name: 'Wird geladen' })).toBeInTheDocument();
    });
    it('cancels its reveal timer when it closes before the timer ends, and when it unmounts', () => {
        const setSpy = vi.spyOn(globalThis, 'setTimeout');
        const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
        const { unmount } = renderUi(<Office defaultValue="sydney" />);
        const reveals = () => setSpy.mock.calls.flatMap((call, i) => (call[1] === 500 ? [setSpy.mock.results[i].value] : []));
        const trigger = field();
        fireEvent.keyDown(trigger, { key: 'Enter' });
        expect(reveals()).toHaveLength(1);
        fireEvent.keyDown(trigger, { key: 'Enter' });
        expect(clearSpy).toHaveBeenCalledWith(reveals()[0]);
        fireEvent.keyDown(trigger, { key: 'Enter' });
        expect(reveals()).toHaveLength(2);
        unmount();
        expect(clearSpy).toHaveBeenCalledWith(reveals()[1]);
    });

    it('says a level could not load, and loads it again the next time its group opens', async () => {
        const loadOptions = vi
            .fn()
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce([{ value: 'acme-newsletter', label: 'Newsletter' }]);
        const { user } = renderUi(
            <CascadeSelect aria-label="Project" options={[{ value: 'acme', label: 'Acme Mail', hasChildren: true }]} loadOptions={loadOptions} />,
            { strings: { loadFailed: 'Konnte nicht laden' } }
        );
        screen.getByRole('button', { name: /^Project/ }).focus();
        await user.keyboard('{ArrowDown}');
        await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Acme Mail' })).toHaveFocus());
        await user.keyboard('{ArrowRight}');
        const failed = await screen.findByRole('menuitem', { name: 'Konnte nicht laden' });
        expect(failed).toHaveAttribute('aria-disabled', 'true');
        expect(failed.closest('[role=menu]')).not.toHaveAttribute('aria-busy');
        expect(screen.queryByRole('menuitem', { name: 'Loading' })).toBeNull();
        await expectNoAxeViolations();
        await user.keyboard('{ArrowLeft}');
        await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'Konnte nicht laden' })).toBeNull());
        await user.keyboard('{ArrowRight}');
        expect(await screen.findByRole('menuitemradio', { name: 'Newsletter' })).toBeInTheDocument();
        expect(loadOptions).toHaveBeenCalledTimes(2);
    });

    it('sets no state when a load settles after it has gone', async () => {
        const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
        let resolve;
        const loadOptions = vi.fn(() => new Promise((done) => (resolve = done)));
        const { user, unmount } = renderUi(
            <CascadeSelect aria-label="Project" options={[{ value: 'acme', label: 'Acme Mail', hasChildren: true }]} loadOptions={loadOptions} />
        );
        await user.click(screen.getByRole('button', { name: /^Project/ }));
        await user.click(await screen.findByRole('menuitem', { name: 'Acme Mail' }));
        await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1));
        unmount();
        await act(async () => resolve([{ value: 'acme-newsletter', label: 'Newsletter' }]));
        expect(errors).not.toHaveBeenCalled();
    });

    it('is not submitted while disabled, and goes back to its first value when its form resets', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <form aria-label="Office form">
                <Office name="office" defaultValue="sydney" onValueChange={onValueChange} />
                <CascadeSelect aria-label="Backup office" name="backup" options={OFFICES} defaultValue="toronto" disabled />
            </form>
        );
        const form = screen.getByRole('form');
        expect([...new FormData(form).entries()]).toEqual([['office', 'sydney']]);
        await openWithKeyboard(user);
        await waitFor(() => expect(option('Sydney')).toHaveFocus());
        await user.keyboard('{ArrowDown}{Enter}');
        await waitFor(() => expect(field()).toHaveTextContent('Newcastle'));
        expect(new FormData(form).get('office')).toBe('newcastle');
        act(() => form.reset());
        await waitFor(() => expect(field()).toHaveTextContent('Sydney'));
        expect(new FormData(form).get('office')).toBe('sydney');
        expect(onValueChange).toHaveBeenLastCalledWith('sydney', [
            expect.objectContaining({ value: 'au' }),
            expect.objectContaining({ value: 'au-nsw' }),
            expect.objectContaining({ value: 'sydney' }),
        ]);
    });

    it('never grows past its container, so a long value truncates', () => {
        renderUi(<Office defaultValue="sydney" clearable />);
        expect(field().className).toContain('max-w-full');
        expect(field().parentElement.className).toContain('max-w-full');
    });
    it('scrolls a long level on reopening, so the chosen option is in view', async () => {
        const leaves = Array.from({ length: 10 }, (_, i) => ({ value: `list-${i + 1}`, label: `List ${i + 1}` }));
        const rect = (top, height) => ({ top, bottom: top + height, height, left: 0, right: 100, width: 100, x: 0, y: top, toJSON() {} });
        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
            if (this.getAttribute('role') === 'menu') return rect(0, 100);
            const menu = this.closest('[role=menu]');
            if (!menu) return rect(0, 0);
            const index = [...menu.querySelectorAll('[role^=menuitem]')].indexOf(this);
            return rect(index * 30 - menu.scrollTop, 30);
        });
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
            configurable: true,
            get() {
                return this.getAttribute('role') === 'menu' ? 100 : 0;
            },
        });
        try {
            const { user } = renderUi(
                <CascadeSelect aria-label="Audience" options={[{ value: 'lists', label: 'Lists', children: leaves }]} defaultValue="list-10" />
            );
            await user.click(screen.getByRole('button', { name: /^Audience/ }));
            await waitFor(() => expect(option('List 10')).toHaveFocus());
            const level = option('List 10').closest('[role=menu]');
            // The tenth option spans 270–300 px of a 100 px level: the level scrolls by 200 px to show it.
            expect(level.scrollTop).toBe(200);
            expect(item('Lists').closest('[role=menu]').scrollTop).toBe(0);
        } finally {
            delete HTMLElement.prototype.clientHeight;
        }
    });
});
