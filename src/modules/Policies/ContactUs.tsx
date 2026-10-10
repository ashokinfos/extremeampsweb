'use client';

import { Iconify } from '@/shared/components/iconify';
import { DashboardContent } from '@/shared/layouts/home';
import { useAppInfo } from '@/shared/contexts/AppInfoContext';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const ContactUs = () => {
  const { appInfo } = useAppInfo();

  return (
    <DashboardContent>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Contact Us
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Iconify icon="eva:pin-outline" width={24} sx={{ mr: 2, flexShrink: 0 }} />
          <Typography>
            <strong>Address:</strong>{' '}
            {appInfo
              ? `${appInfo.AddressLine1}${appInfo.AddressLine2 ? `, ${appInfo.AddressLine2}` : ''}, ${appInfo.City}, ${appInfo.State} — ${appInfo.PinCode}`
              : 'Address information is missing'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Iconify icon="eva:email-outline" width={24} sx={{ mr: 2, flexShrink: 0 }} />
          <Typography>
            <strong>Email:</strong> <Link href={`mailto:${appInfo?.Email}`}>{appInfo?.Email}</Link>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Iconify icon="eva:phone-outline" width={24} sx={{ mr: 2, flexShrink: 0 }} />
          <Typography>
            <strong>Mobile:</strong>{' '}
            <Link href={`tel:${appInfo?.Phone?.replace(/\s/g, '')}`}>{appInfo?.Phone}</Link>{' '}
          </Typography>
        </Box>
      </Paper>
    </DashboardContent>
  );
};

export default ContactUs;
