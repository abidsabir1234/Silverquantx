import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary:
        'bg-silver text-[#080B0A] hover:bg-silver-light shadow-card disabled:hover:bg-silver',
    secondary:
        'bg-surface-alt text-text border border-border hover:border-accent/30 disabled:hover:border-border',
    outline:
        'bg-transparent text-text border border-border hover:border-accent/30 disabled:hover:border-border',
    ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-surface',
    danger: 'bg-danger text-white hover:bg-danger/90 disabled:hover:bg-danger',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-sm gap-1.5',
    md: 'h-11 px-5 text-sm gap-2',
    lg: 'h-13 px-7 text-base gap-2.5',
};

/** Shared style string for anything that needs to *look* like a Button without being
 * a real `<button>` — e.g. a `<Link>`, so we never nest a button inside an anchor. */
export function buttonVariants({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
}: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
} = {}) {
    return cn(
        'inline-flex items-center justify-center rounded-control font-medium',
        'transition-colors duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className
    );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    buttonVariants({ variant, size, fullWidth }),
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';
