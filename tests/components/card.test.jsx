import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

describe('Card', () => {
    it('is raised: a soft shadow and the 12px radius, with no border', async () => {
        renderUi(
            <Card data-testid="card">
                <CardHeader>
                    <CardTitle>Primary mailer</CardTitle>
                    <CardDescription>Amazon SES</CardDescription>
                </CardHeader>
                <CardContent>Healthy</CardContent>
            </Card>,
        );
        const card = screen.getByTestId('card');
        expect(card.className).toContain('shadow-sm');
        expect(card.className).toContain('rounded-xl');
        expect(card.className).not.toMatch(/(^|\s)border(\s|$)/);
        await expectNoAxeViolations();
    });
});
