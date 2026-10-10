'use client';

import { Iconify } from '@/shared/components/iconify';
import { useSearch } from '@/shared/contexts/SearchContext';

import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';

type HeaderSearchBarProps = {
  sx?: any;
  placeholder?: string;
};

export function HeaderSearchBar({ sx, placeholder = 'Search…' }: HeaderSearchBarProps) {
  const { query, setQuery, commit } = useSearch();

  return (
    <InputBase
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && commit()}
      endAdornment={
        <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={commit}>
          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
        </InputAdornment>
      }
      sx={sx}
    />
  );
}
