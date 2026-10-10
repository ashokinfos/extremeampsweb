'use client';

import type { IAddressInfo, ISaveAddress } from '@/modules/user/types/userTypes';

import { toast } from 'react-toastify';
import { fCurrency } from '@/shared/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Iconify } from '@/shared/components/iconify';
import { DashboardContent } from '@/shared/layouts/home';
import { userService } from '@/modules/user/services/userService';
import { useCart } from '@/modules/product-catalog/contexts/CartContext';
import { emptyAddress, AddressFormDialog } from '@/modules/user/components/address-form-dialog';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { checkoutService } from '../services/checkoutService';

import type { IStockIssue, IShippingRate, IShippingAddress } from '../types/checkoutTypes';

// ----------------------------------------------------------------------

const STEPS = ['Shipping Address', 'Delivery Options', 'Payment'];
const PICKUP_PINCODE = '600001';

const toShippingAddress = (a: IAddressInfo | ISaveAddress): IShippingAddress => ({
  FirstName: a.FirstName,
  LastName: a.LastName,
  PhoneNumber: a.PhoneNumber,
  AddressLine1: a.AddressLine1,
  AddressLine2: a.AddressLine2,
  Taluk: a.Taluk,
  City: a.City,
  State: a.State,
  PinCode: a.PinCode,
  AddressTitle: a.AddressTitle,
});

// ----------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart } = useCart();

  const [activeStep, setActiveStep] = useState(0);
  const [address, setAddress] = useState<IShippingAddress | null>(null);

  const [savedAddresses, setSavedAddresses] = useState<IAddressInfo[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // Add new address dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // Shipping
  const [shippingRates, setShippingRates] = useState<IShippingRate[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<IShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState('');

  // Payment
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [stockErrors, setStockErrors] = useState<IStockIssue[]>([]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await userService.getAddresses();
      setSavedAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0].Id);
        setAddress(toShippingAddress(data[0]));
      }
    } catch {
      // user may have no addresses yet
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchCart();
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = cart?.Items ?? [];
  const subTotal = cart?.SubTotal ?? 0;
  const totalMetrixWeight = items.reduce((sum, i) => sum + i.MetrixWeight, 0) || 0.5;
  const totalProductWeight = items.reduce((sum, i) => sum + i.ProductWeight, 0) || 0.5;

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    const found = savedAddresses.find((a) => a.Id === id);
    if (found) setAddress(toShippingAddress(found));
  };

  const handleSaveNewAddress = async (form: ISaveAddress, saveToProfile: boolean) => {
    if (saveToProfile) {
      setSavingAddress(true);
      try {
        await userService.createAddress(form);
        toast.success('Address saved');
        await loadAddresses();
        // select the newly added address (last in list after reload)
        // will be auto-selected in loadAddresses if it's the first, otherwise select manually below
      } catch {
        toast.error('Failed to save address');
        setSavingAddress(false);
        return;
      }
      setSavingAddress(false);
    } else {
      // Use as one-time address without saving
      setAddress(toShippingAddress(form));
      setSelectedAddressId('__new__');
    }
    setAddDialogOpen(false);
  };

  const handleAddressNext = async () => {
    if (!address) {
      toast.error('Please select or add a shipping address');
      return;
    }
    setLoadingRates(true);
    setRatesError('');
    try {
      const rates = await checkoutService.getShippingRates({
        PickupPinCode: PICKUP_PINCODE,
        DeliveryPinCode: address.PinCode,
        Weight: totalMetrixWeight >= totalProductWeight ? totalMetrixWeight : totalProductWeight,
        COD: 0,
        State: address.State,
      });
      if (!rates || rates.length === 0) {
        setRatesError(
          'No shipping options available for this pincode. Please check and try again.'
        );
        return;
      }
      setShippingRates(rates);
      setSelectedCourier(rates[0]);
      setActiveStep(1);
    } catch (err: any) {
      setRatesError(
        err?.response?.data?.Message ||
          err?.message ||
          'Failed to fetch shipping rates. Please try again.'
      );
    } finally {
      setLoadingRates(false);
    }
  };

  const handleShippingNext = () => {
    if (!selectedCourier) {
      toast.error('Please select a delivery option');
      return;
    }
    setActiveStep(2);
  };

  const handleInitiatePayment = async () => {
    if (!selectedCourier || !address) return;
    setLoadingPayment(true);
    setStockErrors([]);
    try {
      const result = await checkoutService.initiateCheckout({
        ShippingAddress: address,
        SelectedCourierName: selectedCourier.CourierName,
        ShippingCost: selectedCourier.Rate,
      });
      if (!result.Status) {
        if (result.OutOfStockItems?.length) {
          setStockErrors(result.OutOfStockItems);
        } else {
          toast.error(result.Message || 'Failed to initiate payment');
        }
        return;
      }
      sessionStorage.setItem('pendingOrderId', result.MerchantOrderId);
      window.location.href = result.PaymentUrl;
    } catch {
      toast.error('Payment initiation failed. Please try again.');
    } finally {
      setLoadingPayment(false);
    }
  };

  const orderTotal = subTotal + (selectedCourier?.Rate ?? 0);

  // ── Step 1: Address ───────────────────────────────────────────────────
  const renderAddressStep = () => (
    <Stack spacing={2.5}>
      {loadingAddresses ? (
        <Stack alignItems="center" py={3}>
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <>
          {savedAddresses.length > 0 && (
            <RadioGroup
              value={selectedAddressId}
              onChange={(e) => handleSelectAddress(e.target.value)}
            >
              <Stack spacing={1.5}>
                {savedAddresses.map((a) => (
                  <Box
                    key={a.Id}
                    onClick={() => handleSelectAddress(a.Id)}
                    sx={{
                      p: 2,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      border: (t) =>
                        `2px solid ${selectedAddressId === a.Id ? t.palette.primary.main : t.palette.divider}`,
                      bgcolor: selectedAddressId === a.Id ? 'primary.lighter' : 'background.paper',
                      transition: 'all 0.2s',
                    }}
                  >
                    <FormControlLabel
                      value={a.Id}
                      control={<Radio size="small" />}
                      label=""
                      sx={{ m: 0, position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    />
                    <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                      <Radio
                        size="small"
                        checked={selectedAddressId === a.Id}
                        onChange={() => handleSelectAddress(a.Id)}
                        sx={{ mt: -0.5, flexShrink: 0 }}
                      />
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.25}>
                          <Typography variant="subtitle2">{a.AddressTitle || 'Address'}</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={500}>
                          {a.FirstName} {a.LastName}
                          {a.PhoneNumber && (
                            <Typography component="span" variant="body2" color="text.secondary">
                              {' '}
                              · {a.PhoneNumber}
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {a.AddressLine1}
                          {a.AddressLine2 ? `, ${a.AddressLine2}` : ''}
                          {a.Taluk ? `, ${a.Taluk}` : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {a.City}, {a.State} — {a.PinCode}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}

                {/* One-time new address tile (shown after user fills form without saving) */}
                {selectedAddressId === '__new__' && address && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1.5,
                      border: (t) => `2px solid ${t.palette.primary.main}`,
                      bgcolor: 'primary.lighter',
                    }}
                  >
                    <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                      <Radio size="small" checked sx={{ mt: -0.5, flexShrink: 0 }} />
                      <Box>
                        <Typography variant="subtitle2" mb={0.25}>
                          New Address
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {address.FirstName} {address.LastName}
                          {address.PhoneNumber && (
                            <Typography component="span" variant="body2" color="text.secondary">
                              {' '}
                              · {address.PhoneNumber}
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.AddressLine1}
                          {address.AddressLine2 ? `, ${address.AddressLine2}` : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.City}, {address.State} — {address.PinCode}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </RadioGroup>
          )}

          {savedAddresses.length === 0 && !address && (
            <Alert severity="info">You have no saved addresses. Add one below to continue.</Alert>
          )}

          <Button
            variant="outlined"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setAddDialogOpen(true)}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add New Address
          </Button>
        </>
      )}

      {ratesError && <Alert severity="error">{ratesError}</Alert>}

      <Button
        variant="contained"
        size="large"
        onClick={handleAddressNext}
        disabled={loadingRates || !address}
        endIcon={
          loadingRates ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <Iconify icon="eva:arrow-ios-forward-fill" />
          )
        }
      >
        {loadingRates ? 'Fetching Shipping Rates...' : 'Continue to Delivery'}
      </Button>
    </Stack>
  );

  // ── Step 2: Shipping ──────────────────────────────────────────────────
  const renderShippingOptions = () => (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Delivering to: {address?.AddressLine1}, {address?.City} - {address?.PinCode}
      </Typography>
      <Stack spacing={1.5}>
        {shippingRates.map((rate) => (
          <Box
            key={rate.CourierCompanyId}
            onClick={() => setSelectedCourier(rate)}
            sx={{
              p: 2,
              borderRadius: 1.5,
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: (t) =>
                `2px solid ${selectedCourier?.CourierName === rate.CourierName ? t.palette.primary.main : t.palette.divider}`,
              bgcolor:
                selectedCourier?.CourierName === rate.CourierName
                  ? 'primary.lighter'
                  : 'background.paper',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack spacing={0.25}>
                <Typography variant="subtitle2">{rate.CourierName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Est. {rate.EstimatedDays} day{rate.EstimatedDays !== 1 ? 's' : ''} delivery
                  {/* {rate.IsCODAvailable ? ' · COD available' : ''} */}
                </Typography>
              </Stack>
              <Typography variant="subtitle1" color="primary.main" fontWeight={700}>
                {fCurrency(rate.Rate)}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
      <Stack direction="row" spacing={1.5}>
        <Button
          variant="outlined"
          onClick={() => setActiveStep(0)}
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleShippingNext}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          Continue to Payment
        </Button>
      </Stack>
    </Stack>
  );

  // ── Step 3: Payment ───────────────────────────────────────────────────
  const renderPaymentStep = () => (
    <Stack spacing={2.5}>
      {stockErrors.length > 0 && (
        <Alert severity="error">
          <Typography variant="body2" fontWeight={600} mb={0.5}>
            Some items are out of stock:
          </Typography>
          {stockErrors.map((s) => (
            <Typography key={s.VariantName} variant="body2">
              • {s.VariantName} — requested {s.Requested}, available {s.Available}
            </Typography>
          ))}
        </Alert>
      )}
      <Alert severity="info">
        You will be redirected to PhonePe to complete your payment securely.
      </Alert>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" mb={1.5}>
          Order Summary
        </Typography>
        <Stack spacing={0.75}>
          {items.map((item) => (
            <Stack key={item.Id} direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 220 }}>
                {item.ProductName} [{item.VariantName}] × {item.Quantity}
              </Typography>
              <Typography variant="body2">{fCurrency(item.ItemTotal)}</Typography>
            </Stack>
          ))}
          <Divider sx={{ my: 0.5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">{fCurrency(subTotal)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Shipping ({selectedCourier?.CourierName})</Typography>
            <Typography variant="body2">{fCurrency(selectedCourier?.Rate ?? 0)}</Typography>
          </Stack>
          <Divider sx={{ my: 0.5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight={700}>
              Total
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="primary.main">
              {fCurrency(orderTotal)}
            </Typography>
          </Stack>
        </Stack>
      </Card>
      {address && (
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" mb={1}>
            Delivering to
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {address.FirstName} {address.LastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {address.PhoneNumber}
          </Typography>
          <Typography variant="body2">
            {address.AddressLine1}
            {address.AddressLine2 ? `, ${address.AddressLine2}` : ''}
          </Typography>
          <Typography variant="body2">
            {address.City}, {address.State} - {address.PinCode}
          </Typography>
        </Card>
      )}
      <Stack direction="row" spacing={1.5}>
        <Button
          variant="outlined"
          onClick={() => setActiveStep(1)}
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          fullWidth
          color="primary"
          onClick={handleInitiatePayment}
          disabled={loadingPayment}
          startIcon={
            loadingPayment ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Iconify icon="solar:lock-password-bold" />
            )
          }
        >
          {loadingPayment ? 'Redirecting...' : `Pay ${fCurrency(orderTotal)}`}
        </Button>
      </Stack>
    </Stack>
  );

  // ── Empty cart guard ──────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 10, textAlign: 'center', px: 2 }}>
        <Iconify icon="solar:cart-3-bold" width={72} sx={{ color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" mb={1}>
          Your cart is empty
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Add some products before checking out.
        </Typography>
        <Button variant="contained" onClick={() => router.push('/')}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <DashboardContent>
      <Typography variant="h4" mb={4}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2.5}>
              {STEPS[activeStep]}
            </Typography>
            {activeStep === 0 && renderAddressStep()}
            {activeStep === 1 && renderShippingOptions()}
            {activeStep === 2 && renderPaymentStep()}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="h6" mb={2}>
              Cart ({items.length} item{items.length !== 1 ? 's' : ''})
            </Typography>
            <Stack spacing={1.5}>
              {items.map((item) => (
                <Stack key={item.Id} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    component="img"
                    src={item.ImageUrl ? item.ImageUrl : '/assets/placeholder.png'}
                    alt={item.ProductName}
                    sx={{
                      width: 52,
                      height: 52,
                      objectFit: 'fill',
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box flex={1} minWidth={0}>
                    <Typography variant="body2" noWrap fontWeight={500}>
                      {item.ProductName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.VariantName} × {item.Quantity}
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                      {item.MetrixWeight} kg
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {fCurrency(item.ItemTotal)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2">{fCurrency(subTotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography variant="body2">
                  {selectedCourier ? fCurrency(selectedCourier.Rate) : '—'}
                </Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                  {fCurrency(orderTotal)}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <AddressFormDialogWithSaveOption
        open={addDialogOpen}
        saving={savingAddress}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleSaveNewAddress}
      />
    </DashboardContent>
  );
}

// ── Wrapper that adds "Save to my addresses" checkbox ─────────────────

interface AddressDialogProps {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (form: ISaveAddress, saveToProfile: boolean) => void;
}

function AddressFormDialogWithSaveOption({ open, saving, onClose, onSave }: AddressDialogProps) {
  const [saveToProfile, setSaveToProfile] = useState(true);

  useEffect(() => {
    if (open) setSaveToProfile(true);
  }, [open]);

  const handleSave = (form: ISaveAddress) => {
    onSave(form, saveToProfile);
  };

  return (
    <AddressFormDialog
      open={open}
      title="Add New Address"
      initialValues={emptyAddress}
      saving={saving}
      onClose={onClose}
      onSave={handleSave}
      extraContent={
        <FormControlLabel
          control={
            <input
              type="checkbox"
              checked={saveToProfile}
              onChange={(e) => setSaveToProfile(e.target.checked)}
              style={{ marginRight: 8 }}
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              Save this address to my profile
            </Typography>
          }
          sx={{ mt: 1, ml: 0 }}
        />
      }
    />
  );
}
