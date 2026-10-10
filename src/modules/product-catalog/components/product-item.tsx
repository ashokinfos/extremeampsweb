'use client';

import { toProductSlug } from '@/shared/utils';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import type { ICatalogVariant } from '../types/productTypes';

// ----------------------------------------------------------------------

const PLACEHOLDER_IMG = '/assets/placeholder.png';

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// ----------------------------------------------------------------------

export function ProductItem({ product }: { product: ICatalogVariant }) {
  const router = useRouter();
  const hasDiscount = product.DiscountedPrice > 0 && product.DiscountedPrice < product.SellingPrice;
  const effectivePrice = hasDiscount ? product.DiscountedPrice : product.SellingPrice;
  const productUrl = `/product/${toProductSlug(product.ProductName, product.Id)}`;

  const handleNavigate = () => router.push(productUrl);

  return (
    <Card sx={{ position: 'relative', borderRadius: 1, '&:hover': { boxShadow: 5 } }}>
      {/* Out of Stock badge — absolutely positioned over the card */}
      {!product.InStock && (
        <Chip
          label="Out of Stock"
          color="error"
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        />
      )}

      {/* Product image — padded, centered, fixed height (matches legacy style) */}
      <Box
        sx={{
          p: 1,
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={handleNavigate}
      >
        <Box
          component="img"
          alt={product.ProductName}
          src={
            product.ImageUrl
              ? `${product.ImageUrl}?w=164&h=164&fit=crop&auto=format`
              : PLACEHOLDER_IMG
          }
          sx={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>

      <CardContent>
        {/* Product name — 2-line clamp, clickable */}
        <Typography
          gutterBottom
          variant="subtitle1"
          component="div"
          onClick={handleNavigate}
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            minHeight: '3em',
            lineHeight: 1.5,
            cursor: 'pointer',
          }}
        >
          {product.ProductName}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* Price with Incl. GST — matches legacy CurrencyFormatter */}
          <Typography variant="body1" color="primary.main">
            {hasDiscount && (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
              >
                {formatINR(product.SellingPrice)}
              </Typography>
            )}
            {formatINR(effectivePrice)}&nbsp;
            <Typography
              component="span"
              variant="caption"
              sx={{ fontSize: 'smaller', color: 'primary.main' }}
            >
              (Incl. GST)
            </Typography>
          </Typography>

          <IconButton
            component={NextLink}
            color="primary"
            size="small"
            href={productUrl}
            aria-label="View Product"
          >
            <OpenInNewIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
