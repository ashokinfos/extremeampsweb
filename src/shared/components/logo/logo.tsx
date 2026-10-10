'use client';

import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';
import { getPublicAssetPath } from '@/shared/utils';
import { RouterLink } from '@/core/routes/components';
import { useAppInfo } from '@/shared/contexts/AppInfoContext';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {
  const { appInfo } = useAppInfo();
  const fallbackPath = getPublicAssetPath('assets/icons/navbar/Logo.webp');

  const logoSrc = appInfo?.Logo ? `data:image/png;base64,${appInfo.Logo}` : fallbackPath;

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label={appInfo?.Name ?? 'Logo'}
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: '100%',
          height: 64,
          mb: 1,
          ...(!isSingle && { height: 40 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <img
        src={logoSrc}
        alt={appInfo?.Name ?? 'Logo'}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
