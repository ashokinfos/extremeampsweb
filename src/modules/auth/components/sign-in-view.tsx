'use client';

import type { IApiToken } from '@/shared/types/CommonTypes';

import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useRouter } from '@/core/routes/hooks';
import ApiService from '@/shared/services/apiService';
import { Iconify } from '@/shared/components/iconify';
import { useState, useEffect, useCallback } from 'react';
import useAuth from '@/modules/auth/contexts/hooks/useAuth';
import { sendOtp, verifyOtp } from '@/modules/auth/services/otpService';
import { useCart } from '@/modules/product-catalog/contexts/CartContext';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

// ----------------------------------------------------------------------

const passwordSchema = Yup.object().shape({
  PhoneNumber: Yup.string()
    .required('Please provide phone number')
    .matches(/^[6-9]\d{9}$/, 'Phone number must be 10 digits and start with 6-9'),
  Password: Yup.string()
    .required('Please provide password')
    .min(8, 'Password must be at least 8 characters'),
  LoginType: Yup.string(),
});

const otpSchema = Yup.object().shape({
  PhoneNumber: Yup.string()
    .required('Please provide phone number')
    .matches(/^[6-9]\d{9}$/, 'Phone number must be 10 digits and start with 6-9'),
  OTP: Yup.string().required('Please provide OTP').length(6, 'OTP must be 6 digits'),
  LoginType: Yup.string(),
});

const passwordInitialValues = {
  PhoneNumber: '',
  Password: '',
  LoginType: 'Password',
};

const otpInitialValues = {
  PhoneNumber: '',
  OTP: '',
  LoginType: 'OTP',
};

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState(0); // 0 for password, 1 for OTP
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const from = '/';

  const handlePhoneChange = useCallback((e: any, formik: any) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    formik.setFieldValue('PhoneNumber', value);
  }, []);

  const { user, login } = useAuth();
  const { mergeAndLoad } = useCart();

  useEffect(() => {
    if (user) {
      router.push(from);
    } else {
      const accessToken = localStorage.getItem('EcomAccessToken');
      const refreshToken = localStorage.getItem('EcomRefreshToken');
      if (accessToken && refreshToken) login(accessToken, refreshToken);
    }
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const passwordFormik = useFormik({
    initialValues: passwordInitialValues,
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      try {
        const response = await ApiService.post<IApiToken>('Auth/login', values);
        if (response.IsSucceed) {
          localStorage.setItem('EcomAccessToken', response.AccessToken);
          localStorage.setItem('EcomRefreshToken', response.RefreshToken);
          login(response.AccessToken, response.RefreshToken);
          await mergeAndLoad();
          router.push('/');
        } else {
          toast.error(response.Message);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.data) {
            toast.error(err.response.data.Message);
          } else {
            toast.error(err.message);
          }
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          console.error('Unknown error:', err);
          toast.error('An unexpected error occurred');
        }
      }
    },
  });

  const otpFormik = useFormik({
    initialValues: otpInitialValues,
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      try {
        const VerifyOtp = await verifyOtp({
          Identifier: values.PhoneNumber,
          IdentifierType: 'SMS',
          Otp: values.OTP,
        });

        if (!VerifyOtp.Status) {
          toast.error(VerifyOtp.Message);
          return;
        }

        const response = await ApiService.post<IApiToken>('Auth/login', values);
        if (response.IsSucceed) {
          localStorage.setItem('EcomAccessToken', response.AccessToken);
          localStorage.setItem('EcomRefreshToken', response.RefreshToken);
          login(response.AccessToken, response.RefreshToken);
          await mergeAndLoad();
          router.push('/');
        } else {
          toast.error(response.Message);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.data) {
            toast.error(err.response.data.Message);
          } else {
            toast.error(err.message);
          }
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          console.error('Unknown error:', err);
          toast.error('An unexpected error occurred');
        }
      }
    },
  });

  const handleSendOTP = async () => {
    if (!otpFormik.values.PhoneNumber || otpFormik.errors.PhoneNumber) {
      otpFormik.setFieldTouched('PhoneNumber', true);
      return;
    }

    try {
      const response = await sendOtp({
        Identifier: otpFormik.values.PhoneNumber ?? '',
        IdentifierType: 'SMS',
        IsRegister: false,
        IsLogin: true,
      });
      if (response.Status) {
        setOtpSent(true);
        setCountdown(60);
        toast.success('OTP sent successfully');
      } else {
        toast.error(response.Message);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.Message || err.message);
      } else {
        toast.error('Failed to send OTP');
      }
    }
  };

  const renderPasswordForm = (
    <Box
      component="form"
      onSubmit={passwordFormik.handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="PhoneNumber"
        label="Phone Number"
        placeholder="Provide without +91"
        value={passwordFormik.values.PhoneNumber}
        onChange={(e) => handlePhoneChange(e, passwordFormik)}
        onBlur={passwordFormik.handleBlur}
        error={passwordFormik.touched.PhoneNumber && Boolean(passwordFormik.errors.PhoneNumber)}
        helperText={passwordFormik.touched.PhoneNumber && passwordFormik.errors.PhoneNumber}
        inputProps={{ maxLength: 10 }}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      {/* <Link
        variant="body2"
        color="inherit"
        sx={{ mb: 1.5, alignSelf: 'flex-end', display: 'block' }}
      >
        Forgot password?
      </Link> */}

      <TextField
        fullWidth
        name="Password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={passwordFormik.values.Password}
        onChange={passwordFormik.handleChange}
        onBlur={passwordFormik.handleBlur}
        error={passwordFormik.touched.Password && Boolean(passwordFormik.errors.Password)}
        helperText={passwordFormik.touched.Password && passwordFormik.errors.Password}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Button fullWidth size="large" type="submit" color="inherit" variant="contained">
        Sign in
      </Button>
    </Box>
  );

  const renderOTPForm = (
    <Box
      component="form"
      onSubmit={otpFormik.handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="PhoneNumber"
        label="Phone Number"
        placeholder="Provide without +91"
        value={otpFormik.values.PhoneNumber}
        onChange={(e) => handlePhoneChange(e, otpFormik)}
        onBlur={otpFormik.handleBlur}
        error={otpFormik.touched.PhoneNumber && Boolean(otpFormik.errors.PhoneNumber)}
        helperText={otpFormik.touched.PhoneNumber && otpFormik.errors.PhoneNumber}
        inputProps={{ maxLength: 10 }}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Button
        fullWidth
        size="large"
        variant="outlined"
        onClick={handleSendOTP}
        disabled={countdown > 0}
        sx={{ mb: 3 }}
      >
        {countdown > 0 ? `Resend OTP in ${countdown}s` : otpSent ? 'Resend OTP' : 'Send OTP'}
      </Button>

      {otpSent && (
        <TextField
          fullWidth
          name="OTP"
          label="Enter OTP"
          placeholder="6-digit OTP"
          value={otpFormik.values.OTP}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            otpFormik.setFieldValue('OTP', value);
          }}
          onBlur={otpFormik.handleBlur}
          error={otpFormik.touched.OTP && Boolean(otpFormik.errors.OTP)}
          helperText={otpFormik.touched.OTP && otpFormik.errors.OTP}
          inputProps={{ maxLength: 6 }}
          sx={{ mb: 3 }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      )}

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={!otpSent}
      >
        Verify & Sign in
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">Sign in</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Don&apos;t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} href="/sign-up">
            Get started
          </Link>
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={loginType}
          onChange={(_, newValue) => setLoginType(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'text.primary',
            },
          }}
        >
          <Tab label="Password" />
          <Tab label="OTP" />
        </Tabs>
      </Box>

      {loginType === 0 ? renderPasswordForm : renderOTPForm}
    </>
  );
}
