// An app that uses one component: it installs the package with its required peers only, without the optional ones
// (recharts, react-day-picker, sonner), and must still build.
import { createRoot } from 'react-dom/client';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { Button } from '@booleanpress/ui/button';
import './index.css';

createRoot(document.getElementById('app')).render(
    <BooleanUIProvider>
        <Button>Save</Button>
    </BooleanUIProvider>,
);
