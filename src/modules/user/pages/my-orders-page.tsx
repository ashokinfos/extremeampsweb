'use client';

import { fCurrency } from '@/shared/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Iconify } from '@/shared/components/iconify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import TimelineContent from '@mui/lab/TimelineContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import CircularProgress from '@mui/material/CircularProgress';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import { myOrderService } from '../services/myOrderService';

import type { IOrderInfo, IMyOrderDetails, IMyOrderSummary } from '../types/orderTypes';

// ----------------------------------------------------------------------

const STATUS_COLOR: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning',
  ordered: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  failed: 'error',
};

const fmt = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

// ----------------------------------------------------------------------

interface TrackingStep {
  label: string;
  sublabel?: string;
  date: string | null;
  done: boolean;
  icon: string;
}

function buildTrackingSteps(info: IOrderInfo): TrackingStep[] {
  const status = info.Status?.toLowerCase();
  const isCancelled = status === 'cancelled' || status === 'failed';

  const steps: TrackingStep[] = [
    {
      label: 'Order Placed',
      date: fmt(info.OrderDate),
      done: true,
      icon: 'solar:bag-4-bold',
    },
    {
      label: 'Order Confirmed',
      date: status !== 'pending' ? fmt(info.OrderDate) : null,
      done: status !== 'pending' && !isCancelled,
      icon: 'solar:check-circle-bold',
    },
    {
      label: 'Shipped',
      sublabel: info.TrackingNumber
        ? `${info.CourierName ? `${info.CourierName} · ` : ''}#${info.TrackingNumber}`
        : info.CourierName || undefined,
      date: fmt(info.ShippedDate),
      done: !!info.ShippedDate,
      icon: 'eva:cube-fill',
    },
    {
      label: 'Delivered',
      date: fmt(info.DeliveredDate),
      done: !!info.DeliveredDate,
      icon: 'solar:home-angle-bold-duotone',
    },
  ];

  if (isCancelled) {
    return [
      steps[0],
      {
        label: status === 'failed' ? 'Payment Failed' : 'Order Cancelled',
        date: fmt(info.OrderDate),
        done: true,
        icon: 'mingcute:close-line',
      },
    ];
  }

  return steps;
}

// ----------------------------------------------------------------------

function TrackingDialog({
  open,
  onClose,
  info,
  orderCode,
}: {
  open: boolean;
  onClose: () => void;
  info: IOrderInfo;
  orderCode: string;
}) {
  const steps = buildTrackingSteps(info);
  const isCancelled = ['cancelled', 'failed'].includes(info.Status?.toLowerCase());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={700}>
            Track Order · {orderCode}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Timeline sx={{ p: 0, m: 0 }}>
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const dotColor = !step.done
              ? 'grey'
              : isCancelled && idx > 0
                ? 'error'
                : isLast && step.done
                  ? 'success'
                  : 'primary';

            return (
              <TimelineItem key={step.label}>
                <TimelineOppositeContent sx={{ flex: 0.45, py: '10px', px: 1 }}>
                  <Typography
                    variant="caption"
                    color={step.done ? 'text.secondary' : 'text.disabled'}
                  >
                    {step.date ?? (step.done ? '—' : 'Pending')}
                  </Typography>
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot
                    color={dotColor as any}
                    variant={step.done ? 'filled' : 'outlined'}
                    sx={{ my: '10px', p: 0.75 }}
                  >
                    <Iconify
                      icon={step.icon as any}
                      width={16}
                      sx={{ color: step.done ? 'inherit' : 'text.disabled' }}
                    />
                  </TimelineDot>
                  {!isLast && (
                    <TimelineConnector
                      sx={{
                        bgcolor: step.done ? 'primary.main' : 'divider',
                        opacity: step.done ? 1 : 0.4,
                      }}
                    />
                  )}
                </TimelineSeparator>

                <TimelineContent sx={{ py: '10px', px: 1.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight={step.done ? 600 : 400}
                    color={step.done ? 'text.primary' : 'text.disabled'}
                  >
                    {step.label}
                  </Typography>
                  {step.sublabel && (
                    <Typography variant="caption" color="text.secondary">
                      {step.sublabel}
                    </Typography>
                  )}
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IMyOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailMap, setDetailMap] = useState<Record<string, IMyOrderDetails>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<IMyOrderDetails | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const canCancelOrder = (status: string) =>
    ['pending', 'payment_pending', 'failed'].includes(status.toLowerCase());

  const handleCancelOrder = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      await myOrderService.cancelOrder(orderId);
      const updated = await myOrderService.getMyOrders();
      setOrders(updated);
      if (detailMap[orderId]) {
        const detail = await myOrderService.getMyOrderDetails(orderId);
        setDetailMap((p) => ({ ...p, [orderId]: detail }));
      }
    } finally {
      setCancellingId(null);
      setConfirmCancelId(null);
    }
  };

  const handleDownloadInvoice = async (orderId: string, orderCode: string) => {
    setDownloadingId(orderId);
    try {
      await myOrderService.downloadInvoice(orderId, orderCode);
    } finally {
      setDownloadingId(null);
    }
  };

  const canDownloadInvoice = (status: string) =>
    ['shipped', 'delivered'].includes(status.toLowerCase());

  useEffect(() => {
    myOrderService
      .getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (orderId: string) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    if (!detailMap[orderId]) {
      setLoadingDetail(orderId);
      try {
        const detail = await myOrderService.getMyOrderDetails(orderId);
        setDetailMap((p) => ({ ...p, [orderId]: detail }));
      } finally {
        setLoadingDetail(null);
      }
    }
  };

  // ----------------------------------------------------------------------

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 10, textAlign: 'center', px: 2 }}>
        <Iconify icon="solar:bag-4-bold" width={72} sx={{ color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" mb={1}>
          No orders yet
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          You haven&apos;t placed any orders yet.
        </Typography>
        <Button variant="contained" onClick={() => router.push('/')}>
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '90%', md: '75%', lg: '70%' },
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Typography variant="h4" mb={3}>
        My Orders
      </Typography>

      <Stack spacing={2}>
        {orders.map((order) => {
          const isExpanded = expandedId === order.OrderId;
          const detail = detailMap[order.OrderId];
          const isLoadingThis = loadingDetail === order.OrderId;

          return (
            <Card key={order.OrderId} variant="outlined" sx={{ overflow: 'hidden' }}>
              {/* ── Summary row ── */}
              <Stack
                direction={{ md: 'row', xs: 'column' }}
                alignItems={{ md: 'center', xs: 'flex-start' }}
                justifyContent="space-between"
                spacing={1.5}
                sx={{ px: 2.5, py: 2, cursor: 'pointer' }}
                onClick={() => handleToggle(order.OrderId)}
              >
                {/* Left: order info */}
                <Stack spacing={0.5} flex={1} minWidth={0}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="subtitle1" fontWeight={700}>
                      {order.OrderCode}
                    </Typography>
                    <Chip
                      label={order.Status}
                      size="small"
                      color={STATUS_COLOR[order.Status?.toLowerCase()] ?? 'default'}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Placed on {fmt(order.OrderDate)}
                  </Typography>
                  {detail?.PaymentInfo && (
                    <Stack
                      direction={{ md: 'row', xs: 'column' }}
                      spacing={1}
                      alignItems={{ md: 'center', xs: 'flex-start' }}
                      flexWrap="wrap"
                    >
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          sx={{ display: { xs: 'block', sm: 'inline' } }}
                        >
                          Payment Info: {fmt(detail.PaymentInfo.PaymentDate)}
                        </Typography>
                        <Chip
                          label={
                            detail.PaymentInfo.PaymentStatus?.toLowerCase() === 'completed'
                              ? 'Paid'
                              : 'Pending'
                          }
                          size="small"
                          color={
                            detail.PaymentInfo.PaymentStatus?.toLowerCase() === 'completed'
                              ? 'success'
                              : 'warning'
                          }
                          sx={{ height: 18, fontSize: 10 }}
                        />
                      </Stack>
                      {detail.PaymentInfo.PaymentOrderId && (
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          sx={{ fontFamily: 'monospace', display: { xs: 'block', sm: 'inline' } }}
                        >
                          Txn: {detail.PaymentInfo.PaymentOrderId}
                        </Typography>
                      )}
                    </Stack>
                  )}
                  {detail?.ShippingDetails && (
                    <Typography variant="caption" color="text.secondary">
                      <Iconify
                        icon="eva:person-outline"
                        width={12}
                        sx={{ mr: 0.5, verticalAlign: 'middle' }}
                      />
                      {detail.ShippingDetails.CustomerName} · {detail.ShippingDetails.PhoneNumber} ·{' '}
                      {detail.ShippingDetails.AddressLine1}, {detail.ShippingDetails.City},{' '}
                      {detail.ShippingDetails.State} — {detail.ShippingDetails.PinCode}
                    </Typography>
                  )}
                </Stack>

                {/* Right: total + actions */}
                <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                    {fCurrency(order.Total)}
                  </Typography>
                  {detail && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Iconify icon="eva:cube-fill" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrackingOrder(detail);
                      }}
                      sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                    >
                      Track
                    </Button>
                  )}
                  {detail && canDownloadInvoice(order.Status) && (
                    <LoadingButton
                      size="small"
                      variant="contained"
                      loading={downloadingId === order.OrderId}
                      startIcon={<Iconify icon="eva:download-fill" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadInvoice(order.OrderId, order.OrderCode);
                      }}
                      sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                    >
                      Invoice
                    </LoadingButton>
                  )}
                  <Button
                    size="small"
                    variant="text"
                    endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/my-orders/${order.OrderId}`);
                    }}
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    Details
                  </Button>
                  {canCancelOrder(order.Status) && (
                    <LoadingButton
                      size="small"
                      variant="outlined"
                      color="error"
                      loading={cancellingId === order.OrderId}
                      startIcon={<Iconify icon="solar:close-circle-bold" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmCancelId(order.OrderId);
                      }}
                      sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                    >
                      Cancel
                    </LoadingButton>
                  )}
                  {detail && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrackingOrder(detail);
                      }}
                      sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                    >
                      <Iconify icon="eva:cube-fill" />
                    </IconButton>
                  )}
                  {detail && canDownloadInvoice(order.Status) && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadInvoice(order.OrderId, order.OrderCode);
                      }}
                      sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                    >
                      <Iconify icon="eva:download-fill" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/my-orders/${order.OrderId}`);
                    }}
                    sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                  >
                    <Iconify icon="solar:open-in-new-rounded" />
                  </IconButton>
                  {canCancelOrder(order.Status) && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmCancelId(order.OrderId);
                      }}
                      sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                    >
                      <Iconify icon="solar:close-circle-bold" />
                    </IconButton>
                  )}
                  <IconButton size="small">
                    <Iconify
                      icon={
                        isExpanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                      }
                    />
                  </IconButton>
                </Stack>
              </Stack>

              {/* ── Expanded detail ── */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider />

                {isLoadingThis ? (
                  <Stack alignItems="center" py={4}>
                    <CircularProgress size={28} />
                  </Stack>
                ) : detail ? (
                  <Box sx={{ p: { xs: 1.5, sm: 2.5 }, bgcolor: 'background.neutral' }}>
                    <Grid container spacing={2}>
                      {/* ── Items + totals ── */}
                      <Grid size={{ xs: 12 }}>
                        <Card sx={{ p: 2 }}>
                          <Typography variant="subtitle2" mb={1.5}>
                            Items ({detail.OrderedItems.length})
                          </Typography>
                          <Stack spacing={1.5}>
                            {detail.OrderedItems.map((item) => (
                              <Stack
                                key={item.Id}
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                              >
                                <Box
                                  component="img"
                                  src={item.ImageUrl ?? '/assets/placeholder.png'}
                                  alt={item.ProductName}
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    objectFit: 'contain',
                                    borderRadius: 1,
                                    flexShrink: 0,
                                  }}
                                />
                                <Box flex={1} minWidth={0}>
                                  <Typography variant="body2" fontWeight={500} noWrap>
                                    {item.ProductName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.VariantName} × {item.Quantity}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {fCurrency(item.Price)} each
                                  </Typography>
                                </Box>
                                <Typography variant="body2" fontWeight={600} sx={{ flexShrink: 0 }}>
                                  {fCurrency(item.ItemTotal)}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>

                          <Divider sx={{ my: 1.5 }} />

                          <Stack spacing={0.5}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Subtotal
                              </Typography>
                              <Typography variant="body2">
                                {fCurrency(detail.OrderInfo.SubTotal)}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                Shipping
                                {detail.OrderInfo.CourierName
                                  ? ` (${detail.OrderInfo.CourierName})`
                                  : ''}
                              </Typography>
                              <Typography variant="body2">
                                {fCurrency(detail.OrderInfo.ShippingCost)}
                              </Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="subtitle2">Total</Typography>
                              <Typography variant="subtitle2" color="primary.main">
                                {fCurrency(detail.OrderInfo.Total)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                ) : null}
              </Collapse>
            </Card>
          );
        })}
      </Stack>

      {/* ── Tracking timeline dialog ── */}
      {trackingOrder && (
        <TrackingDialog
          open={!!trackingOrder}
          onClose={() => setTrackingOrder(null)}
          info={trackingOrder.OrderInfo}
          orderCode={trackingOrder.OrderInfo.OrderCode}
        />
      )}

      {/* ── Cancel confirmation dialog ── */}
      <Dialog
        open={!!confirmCancelId}
        onClose={() => setConfirmCancelId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to cancel this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancelId(null)}>Keep Order</Button>
          <LoadingButton
            color="error"
            variant="contained"
            loading={!!cancellingId}
            onClick={() => confirmCancelId && handleCancelOrder(confirmCancelId)}
          >
            Yes, Cancel
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
