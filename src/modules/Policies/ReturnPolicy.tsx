'use client';

import { DashboardContent } from '@/shared/layouts/home';
import { useAppInfo } from '@/shared/contexts/AppInfoContext';
import { useSeoMeta } from '@/shared/contexts/hooks/useSeoMeta';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const ReturnPolicy = () => {
  const { appInfo } = useAppInfo();

  const companyName = appInfo?.Name ?? 'GenNest Infra Tech Services';
  const email = appInfo?.Email ?? 'ashokinfos@gmail.com';
  const phone = appInfo?.Phone ?? '+91 82203 02401';

  useSeoMeta({
    title: `Return & Replacement Policy | ${companyName}`,
    description: `Understand ${companyName} 7-day return and replacement policy — eligibility, how to initiate a return, and replacement timelines.`,
    canonical: '/return-policy',
    noIndex: true,
  });

  return (
    <DashboardContent>
      <Box py={4}>
        <Box mb={4} textAlign="center">
          <Typography variant="h4">Return &amp; Replacement Policy</Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            At {companyName}
          </Typography>
          <Typography variant="body1">
            We are committed to providing our customers with a seamless and satisfying shopping
            experience. If for any reason you&apos;re not completely satisfied with your purchase,
            we offer a straightforward Return and Replacement policy to ensure your peace of mind.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Return Policy
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            We offer a 7-day return window from the date of delivery. If you are not fully satisfied
            with your purchase or receive an incorrect or defective item, you can request a return
            within this period.
          </Typography>
          <ul>
            <li>
              The item must be in its original condition, unused, and with all original packaging,
              accessories, and documentation.
            </li>
            <li>A valid proof of purchase (invoice or receipt) must be provided.</li>
            <li>The return request must be raised within 7 days of receiving the product.</li>
          </ul>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
            How to initiate a return:
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Contact our Customer Support team via{' '}
            <Link href={`mailto:${email}`} color="primary">
              {email}
            </Link>{' '}
            /{' '}
            <Link href={`tel:${phone.replace(/\s/g, '')}`} color="primary">
              {phone}
            </Link>{' '}
            with your order number and reason for return.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Our team will guide you through the return process and arrange for a pickup or provide
            instructions for returning the item.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Once we receive and inspect the returned item, we will confirm whether it qualifies for
            a return.
          </Typography>
          <Typography variant="body1">
            <strong>Please note:</strong> Items that are damaged due to misuse, mishandling, or
            unauthorized repairs will not be eligible for return.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Replacement Policy
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            If you receive a product that is damaged, defective, or not as described, we will offer
            a replacement once the item has been returned and inspected.
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Replacement terms:
          </Typography>
          <ul>
            <li>
              Replacements will be delivered within 7-10 business days after we receive and verify
              the returned item.
            </li>
          </ul>
          <Typography variant="body1">
            <strong>Important Notes:</strong>
          </Typography>
          <ul>
            <li>All replacement requests must also be reported within 7 days of delivery.</li>
            <li>
              Products returned without prior authorization or outside the eligible window will not
              be accepted.
            </li>
          </ul>
        </Box>

        <Box mb={4}>
          <Typography variant="body1">
            We strive to make returns and replacements as smooth and hassle-free as possible. If you
            have any questions, our support team is here to help you every step of the way.
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="subtitle2" gutterBottom>
            Contact Us:
          </Typography>
          <Typography variant="body2">
            📧 <Link href={`mailto:${email}`}>{email}</Link>
          </Typography>
          <Typography variant="body2">
            📞 <Link href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</Link>
          </Typography>
        </Box>
      </Box>
    </DashboardContent>
  );
};

export default ReturnPolicy;
