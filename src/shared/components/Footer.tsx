'use client';

import { RouterLink } from '@/core/routes/components';
import { useAppInfo } from '@/shared/contexts/AppInfoContext';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const AppFooter = () => {
  const { appInfo } = useAppInfo();
  const companyName = appInfo?.Name;

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        bgcolor: 'grey.800',
        color: 'grey.300',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </Typography>
      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { href: '/terms-and-conditions', label: 'Terms & Conditions' },
          { href: '/refund-policy', label: 'Refund Policy' },
          { href: '/privacy-policy', label: 'Privacy Policy' },
          { href: '/return-policy', label: 'Return Policy' },
          { href: '/shipping-policy', label: 'Shipping Policy' },
          { href: '/contact-us', label: 'Contact Us' },
        ].map((link) => (
          <Button
            key={link.href}
            component={RouterLink}
            href={link.href}
            size="small"
            color="inherit"
            sx={{ color: 'primary.light', textTransform: 'none' }}
          >
            {link.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default AppFooter;
