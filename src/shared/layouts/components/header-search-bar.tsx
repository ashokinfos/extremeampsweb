'use client';

import { useRef, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Iconify } from '@/shared/components/iconify';
import { useSearch } from '@/shared/contexts/SearchContext';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';

type HeaderSearchBarProps = {
  sx?: any;
  placeholder?: string;
};

export function HeaderSearchBar({ sx, placeholder = 'Search…' }: HeaderSearchBarProps) {
  const { query, setQuery, commit } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <InputBase
      inputRef={inputRef}
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && commit()}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      startAdornment={
        <InputAdornment position="start" sx={{ cursor: 'pointer' }} onClick={commit}>
          <Iconify
            icon="eva:search-fill"
            sx={{ color: focused ? 'primary.main' : 'text.disabled', transition: 'color 0.2s' }}
          />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          {query ? (
            <IconButton size="small" onClick={handleClear} edge="end" aria-label="Clear search">
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          ) : (
            <Box
              component="span"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                px: 0.75,
                py: 0.25,
                borderRadius: 0.75,
                border: '1px solid',
                borderColor: 'divider',
                fontSize: '0.65rem',
                fontFamily: 'monospace',
                color: 'text.disabled',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {isMac ? '⌘K' : 'Ctrl K'}
            </Box>
          )}
        </InputAdornment>
      }
      sx={[
        ...(Array.isArray(sx) ? sx : [sx]),
        {
          transition: 'box-shadow 0.2s, border-color 0.2s',
          ...(focused && {
            borderColor: (t: any) => t.palette.primary.main,
            boxShadow: (t: any) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.15)}`,
          }),
        },
      ]}
    />
  );
}
