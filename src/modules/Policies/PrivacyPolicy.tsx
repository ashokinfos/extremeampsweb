'use client';

import { Iconify } from '@/shared/components/iconify';
import { DashboardContent } from '@/shared/layouts/home';
import { useAppInfo } from '@/shared/contexts/AppInfoContext';
import { useSeoMeta } from '@/shared/contexts/hooks/useSeoMeta';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

// ----------------------------------------------------------------------

const PrivacyPolicy = () => {
  const { appInfo } = useAppInfo();

  const companyName = appInfo?.Name ?? 'GenNest Infra Tech Services';
  const websiteUrl = appInfo?.Domain ? `https://${appInfo.Domain}` : 'https://www.gennest.in';

  useSeoMeta({
    title: `Privacy Policy | ${companyName}`,
    description: `Read the ${companyName} Privacy Policy to understand how we collect, use, and protect your personal data.`,
    canonical: '/privacy-policy',
    noIndex: true,
  });

  const sections = [
    {
      title: 'Introduction',
      content: (
        <>
          This Privacy Policy describes how {companyName} and its affiliates (collectively &quot;
          {companyName}, we, our, us&quot;) collect, use, share, protect or otherwise process your
          information/ personal data through our website <a href={websiteUrl}>{websiteUrl}</a>{' '}
          (hereinafter referred to as Platform).
        </>
      ),
      defaultExpanded: true,
    },
    {
      title: 'Collection',
      content:
        'We collect your personal data when you use our Platform, services or otherwise interact with us during the course of our relationship. Some of the information that we may collect includes but is not limited to personal data / information provided to us during sign-up/registering or using our Platform such as name, date of birth, address, telephone/mobile number, email ID and/or any such information shared as proof of identity or address.',
    },
    {
      title: 'Usage',
      content:
        'We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you the ability to opt-out of such uses.',
    },
    {
      title: 'Sharing',
      content:
        'We may share your personal data internally within our group entities, our other corporate entities, and affiliates to provide you access to the services and products offered by them.',
    },
    {
      title: 'Security Precautions',
      content:
        'To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable security practices and procedures.',
    },
    {
      title: 'Data Deletion and Retention',
      content:
        'You have an option to delete your account by visiting your profile and settings on our Platform, this action would result in you losing all information related to your account.',
    },
    {
      title: 'Your Rights',
      content:
        'You may access, rectify, and update your personal data directly through the functionalities provided on the Platform.',
    },
    {
      title: 'Consent',
      content:
        'By visiting our Platform or by providing your information, you consent to the collection, use, storage, disclosure and otherwise processing of your information on the Platform in accordance with this Privacy Policy.',
    },
    {
      title: 'Changes to this Privacy Policy',
      content:
        'Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes to our information practices.',
    },
  ];

  return (
    <DashboardContent>
      <Box py={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom align="center">
            Privacy Policy
          </Typography>

          <Divider sx={{ my: 3 }} />

          {sections.map((section) => (
            <Accordion key={section.title} defaultExpanded={section.defaultExpanded}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography variant="h6">{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">{section.content}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>
    </DashboardContent>
  );
};

export default PrivacyPolicy;
