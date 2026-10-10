'use client';

import type { Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';
import { Logo } from '@/shared/components/logo';
import AppFooter from '@/shared/components/Footer';
import { RouterLink } from '@/core/routes/components';
import useAuth from '@/modules/auth/contexts/hooks/useAuth';
import { CartIcon } from '@/modules/product-catalog/components';
import { SearchProvider } from '@/shared/contexts/SearchContext';
import { useCart } from '@/modules/product-catalog/contexts/CartContext';
import { CartDrawer } from '@/modules/product-catalog/components/cart-drawer';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton';

import { homeLayoutVars } from './css-vars';
import { layoutClasses } from '../core/classes';
import { _account } from '../nav-config-account';
import { MainSection } from '../core/main-section';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { AccountPopover } from '../components/account-popover';
import { HeaderSearchBar } from '../components/header-search-bar';

import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type HomeLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export function HomeLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: HomeLayoutProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const { totalItems, openDrawer } = useCart();

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Logo />
        </Box>
      ),
      centerArea: (
        <HeaderSearchBar
          sx={{
            display: { xs: 'none', md: 'flex' },
            px: 2,
            height: 50,
            width: { xs: 1, md: 0.7 },
            borderRadius: 1,
            border: (t: any) => `1px solid ${t.palette.divider}`,
            bgcolor: 'background.paper',
          }}
        />
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              <CartIcon totalItems={totalItems} onClick={openDrawer} />
              <AccountPopover data={_account} />
            </>
          ) : (
            <>
              <CartIcon totalItems={totalItems} onClick={openDrawer} />
              <Button
                component={RouterLink}
                href="/sign-in"
                variant="outlined"
                color="inherit"
                size="small"
                sx={{ display: { xs: 'none', sm: 'flex' }, borderColor: 'primary.contrastText' }}
              >
                Sign In
              </Button>
              <IconButton
                component={RouterLink}
                href="/sign-in"
                color="inherit"
                size="small"
                aria-label="Sign in"
                sx={{ display: { xs: 'flex', sm: 'none' } }}
              >
                <LoginIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      ),
      bottomArea: (
        <HeaderSearchBar
          sx={{
            display: { xs: 'flex', md: 'none' },
            px: 2,
            margin: '0px auto',
            height: 50,
            width: { xs: 0.9, md: 0.7 },
            borderRadius: 1,
            border: (t: any) => `1px solid ${t.palette.divider}`,
            bgcolor: 'background.paper',
          }}
        />
      ),
    };

    return (
      <HeaderSection
        disableElevation
        disableOffset
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {}) as HeaderSectionProps['slotProps']}
        sx={[
          {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            // Lock --color to white so useScrollOffsetTop can never override
            // the icon/text colour when the user scrolls down.
            '--color': 'var(--palette-primary-contrastText, #fff)',
          },
          ...(Array.isArray(slotProps?.header?.sx)
            ? (slotProps?.header?.sx ?? [])
            : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderFooter = () => <AppFooter />;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <SearchProvider>
      <CartDrawer />
      <LayoutSection
        /** **************************************
         * @Header
         *************************************** */
        headerSection={renderHeader()}
        /** **************************************
         * @Footer
         *************************************** */
        footerSection={renderFooter()}
        /** **************************************
         * @Styles
         *************************************** */
        cssVars={{ ...homeLayoutVars(theme), ...cssVars }}
        sx={[
          {
            [`& .${layoutClasses.sidebarContainer}`]: {
              [theme.breakpoints.up(layoutQuery)]: {
                pl: 'var(--layout-nav-vertical-width)',
                transition: theme.transitions.create(['padding-left'], {
                  easing: 'var(--layout-transition-easing)',
                  duration: 'var(--layout-transition-duration)',
                }),
              },
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {renderMain()}
      </LayoutSection>
    </SearchProvider>
  );
}
