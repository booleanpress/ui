import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { ColorPicker, ColorPickerPopover, ColorSwatch, ColorPickerArea, ColorPickerSlider, ColorPickerInput, ColorPickerFormatSelect, ColorPickerEyeDropper, ColorPickerPreview } from '@/components/color-picker';
import { Dialog, DialogContent, DialogTitle } from '@/components/dialog';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const slider = (name) => screen.getByRole('slider', { name });
const hexField = () => screen.getByRole('textbox', { name: 'Hex colour' });

// #804040 is hue 0, saturation 50, brightness 50 once rounded.
const START = '#804040';

describe('ColorPicker', () => {
    it('renders a named group with the area, the hue slider, the hex field and an alpha slider', async () => {
        renderUi(<ColorPicker defaultValue={START} />);
        expect(screen.getByRole('group', { name: 'Colour picker' })).toBeInTheDocument();
        expect(slider('Saturation').value).toBe('50');
        expect(slider('Saturation')).toHaveAttribute('aria-valuetext', '50%');
        expect(slider('Brightness').value).toBe('50');
        expect(slider('Brightness')).toHaveAttribute('aria-orientation', 'vertical');
        expect(slider('Hue').value).toBe('0');
        expect(slider('Hue')).toHaveAttribute('aria-valuetext', '0°');
        expect(slider('Alpha')).toHaveValue('1');
        expect(hexField()).toHaveValue('#804040');
        await expectNoAxeViolations();
    });

    it('takes its name from aria-label or aria-labelledby', () => {
        renderUi(
            <>
                <ColorPicker aria-label="Button colour" />
                <span id="link-label">Link colour</span>
                <ColorPicker aria-labelledby="link-label" />
            </>,
        );
        expect(screen.getByRole('group', { name: 'Button colour' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Link colour' })).toBeInTheDocument();
    });

    it('moves the saturation with ArrowRight and ArrowLeft on the area, ten at a time with Shift', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<ColorPicker defaultValue={START} onValueChange={onValueChange} />);
        slider('Saturation').focus();
        await user.keyboard('{ArrowRight}');
        expect(slider('Saturation').value).toBe('51');
        await user.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(slider('Saturation').value).toBe('49');
        await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
        expect(slider('Saturation').value).toBe('59');
        expect(onValueChange).toHaveBeenLastCalledWith(hexField().value);
        expect(slider('Saturation')).toHaveFocus();
    });

    it('moves the brightness with ArrowUp and ArrowDown and moves focus to the brightness input', async () => {
        const { user } = renderUi(<ColorPicker defaultValue={START} />);
        slider('Saturation').focus();
        await user.keyboard('{ArrowUp}');
        expect(slider('Brightness').value).toBe('51');
        expect(slider('Brightness')).toHaveFocus();
        await user.keyboard('{ArrowDown}{ArrowDown}');
        expect(slider('Brightness').value).toBe('49');
        await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
        expect(slider('Brightness').value).toBe('39');
        await user.keyboard('{ArrowLeft}');
        expect(slider('Saturation')).toHaveFocus();
    });

    it('moves the brightness by ten with Page Up and Page Down', async () => {
        const { user } = renderUi(<ColorPicker defaultValue={START} />);
        slider('Saturation').focus();
        await user.keyboard('{PageUp}');
        expect(slider('Brightness').value).toBe('60');
        await user.keyboard('{PageDown}{PageDown}');
        expect(slider('Brightness').value).toBe('40');
    });

    it('moves the saturation by ten with Home and End, as React Aria ColorArea', async () => {
        const { user } = renderUi(<ColorPicker defaultValue={START} />);
        slider('Saturation').focus();
        await user.keyboard('{End}');
        expect(slider('Saturation').value).toBe('60');
        await user.keyboard('{Home}{Home}');
        expect(slider('Saturation').value).toBe('40');
    });

    it('keeps one tab stop in the area: the input used last', async () => {
        const { user } = renderUi(<ColorPicker defaultValue={START} />);
        expect(slider('Saturation')).toHaveAttribute('tabindex', '0');
        expect(slider('Brightness')).toHaveAttribute('tabindex', '-1');
        await user.tab();
        expect(slider('Saturation')).toHaveFocus();
        await user.tab();
        expect(slider('Hue')).toHaveFocus();
        await user.tab();
        expect(slider('Alpha')).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('combobox', { name: 'Colour format' })).toHaveFocus();
        await user.tab();
        expect(hexField()).toHaveFocus();
        slider('Saturation').focus();
        await user.keyboard('{ArrowUp}');
        expect(slider('Saturation')).toHaveAttribute('tabindex', '-1');
        expect(slider('Brightness')).toHaveAttribute('tabindex', '0');
    });

    it('swaps ArrowLeft and ArrowRight on the area and the hue slider in right-to-left pages', async () => {
        const { user } = renderUi(<ColorPicker defaultValue={START} />, { dir: 'rtl' });
        slider('Saturation').focus();
        await user.keyboard('{ArrowLeft}');
        expect(slider('Saturation').value).toBe('51');
        slider('Hue').focus();
        await user.keyboard('{ArrowLeft}');
        expect(slider('Hue').value).toBe('1');
        await user.keyboard('{ArrowRight}');
        expect(slider('Hue').value).toBe('0');
    });

    it('moves the hue by one with the arrow keys and ten with Shift', async () => {
        const { user } = renderUi(<ColorPicker defaultValue={START} />);
        slider('Hue').focus();
        await user.keyboard('{ArrowRight}{ArrowUp}');
        expect(slider('Hue').value).toBe('2');
        await user.keyboard('{ArrowLeft}');
        expect(slider('Hue').value).toBe('1');
        await user.keyboard('{ArrowDown}');
        expect(slider('Hue').value).toBe('0');
        await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
        expect(slider('Hue').value).toBe('10');
        expect(hexField()).toHaveValue('#804b40');
    });

    it('moves the hue by ten with Page Up and Page Down', async () => {
        const { user } = renderUi(<ColorPicker defaultValue={START} />);
        slider('Hue').focus();
        await user.keyboard('{PageUp}{PageUp}');
        expect(slider('Hue').value).toBe('20');
        await user.keyboard('{PageDown}');
        expect(slider('Hue').value).toBe('10');
    });

    it('sets the hue to its minimum and maximum with Home and End', async () => {
        const { user } = renderUi(<ColorPicker defaultValue="#408080" />);
        slider('Hue').focus();
        await user.keyboard('{End}');
        expect(slider('Hue').value).toBe('360');
        expect(slider('Hue')).toHaveAttribute('aria-valuetext', '360°');
        await user.keyboard('{Home}');
        expect(slider('Hue').value).toBe('0');
    });

    it('keeps the hue while the colour is grey', async () => {
        const { user } = renderUi(<ColorPicker defaultValue="#408080" />);
        slider('Saturation').focus();
        await user.keyboard('{Home}{Home}{Home}{Home}{Home}');
        expect(slider('Saturation').value).toBe('0');
        expect(slider('Hue').value).toBe('180');
    });

    it('adds an alpha slider whose value reaches the hex as an alpha pair', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<ColorPicker alpha defaultValue="#ff0000" onValueChange={onValueChange} />);
        expect(slider('Alpha').value).toBe('1');
        expect(hexField()).toHaveValue('#ff0000');
        slider('Alpha').focus();
        await user.keyboard('{PageDown}{PageDown}{PageDown}{PageDown}{PageDown}');
        expect(slider('Alpha')).toHaveAttribute('aria-valuetext', '50%');
        expect(hexField()).toHaveValue('#ff000080');
        expect(onValueChange).toHaveBeenLastCalledWith('#ff000080');
        await user.keyboard('{Home}');
        expect(slider('Alpha').value).toBe('0');
        await user.keyboard('{End}');
        expect(hexField()).toHaveValue('#ff0000');
        await expectNoAxeViolations();
    });

    it('applies a valid hex as it is typed and shows the colour again on Enter', async () => {
        const onValueChange = vi.fn();
        const onValueCommit = vi.fn();
        const { user } = renderUi(<ColorPicker defaultValue={START} onValueChange={onValueChange} onValueCommit={onValueCommit} />);
        await user.clear(hexField());
        await user.type(hexField(), '0f0');
        expect(onValueChange).toHaveBeenLastCalledWith('#00ff00');
        expect(slider('Hue').value).toBe('120');
        expect(hexField()).toHaveValue('0f0');
        await user.keyboard('{Enter}');
        expect(hexField()).toHaveValue('#00ff00');
        expect(onValueCommit).toHaveBeenLastCalledWith('#00ff00');
    });

    it('leaves the colour alone while the hex typed is not valid, and restores it on blur', async () => {
        const { user } = renderUi(<ColorPicker defaultValue={START} />);
        await user.clear(hexField());
        await user.type(hexField(), '#12');
        expect(slider('Hue').value).toBe('0');
        await user.tab();
        expect(hexField()).toHaveValue('#804040');
    });

    it('shows a controlled value, follows it, and reports each change once it ends', async () => {
        const onValueCommit = vi.fn();
        function Controlled() {
            const [colour, setColour] = useState('#ff0000');
            return (
                <>
                    <ColorPicker value={colour} onValueChange={setColour} onValueCommit={onValueCommit} />
                    <button type="button" onClick={() => setColour('#0000ff')}>
                        Blue
                    </button>
                </>
            );
        }
        const { user } = renderUi(<Controlled />);
        expect(hexField()).toHaveValue('#ff0000');
        await user.click(screen.getByRole('button', { name: 'Blue' }));
        expect(hexField()).toHaveValue('#0000ff');
        expect(slider('Hue').value).toBe('240');
        slider('Hue').focus();
        await user.keyboard('{End}');
        expect(onValueCommit).toHaveBeenLastCalledWith('#ff0000');
    });

    it('keeps showing the controlled value when the parent does not take the change', async () => {
        const { user } = renderUi(<ColorPicker value="#ff0000" />);
        slider('Hue').focus();
        await user.keyboard('{PageUp}');
        // The parent holds #ff0000, so the picker keeps showing it.
        expect(hexField()).toHaveValue('#ff0000');
    });

    it('chooses a preset colour from the swatches, named by their labels', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(
            <ColorPicker
                defaultValue="#2563eb"
                onValueChange={onValueChange}
                swatches={[{ value: '#2563eb', label: 'Mailer blue' }, { value: '#16a34a', label: 'Delivered green' }, '#dc2626']}
            />,
        );
        const group = screen.getByRole('radiogroup', { name: 'Preset colours' });
        expect(group).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Mailer blue' })).toHaveAttribute('aria-checked', 'true');
        await user.click(screen.getByRole('radio', { name: 'Delivered green' }));
        expect(onValueChange).toHaveBeenLastCalledWith('#16a34a');
        expect(hexField()).toHaveValue('#16a34a');
        await user.keyboard('{ArrowRight>}');
        await waitFor(() => expect(screen.getByRole('radio', { name: '#dc2626' })).toHaveFocus());
        await user.keyboard('{/ArrowRight}');
        expect(screen.getByRole('radio', { name: '#dc2626' })).toHaveAttribute('aria-checked', 'true');
        expect(hexField()).toHaveValue('#dc2626');
        await expectNoAxeViolations();
    });

    it('checks no swatch while the colour matches none', () => {
        renderUi(<ColorPicker defaultValue="#123456" swatches={['#2563eb', '#16a34a']} />);
        for (const radio of screen.getAllByRole('radio')) expect(radio).toHaveAttribute('aria-checked', 'false');
    });

    it('stands the sliders upright with orientation="vertical"', async () => {
        const { user } = renderUi(<ColorPicker orientation="vertical" alpha defaultValue={START} />, { dir: 'rtl' });
        expect(slider('Hue')).toHaveAttribute('aria-orientation', 'vertical');
        expect(slider('Alpha')).toHaveAttribute('aria-orientation', 'vertical');
        slider('Hue').focus();
        // An upright slider keeps → as "more" in right-to-left pages.
        await user.keyboard('{ArrowRight}');
        expect(slider('Hue').value).toBe('1');
        await expectNoAxeViolations();
    });

    it('disables every slider, the field and the swatches', async () => {
        renderUi(<ColorPicker disabled alpha defaultValue={START} swatches={['#2563eb']} />);
        expect(screen.getByRole('group', { name: 'Colour picker' })).toHaveAttribute('aria-disabled', 'true');
        for (const name of ['Saturation', 'Brightness', 'Hue', 'Alpha']) expect(slider(name)).toBeDisabled();
        expect(hexField()).toBeDisabled();
        expect(screen.getByRole('radio', { name: '#2563eb' })).toBeDisabled();
        await expectNoAxeViolations();
    });

    it('sets the colour from a press on the area', () => {
        renderUi(<ColorPicker defaultValue="#ff0000" />);
        const area = document.querySelector('[data-slot=color-picker-area]');
        area.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0 });
        fireEvent.pointerDown(area, { button: 0, clientX: 50, clientY: 25, pointerId: 1 });
        expect(slider('Saturation').value).toBe('25');
        expect(slider('Brightness').value).toBe('75');
        expect(slider('Saturation')).toHaveFocus();
    });

    it('submits the hex value in a form under name', () => {
        renderUi(
            <form aria-label="Theme">
                <ColorPicker name="accent" defaultValue="#2563eb" />
            </form>,
        );
        expect(new FormData(screen.getByRole('form')).get('accent')).toBe('#2563eb');
    });

    it('leaves a disabled picker out of the form, as a disabled native field', () => {
        renderUi(
            <form aria-label="Theme">
                <ColorPicker name="accent" defaultValue="#2563eb" disabled />
            </form>,
        );
        expect(new FormData(screen.getByRole('form')).get('accent')).toBeNull();
    });

    it('goes back to its defaultValue when the form is reset', async () => {
        const { user } = renderUi(
            <form aria-label="Theme">
                <ColorPicker name="accent" defaultValue="#ff0000" />
            </form>,
        );
        const form = screen.getByRole('form');
        slider('Hue').focus();
        await user.keyboard('{PageUp}{PageUp}{PageUp}');
        expect(new FormData(form).get('accent')).not.toBe('#ff0000');
        act(() => form.reset());
        // The reset lands a task later, once the form has put its own fields back and nothing cancelled it.
        await waitFor(() => expect(new FormData(form).get('accent')).toBe('#ff0000'));
        expect(hexField()).toHaveValue('#ff0000');
        expect(slider('Hue').value).toBe('0');
    });

    it('reports a change made by assistive technology on a range input as committed', () => {
        const onValueCommit = vi.fn();
        renderUi(<ColorPicker defaultValue={START} onValueCommit={onValueCommit} />);
        fireEvent.change(slider('Hue'), { target: { value: '120' } });
        expect(onValueCommit).toHaveBeenLastCalledWith('#408040');
        fireEvent.change(slider('Brightness'), { target: { value: '100' } });
        expect(onValueCommit).toHaveBeenLastCalledWith('#80ff80');
    });

    it('reports a drag on the area as committed once the pointer is released or cancelled', () => {
        const onValueCommit = vi.fn();
        renderUi(<ColorPicker defaultValue="#ff0000" onValueCommit={onValueCommit} />);
        const area = document.querySelector('[data-slot=color-picker-area]');
        area.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0 });
        fireEvent.pointerDown(area, { button: 0, clientX: 100, clientY: 0, pointerId: 1 });
        expect(onValueCommit).not.toHaveBeenCalled();
        fireEvent.lostPointerCapture(area, { pointerId: 1 });
        expect(onValueCommit).toHaveBeenCalledTimes(1);
        expect(onValueCommit).toHaveBeenLastCalledWith('#ff8080');
    });

    it('shows a swatch once when the same colour is given twice, and leaves out one that is not hex', () => {
        renderUi(<ColorPicker defaultValue="#2563eb" swatches={['#2563eb', '#2563EB', { value: 'blue', label: 'Blue' }, '#16a34a']} />);
        expect(screen.getAllByRole('radio').map((radio) => radio.getAttribute('aria-label'))).toEqual(['#2563eb', '#16a34a']);
    });

    it('reads its names from the provider strings', () => {
        renderUi(<ColorPicker alpha swatches={['#2563eb']} />, {
            strings: { colorPicker: 'Farbwähler', saturation: 'Sättigung', brightness: 'Helligkeit', hue: 'Farbton', alpha: 'Deckkraft', hexColor: 'Hex-Farbe', colorSwatches: 'Vorgaben' },
            locale: 'de-DE',
        });
        expect(screen.getByRole('group', { name: 'Farbwähler' })).toBeInTheDocument();
        expect(slider('Sättigung')).toHaveAttribute('aria-valuetext', new Intl.NumberFormat('de-DE', { style: 'percent' }).format(0));
        expect(slider('Helligkeit')).toBeInTheDocument();
        expect(slider('Farbton')).toBeInTheDocument();
        expect(slider('Deckkraft')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Hex-Farbe' })).toBeInTheDocument();
        expect(screen.getByRole('radiogroup', { name: 'Vorgaben' })).toBeInTheDocument();
    });

    it('sets data-size on the picker and its field, from its prop or the provider', () => {
        const { unmount } = renderUi(<ColorPicker size="lg" />);
        expect(screen.getByRole('group')).toHaveAttribute('data-size', 'lg');
        expect(hexField()).toHaveAttribute('data-size', 'lg');
        unmount();
        renderUi(<ColorPicker variant="filled" />, { controlSize: 'sm' });
        expect(hexField()).toHaveAttribute('data-size', 'sm');
        expect(hexField()).toHaveAttribute('data-variant', 'filled');
    });
});

describe('ColorPickerPopover', () => {
    it('opens the picker from a swatch button named with its label and colour, and returns focus on Escape', async () => {
        const { user } = renderUi(<ColorPickerPopover defaultValue="#ff0000" aria-label="Accent colour" />);
        const trigger = screen.getByRole('button', { name: 'Accent colour #ff0000' });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expectNoAxeViolations();
        await user.click(trigger);
        expect(screen.getByRole('group', { name: 'Accent colour' })).toBeInTheDocument();
        await expectNoAxeViolations();
        slider('Hue').focus();
        await user.keyboard('{End}{Home}{PageUp}');
        expect(hexField()).toHaveValue('#ff2a00');
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('group', { name: 'Accent colour' })).toBeNull();
        expect(trigger).toHaveFocus();
        expect(trigger).toHaveAccessibleName('Accent colour #ff2a00');
    });

    it('works inside a dialog: a change in the popover keeps the dialog open', async () => {
        const { user } = renderUi(
            <Dialog open>
                <DialogContent aria-describedby={undefined}>
                    <DialogTitle>Brand</DialogTitle>
                    <ColorPickerPopover defaultValue="#2563eb" swatches={['#16a34a']} />
                </DialogContent>
            </Dialog>,
        );
        await user.click(screen.getByRole('button', { name: 'Colour picker #2563eb' }));
        await user.click(screen.getByRole('radio', { name: '#16a34a' }));
        expect(screen.getByRole('dialog', { name: 'Brand' })).toBeInTheDocument();
        expect(hexField()).toHaveValue('#16a34a');
    });

    it('takes the disabled state on its trigger, and leaves a disabled picker out of the form', () => {
        renderUi(
            <form aria-label="Theme">
                <ColorPickerPopover name="accent" disabled defaultValue="#2563eb" />
            </form>,
        );
        expect(screen.getByRole('button', { name: 'Colour picker #2563eb' })).toBeDisabled();
        expect(new FormData(screen.getByRole('form')).get('accent')).toBeNull();
    });

    it('names, shows and submits the colour as hex, black when the value is not a hex colour', () => {
        const { rerender } = renderUi(
            <form aria-label="Theme">
                <ColorPickerPopover name="accent" defaultValue="#F00" />
            </form>,
        );
        expect(screen.getByRole('button', { name: 'Colour picker #ff0000' })).toBeInTheDocument();
        expect(new FormData(screen.getByRole('form')).get('accent')).toBe('#ff0000');
        rerender(
            <form aria-label="Theme">
                <ColorPickerPopover name="accent" value="tomato" />
            </form>,
        );
        expect(screen.getByRole('button', { name: 'Colour picker #000000' })).toBeInTheDocument();
        expect(new FormData(screen.getByRole('form')).get('accent')).toBe('#000000');
    });

    it('goes back to its defaultValue when the form is reset', async () => {
        const { user } = renderUi(
            <form aria-label="Theme">
                <ColorPickerPopover name="accent" defaultValue="#2563eb" swatches={['#16a34a']} />
            </form>,
        );
        await user.click(screen.getByRole('button', { name: 'Colour picker #2563eb' }));
        await user.click(screen.getByRole('radio', { name: '#16a34a' }));
        const form = screen.getByRole('form');
        expect(new FormData(form).get('accent')).toBe('#16a34a');
        act(() => form.reset());
        await waitFor(() => expect(new FormData(form).get('accent')).toBe('#2563eb'));
        expect(screen.getByRole('button', { name: 'Colour picker #2563eb' })).toBeInTheDocument();
    });

    it('closes only the popover on Escape inside a dialog', async () => {
        const { user } = renderUi(
            <Dialog open>
                <DialogContent aria-describedby={undefined}>
                    <DialogTitle>Brand</DialogTitle>
                    <ColorPickerPopover defaultValue="#2563eb" />
                </DialogContent>
            </Dialog>,
        );
        const trigger = screen.getByRole('button', { name: 'Colour picker #2563eb' });
        await user.click(trigger);
        slider('Hue').focus();
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('group', { name: 'Colour picker' })).toBeNull();
        expect(screen.getByRole('dialog', { name: 'Brand' })).toBeInTheDocument();
        await waitFor(() => expect(trigger).toHaveFocus());
    });
});

describe('ColorSwatch', () => {
    it('is decorative unless named', async () => {
        renderUi(
            <>
                <ColorSwatch color="#2563eb" data-testid="plain" />
                <ColorSwatch color="#16a34a" aria-label="Delivered green" />
            </>,
        );
        expect(screen.getByTestId('plain')).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByRole('img', { name: 'Delivered green' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });
});

describe('ColorPicker and its form', () => {
    it('submits to the form its form attribute names, and resets with it', async () => {
        const { user } = renderUi(
            <>
                <form id="theme" />
                <ColorPickerPopover name="accent" form="theme" defaultValue="#2563eb" swatches={['#16a34a']} />
            </>
        );
        const form = document.getElementById('theme');
        expect(new FormData(form).get('accent')).toBe('#2563eb');
        await user.click(screen.getByRole('button', { name: 'Colour picker #2563eb' }));
        await user.click(screen.getByRole('radio', { name: '#16a34a' }));
        expect(new FormData(form).get('accent')).toBe('#16a34a');
        act(() => form.reset());
        await waitFor(() => expect(new FormData(form).get('accent')).toBe('#2563eb'));
    });
});


describe('ColorPicker formats and composition', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('changes format without changing the colour and edits RGB channels', async () => {
        const onValueChange = vi.fn();
        const { user } = renderUi(<ColorPicker defaultValue="#276def" onValueChange={onValueChange} />);
        await user.click(screen.getByRole('combobox', { name: 'Colour format' }));
        for (const name of ['HEX', 'RGBA', 'HSBA', 'HSLA', 'OKLCHA']) expect(screen.getByRole('option', { name })).toBeInTheDocument();
        await user.click(screen.getByRole('option', { name: 'RGBA' }));
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.getByRole('spinbutton', { name: 'Red' })).toHaveValue(39);
        expect(screen.getByRole('spinbutton', { name: 'Green' })).toHaveValue(109);
        expect(screen.getByRole('spinbutton', { name: 'Blue' })).toHaveValue(239);
        fireEvent.change(screen.getByRole('spinbutton', { name: 'Red' }), { target: { value: '255' } });
        expect(onValueChange).toHaveBeenLastCalledWith('#ff6def');
        fireEvent.change(screen.getByRole('spinbutton', { name: 'Alpha' }), { target: { value: '0.5' } });
        expect(onValueChange).toHaveBeenLastCalledWith('#ff6def80');
    });

    it.each([
        ['hsba', 'Brightness', '0', '#000000'],
        ['hsla', 'Lightness', '100', '#ffffff'],
    ])('edits %s channels', (format, name, value, expected) => {
        const onValueChange = vi.fn();
        renderUi(<ColorPicker defaultValue="#276def" defaultFormat={format} onValueChange={onValueChange} />);
        fireEvent.change(screen.getByRole('spinbutton', { name }), { target: { value } });
        expect(onValueChange).toHaveBeenLastCalledWith(expected);
    });

    it('accepts an OKLCH CSS value and renders its sRGB colour', () => {
        const onValueChange = vi.fn();
        renderUi(<ColorPicker defaultFormat="oklcha" onValueChange={onValueChange} />);
        const css = screen.getByRole('textbox', { name: 'CSS colour' });
        fireEvent.change(css, { target: { value: 'oklch(62.7955% 0.257683 29.2339 / 0.5)' } });
        expect(onValueChange).toHaveBeenLastCalledWith('#ff000080');
        fireEvent.blur(css);
        expect(css.value).toMatch(/^oklch\(/);
    });

    it('composes sliders, editable channels, preview and format controls', async () => {
        const onValueCommit = vi.fn();
        const { user } = renderUi(<ColorPicker defaultValue="#ff0000" onValueCommit={onValueCommit}>
            <ColorPickerArea />
            <ColorPickerSlider channel="red" format="rgba" />
            <ColorPickerSlider channel="chroma" format="oklcha" />
            <ColorPickerInput channel="red" format="rgba" />
            <ColorPickerInput channel="hex" />
            <ColorPickerPreview aria-label="Current colour" />
            <ColorPickerFormatSelect />
        </ColorPicker>);
        expect(screen.getByRole('img', { name: 'Current colour' })).toBeInTheDocument();
        slider('Red').focus();
        await user.keyboard('{End}{ArrowLeft}');
        expect(hexField()).toHaveValue('#fe0000');
        const red = screen.getByRole('spinbutton', { name: 'Red' });
        fireEvent.change(red, { target: { value: 'invalid' } });
        fireEvent.blur(red);
        expect(red).toHaveValue(254);
        await user.click(red);
        await user.keyboard('{Home}');
        expect(hexField()).toHaveValue('#000000');
        expect(onValueCommit).toHaveBeenLastCalledWith('#000000');
        expect(slider('Chroma')).toHaveAttribute('step', '0.001');
        await expectNoAxeViolations();
    });

    it('displays reference channel units and precision in an OKLCH composition', () => {
        renderUi(<ColorPicker defaultValue="#ff0000" defaultFormat="oklcha">
            <ColorPickerInput channel="lightness" />
            <ColorPickerInput channel="chroma" />
            <ColorPickerInput channel="hue" />
            <ColorPickerInput channel="alpha" />
            <ColorPickerSlider channel="lightness" />
            <ColorPickerSlider channel="alpha" />
        </ColorPicker>);
        expect(screen.getByRole('spinbutton', { name: 'Lightness' })).toHaveValue(0.628);
        expect(screen.getByRole('spinbutton', { name: 'Chroma' })).toHaveValue(0.2577);
        expect(screen.getByRole('spinbutton', { name: 'Hue' })).toHaveValue(29.23);
        expect(screen.getByRole('spinbutton', { name: 'Alpha' })).toHaveValue(1);
        expect(slider('Lightness')).toHaveAttribute('max', '1');
        expect(slider('Alpha')).toHaveAttribute('aria-valuetext', '100%');
    });

    it('interprets chroma as OKLCH even while the root displays HEX', async () => {
        const { user } = renderUi(<ColorPicker defaultValue="#ff0000">
            <ColorPickerSlider channel="chroma" />
            <ColorPickerInput channel="chroma" />
            <ColorPickerInput />
        </ColorPicker>);
        expect(screen.getByRole('spinbutton', { name: 'Chroma' })).toHaveValue(0.2577);
        slider('Chroma').focus();
        await user.keyboard('{Home}');
        expect(hexField()).toHaveValue('#888888');
    });

    it('keeps a controlled format when the parent rejects its change', async () => {
        const onFormatChange = vi.fn();
        const { user } = renderUi(<ColorPicker format="hex" onFormatChange={onFormatChange} />);
        await user.click(screen.getByRole('combobox', { name: 'Colour format' }));
        await user.click(screen.getByRole('option', { name: 'HSLA' }));
        expect(onFormatChange).toHaveBeenCalledWith('hsla');
        expect(hexField()).toBeInTheDocument();
    });

    it('explicitly disables alpha and accepts CSS initial values', () => {
        renderUi(<ColorPicker alpha={false} defaultValue="rgba(255, 0, 0, 0.5)" />);
        expect(screen.queryByRole('slider', { name: 'Alpha' })).not.toBeInTheDocument();
        expect(hexField()).toHaveValue('#ff0000');
    });

    it('leaves the eyedropper disabled when the browser does not provide it', () => {
        renderUi(<ColorPicker />);
        expect(screen.getByRole('button', { name: 'Pick a colour from the screen' })).toBeDisabled();
    });

    it('picks a screen colour, preserves alpha and commits once', async () => {
        const open = vi.fn().mockResolvedValue({ sRGBHex: '#00ff00' });
        vi.stubGlobal('EyeDropper', class { open = open });
        const onValueChange = vi.fn(), onValueCommit = vi.fn();
        const { user } = renderUi(<ColorPicker defaultValue="#ff000080" onValueChange={onValueChange} onValueCommit={onValueCommit} />);
        await user.click(screen.getByRole('button', { name: 'Pick a colour from the screen' }));
        await waitFor(() => expect(hexField()).toHaveValue('#00ff0080'));
        expect(onValueChange).toHaveBeenCalledExactlyOnceWith('#00ff0080');
        expect(onValueCommit).toHaveBeenCalledExactlyOnceWith('#00ff0080');
        expect(open).toHaveBeenCalledWith({ signal: expect.any(AbortSignal) });
    });

    it('treats cancelling the eyedropper as an unchanged selection', async () => {
        vi.stubGlobal('EyeDropper', class { open = () => Promise.reject(new DOMException('Cancelled', 'AbortError')) });
        const onValueChange = vi.fn();
        const { user } = renderUi(<ColorPicker defaultValue="#276def" onValueChange={onValueChange} />);
        const button = screen.getByRole('button', { name: 'Pick a colour from the screen' });
        await user.click(button);
        await waitFor(() => expect(button).toBeEnabled());
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('announces browser failures and aborts a pending eyedropper on unmount', async () => {
        vi.stubGlobal('EyeDropper', class { open = () => Promise.reject(new Error('Unavailable')) });
        const { user, unmount } = renderUi(<ColorPicker><ColorPickerEyeDropper /></ColorPicker>);
        await user.click(screen.getByRole('button', { name: 'Pick a colour from the screen' }));
        expect(await screen.findByRole('status')).toHaveTextContent('The colour could not be picked');
        unmount();
        let signal;
        vi.stubGlobal('EyeDropper', class { open = (options) => { signal = options.signal; return new Promise(() => {}); } });
        const view = renderUi(<ColorPicker />);
        await view.user.click(screen.getByRole('button', { name: 'Pick a colour from the screen' }));
        expect(signal.aborted).toBe(false);
        view.unmount();
        expect(signal.aborted).toBe(true);
    });
});
