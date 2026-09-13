import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Root } from './Root';

const container = document.getElementById('app');

if (container) {
    createRoot(container).render(
        <StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <Root />
                </AuthProvider>
            </BrowserRouter>
        </StrictMode>
    );
}
