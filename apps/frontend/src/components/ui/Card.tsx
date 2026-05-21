import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('bg-white rounded-lg border border-gray-200 shadow-sm', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200', className)} {...props}>
      {children}
    </div>
  );
};

export const CardBody = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx('px-6 py-4 border-t border-gray-200', className)} {...props}>
      {children}
    </div>
  );
};
