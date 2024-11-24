import { cn } from '@/shared/lib';
import { VariantProps, cva } from 'class-variance-authority';
import { FC, HTMLAttributes } from 'react';

export interface SpinnerProps
    extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> { }

const spinnerVariants = cva(
    'inline-block box-border animate-spin rounded-[50%] border-b-foreground/50 border-solid',
    {
        variants: {
            size: {
                sm: 'w-4 h-4 border-[2px]',
                lg: 'w-12 h-12 border-[5px]',
            },
        },
        defaultVariants: {
            size: 'lg',
        },
    }
);

export const Spinner: FC<SpinnerProps> = ({ className, size, ...props }) => {
    return (
        <span {...props} className={cn(spinnerVariants({ size, className }))} />
    );
};