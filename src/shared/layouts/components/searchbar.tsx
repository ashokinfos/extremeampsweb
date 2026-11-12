'use client';

import type { BoxProps } from '@mui/material/Box';

import { useState, useCallback, useEffect } from 'react';
import { Iconify } from '@/shared/components/iconify';

import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

// ----------------------------------------------------------------------

export function Searchbar({ sx, ...other }: BoxProps) {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Cmd+K / Ctrl+K shortcut to toggle the overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen} aria-label="Open search">
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <Box
            sx={{
              top: 0,
              left: 0,
              zIndex: 99,
              width: '100%',
              display: 'flex',
              position: 'absolute',
              alignItems: 'center',
              px: { xs: 3, md: 5 },
              boxShadow: theme.shadows[8],
              height: {
                xs: 'var(--layout-header-mobile-height)',
                md: 'var(--layout-header-desktop-height)',
              },
              backdropFilter: `blur(6px)`,
              WebkitBackdropFilter: `blur(6px)`,
              backgroundColor: alpha(theme.palette.background.default, 0.8),
              ...sx,
            }}
            {...other}
          >
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search…"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ fontWeight: 'fontWeightBold' }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
                sx={{ borderRadius: 2 }}
              >
                Search
              </Button>
              <IconButton onClick={handleClose} size="small" aria-label="Close search">
                <Iconify icon="mingcute:close-line" />
              </IconButton>
            </Box>
          </Box>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
