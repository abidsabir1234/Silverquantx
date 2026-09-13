import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, leftIcon, rightSlot, id, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-subtle">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={Boolean(error)}
                        className={cn(
                            'h-11 w-full rounded-control border bg-surface-alt px-3.5 text-sm text-text placeholder:text-text-subtle',
                            'transition-colors duration-150 outline-none',
                            'focus:border-accent focus:ring-1 focus:ring-accent',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            error ? 'border-danger' : 'border-border',
                            leftIcon && 'pl-10',
                            rightSlot && 'pr-10',
                            className
                        )}
                        {...props}
                    />
                    {rightSlot && (
                        <span className="absolute inset-y-0 right-3 flex items-center text-text-subtle">
                            {rightSlot}
                        </span>
                    )}
                </div>
                {error ? (
                    <p className="mt-1.5 text-xs text-danger">{error}</p>
                ) : helperText ? (
                    <p className="mt-1.5 text-xs text-text-subtle">{helperText}</p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';
