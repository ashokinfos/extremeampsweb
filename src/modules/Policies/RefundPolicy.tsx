'use client';

import { DashboardContent } from '@/shared/layouts/home';
import { useAppInfo } from '@/shared/contexts/AppInfoContext';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ----------------------------------------------------------------------

const RefundPolicy = () => {
  const { appInfo } = useAppInfo();

  return (
    <DashboardContent>
      <Card variant="outlined" sx={{ mt: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Refund Policy
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            At {appInfo?.Name}, customer satisfaction is our top priority. If you&apos;ve returned
            an item, we will send you a confirmation within 2–3 business days after the return has
            been received and thoroughly inspected by our team.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The inspection process typically takes up to 5 business days. Once completed, we will
            notify you via email regarding the status of your refund whether it has been approved or
            declined based on the condition of the returned product and adherence to our return
            policy.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" gutterBottom>
            Approved Refunds
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            If your refund is approved, it will be automatically processed and credited back to your
            original method of payment within 4–6 business days.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Processing Time
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please note that while we process refunds promptly, your bank or credit card provider
            may take additional time to reflect the credit on your account. Processing times can
            vary depending on the financial institution.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Follow-up
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            If more than 15 business days have passed since you received confirmation of your
            approved return and you have not yet received your refund, please reach out to our
            customer support team at{' '}
            <Typography component="span" color="primary">
              {appInfo?.Email}
            </Typography>{' '}
            for assistance.
          </Typography>
          <Typography variant="body1">
            We appreciate your patience and understanding throughout the refund process. If you have
            any further questions or concerns, don&apos;t hesitate to get in touch with us.
          </Typography>
        </CardContent>
      </Card>
    </DashboardContent>
  );
};

export default RefundPolicy;
