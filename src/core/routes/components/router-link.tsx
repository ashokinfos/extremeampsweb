'use client';

import NextLink from 'next/link';
import type { LinkProps as NextLinkProps } from 'next/link';

// ----------------------------------------------------------------------

interface RouterLinkProps extends Omit<NextLinkProps, 'href'> {
  href: string;
  ref?: React.RefObject<HTMLAnchorElement | null>;
  children?: React.ReactNode;
}

export function RouterLink({ href, ref, children, ...other }: RouterLinkProps) {
  return (
    <NextLink href={href} ref={ref} {...other}>
      {children}
    </NextLink>
  );
}
