'use client';

import { Iconify } from '@/shared/components/iconify';
import { Scrollbar } from '@/shared/components/scrollbar';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

export type FiltersProps = {
  search: string;
  categoryIds: string[];
  minPrice: string;
  maxPrice: string;
};

type CategoryOption = { value: string; label: string };

type ProductFiltersProps = {
  canReset: boolean;
  openFilter: boolean;
  filters: FiltersProps;
  categoryOptions: CategoryOption[];
  onOpenFilter: () => void;
  onCloseFilter: () => void;
  onResetFilter: () => void;
  onSetFilters: (updateState: Partial<FiltersProps>) => void;
};

export function ProductFilters({
  filters,
  canReset,
  openFilter,
  categoryOptions,
  onSetFilters,
  onOpenFilter,
  onCloseFilter,
  onResetFilter,
}: ProductFiltersProps) {
  const handleCategoryToggle = (value: string) => {
    const current = filters.categoryIds;
    const next = current.includes(value)
      ? current.filter((id) => id !== value)
      : [...current, value];
    onSetFilters({ categoryIds: next });
  };

  const renderCategory = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Category</Typography>
      <Stack>
        {categoryOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            label={option.label}
            control={
              <Checkbox
                size="small"
                checked={filters.categoryIds.includes(option.value)}
                onChange={() => handleCategoryToggle(option.value)}
              />
            }
          />
        ))}
      </Stack>
    </Stack>
  );

  const renderPrice = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Price Range</Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          label="Min"
          type="number"
          value={filters.minPrice}
          onChange={(e) => onSetFilters({ minPrice: e.target.value })}
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          size="small"
          label="Max"
          type="number"
          value={filters.maxPrice}
          onChange={(e) => onSetFilters({ maxPrice: e.target.value })}
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Stack>
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpenFilter}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        slotProps={{ paper: { sx: { width: 280, overflow: 'hidden' } } }}
      >
        <Box sx={{ py: 2, pl: 2.5, pr: 1.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Filters
          </Typography>

          <IconButton onClick={onResetFilter}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>

          <IconButton onClick={onCloseFilter}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderCategory}
            {renderPrice}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2 }}>
          <Button fullWidth variant="contained" onClick={onCloseFilter}>
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
