import * as Yup from 'yup';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';

import { locationService } from '../services/locationService';

import type { ISaveAddress } from '../types/userTypes';
import type { ICity, IState } from '../types/locationTypes';

// ----------------------------------------------------------------------

export const emptyAddress: ISaveAddress = {
  AddressTitle: '',
  FirstName: '',
  LastName: '',
  PhoneNumber: '',
  AddressLine1: '',
  AddressLine2: '',
  Taluk: '',
  City: '',
  State: '',
  PinCode: '',
};

interface Props {
  open: boolean;
  title: string;
  initialValues: ISaveAddress;
  saving: boolean;
  onClose: () => void;
  onSave: (form: ISaveAddress) => void;
  extraContent?: React.ReactNode;
}

// ----------------------------------------------------------------------

const addressSchema = Yup.object().shape({
  FirstName: Yup.string().required('First Name is required'),
  LastName: Yup.string().required('Last Name is required'),
  PhoneNumber: Yup.string()
    .required('Mobile Number is required')
    .matches(/^[6-9]\d{9}$/, 'Phone number must be 10 digits and start with 6-9'),
  AddressTitle: Yup.string().required('Address Title is required'),
  AddressLine1: Yup.string().required('Address Line 1 is required'),
  AddressLine2: Yup.string(),
  Taluk: Yup.string().required('Taluk is required'),
  City: Yup.string().required('City is required'),
  State: Yup.string().required('State is required'),
  PinCode: Yup.string()
    .required('Pin Code is required')
    .matches(/^[0-9]{6}$/, 'Pin Code must be 6 digits')
    .test('is-valid-pincode', 'Invalid Pin Code', async (value) => {
      if (!value) return false;
      try {
        const response = await locationService.validatePincode(value);
        return response.IsValid;
      } catch (error) {
        console.error('Error validating Pin Code:', error);
        return false;
      }
    }),
});

// ----------------------------------------------------------------------

export function AddressFormDialog({
  open,
  title,
  initialValues,
  saving,
  onClose,
  onSave,
  extraContent,
}: Props) {
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | ''>('');
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [pincodeValidation, setPincodeValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
    validatedData?: {
      city?: string;
      state?: string;
      district?: string;
    };
  }>({
    isValidating: false,
    isValid: null,
    message: '',
  });

  const formik = useFormik<ISaveAddress>({
    initialValues,
    enableReinitialize: true,
    validationSchema: addressSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  // Reset pincode validation state when dialog opens
  useEffect(() => {
    if (open) {
      setCities([]);
      setSelectedStateId('');
    }
  }, [open, initialValues]);

  // Load states once on mount
  useEffect(() => {
    setLoadingStates(true);
    locationService
      .getStates()
      .then(setStates)
      .finally(() => setLoadingStates(false));
  }, []);

  // When editing, pre-select the matching state and load its cities
  useEffect(() => {
    if (!open || !initialValues.State || states.length === 0) return;
    const matched = states.find((s) => s.Name === initialValues.State);
    if (matched) {
      setSelectedStateId(matched.Id);
      setLoadingCities(true);
      locationService
        .getCities(matched.Id)
        .then(setCities)
        .finally(() => setLoadingCities(false));
    }
  }, [open, initialValues.State, states]);

  const handleStateChange = (stateId: number) => {
    const stateName = states.find((s) => s.Id === stateId)?.Name ?? '';
    setSelectedStateId(stateId);
    formik.setFieldValue('State', stateName);
    formik.setFieldValue('City', '');
    setCities([]);
    setLoadingCities(true);
    locationService
      .getCities(stateId)
      .then(setCities)
      .finally(() => setLoadingCities(false));
  };

  const validatePincode = async (pincode: string) => {
    if (!pincode || pincode.length !== 6) {
      setPincodeValidation({
        isValidating: false,
        isValid: null,
        message: '',
      });
      return;
    }

    setPincodeValidation({
      isValidating: true,
      isValid: null,
      message: 'Validating pincode...',
    });

    try {
      const response = await locationService.validatePincode(pincode);

      setPincodeValidation({
        isValidating: false,
        isValid: response.IsValid,
        message: response.Message,
        validatedData: response.IsValid
          ? {
              city: response.City,
              state: response.State,
              district: response.District,
            }
          : undefined,
      });

      // Auto-fill state and city if validation is successful
      if (response.IsValid && response.State && response.City) {
        const matchedState = states.find(
          (s) => s.Name.replace(/\s/g, '').toLowerCase() === response.State!.replace(/\s/g, '').toLowerCase()
        );
        if (matchedState) {
          setSelectedStateId(matchedState.Id);
          setLoadingCities(true);
          locationService
            .getCities(matchedState.Id)
            .then(setCities)
            .finally(() => setLoadingCities(false));
          formik.setFieldValue('State', matchedState.Name);
          formik.setFieldValue('City', response.City);
        } else {
          setSelectedStateId('');
          setCities([]);
          formik.setFieldValue('State', '');
          formik.setFieldValue('City', '');
        }
      } else {
        setSelectedStateId('');
        setCities([]);
        formik.setFieldValue('State', '');
        formik.setFieldValue('City', '');
      }
    } catch {
      setPincodeValidation({
        isValidating: false,
        isValid: false,
        message: 'Error validating pincode',
      });
      formik.setFieldValue('State', '');
      formik.setFieldValue('City', '');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="AddressTitle"
              label="Address Title"
              size="small"
              value={formik.values.AddressTitle}
              onChange={formik.handleChange}
              placeholder="Home, Office, etc."
              error={formik.touched.AddressTitle && Boolean(formik.errors.AddressTitle)}
              helperText={formik.touched.AddressTitle && formik.errors.AddressTitle}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="FirstName"
              label="First Name"
              size="small"
              value={formik.values.FirstName}
              onChange={formik.handleChange}
              error={formik.touched.FirstName && Boolean(formik.errors.FirstName)}
              helperText={formik.touched.FirstName && formik.errors.FirstName}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="LastName"
              label="Last Name"
              size="small"
              value={formik.values.LastName}
              onChange={formik.handleChange}
              error={formik.touched.LastName && Boolean(formik.errors.LastName)}
              helperText={formik.touched.LastName && formik.errors.LastName}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="PhoneNumber"
              label="Phone Number"
              size="small"
              value={formik.values.PhoneNumber}
              placeholder="Provide without +91"
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value)) {
                  formik.handleChange(e);
                }
              }}
              inputProps={{ maxLength: 10 }}
              error={formik.touched.PhoneNumber && Boolean(formik.errors.PhoneNumber)}
              helperText={formik.touched.PhoneNumber && formik.errors.PhoneNumber}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="AddressLine1"
              label="Address Line 1"
              size="small"
              value={formik.values.AddressLine1}
              onChange={formik.handleChange}
              error={formik.touched.AddressLine1 && Boolean(formik.errors.AddressLine1)}
              helperText={formik.touched.AddressLine1 && formik.errors.AddressLine1}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="AddressLine2"
              label="Address Line 2"
              size="small"
              value={formik.values.AddressLine2}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="Taluk"
              label="Taluk"
              size="small"
              value={formik.values.Taluk}
              onChange={formik.handleChange}
              error={formik.touched.Taluk && Boolean(formik.errors.Taluk)}
              helperText={formik.touched.Taluk && formik.errors.Taluk}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                name="PinCode"
                label="Pin Code"
                size="small"
                value={formik.values.PinCode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[0-9]*$/.test(value)) {
                    formik.handleChange(e);
                    // Validate pincode when user types
                    if (value.length === 6) {
                      validatePincode(value);
                    } else {
                      setPincodeValidation({
                        isValidating: false,
                        isValid: null,
                        message: '',
                      });
                    }
                  }
                }}
                error={
                  (formik.touched.PinCode && Boolean(formik.errors.PinCode)) ||
                  pincodeValidation.isValid === false
                }
                helperText={
                  formik.touched.PinCode && formik.errors.PinCode
                    ? formik.errors.PinCode
                    : pincodeValidation.message
                }
                inputProps={{
                  maxLength: 6,
                }}
                InputProps={{
                  endAdornment: (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {pincodeValidation.isValidating && <CircularProgress size={16} />}
                      {pincodeValidation.isValid === true && (
                        <Box
                          component="span"
                          sx={{ color: 'success.main', fontSize: 18, lineHeight: 1 }}
                        >
                          ✓
                        </Box>
                      )}
                      {pincodeValidation.isValid === false && (
                        <Box
                          component="span"
                          sx={{ color: 'error.main', fontSize: 18, lineHeight: 1 }}
                        >
                          ✗
                        </Box>
                      )}
                    </Box>
                  ),
                }}
              />
            </Box>
          </Grid>

          {/* State dropdown */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl
              fullWidth
              size="small"
              error={formik.touched.State && !!formik.errors.State}
            >
              <InputLabel>State *</InputLabel>
              <Select
                label="State *"
                value={selectedStateId}
                onChange={(e) => handleStateChange(e.target.value as number)}
                onBlur={() => formik.setFieldTouched('State', true)}
                disabled={loadingStates}
                startAdornment={
                  loadingStates ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null
                }
              >
                {states.map((s) => (
                  <MenuItem key={s.Id} value={s.Id}>
                    {s.Name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.State && formik.errors.State && (
                <FormHelperText>{formik.errors.State}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* City dropdown */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl
              fullWidth
              size="small"
              error={formik.touched.City && !!formik.errors.City}
              disabled={!selectedStateId || loadingCities}
            >
              <InputLabel>City *</InputLabel>
              <Select
                label="City *"
                value={formik.values.City}
                onChange={(e) => formik.setFieldValue('City', e.target.value)}
                onBlur={() => formik.setFieldTouched('City', true)}
                startAdornment={
                  loadingCities ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null
                }
              >
                {cities.map((c) => (
                  <MenuItem key={c.Id} value={c.Name}>
                    {c.Name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.City && formik.errors.City && (
                <FormHelperText>{formik.errors.City}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
        {extraContent && <Box sx={{ mt: 1 }}>{extraContent}</Box>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => formik.handleSubmit()} disabled={saving}>
          {saving ? 'Saving...' : title.startsWith('Edit') ? 'Update Address' : 'Save Address'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
