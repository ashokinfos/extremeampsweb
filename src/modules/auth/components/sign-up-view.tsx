'use client';

import axios from 'axios';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { Iconify } from '@/shared/components/iconify';
import { useState, useEffect, useCallback } from 'react';
import { CreateNewUser } from '@/modules/user/services/userService';
import { sendOtp, verifyOtp } from '@/modules/auth/services/otpService';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

// ----------------------------------------------------------------------

const validationSchema = Yup.object({
  firstName: Yup.string().required('Please provide first name'),
  lastName: Yup.string().required('Please provide last name'),
  email: Yup.string().email('Invalid email format'),
  phoneNumber: Yup.string()
    .required('Please provide phone number')
    .matches(/^[6-9]\d{9}$/, 'Phone number must be 10 digits and start with 6-9'),
  otp: Yup.string()
    .required('Please provide OTP')
    .matches(/^[0-9]{6}$/, 'OTP must be 6 digits'),
  password: Yup.string()
    .required('Please provide password')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .required('Please provide confirm password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  otp: '',
  password: '',
  confirmPassword: '',
};

export function SignUpView() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendOtp = useCallback(async (phoneNumber: string) => {
    try {
      const response = await sendOtp({
        Identifier: phoneNumber,
        IdentifierType: 'SMS',
        IsRegister: true,
        IsLogin: false,
      });

      if (response.Status) {
        setOtpSent(true);
        setCountdown(60);
        toast.success(response.Message);
      } else {
        toast.error(response.Message);
      }
    } catch (error: any) {
      toast.error(error.Message || 'Failed to send OTP');
    }
  }, []);

  const handlePhoneChange = useCallback((e: any, formik: any) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    formik.setFieldValue('phoneNumber', value);
  }, []);

  const handleOtpChange = useCallback((e: any, formik: any) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    formik.setFieldValue('otp', value);
  }, []);

  const handleValidateOtp = useCallback(async (phoneNumber: string, otp: string) => {
    try {
      const response = await verifyOtp({
        Identifier: phoneNumber,
        IdentifierType: 'SMS',
        Otp: otp,
      });

      if (response.Status) {
        setOtpValid(true);
        toast.success(response.Message);
      } else {
        setOtpValid(false);
        toast.error(response.Message);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;

          // Show error toast for other HTTP errors
          const errorMessage =
            data?.Message || data?.message || `Error ${status}: ${error.message}`;
          toast.error(errorMessage);
        }
      }
    }
  }, []);

  const handleSignUp = useCallback(async (values: typeof initialValues) => {
    try {
      const response = await CreateNewUser({
        FirstName: values.firstName,
        LastName: values.lastName,
        Email: values.email,
        PhoneNumber: values.phoneNumber,
        Password: values.password,
        Otp: values.otp,
      });

      if (response.Status) {
        toast.success(response.Message);
        setIsSignedUp(true);
      } else {
        toast.error(response.Message);
      }
    } catch (error: any) {
      console.error('Error registering user:', error);
      toast.error('Registration failed');
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const renderForm = (formik: any) => (
    <Form>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          name="firstName"
          label="First Name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          fullWidth
          name="lastName"
          label="Last Name"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </Box>

      <TextField
        fullWidth
        name="email"
        label="Email Address (Optional)"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          name="phoneNumber"
          label="Phone Number"
          placeholder="Provide without +91"
          disabled={otpSent}
          value={formik.values.phoneNumber}
          onChange={(e) => handlePhoneChange(e, formik)}
          onBlur={formik.handleBlur}
          error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          inputProps={{ maxLength: 10 }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        {!otpValid && (
          <Button
            variant="outlined"
            onClick={() => handleSendOtp(formik.values.phoneNumber)}
            disabled={
              !formik.values.phoneNumber || Boolean(formik.errors.phoneNumber) || countdown > 0
            }
            sx={{ minWidth: 100 }}
          >
            {countdown > 0 ? `Send OTP (${countdown} sec)` : 'Send OTP'}
          </Button>
        )}
      </Box>

      {!otpValid && otpSent && (
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            name="otp"
            label="One Time Password"
            value={formik.values.otp}
            onChange={(e) => handleOtpChange(e, formik)}
            onBlur={formik.handleBlur}
            error={formik.touched.otp && Boolean(formik.errors.otp)}
            helperText={formik.touched.otp && formik.errors.otp}
            inputProps={{ maxLength: 6 }}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <Button
            variant="outlined"
            color="success"
            onClick={() => handleValidateOtp(formik.values.phoneNumber, formik.values.otp)}
            disabled={otpValid || !formik.values.otp}
            sx={{ minWidth: 100 }}
          >
            Validate
          </Button>
        </Box>
      )}

      <TextField
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
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

      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify
                    icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      {otpValid && (
        <Button fullWidth size="large" type="submit" color="inherit" variant="contained">
          Sign up
        </Button>
      )}
    </Form>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Sign up</Typography>
        {!isSignedUp && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            Already have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} href={"/sign-in"}>
              Sign in
            </Link>
          </Typography>
        )}
      </Box>
      {isSignedUp ? (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography>
            Account created successfully. Please{' '}
            <Link href={"/sign-in"} underline="hover">
              sign in
            </Link>
          </Typography>
        </Box>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignUp}
        >
          {(formik) => renderForm(formik)}
        </Formik>
      )}
    </>
  );
}
