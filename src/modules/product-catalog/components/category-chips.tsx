'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { toCategorySlug } from '@/shared/utils';
import { catalogService } from '../services/catalogService';
import type { ICatalogCategory } from '../types/productTypes';

// ----------------------------------------------------------------------

export function CategoryChips() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<ICatalogCategory[]>([]);

  useEffect(() => {
    catalogService.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        py: 1,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/* "All" chip — active when on the homepage */}
      <Chip
        label="All"
        component={NextLink}
        href="/"
        clickable
        variant={pathname === '/' ? 'filled' : 'outlined'}
        color={pathname === '/' ? 'primary' : 'default'}
      />

      {categories.map((cat) => {
        const href = `/category/${toCategorySlug(cat.Name, cat.Id)}`;
        const isActive = pathname === href;
        return (
          <Chip
            key={cat.Id}
            label={cat.Name}
            component={NextLink}
            href={href}
            clickable
            variant={isActive ? 'filled' : 'outlined'}
            color={isActive ? 'primary' : 'default'}
          />
        );
      })}
    </Box>
  );
}
