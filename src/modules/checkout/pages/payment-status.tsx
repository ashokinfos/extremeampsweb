'use client';

import { fCurrency } from '@/shared/utils';
import { useRef, useState, useEffect } from 'react';
import { useCart } from '@/modules/product-catalog';
import { Iconify } from '@/shared/components/iconify';
import { myOrderService } from '@/modules/user/services/myOrderService';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { checkoutService } from '../services/checkoutService';

import type { IPaymentStatusResponse } from '../types/checkoutTypes';

// ----------------------------------------------------------------------

export default function PaymentStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const orderId = params?.orderId as string | undefined;
  const [status, setStatus] = useState<IPaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const hasRun = useRef(false);
  const { fetchCart } = useCart();

  useEffect(() => {
    const merchantOrderId =
      searchParams.get('merchantOrderId') || orderId || sessionStorage.getItem('pendingOrderId');

    if (!merchantOrderId) {
      router.push('/');
      return;
    }
    if (hasRun.current) return;

    hasRun.current = true;

    checkoutService
      .getPaymentStatus(merchantOrderId)
      .then((res) => setStatus(res))
      .catch(() =>
        setStatus({
          Status: false,
          Message: 'Unable to verify payment status.',
          PaymentState: 'UNKNOWN',
          OrderId: merchantOrderId,
          Amount: 0,
        })
      )
      .finally(() => {
        setLoading(false);
        sessionStorage.removeItem('pendingOrderId');
      });
  }, [router, orderId, searchParams]);

  const handleRetry = async () => {
    if (!status?.OrderId) return;
    setRetrying(true);
    try {
      const result = await checkoutService.reInitiateCheckout({ OrderId: status.OrderId });
      if (!result.Status) {
        return;
      }
      sessionStorage.setItem('pendingOrderId', result.MerchantOrderId);
      window.location.href = result.PaymentUrl;
    } catch {
      // stay on page — user can try again
    } finally {
      setRetrying(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!status?.OrderId) return;
    setCancelling(true);
    try {
      await myOrderService.cancelOrder(status.OrderId);
      await fetchCart();
      router.push('/my-orders');
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 12, gap: 2 }}>
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Verifying your payment...
        </Typography>
      </Box>
    );
  }

  const isSuccess = status?.PaymentState?.toUpperCase() === 'COMPLETED';
  const isFailed = status?.PaymentState?.toUpperCase() === 'FAILED';

  return (
    <>
      <Box sx={{ maxWidth: 480, mx: 'auto', px: 2, py: 6 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
              bgcolor: isSuccess
                ? 'success.lighter'
                : isFailed
                  ? 'error.lighter'
                  : 'warning.lighter',
            }}
          >
            <Iconify
              icon={
                isSuccess
                  ? 'solar:check-circle-bold'
                  : isFailed
                    ? 'mingcute:close-line'
                    : 'solar:clock-circle-outline'
              }
              width={44}
              sx={{
                color: isSuccess ? 'success.main' : isFailed ? 'error.main' : 'warning.main',
              }}
            />
          </Box>

          <Typography variant="h5" mb={1}>
            {isSuccess ? 'Payment Successful!' : isFailed ? 'Payment Failed' : 'Payment Pending'}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            {isSuccess
              ? 'Your order has been confirmed. Thank you for shopping with us!'
              : isFailed
                ? 'Your payment could not be processed. Please try again.'
                : 'Your payment is being processed. Please wait for 10 mins to verify your payment status.'}
          </Typography>

          {status && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.25} sx={{ textAlign: 'left', mb: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Order Code
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ fontSize: 12 }}>
                    {status.OrderCode || status.OrderId}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ fontSize: 12 }}>
                    {status.TrasnactionId || '-'}
                  </Typography>
                </Stack>
                {status.Amount > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {fCurrency(status.Amount)}
                    </Typography>
                  </Stack>
                )}
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={isSuccess ? 'success.main' : isFailed ? 'error.main' : 'warning.main'}
                  >
                    {status.PaymentState}
                  </Typography>
                </Stack>
              </Stack>
            </>
          )}

          <Stack spacing={1.5}>
            {isSuccess && (
              <Button
                variant="contained"
                fullWidth
                startIcon={<Iconify icon="solar:cart-3-bold" />}
                onClick={() => fetchCart().then(() => router.push('/'))}
              >
                Continue Shopping
              </Button>
            )}
            {isFailed && (
              <Button
                variant="contained"
                fullWidth
                color="error"
                disabled={retrying}
                startIcon={
                  retrying ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Iconify icon="solar:restart-bold" />
                  )
                }
                onClick={handleRetry}
              >
                {retrying ? 'Redirecting...' : 'Try Again'}
              </Button>
            )}
            {isFailed && (
              <LoadingButton
                variant="outlined"
                fullWidth
                color="error"
                loading={cancelling}
                startIcon={<Iconify icon="solar:close-circle-bold" />}
                onClick={() => setConfirmCancel(true)}
              >
                Cancel Order
              </LoadingButton>
            )}
            {!isSuccess && !isFailed && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() =>
                  status && checkoutService.getPaymentStatus(status.OrderId).then(setStatus)
                }
                startIcon={<Iconify icon="solar:restart-bold" />}
              >
                Refresh Status
              </Button>
            )}
            <Button variant="text" fullWidth onClick={() => fetchCart().then(() => router.push('/'))}>
              Back to Home
            </Button>
          </Stack>
        </Card>
      </Box>

      {/* Cancel confirmation dialog */}
      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to cancel this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(false)}>Keep Order</Button>
          <LoadingButton
            color="error"
            variant="contained"
            loading={cancelling}
            onClick={handleCancelOrder}
          >
            Yes, Cancel
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
