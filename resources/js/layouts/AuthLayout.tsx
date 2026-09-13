import { Link, Outlet } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

export function AuthLayout() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">
            <Link to="/" className="mb-8 flex items-center">
                <Logo size="lg" showTagline />
            </Link>
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    );
}
