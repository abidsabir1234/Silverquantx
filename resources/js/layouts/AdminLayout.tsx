import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar, MobileAdminSidebarDrawer } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminLayout() {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { pathname } = useLocation();

    return (
        <div className="flex min-h-screen bg-bg">
            <AdminSidebar />
            <MobileAdminSidebarDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader onOpenMenu={() => setIsMobileNavOpen(true)} />
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    <div key={pathname} className="animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
