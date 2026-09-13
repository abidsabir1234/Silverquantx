import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-text">Page not found</h1>
            <p className="mt-3 text-text-muted">The page you're looking for doesn't exist.</p>
            <Link to="/" className={buttonVariants({ className: 'mt-6' })}>
                Back to Home
            </Link>
        </div>
    );
}
