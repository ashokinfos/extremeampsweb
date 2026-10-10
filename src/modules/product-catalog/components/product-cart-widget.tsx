'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

type CartIconProps = IconButtonProps & {
  totalItems: number;
};

export function CartIcon({ totalItems, onClick, sx, ...other }: CartIconProps) {
  return (
    <IconButton
      onClick={onClick}
      color="inherit"
      aria-label="cart"
      sx={[{ p: 1 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Badge badgeContent={totalItems} color="error" max={99}>
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
}
