'use client';

import { fCurrency } from '@/shared/utils';
import { useRouter } from 'next/navigation';
import { Iconify } from '@/shared/components/iconify';
import useAuth from '@/modules/auth/contexts/hooks/useAuth';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useCart } from '../contexts/CartContext';

const PLACEHOLDER_IMG = '/assets/placeholder.png';

const imgUrl = (path: string | null | undefined) => (path ? path : PLACEHOLDER_IMG);

// ----------------------------------------------------------------------

export function CartDrawer() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const router = useRouter();
  const { cart, guestItems, open, closeDrawer, updateItem, removeItem, clearCart } = useCart();

  const pendingOrderId = isLoggedIn ? cart?.PendingOrderId : undefined;

  const handleCheckout = () => {
    closeDrawer();
    router.push('/checkout');
  };

  const items = isLoggedIn
    ? (cart?.Items ?? []).map((i) => ({
        id: i.Id,
        variantId: i.VariantId,
        name: `${i.ProductName} [${i.VariantName}]`,
        price: i.EffectivePrice,
        quantity: i.Quantity,
        imageUrl: i.ImageUrl,
        stock: i.StockQuantity,
      }))
    : guestItems.map((g) => ({
        id: g.VariantId,
        variantId: g.VariantId,
        name: `${g.ProductName ?? ''} [${g.VariantName ?? ''}]`,
        price: g.EffectivePrice ?? 0,
        quantity: g.Quantity,
        imageUrl: g.ImageUrl,
        stock: g.StockQuantity ?? 99,
      }));

  const subTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleQty = (id: string, variantId: string, qty: number) => {
    updateItem(id, qty, isLoggedIn, variantId);
  };

  const handleRemove = (id: string, variantId: string) => {
    removeItem(id, isLoggedIn, variantId);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeDrawer}
      slotProps={{
        paper: {
          sx: { width: { xs: '100vw', sm: 400 }, display: 'flex', flexDirection: 'column' },
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.5, py: 2 }}
      >
        <Typography variant="h6">Cart{items.length > 0 && ` (${items.length})`}</Typography>
        <Stack direction="row" spacing={0.5}>
          {items.length > 0 && (
            <IconButton size="small" onClick={() => clearCart(isLoggedIn)} title="Clear cart">
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          )}
          <IconButton size="small" onClick={closeDrawer}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
      </Stack>

      <Divider />

      {/* Pending order banner */}
      {pendingOrderId && (
        <>
          <Alert
            severity="warning"
            sx={{ mx: 2.5, mt: 2, borderRadius: 1.5 }}
            action={
              <Button
                size="small"
                color="warning"
                variant="outlined"
                onClick={() => {
                  closeDrawer();
                  router.push(`/payment/status/${pendingOrderId}`);
                }}
              >
                View Order
              </Button>
            }
          >
            You have a pending order. Complete or cancel it before placing a new one.
          </Alert>
          <Divider sx={{ mt: 2 }} />
        </>
      )}

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2 }}>
        {items.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ height: 1, py: 10 }}>
            <Iconify icon="solar:cart-3-bold" width={64} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              Your cart is empty
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            {items.map((item) => (
              <Stack key={item.id} direction="row" spacing={2}>
                <Box
                  component="img"
                  src={imgUrl(item.imageUrl)}
                  alt={item.name}
                  sx={{
                    width: 72,
                    height: 72,
                    objectFit: 'fill',
                    borderRadius: 1.5,
                    flexShrink: 0,
                  }}
                />
                <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.5}>
                  <Typography variant="subtitle2" noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="primary.main">
                    {fCurrency(item.price)}
                  </Typography>

                  {/* Qty controls */}
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => handleQty(item.id, item.variantId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      sx={{
                        border: (t) => `1px solid ${t.palette.divider}`,
                        borderRadius: 1,
                        p: 0.25,
                      }}
                    >
                      <Iconify icon="mingcute:minus-line" width={14} />
                    </IconButton>
                    <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQty(item.id, item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      sx={{
                        border: (t) => `1px solid ${t.palette.divider}`,
                        borderRadius: 1,
                        p: 0.25,
                      }}
                    >
                      <Iconify icon="mingcute:add-line" width={14} />
                    </IconButton>
                    <Box sx={{ flex: 1 }} />
                    <Typography variant="subtitle2">
                      {fCurrency(item.price * item.quantity)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(item.id, item.variantId)}
                      sx={{ color: 'error.main' }}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>

      {/* Footer */}
      {items.length > 0 && (
        <>
          <Divider />
          <Stack spacing={2} sx={{ px: 2.5, py: 2.5 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1">Subtotal</Typography>
              <Typography variant="subtitle1" color="primary.main">
                {fCurrency(subTotal)}
              </Typography>
            </Stack>
            {isLoggedIn && !pendingOrderId ? (
              <Button variant="contained" size="large" fullWidth onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            ) : isLoggedIn && pendingOrderId ? (
              <Button
                variant="contained"
                size="large"
                fullWidth
                color="warning"
                onClick={() => {
                  closeDrawer();
                  router.push(`/payment/status/${pendingOrderId}`);
                }}
              >
                Complete Pending Order
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => {
                  closeDrawer();
                  router.push('/sign-in');
                }}
              >
                Sign In to Checkout
              </Button>
            )}
          </Stack>
        </>
      )}
    </Drawer>
  );
}
