import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type AccordionRootProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
};

/** Server-rendered accordion for course MDX (avoids client-boundary stripping of code block content). */
export function CourseAccordion({ className, children, ...props }: AccordionRootProps) {
  const { type: _t, collapsible: _c, ...rest } = props;
  return (
    <div className={cn('w-full', className)} {...rest}>
      {children}
    </div>
  );
}

type AccordionItemProps = React.HTMLAttributes<HTMLDetailsElement> & {
  value?: string;
};

export function CourseAccordionItem({ className, children, value: _value, ...props }: AccordionItemProps) {
  return (
    <details className={cn('group border-b', className)} {...props}>
      {children}
    </details>
  );
}

export function CourseAccordionTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <summary
      className={cn(
        'flex flex-1 list-none cursor-pointer items-center justify-between py-4 font-medium transition-all hover:underline [&::-webkit-details-marker]:hidden',
        className
      )}
      {...props}
    >
      <span className="flex-1 text-left">{children}</span>
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
    </summary>
  );
}

export function CourseAccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('overflow-hidden pb-4 pt-0 text-sm', className)} {...props}>
      {children}
    </div>
  );
}