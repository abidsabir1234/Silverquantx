import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, MobileSidebarDrawer } from '@/components/app/Sidebar';
import { Header } from '@/components/app/Header';

export function AppLayout() {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { pathname } = useLocation();

    return (
        <div className="flex min-h-screen bg-bg">
            <Sidebar />
            <MobileSidebarDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header onOpenMenu={() => setIsMobileNavOpen(true)} />
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    <div key={pathname} className="animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
