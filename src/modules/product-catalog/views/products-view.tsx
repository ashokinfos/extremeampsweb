'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardContent } from '@/shared/layouts/home';
import { useSearch } from '@/shared/contexts/SearchContext';
import { useAppInfo } from '@/shared/contexts/AppInfoContext';
import { useSeoMeta } from '@/shared/contexts/hooks/useSeoMeta';

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import { BannerSlider } from '../components/banner-slider';
import { catalogService } from '../services/catalogService';
import { ProductItem, ProductSort, ProductFilters } from '../components';

import type { FiltersProps } from '../components';
import type { IBanner, ICatalogFilter, ICatalogVariant } from '../types/productTypes';

// ----------------------------------------------------------------------

const PAGE_SIZE = 25;

const defaultFilters: FiltersProps = {
  search: '',
  categoryIds: [],
  minPrice: '',
  maxPrice: '',
};

export default function ProductsView() {
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<ICatalogVariant[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  const { committed, setQuery, commit } = useSearch();
  const { appInfo } = useAppInfo();

  useSeoMeta({
    title: appInfo?.Name
      ? `${appInfo.Name} | Class D Amplifier Manufacturer & OEM Audio Solutions`
      : 'Class D Amplifier Manufacturer & OEM Audio Solutions India',
    description: `${appInfo?.Name ?? 'Extreme Amps'} — Class D Amplifier Manufacturer and Audio PCB Assembly in Vellore, India. Shop TPA3116D2 amplifier boards, 5.1 home theater kits, speaker protection kits, and high-efficiency audio amplifiers.`,
    keywords:
      'Class D Amplifier Manufacturer, Audio PCB Assembly India, Electronics R&D Vellore, OEM Audio Solutions, TPA3116D2 Amplifier Board, 5.1 Home Theater Remote Kit, Speaker Protection Kit Manufacturer, 14-Segment LED Display Design, High-Efficiency Audio Amplifiers, 5.1 Ch DSP Kit, HDMI CEC Audio Controller, Biquad Filter EQ Control',
    canonical: '/',
  });

  useEffect(() => {
    setPage(1);
    setFilters((prev) => ({ ...prev, search: committed }));
  }, [committed]);

  useEffect(() => {
    catalogService.getCategories().then((cats) => {
      setCategoryOptions(cats.map((c) => ({ value: c.Id, label: c.Name })));
    });
    catalogService.getBanners().then(setBanners);
  }, []);

  const fetchProducts = useCallback(
    async (currentPage: number, currentFilters: FiltersProps, currentSort: string) => {
      const filter: ICatalogFilter = {
        Search: currentFilters.search || undefined,
        CategoryIds: currentFilters.categoryIds?.length ? currentFilters.categoryIds : undefined,
        MinPrice: currentFilters.minPrice ? Number(currentFilters.minPrice) : undefined,
        MaxPrice: currentFilters.maxPrice ? Number(currentFilters.maxPrice) : undefined,
        Page: currentPage,
        PageSize: PAGE_SIZE,
      };
      console.log(filter);

      const result = await catalogService.getCatalog(filter);

      const items = [...result.Items];

      if (currentSort === 'priceAsc') items.sort((a, b) => a.SellingPrice - b.SellingPrice);
      else if (currentSort === 'priceDesc') items.sort((a, b) => b.SellingPrice - a.SellingPrice);
      else if (currentSort === 'newest') items.reverse();

      setProducts(items);
      setTotalCount(result.TotalCount);
    },
    []
  );

  useEffect(() => {
    console.log(filters);
    fetchProducts(page, filters, sortBy);
  }, [page, filters, sortBy, fetchProducts]);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((update: Partial<FiltersProps>) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...update }));
  }, []);

  const handleResetFilter = useCallback(() => {
    setPage(1);
    setQuery('');
    commit();
    setFilters(defaultFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canReset = JSON.stringify(filters) !== JSON.stringify(defaultFilters);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <DashboardContent maxWidth={false}>
      {page == 1 && <BannerSlider banners={banners} />}

      <Box
        sx={{
          mb: 5,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ gap: 1, display: 'flex' }}>
          <ProductFilters
            canReset={canReset}
            filters={filters}
            categoryOptions={categoryOptions}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={() => setOpenFilter(true)}
            onCloseFilter={() => setOpenFilter(false)}
            onResetFilter={handleResetFilter}
          />

          <ProductSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'newest', label: 'Newest' },
              { value: 'priceDesc', label: 'Price: High-Low' },
              { value: 'priceAsc', label: 'Price: Low-High' },
            ]}
          />
        </Box>
      </Box>

      {products.length === 0 ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No products found.
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
              lg: 'repeat(5, 1fr)',
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
