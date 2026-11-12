'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { DashboardContent } from '@/shared/layouts/home';
import { ProductItem, ProductSort } from '@/modules/product-catalog/components';
import { catalogService } from '@/modules/product-catalog/services/catalogService';
import { idFromCategorySlug } from '@/shared/utils';
import type { ICatalogVariant } from '@/modules/product-catalog/types/productTypes';

// ----------------------------------------------------------------------

const PAGE_SIZE = 24;

type Props = {
  categoryName: string;
};

export function CategoryView({ categoryName }: Props) {
  const params = useParams<{ categorySlug: string }>();
  const categoryId = idFromCategorySlug(params?.categorySlug ?? '');

  const [products, setProducts] = useState<ICatalogVariant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    catalogService
      .getCatalog({
        CategoryIds: [categoryId],
        Page: page,
        PageSize: PAGE_SIZE,
        SortBy: sortBy,
      })
      .then((result) => {
        setProducts(result.Items);
        setTotalCount(result.TotalCount);
      })
      .catch(() => {
        setProducts([]);
        setTotalCount(0);
      })
      .finally(() => setLoading(false));
  }, [categoryId, page, sortBy]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <DashboardContent maxWidth={false}>
      {/* Compact category header */}
      <Box sx={{ mb: 2 }}>
        {/* Breadcrumbs — small, single line */}
        <Breadcrumbs sx={{ mb: 0.5, fontSize: '0.75rem' }}>
          <MuiLink
            component={NextLink}
            href="/"
            underline="hover"
            color="inherit"
            sx={{ fontSize: 'inherit' }}
          >
            Home
          </MuiLink>
          <Typography color="text.primary" sx={{ fontSize: 'inherit' }}>
            {categoryName}
          </Typography>
        </Breadcrumbs>

        {/* H1 + count + sort on one row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {categoryName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {loading ? '…' : `${totalCount} product${totalCount !== 1 ? 's' : ''}`}
            </Typography>
          </Box>

          <ProductSort
            sortBy={sortBy}
            onSort={(val) => { setPage(1); setSortBy(val); }}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'newest', label: 'Newest' },
              { value: 'priceDesc', label: 'Price: High-Low' },
              { value: 'priceAsc', label: 'Price: Low-High' },
            ]}
          />
        </Box>
      </Box>

      {/* Product grid */}
      {loading ? (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" sx={{ aspectRatio: '1/1', width: 1 }} />
          ))}
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No products in this category yet.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
          }}
        >
          {products.map((product) => (
            <ProductItem key={product.Id} product={product} />
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          color="primary"
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 8, mx: 'auto' }}
        />
      )}
    </DashboardContent>
  );
}
