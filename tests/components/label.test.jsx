import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Label', () => {
    it('names its control and focuses it when clicked', async () => {
        const { user } = renderUi(
            <>
                <Label htmlFor="sender">Sender name</Label>
                <Input id="sender" />
            </>,
        );
        await user.click(screen.getByText('Sender name'));
        expect(screen.getByRole('textbox', { name: 'Sender name' })).toHaveFocus();
        await expectNoAxeViolations();
    });

    it('toggles its checkbox when clicked', async () => {
        const { user } = renderUi(
            <>
                <Checkbox id="log-bodies" />
                <Label htmlFor="log-bodies">Keep the message body in the log</Label>
            </>,
        );
        const box = screen.getByRole('checkbox', { name: 'Keep the message body in the log' });
        await user.click(screen.getByText('Keep the message body in the log'));
        expect(box).toBeChecked();
        await user.click(screen.getByText('Keep the message body in the log'));
        expect(box).not.toBeChecked();
        await expectNoAxeViolations();
    });
});
