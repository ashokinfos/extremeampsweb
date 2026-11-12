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
            No: 941A, Phase-II 32nd Street, Sathuvacheri, Vellore, Tamil Nadu — 632202
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Iconify icon="eva:email-outline" width={24} sx={{ mr: 2, flexShrink: 0 }} />
          <Typography>
            <strong>Email:</strong> <Link href={`mailto:kiruaudios7@gmail.com`}>kiruaudios7@gmail.com</Link>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Iconify icon="eva:phone-outline" width={24} sx={{ mr: 2, flexShrink: 0 }} />
          <Typography>
            <strong>Mobile:</strong>{' '}
            <Link href={`tel:9092452542`}>9092452542</Link>{' '}
          </Typography>
        </Box>
      </Paper>
    </DashboardContent>
  );
};

export default ContactUs;
