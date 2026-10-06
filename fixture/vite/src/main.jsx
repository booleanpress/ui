// A minimal consumer: it imports public entry points only, renders the documented Checkbox example pasted verbatim
// (checkbox-example.tsx, copied from examples/checkbox/basic.tsx by the fixture script), and uses none of the package's
// distinctive classes itself, so finding them in the built CSS proves Tailwind scanned the package.
import { createRoot } from 'react-dom/client';
import { BooleanUIProvider } from '@booleanpress/ui/provider';
import { Button } from '@booleanpress/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@booleanpress/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@booleanpress/ui/tabs';
import CheckboxExample from './checkbox-example.tsx';
import './index.css';

function App() {
    return (
        <BooleanUIProvider strings={{ close: 'Fermer' }}>
            <main className="p-8">
                <Tabs defaultValue="one">
                    <TabsList>
                        <TabsTrigger value="one">One</TabsTrigger>
                        <TabsTrigger value="two">Two</TabsTrigger>
                    </TabsList>
                    <TabsContent value="one">
                        <Dialog>
                            <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
                            <DialogContent size="lg">
                                <DialogHeader>
                                    <DialogTitle>Fixture</DialogTitle>
                                    <DialogDescription>Built from the packed tarball.</DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>
                </Tabs>
                <section aria-label="Documented example" className="mt-6">
                    <CheckboxExample />
                </section>
            </main>
        </BooleanUIProvider>
    );
}

createRoot(document.getElementById('app')).render(<App />);
