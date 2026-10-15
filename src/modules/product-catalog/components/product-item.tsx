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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import type { ICatalogVariant } from '../types/productTypes';

// ----------------------------------------------------------------------

const PLACEHOLDER_IMG = '/assets/placeholder.png';

// Fixed height of the info section so cards in the same row align perfectly.
// 2 lines of name (1.43 * 13px * 2 ≈ 37px) + price row (24px) + padding (24px)
const INFO_HEIGHT = 88;

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
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0.5,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Out of Stock badge */}
      {!product.InStock && (
        <Chip
          label="Out of Stock"
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 700,
          }}
        />
      )}

      {/* Square image area — paddingTop: '100%' locks width === height */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          bgcolor: 'grey.50',
          cursor: 'pointer',
          overflow: 'hidden',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        onClick={handleNavigate}
      >
        <Box
          component="img"
          alt={product.ProductName}
          src={
            product.ImageUrl
              ? `${product.ImageUrl}?w=300&h=300&fit=crop&auto=format`
              : PLACEHOLDER_IMG
          }
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            p: 1.5,
          }}
        />
      </Box>

      {/* Info section — fixed height keeps all cards in a row aligned */}
      <Box
        sx={{
          height: INFO_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          px: 1.5,
          pt: 1,
          pb: 1.25,
        }}
      >
        {/* Product name — 2-line clamp */}
        <Typography
          variant="body2"
          component="div"
          onClick={handleNavigate}
          title={product.ProductName}
          sx={{
            fontWeight: 500,
            fontSize: '0.78rem',
            lineHeight: 1.45,
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            color: 'text.primary',
          }}
        >
          {product.ProductName}
        </Typography>

        {/* Price row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
          <Box>
            {hasDiscount && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                  display: 'block',
                  lineHeight: 1,
                  mb: 0.25,
                }}
              >
                {formatINR(product.SellingPrice)}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1 }}
            >
              {formatINR(effectivePrice)}{' '}
              <Typography
                component="span"
                sx={{ fontSize: '0.65rem', fontWeight: 400, color: 'text.secondary' }}
              >
                incl. GST
              </Typography>
            </Typography>
          </Box>

          <IconButton
            component={NextLink}
            color="primary"
            size="small"
            href={productUrl}
            aria-label="View Product"
            sx={{ p: 0.5, ml: 0.5 }}
          >
            <OpenInNewIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  );
}
