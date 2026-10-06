import { beforeAll, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import {
    FileUpload,
    FileUploadClear,
    FileUploadDropzone,
    FileUploadErrors,
    FileUploadList,
    FileUploadProgress,
    FileUploadSubmit,
    FileUploadTrigger,
    formatFileSize,
    useFileUpload,
} from '@/components/file-upload';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/input-group';
import { expectNoAxeViolations, renderUi } from '../helpers.jsx';

const file = (name, size = 1000, type = 'image/png') => new File([new Uint8Array(size)], name, { type });

// jsdom makes no blob URLs: these hand out numbered ones and record which were revoked, for the image previews.
const blobs = { made: [], revoked: [] };
beforeAll(() => {
    URL.createObjectURL = () => {
        const url = `blob:preview-${blobs.made.length + 1}`;
        blobs.made.push(url);
        return url;
    };
    URL.revokeObjectURL = (url) => blobs.revoked.push(url);
});

function Uploader({ children, ...props }) {
    return (
        <FileUpload {...props}>
            {children ?? (
                <>
                    <div>
                        <FileUploadTrigger />
                        <FileUploadSubmit />
                        <FileUploadClear />
                    </div>
                    <FileUploadDropzone />
                    <FileUploadErrors />
                    <FileUploadProgress />
                    <FileUploadList />
                </>
            )}
        </FileUpload>
    );
}

const input = (container) => container.querySelector('input[type=file]');
const zone = (container) => container.querySelector('[data-slot=file-upload-dropzone]');
const status = (container) => container.querySelector('[role=status][data-slot=file-upload-status]');
const rows = () => screen.queryAllByRole('listitem').filter((row) => row.dataset.slot === 'file-upload-item');

/** An `onUpload` whose batch the test finishes by hand. */
function controlledUpload() {
    const calls = [];
    const onUpload = vi.fn(
        (files, helpers) =>
            new Promise((resolve, reject) => {
                calls.push({ files, helpers, resolve, reject });
            })
    );
    return { onUpload, calls };
}

describe('FileUpload', () => {
    it('opens the picker from Choose with Enter and with Space', async () => {
        const { user, container } = renderUi(<Uploader />);
        const click = vi.spyOn(input(container), 'click');
        screen.getByRole('button', { name: 'Choose' }).focus();
        await user.keyboard('{Enter}');
        expect(click).toHaveBeenCalledTimes(1);
        await user.keyboard(' ');
        expect(click).toHaveBeenCalledTimes(2);
        await expectNoAxeViolations();
    });

    it('opens the picker from the drop zone button with Enter and with Space', async () => {
        const { user, container } = renderUi(<Uploader />);
        const click = vi.spyOn(input(container), 'click');
        const button = screen.getByRole('button', { name: 'Drop files here or click to browse' });
        button.focus();
        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        expect(click).toHaveBeenCalledTimes(2);
    });

    it('adds the chosen files and announces them in a polite live region', async () => {
        const onFilesChange = vi.fn();
        const { user, container } = renderUi(<Uploader multiple onFilesChange={onFilesChange} />);
        expect(status(container)).toHaveAttribute('aria-live', 'polite');
        await user.upload(input(container), [file('invoice.png', 2400), file('logo.png', 1_500_000)]);
        expect(rows()).toHaveLength(2);
        expect(within(rows()[0]).getByText('invoice.png')).toBeInTheDocument();
        expect(within(rows()[0]).getByText('2.4 KB')).toBeInTheDocument();
        expect(within(rows()[1]).getByText('1.5 MB')).toBeInTheDocument();
        expect(rows()[0]).toHaveAttribute('data-status', 'queued');
        expect(status(container)).toHaveTextContent('2 files added');
        expect(onFilesChange).toHaveBeenLastCalledWith([
            expect.objectContaining({ status: 'queued', progress: 0 }),
            expect.objectContaining({ status: 'queued', progress: 0 }),
        ]);
        await user.upload(input(container), file('header.png'));
        expect(status(container)).toHaveTextContent('header.png added');
        await expectNoAxeViolations();
    });

    it('takes dropped files and marks the zone while files are dragged over it', async () => {
        const { container } = renderUi(<Uploader multiple />);
        fireEvent.dragEnter(zone(container), { dataTransfer: { files: [] } });
        expect(zone(container)).toHaveAttribute('data-dragging');
        fireEvent.dragLeave(zone(container));
        expect(zone(container)).not.toHaveAttribute('data-dragging');
        fireEvent.dragEnter(zone(container), { dataTransfer: { files: [] } });
        fireEvent.drop(zone(container), { dataTransfer: { files: [file('a.png'), file('b.png')] } });
        expect(zone(container)).not.toHaveAttribute('data-dragging');
        expect(rows()).toHaveLength(2);
        expect(status(container)).toHaveTextContent('2 files added');
    });

    it('does not mark the zone for text dragged over it', () => {
        const { container } = renderUi(<Uploader multiple />);
        fireEvent.dragEnter(zone(container), { dataTransfer: { types: ['text/plain'], files: [] } });
        expect(zone(container)).not.toHaveAttribute('data-dragging');
        fireEvent.dragEnter(zone(container), { dataTransfer: { types: ['Files'], files: [] } });
        expect(zone(container)).toHaveAttribute('data-dragging');
    });

    it('refuses a wrong type, a file too large and files over the limit, each with its message', async () => {
        const onReject = vi.fn();
        const { container } = renderUi(
            <Uploader multiple accept="image/png,.jpg" maxSize={10_000} maxFiles={2} onReject={onReject} />
        );
        fireEvent.drop(zone(container), {
            dataTransfer: {
                files: [
                    file('logo.png'),
                    file('notes.txt', 10, 'text/plain'),
                    file('photo.png', 20_000),
                    file('header.jpg', 100, ''),
                    file('footer.png'),
                ],
            },
        });
        expect(rows().map((row) => within(row).getByText(/\./).textContent)).toEqual(['logo.png', 'header.jpg']);
        const messages = within(container.querySelector('[data-slot=file-upload-errors]')).getAllByRole('listitem');
        expect(messages.map((message) => message.textContent)).toEqual([
            'notes.txt is not an allowed file type',
            'photo.png is larger than 10 KB',
            'Too many files: you can add 2 at most',
        ]);
        expect(onReject).toHaveBeenCalledWith([
            expect.objectContaining({ reason: 'type' }),
            expect.objectContaining({ reason: 'size' }),
            expect.objectContaining({ reason: 'count' }),
        ]);
        expect(status(container)).toHaveTextContent('2 files added');
        expect(status(container)).toHaveTextContent('photo.png is larger than 10 KB');
        await expectNoAxeViolations();
    });

    it('refuses a dropped folder with its own message, and takes the files beside it', async () => {
        const onReject = vi.fn();
        const { container } = renderUi(<Uploader multiple onReject={onReject} />);
        const folder = file('Invoices', 0, '');
        fireEvent.drop(zone(container), {
            dataTransfer: {
                files: [folder, file('logo.png')],
                items: [
                    { kind: 'file', webkitGetAsEntry: () => ({ isDirectory: true }) },
                    { kind: 'file', webkitGetAsEntry: () => ({ isDirectory: false }) },
                ],
            },
        });
        expect(rows()).toHaveLength(1);
        expect(screen.getByText('logo.png')).toBeInTheDocument();
        expect(document.querySelector('[data-slot=file-upload-error]')).toHaveTextContent('Invoices is a folder: add the files inside it');
        expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ file: folder, reason: 'type' })]);
        await expectNoAxeViolations();
    });

    it('takes any file with accept="*/*"', () => {
        const { container } = renderUi(<Uploader accept="*/*" />);
        fireEvent.drop(zone(container), { dataTransfer: { files: [file('notes.txt', 10, 'text/plain')] } });
        expect(rows()).toHaveLength(1);
    });

    it('checks defaultFiles like added files', () => {
        renderUi(<Uploader multiple maxFiles={1} defaultFiles={[file('one.png'), file('two.png')]} />);
        expect(rows()).toHaveLength(1);
        expect(document.querySelector('[data-slot=file-upload-error]')).toHaveTextContent('Too many files: you can add 1 at most');
    });

    it('replaces the chosen file without multiple', async () => {
        const { user, container } = renderUi(<Uploader />);
        await user.upload(input(container), file('first.png'));
        await user.upload(input(container), file('second.png'));
        expect(rows()).toHaveLength(1);
        expect(screen.getByText('second.png')).toBeInTheDocument();
    });

    it('uploads with Enter on Upload and updates each file from onProgress', async () => {
        const { onUpload, calls } = controlledUpload();
        const { user } = renderUi(<Uploader multiple onUpload={onUpload} defaultFiles={[file('a.png'), file('b.png')]} />);
        const submit = screen.getByRole('button', { name: 'Upload' });
        submit.focus();
        await user.keyboard('{Enter}');
        expect(onUpload).toHaveBeenCalledTimes(1);
        const [{ files, helpers }] = calls;
        expect(files.map((entry) => entry.name)).toEqual(['a.png', 'b.png']);
        expect(rows()[0]).toHaveAttribute('data-status', 'uploading');
        expect(submit).toBeDisabled();
        act(() => helpers.onProgress(files[0], 40));
        const bar = screen.getByRole('progressbar', { name: 'a.png' });
        expect(bar).toHaveAttribute('aria-valuenow', '40');
        expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute('aria-valuenow', '20');
        await expectNoAxeViolations();
        await act(async () => calls[0].resolve());
        expect(rows().map((row) => row.dataset.status)).toEqual(['done', 'done']);
        expect(within(rows()[0]).getByText('Upload complete')).toBeInTheDocument();
        expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute('aria-valuenow', '100');
        await waitFor(() => expect(document.querySelector('[data-slot=file-upload-status]')).toHaveTextContent('Upload complete'));
    });

    it('marks one file as failed with onError, and a whole batch when the upload rejects', async () => {
        const { onUpload, calls } = controlledUpload();
        const { user, container } = renderUi(
            <Uploader multiple onUpload={onUpload} defaultFiles={[file('a.png'), file('b.png')]} />
        );
        await user.click(screen.getByRole('button', { name: 'Upload' }));
        act(() => calls[0].helpers.onError(calls[0].files[1], 'The server refused b.png'));
        await act(async () => calls[0].resolve());
        expect(rows().map((row) => row.dataset.status)).toEqual(['done', 'error']);
        expect(within(rows()[1]).getByText('The server refused b.png')).toBeInTheDocument();
        expect(status(container)).toHaveTextContent('Upload failed');

        await user.upload(input(container), file('c.png'));
        await user.click(screen.getByRole('button', { name: 'Upload' }));
        await act(async () => calls[1].reject(new Error('offline')));
        expect(rows()[2]).toHaveAttribute('data-status', 'error');
        expect(within(rows()[2]).getByText('Upload failed')).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it('uploads as soon as files are added with auto', async () => {
        const { onUpload, calls } = controlledUpload();
        const { user, container } = renderUi(<Uploader auto onUpload={onUpload} />);
        await user.upload(input(container), file('auto.png'));
        expect(onUpload).toHaveBeenCalledTimes(1);
        expect(calls[0].files[0].name).toBe('auto.png');
        expect(rows()[0]).toHaveAttribute('data-status', 'uploading');
    });

    it('cancels with Enter on Cancel: aborts the upload and empties the list', async () => {
        const { onUpload, calls } = controlledUpload();
        const { user } = renderUi(<Uploader multiple onUpload={onUpload} defaultFiles={[file('a.png')]} />);
        await user.click(screen.getByRole('button', { name: 'Upload' }));
        const { signal } = calls[0].helpers;
        screen.getByRole('button', { name: 'Cancel' }).focus();
        await user.keyboard('{Enter}');
        expect(signal.aborted).toBe(true);
        expect(rows()).toHaveLength(0);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
        await act(async () => calls[0].resolve());
        expect(rows()).toHaveLength(0);
    });

    it("aborts a file's signal when it is removed during its upload, and the batch's once its last file goes", async () => {
        const { onUpload, calls } = controlledUpload();
        const { user } = renderUi(<Uploader multiple onUpload={onUpload} defaultFiles={[file('a.png'), file('b.png')]} />);
        await user.click(screen.getByRole('button', { name: 'Upload' }));
        const { files, helpers } = calls[0];
        const [a, b] = files.map((entry) => helpers.fileSignal(entry));
        await user.click(screen.getByRole('button', { name: 'Remove a.png' }));
        expect(a.aborted).toBe(true);
        expect(b.aborted).toBe(false);
        expect(helpers.signal.aborted).toBe(false);
        // Progress for the removed file is ignored; the other file finishes.
        act(() => helpers.onProgress(files[0], 50));
        await act(async () => calls[0].resolve());
        expect(rows().map((row) => row.dataset.status)).toEqual(['done']);

        await user.click(screen.getByRole('button', { name: 'Remove b.png' }));
        expect(b.aborted).toBe(false);
    });

    it('aborts the batch when every file of it is removed during the upload', async () => {
        const { onUpload, calls } = controlledUpload();
        const { user } = renderUi(<Uploader auto onUpload={onUpload} />);
        await user.upload(document.querySelector('input[type=file]'), file('auto.png'));
        const { helpers, files } = calls[0];
        await user.click(screen.getByRole('button', { name: 'Remove auto.png' }));
        expect(helpers.signal.aborted).toBe(true);
        expect(helpers.fileSignal(files[0]).aborted).toBe(true);
        await act(async () => calls[0].resolve());
        expect(rows()).toHaveLength(0);
    });

    it('aborts the upload of a file replaced without multiple', async () => {
        const { onUpload, calls } = controlledUpload();
        const { user, container } = renderUi(<Uploader auto onUpload={onUpload} />);
        await user.upload(input(container), file('first.png'));
        await user.upload(input(container), file('second.png'));
        expect(calls[0].helpers.signal.aborted).toBe(true);
        expect(calls[1].helpers.signal.aborted).toBe(false);
        expect(rows()).toHaveLength(1);
    });

    it('removes a file with the keyboard and moves focus to the next, then to Choose', async () => {
        const { user } = renderUi(<Uploader multiple defaultFiles={[file('a.png'), file('b.png')]} />);
        screen.getByRole('button', { name: 'Remove a.png' }).focus();
        await user.keyboard('{Enter}');
        expect(screen.queryByText('a.png')).toBeNull();
        expect(screen.getByRole('button', { name: 'Remove b.png' })).toHaveFocus();
        await user.keyboard(' ');
        expect(rows()).toHaveLength(0);
        expect(screen.getByRole('button', { name: 'Choose' })).toHaveFocus();
    });

    it('moves through the buttons and the remove buttons with Tab', async () => {
        const { user } = renderUi(<Uploader multiple onUpload={() => {}} defaultFiles={[file('a.png')]} />);
        screen.getByRole('button', { name: 'Choose' }).focus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Upload' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Drop files here or click to browse' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Remove a.png' })).toHaveFocus();
    });

    it('lays files out as cards with layout="grid"', async () => {
        renderUi(
            <FileUpload multiple defaultFiles={[file('banner.png'), file('report.pdf', 100, 'application/pdf')]}>
                <FileUploadList layout="grid" />
            </FileUpload>
        );
        expect(screen.getByRole('list')).toHaveAttribute('data-layout', 'grid');
        expect(rows()[0]).toHaveAttribute('data-layout', 'grid');
        expect(screen.getByRole('button', { name: 'Remove report.pdf' })).toBeInTheDocument();
        await expectNoAxeViolations();
    });

    it("shows an image's picture from a blob URL and revokes it when the file is removed or the list unmounts", async () => {
        const { user, unmount } = renderUi(<Uploader multiple defaultFiles={[file('banner.png'), file('logo.png')]} />);
        const pictures = () => [...document.querySelectorAll('[data-slot=file-upload-preview] img')];
        await waitFor(() => expect(pictures().map((img) => img.getAttribute('src'))).toEqual([expect.stringMatching(/^blob:/), expect.stringMatching(/^blob:/)]));
        const [banner, logo] = pictures().map((img) => img.getAttribute('src'));
        await user.click(screen.getByRole('button', { name: 'Remove banner.png' }));
        expect(blobs.revoked).toContain(banner);
        expect(blobs.revoked).not.toContain(logo);
        unmount();
        expect(blobs.revoked).toContain(logo);
        // Every URL made was revoked: none outlives its preview.
        expect(blobs.made.every((url) => blobs.revoked.includes(url))).toBe(true);
    });

    it('shows the empty content while the list is empty', () => {
        renderUi(
            <FileUpload>
                <FileUploadList empty={<p>Nothing yet</p>} />
            </FileUpload>
        );
        expect(screen.getByText('Nothing yet')).toBeInTheDocument();
        expect(screen.queryByRole('list')).toBeNull();
    });

    it('stops picking, dropping and removing while disabled', async () => {
        const { user, container } = renderUi(<Uploader disabled multiple onUpload={() => {}} defaultFiles={[file('a.png')]} />);
        const click = vi.spyOn(input(container), 'click');
        expect(screen.getByRole('button', { name: 'Choose' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Drop files here or click to browse' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Remove a.png' })).toBeDisabled();
        expect(zone(container)).toHaveAttribute('data-disabled');
        fireEvent.drop(zone(container), { dataTransfer: { files: [file('b.png')] } });
        expect(rows()).toHaveLength(1);
        await user.click(screen.getByRole('button', { name: 'Choose' }));
        expect(click).not.toHaveBeenCalled();
        await expectNoAxeViolations();
    });

    it('lends its behaviour to an element of yours with asChild', async () => {
        function Field() {
            const { files } = useFileUpload();
            return (
                <InputGroup>
                    <InputGroupInput aria-label="Contacts file" readOnly value={files[0]?.file.name ?? ''} />
                    <InputGroupAddon align="inline-end">
                        <FileUploadTrigger asChild>
                            <InputGroupButton>Browse</InputGroupButton>
                        </FileUploadTrigger>
                    </InputGroupAddon>
                </InputGroup>
            );
        }
        const { user, container } = renderUi(
            <FileUpload accept=".csv">
                <Field />
            </FileUpload>
        );
        const browse = screen.getByRole('button', { name: 'Browse' });
        expect(browse).toHaveAttribute('data-slot', 'file-upload-trigger');
        expect(browse).toHaveAttribute('data-variant', 'ghost');
        const click = vi.spyOn(input(container), 'click');
        browse.focus();
        await user.keyboard('{Enter}');
        expect(click).toHaveBeenCalledTimes(1);
        await user.upload(input(container), file('contacts.csv', 10, 'text/csv'));
        expect(screen.getByRole('textbox', { name: 'Contacts file' })).toHaveValue('contacts.csv');
        await expectNoAxeViolations();
    });

    it('takes its words from the provider', async () => {
        const { user, container } = renderUi(<Uploader maxSize={10} defaultFiles={[file('a.png', 5)]} />, {
            strings: {
                chooseFiles: 'Auswählen',
                upload: 'Hochladen',
                cancel: 'Abbrechen',
                dropFilesHere: 'Dateien hierher ziehen',
                browseFiles: 'oder klicken',
                removeItem: '{label} entfernen',
                fileTooLarge: '{name} ist größer als {size}',
                fileAdded: '{name} hinzugefügt',
            },
            locale: 'de-DE',
        });
        expect(screen.getByRole('button', { name: 'Auswählen' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Hochladen' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Abbrechen' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Dateien hierher ziehen oder klicken' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'a.png entfernen' })).toBeInTheDocument();
        await user.upload(input(container), file('big.png', 1500));
        expect(within(container.querySelector('[data-slot=file-upload-errors]')).getByText('big.png ist größer als 10 B')).toBeInTheDocument();
        await user.upload(input(container), file('ok.png', 5));
        expect(status(container)).toHaveTextContent('ok.png hinzugefügt');
    });

    it('formats sizes in steps of 1,000 with short units, the number in the locale', () => {
        expect(formatFileSize(138, 'en')).toBe('138 B');
        expect(formatFileSize(48_200, 'en')).toBe('48.2 KB');
        expect(formatFileSize(1_500_000, 'de-DE')).toBe('1,5 MB');
        expect(formatFileSize(2_000_000_000, 'en')).toBe('2 GB');
        expect(formatFileSize(999_960, 'en')).toBe('1 MB');
        expect(formatFileSize(1_234_000, 'ar-EG')).toBe('١٫٢ MB');
    });

    it('throws a clear error outside FileUpload', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderUi(<FileUploadTrigger />)).toThrow('useFileUpload must be used inside <FileUpload>.');
        spy.mockRestore();
    });
});
