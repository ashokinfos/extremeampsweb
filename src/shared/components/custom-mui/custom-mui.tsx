'use client';

import React from 'react';

import { Box, CircularProgress } from '@mui/material';

import { useLoader } from '../../contexts/hooks/useLoader';

function Loader() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        width: '100%',
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
}

export const LoaderOverlay = () => {
  const { isLoading } = useLoader();

  return isLoading ? (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000, // higher than other elements
      }}
    >
      <Loader />
    </Box>
  ) : null;
};
