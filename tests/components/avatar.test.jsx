import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from '@/components/avatar';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const PHOTO =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8"/></svg>');

describe('Avatar', () => {
    it('shows the fallback while the image has not loaded (jsdom never loads images)', async () => {
        renderUi(
            <Avatar>
                <AvatarImage src={PHOTO} alt="Ada Lovelace" />
                <AvatarFallback>AL</AvatarFallback>
            </Avatar>,
        );
        expect(screen.getByText('AL')).toHaveAttribute('data-slot', 'avatar-fallback');
        expect(screen.queryByRole('img')).toBeNull();
        await expectNoAxeViolations();
    });

    it('shows the fallback when there is no image', async () => {
        renderUi(
            <Avatar>
                <AvatarFallback>GH</AvatarFallback>
            </Avatar>,
        );
        expect(screen.getByText('GH')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('sets the size as data-size on the root', () => {
        const { container } = renderUi(
            <>
                <Avatar size="sm" />
                <Avatar />
                <Avatar size="lg" />
            </>,
        );
        const sizes = [...container.querySelectorAll('[data-slot=avatar]')].map((el) => el.getAttribute('data-size'));
        expect(sizes).toEqual(['sm', 'default', 'lg']);
    });

    it('names a badge and a count for assistive technology', async () => {
        renderUi(
            <AvatarGroup>
                <Avatar>
                    <AvatarFallback>AL</AvatarFallback>
                    <AvatarBadge>
                        <span className="sr-only">Online</span>
                    </AvatarBadge>
                </Avatar>
                <AvatarGroupCount>
                    <span aria-hidden="true">+4</span>
                    <span className="sr-only">4 more people</span>
                </AvatarGroupCount>
            </AvatarGroup>,
        );
        expect(screen.getByText('Online')).toBeInTheDocument();
        expect(screen.getByText('4 more people')).toBeInTheDocument();
        await expectNoAxeViolations();
    });
});
