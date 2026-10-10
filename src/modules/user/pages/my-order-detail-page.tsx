'use client';

import { fCurrency } from '@/shared/utils';
import { useState, useEffect } from 'react';
import { Iconify } from '@/shared/components/iconify';
import { DashboardContent } from '@/shared/layouts/home';
import { useParams, useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import Tooltip from '@mui/material/Tooltip';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { myOrderService } from '../services/myOrderService';

import type { IMyOrderDetails } from '../types/orderTypes';

// ----------------------------------------------------------------------

const statusColor = (status: string): 'default' | 'warning' | 'info' | 'success' | 'error' => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'payment_pending':
      return 'warning';
    case 'ordered':
    case 'shipped':
      return 'info';
    case 'delivered':
      return 'success';
    case 'cancelled':
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const fmt = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

// ── Order status stepper steps ──────────────────────────────────────────

const ORDER_STEPS: { label: string; sublabel?: (info: IMyOrderDetails['OrderInfo']) => string | null }[] = [
  { label: 'Ordered',    sublabel: (i) => fmt(i.OrderDate) },
  { label: 'Processing', sublabel: () => null },
  {
    label: 'Shipped',
    sublabel: (i) => {
      const parts: string[] = [];
      if (i.ShippedDate) parts.push(fmt(i.ShippedDate));
      if (i.CourierName) parts.push(i.CourierName);
      if (i.TrackingNumber) parts.push(`#${i.TrackingNumber}`);
      return parts.length ? parts.join(' · ') : null;
    },
  },
  { label: 'Delivered',  sublabel: (i) => fmt(i.DeliveredDate) },
];

const statusToStep = (status: string): number => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'payment_pending':
    case 'ordered':
      return 0;
    case 'processing':
      return 1;
    case 'shipped':
      return 2;
    case 'delivered':
      return 3;
    default:
      return 0;
  }
};

interface OrderStatusStepperProps {
  order: IMyOrderDetails;
}

function OrderStatusStepper({ order }: OrderStatusStepperProps) {
  const { Status } = order.OrderInfo;
  const isCancelled = ['cancelled', 'failed'].includes(Status.toLowerCase());
  const activeStep = statusToStep(Status);

  if (isCancelled) {
    return (
      <Alert severity="error" icon={<Iconify icon="solar:close-circle-bold" />}>
        This order has been <strong>{Status}</strong>.
      </Alert>
    );
  }

  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {ORDER_STEPS.map((step, idx) => {
        const sub = step.sublabel?.(order.OrderInfo);
        const isActive = idx === activeStep;
        const isCompleted = idx < activeStep;

        return (
          <Step key={step.label} completed={isCompleted}>
            <StepLabel
              optional={
                sub && (isActive || isCompleted) ? (
                  <Typography
                    variant="caption"
                    color={isActive ? 'primary.main' : 'text.secondary'}
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      // tracking number in monospace so it stands out
                      ...(step.label === 'Shipped' && order.OrderInfo.TrackingNumber
                        ? { fontFamily: 'monospace', letterSpacing: 0.3 }
                        : {}),
                    }}
                  >
                    {sub}
                  </Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}

// ── Copy tracking number button ─────────────────────────────────────────

function CopyTrackingButton({ trackingNumber }: { trackingNumber: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy tracking number'}>
      <IconButton size="small" onClick={handleCopy} sx={{ ml: 0.5 }}>
        <Iconify icon={copied ? 'eva:checkmark-fill' : 'eva:hash-outline'} width={15} />
      </IconButton>
    </Tooltip>
  );
}

// ── Main page ───────────────────────────────────────────────────────────

export default function MyOrderDetailPage() {
  const params = useParams();
  const orderId = params?.orderId as string | undefined;
  const router = useRouter();
  const [order, setOrder] = useState<IMyOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const canCancelOrder = (status: string) =>
    ['pending', 'payment_pending', 'failed'].includes(status.toLowerCase());

  const canDownloadInvoice = (status: string) =>
    ['shipped', 'delivered'].includes(status.toLowerCase());

  useEffect(() => {
    if (!orderId) return;
    myOrderService
      .getMyOrderDetails(orderId)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!orderId) return;
    setCancelling(true);
    try {
      await myOrderService.cancelOrder(orderId);
      const updated = await myOrderService.getMyOrderDetails(orderId);
      setOrder(updated);
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!orderId || !order) return;
    setDownloading(true);
    try {
      await myOrderService.downloadInvoice(orderId, order.OrderInfo.OrderCode);
    } finally {
      setDownloading(false);
    }
  };

  // ── Loading / not found ──────────────────────────────────────────────

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Order not found.</Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.push('/my-orders')}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  const { OrderInfo, OrderedItems, ShippingDetails, PaymentInfo } = order;
  const hasTracking = !!OrderInfo.TrackingNumber;
  const isShippedOrDelivered = ['shipped', 'delivered'].includes(OrderInfo.Status.toLowerCase());

  return (
    <>
      <DashboardContent>
        {/* ── Page header ── */}
        <Stack direction="row" alignItems="center" spacing={1} mb={3} flexWrap="wrap" gap={1}>
          <Button
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            onClick={() => router.push('/my-orders')}
            variant="outlined"
            size="small"
          >
            Back
          </Button>
          <Typography variant="h5">Order {OrderInfo.OrderCode}</Typography>
          <Chip label={OrderInfo.Status} color={statusColor(OrderInfo.Status)} size="small" />
          <Box flex={1} />
          {canCancelOrder(OrderInfo.Status) && (
            <LoadingButton
              loading={cancelling}
              color="error"
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:close-circle-bold" />}
              onClick={() => setConfirmCancel(true)}
            >
              Cancel Order
            </LoadingButton>
          )}
          {canDownloadInvoice(OrderInfo.Status) && (
            <LoadingButton
              loading={downloading}
              startIcon={<Iconify icon="eva:download-fill" />}
              variant="contained"
              size="small"
              onClick={handleDownloadInvoice}
            >
              Download Invoice
            </LoadingButton>
          )}
        </Stack>

        {/* ── Order status tracker ── */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" mb={2.5}>
            Order Status
          </Typography>

          <OrderStatusStepper order={order} />

          {/* Courier + tracking number pill — shown below stepper when shipped */}
          {isShippedOrDelivered && (OrderInfo.CourierName || hasTracking) && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap"
              gap={1}
              mt={2.5}
            >
              {OrderInfo.CourierName && (
                <Chip
                  icon={<Iconify icon="solar:box-linear" width={16} />}
                  label={OrderInfo.CourierName}
                  size="small"
                  variant="outlined"
                  color="info"
                />
              )}
              {hasTracking && (
                <Stack direction="row" alignItems="center">
                  <Chip
                    icon={<Iconify icon="eva:hash-outline" width={16} />}
                    label={
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ fontFamily: 'monospace', letterSpacing: 0.5 }}
                      >
                        {OrderInfo.TrackingNumber}
                      </Typography>
                    }
                    size="small"
                    variant="outlined"
                    color="default"
                  />
                  <CopyTrackingButton trackingNumber={OrderInfo.TrackingNumber!} />
                </Stack>
              )}
            </Stack>
          )}
        </Card>

        <Grid container spacing={3}>
          {/* ── Left: items ── */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" mb={2}>
                Items Ordered
              </Typography>
              <Stack spacing={2}>
                {OrderedItems.map((item) => (
                  <Stack key={item.Id} direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={item.ImageUrl ?? '/assets/placeholder.png'}
                      alt={item.ProductName}
                      sx={{
                        width: 64,
                        height: 64,
                        objectFit: 'contain',
                        borderRadius: 1,
                        flexShrink: 0,
                        border: (t) => `1px solid ${t.palette.divider}`,
                      }}
                    />
                    <Box flex={1} minWidth={0}>
                      <Typography variant="subtitle2" noWrap>
                        {item.ProductName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.VariantName} × {item.Quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {fCurrency(item.Price)} each
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" flexShrink={0}>
                      {fCurrency(item.ItemTotal)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2">{fCurrency(OrderInfo.SubTotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                  <Typography variant="body2">{fCurrency(OrderInfo.ShippingCost)}</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                    {fCurrency(OrderInfo.Total)}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          {/* ── Right: address + payment ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5}>
              {/* Shipping address */}
              <Card sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <Iconify icon="eva:pin-outline" width={18} sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle1">Shipping Address</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={600}>
                  {ShippingDetails.CustomerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ShippingDetails.PhoneNumber}
                </Typography>
                <Typography variant="body2">
                  {ShippingDetails.AddressLine1}
                  {ShippingDetails.AddressLine2 ? `, ${ShippingDetails.AddressLine2}` : ''}
                </Typography>
                <Typography variant="body2">
                  {ShippingDetails.City}, {ShippingDetails.State} — {ShippingDetails.PinCode}
                </Typography>
              </Card>

              {/* Payment */}
              <Card sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <Iconify icon="mdi:credit-card" width={18} sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle1">Payment</Typography>
                </Stack>
                <Stack spacing={0.75}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Method
                    </Typography>
                    <Typography variant="body2">{PaymentInfo.PaymentMethod || '—'}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={PaymentInfo.PaymentStatus}
                      size="small"
                      color={
                        PaymentInfo.PaymentStatus?.toLowerCase() === 'completed'
                          ? 'success'
                          : 'warning'
                      }
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Amount Paid
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fCurrency(PaymentInfo.AmountPaid)}
                    </Typography>
                  </Stack>
                  {PaymentInfo.PaymentDate && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body2">{fmt(PaymentInfo.PaymentDate)}</Typography>
                    </Stack>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </DashboardContent>

      {/* Cancel confirmation dialog */}
      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to cancel order {OrderInfo.OrderCode}? This action cannot be
            undone.
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
