import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export function PublicLayout() {
    const { pathname } = useLocation();

    return (
        <div className="flex min-h-screen flex-col bg-bg">
            <Navbar />
            <main className="flex-1">
                <div key={pathname} className="animate-fade-in">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
