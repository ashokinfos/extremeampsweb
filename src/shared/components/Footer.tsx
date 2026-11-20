'use client';

import { RouterLink } from '@/core/routes/components';
import { useAppInfo } from '@/shared/contexts/AppInfoContext';

import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
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
        py: 2,
        px: 2,
        mt: 'auto',
        bgcolor: 'grey.300',
        color: 'grey.900',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: 1.5,
          rowGap: 0.5,
        }}
      >
        <Typography component="span" variant="body2">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </Typography>
        <Box component="span" aria-hidden="true" sx={{ mx: -0.5 }}>
          |
        </Box>
        <Box
          component="a"
          href="https://www.youtube.com/@extremeamps4482"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Extreme Amps on YouTube"
          title="Extreme Amps on YouTube"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#FF0000',
            textDecoration: 'none',
            '&:hover': { opacity: 0.75 },
          }}
        >
          <YouTubeIcon fontSize="small" />
          <Typography component="span" variant="body2" sx={{ color: 'inherit' }}>
            YouTube
          </Typography>
        </Box>
        <Box
          component="a"
          href="https://www.facebook.com/ExtremeAmps/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Extreme Amps on Facebook"
          title="Extreme Amps on Facebook"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#1877F2',
            textDecoration: 'none',
            '&:hover': { opacity: 0.75 },
          }}
        >
          <FacebookIcon fontSize="small" />
          <Typography component="span" variant="body2" sx={{ color: 'inherit' }}>
            Facebook
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 1, display: 'none', flexWrap: 'wrap', justifyContent: 'center' }}>
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
