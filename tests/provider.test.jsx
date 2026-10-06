import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Direction, Tooltip as TooltipPrimitive } from 'radix-ui';
import {
    BooleanUIProvider,
    DEFAULT_STRINGS,
    useControlSize,
    useFieldVariant,
    useUiConfig,
    useUiLocale,
    useUiStrings,
} from '@booleanpress/ui/provider';

function Probe() {
    const strings = useUiStrings();
    const config = useUiConfig();
    return <output>{`${strings.close}|${strings.loading}|${config.dir}|${config.tooltipDelay}|${config.sidebarStorageKey}`}</output>;
}

function FullProbe({ size, variant }) {
    const strings = useUiStrings();
    const config = useUiConfig();
    const { locale, timeZone } = useUiLocale();
    const resolvedSize = useControlSize(size);
    const resolvedVariant = useFieldVariant(variant);
    return (
        <output>
            {[
                strings.close,
                strings.loading,
                config.dir,
                config.tooltipDelay,
                config.tooltipSkipDelay,
                config.sidebarStorageKey,
                resolvedSize,
                resolvedVariant,
                locale ?? '-',
                timeZone ?? '-',
            ].join('|')}
        </output>
    );
}

describe('BooleanUIProvider', () => {
    it('defines every built-in string, in English', () => {
        expect(Object.keys(DEFAULT_STRINGS)).toEqual([
            'close',
            'previous',
            'next',
            'previousPage',
            'nextPage',
            'morePages',
            'loading',
            'toggleSidebar',
            'sidebarTitle',
            'sidebarDescription',
            'commandTitle',
            'commandDescription',
            'pagination',
            'breadcrumb',
            'more',
            'showPassword',
            'notifications',
            'closeNotification',
            'suggestions',
            'maximize',
            'restore',
            'rowsPerPage',
            'pageRange',
            'goToPage',
            'firstPage',
            'lastPage',
            'clear',
            'sliderMinimum',
            'sliderMaximum',
            'sliderValue',
            'badgeOverflow',
            'removeItem',
            'scrollTabsBackward',
            'scrollTabsForward',
            'closeTab',
            'carouselRole',
            'slideRole',
            'previousSlide',
            'nextSlide',
            'slideOf',
            'goToSlide',
            'otpCharacter',
            'colorPicker',
            'hue',
            'saturation',
            'brightness',
            'alpha',
            'hexColor',
            'colorSwatches', 'colorFormat', 'red', 'green', 'blue', 'lightness', 'chroma', 'cssColor', 'pickColor', 'eyeDropperUnavailable', 'eyeDropperFailed',
            'ratingValue',
            'ratingCleared',
            'selectAll',
            'today',
            'chooseDate',
            'chooseDateRange',
            'apply',
            'cancel',
            'presetToday',
            'presetYesterday',
            'presetLast7Days',
            'presetLast30Days',
            'presetThisMonth',
            'presetLastMonth',
            'rangeMinDays',
            'rangeMaxDays',
            'rangeDaysBetween',
            'hour',
            'minute',
            'second',
            'dayPeriod',
            'day',
            'month',
            'year',
            'chooseYear',
            'previousYear',
            'nextYear',
            'previousYears',
            'nextYears',
            'emptySegment',
            'noResults',
            'loadingResults',
            'toggleOptions',
            'filterOptions',
            'selectedCount',
            'moreSelected',
            'increment',
            'decrement',
            'numberFieldRole',
            'search',
            'passwordStrength',
            'strengthWeak',
            'strengthMedium',
            'strengthStrong', 'strengthVeryStrong', 'strengthTooWeak', 'strengthFair', 'passwordStrengthTitle',
            'ruleMet',
            'ruleNotMet',
            'toggleContent',
            'stepOf',
            'stepCompleted',
            'stepError',
            'back',
            'finish',
            'speedDialActions',
            'scrollToTop',
            'moreActions',
            'expandNode',
            'collapseNode',
            'filterTree',
            'expandAll',
            'collapseAll',
            'treeLoading',
            'chooseFiles',
            'upload',
            'dropFilesHere',
            'browseFiles',
            'uploadComplete',
            'uploadFailed',
            'fileTooLarge',
            'fileTypeNotAllowed',
            'tooManyFiles',
            'fileAdded',
            'filesAdded',
            'folderNotAllowed',
            'layout',
            'layoutList',
            'layoutGrid',
            'sortBy',
            'noItems',
            'trendUp',
            'trendDown',
            'sortAscending',
            'sortDescending',
            'sortNone',
            'sortedBy',
            'resultsCount',
            'selectRow',
            'selectAllRows',
            'expandRow',
            'collapseRow',
            'resizeColumn',
            'columnMenu',
            'moveColumnLeft',
            'moveColumnRight',
            'hideColumn',
            'filterColumn',
            'editCell',
            'rowActions',
            'columns',
            'exportCsv',
            'noRows',
            'confirm',
            'confirmTitle',
            'delete',
            'dismiss',
            'clearSelection',
            'edit',
            'save',
            'saving',
            'saveFailed',
            'skipTour',
            'tourStep',
            'opensInNewTab',
            'copy',
            'copied',
            'copyFailed',
            'wrapLines',
            'codeBlock',
            'chatThread',
            'newMessages',
            'chatMessage',
            'sendMessage',
            'attachFile',
            'typing',
            'messageSending',
            'messageSent',
            'messageFailed',
            'retry',
            'editorToolbar',
            'textStyle',
            'paragraph',
            'heading',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'inlineCode',
            'bulletList',
            'orderedList',
            'blockquote',
            'link',
            'linkUrl',
            'invalidLink',
            'removeLink',
            'undo',
            'redo',
            'characters',
            'characterCount',
            'monthNavigation',
            'previousMonth',
            'nextMonth',
            'todayDate',
            'selectedDate',
            'weekNumber',
            'weekNumberHeader',
            'moveUp',
            'moveDown',
            'moveToTop',
            'moveToBottom',
            'moveToTarget',
            'moveAllToTarget',
            'moveToSource',
            'moveAllToSource',
            'itemMoved',
            'itemsMoved',
            'dragHandle',
            'dragStarted',
            'dragCancelled',
            'sourceList',
            'targetList',
            'loadingMore',
            'loadFailed',
            'treeLoadFailed',
            'actionFailed',
        ]);
        expect(Object.values(DEFAULT_STRINGS).every((value) => typeof value === 'string' && value.length > 0)).toBe(true);
    });

    it('gives defaults outside a provider', () => {
        render(<Probe />);
        expect(screen.getByRole('status')).toHaveTextContent('Close|Loading|ltr|500|booleanpress-ui:sidebar');
    });

    it('merges a partial strings map over the English defaults', () => {
        render(
            <BooleanUIProvider strings={{ close: 'Fermer' }} dir="rtl" tooltipDelay={300} sidebarStorageKey="acme:sidebar">
                <Probe />
            </BooleanUIProvider>,
        );
        expect(screen.getByRole('status')).toHaveTextContent('Fermer|Loading|rtl|300|acme:sidebar');
    });

    it('resolves sizes, field looks, locale and time zone: defaults outside a provider', () => {
        render(<FullProbe />);
        expect(screen.getByRole('status')).toHaveTextContent('Close|Loading|ltr|500|0|booleanpress-ui:sidebar|default|default|-|-');
    });

    it('hands controlSize, fieldVariant, locale and timeZone to the hooks, and a prop on the control wins', () => {
        const { rerender } = render(
            <BooleanUIProvider controlSize="sm" fieldVariant="filled" locale="de-DE" timeZone="Europe/Berlin">
                <FullProbe />
            </BooleanUIProvider>,
        );
        expect(screen.getByRole('status')).toHaveTextContent('|sm|filled|de-DE|Europe/Berlin');
        rerender(
            <BooleanUIProvider controlSize="sm" fieldVariant="filled" locale="de-DE" timeZone="Europe/Berlin">
                <FullProbe size="lg" variant="default" />
            </BooleanUIProvider>,
        );
        expect(screen.getByRole('status')).toHaveTextContent('|lg|default|de-DE|Europe/Berlin');
    });

    it('treats a string given as undefined as left out', () => {
        render(
            <BooleanUIProvider strings={{ close: undefined, loading: 'Chargement' }}>
                <Probe />
            </BooleanUIProvider>,
        );
        expect(screen.getByRole('status')).toHaveTextContent('Close|Chargement|');
    });

    it('lets a nested provider change only what it is given and inherit the rest', () => {
        render(
            <BooleanUIProvider
                strings={{ close: 'Fermer', loading: 'Chargement' }}
                dir="rtl"
                tooltipDelay={300}
                tooltipSkipDelay={100}
                sidebarStorageKey="acme:sidebar"
                controlSize="sm"
                fieldVariant="filled"
                locale="fr-FR"
                timeZone="Europe/Paris"
            >
                <BooleanUIProvider locale="de-DE" strings={{ loading: 'Laden' }}>
                    <FullProbe />
                </BooleanUIProvider>
            </BooleanUIProvider>,
        );
        expect(screen.getByRole('status')).toHaveTextContent(
            'Fermer|Laden|rtl|300|100|acme:sidebar|sm|filled|de-DE|Europe/Paris',
        );
    });

    it('lets a nested provider override any value, and the outer one keeps its own', () => {
        render(
            <BooleanUIProvider dir="rtl" controlSize="sm" timeZone="Europe/Paris">
                <FullProbe />
                <BooleanUIProvider dir="ltr" controlSize="lg" fieldVariant="filled" tooltipDelay={0} timeZone="UTC">
                    <FullProbe />
                </BooleanUIProvider>
            </BooleanUIProvider>,
        );
        const [outer, inner] = screen.getAllByRole('status');
        expect(outer).toHaveTextContent('Close|Loading|rtl|500|0|booleanpress-ui:sidebar|sm|default|-|Europe/Paris');
        expect(inner).toHaveTextContent('Close|Loading|ltr|0|0|booleanpress-ui:sidebar|lg|filled|-|UTC');
    });

    it("gives Radix primitives a nested provider's inherited direction", () => {
        function RadixDirection() {
            return <output>{Direction.useDirection()}</output>;
        }
        render(
            <BooleanUIProvider dir="rtl">
                <BooleanUIProvider locale="de-DE">
                    <RadixDirection />
                </BooleanUIProvider>
            </BooleanUIProvider>,
        );
        expect(screen.getByRole('status')).toHaveTextContent('rtl');
    });

    it('opens a tooltip inside a nested provider that leaves the timing alone', async () => {
        const { default: userEvent } = await import('@testing-library/user-event');
        const user = userEvent.setup();
        render(
            <BooleanUIProvider tooltipDelay={0}>
                <BooleanUIProvider locale="de-DE">
                    <TooltipPrimitive.Root>
                        <TooltipPrimitive.Trigger>Resend</TooltipPrimitive.Trigger>
                        <TooltipPrimitive.Content>Send the email again</TooltipPrimitive.Content>
                    </TooltipPrimitive.Root>
                </BooleanUIProvider>
            </BooleanUIProvider>,
        );
        await user.tab();
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Send the email again');
    });

    describe('normalises the locale and the time zone for Intl', () => {
        function LocaleProbe() {
            const { locale, timeZone } = useUiLocale();
            const config = useUiConfig();
            // Formatting must not throw with whatever the provider hands over.
            const number = new Intl.NumberFormat(locale).format(1234.5);
            const date = new Intl.DateTimeFormat(locale, { timeZone, hour: 'numeric', hourCycle: 'h23' }).format(new Date(Date.UTC(2026, 9, 5, 12)));
            return <output>{`${locale ?? '-'}|${timeZone ?? '-'}|${config.locale ?? '-'}|${number}|${date}`}</output>;
        }
        const show = (props) => {
            const { unmount } = render(
                <BooleanUIProvider {...props}>
                    <LocaleProbe />
                </BooleanUIProvider>,
            );
            const text = screen.getByRole('status').textContent;
            unmount();
            return text;
        };

        it.each([
            ['en_US', 'en-US'],
            ['de_DE_formal', 'de-DE'],
            ['de_CH_informal', 'de-CH'],
            ['pt_BR', 'pt-BR'],
            ['pt_PT_ao90', 'pt-PT'],
            ['de-DE', 'de-DE'],
        ])('turns WordPress locale %s into %s', (given, expected) => {
            expect(show({ locale: given }).split('|').slice(0, 3)).toEqual([expected, '-', expected]);
        });

        it('falls back to the runtime default for a locale Intl cannot read, and formats without throwing', () => {
            for (const garbage of ['garbage!!', '_', '', '  ']) expect(show({ locale: garbage }).split('|')[0]).toBe('-');
        });

        it('formats German numbers from a WordPress locale', () => {
            expect(show({ locale: 'de_DE_formal' }).split('|')[3]).toBe('1.234,5');
        });

        it('keeps an IANA zone, turns a whole-hour UTC offset into its Etc zone, and drops a zone Intl refuses', () => {
            expect(show({ timeZone: 'Europe/Berlin' }).split('|')[1]).toBe('Europe/Berlin');
            expect(show({ timeZone: '+02:00' }).split('|')[1]).toBe('Etc/GMT-2');
            expect(show({ timeZone: '-05:00' }).split('|')[1]).toBe('Etc/GMT+5');
            expect(show({ timeZone: '+00:00' }).split('|')[1]).toBe('UTC');
            expect(show({ timeZone: '+02:00', locale: 'en-GB' }).split('|')[4]).toBe('14');
            expect(show({ timeZone: 'Nowhere/City' }).split('|')[1]).toBe('-');
        });

        it('lets a nested provider with an unreadable locale keep the one above', () => {
            render(
                <BooleanUIProvider locale="fr_FR">
                    <BooleanUIProvider locale="garbage!!">
                        <LocaleProbe />
                    </BooleanUIProvider>
                </BooleanUIProvider>,
            );
            expect(screen.getByRole('status').textContent.split('|')[0]).toBe('fr-FR');
        });
    });
});
