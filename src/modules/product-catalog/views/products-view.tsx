'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DashboardContent } from '@/shared/layouts/home';
import { useSearch } from '@/shared/contexts/SearchContext';

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import { BannerSlider } from '../components/banner-slider';
import { catalogService } from '../services/catalogService';
import { ProductItem, ProductSort, ProductFilters, CategoryChips } from '../components';

import type { FiltersProps } from '../components';
import type { IBanner, ICatalogFilter, ICatalogVariant } from '../types/productTypes';

// ----------------------------------------------------------------------

const PAGE_SIZE = 24;

const defaultFilters: FiltersProps = {
  search: '',
  categoryIds: [],
  minPrice: '',
  maxPrice: '',
};

export default function ProductsView({ initialSearch = '' }: { initialSearch?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page'));
  const { committed, clearSearch } = useSearch();
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<ICatalogVariant[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(() =>
    Number.isInteger(initialPage) && initialPage > 0 ? initialPage : 1
  );
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const previousCommitted = useRef(committed);
  const previousInitialSearch = useRef(initialSearch);

  useEffect(() => {
    const queryPage = Number(searchParams.get('page'));
    setPage(Number.isInteger(queryPage) && queryPage > 0 ? queryPage : 1);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    const query = params.toString();
    if (query !== searchParams.toString()) {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
  }, [page, pathname, router, searchParams]);

  useEffect(() => {
    if (previousCommitted.current !== committed) setPage(1);
    previousCommitted.current = committed;
    setFilters((prev) => ({ ...prev, search: committed }));
  }, [committed]);

  useEffect(() => {
    if (previousInitialSearch.current !== initialSearch) setPage(1);
    previousInitialSearch.current = initialSearch;
    setFilters((prev) => ({ ...prev, search: initialSearch }));
  }, [initialSearch]);

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
        SortBy: currentSort,
      };

      const result = await catalogService.getCatalog(filter);

      setProducts(result.Items);
      setTotalCount(result.TotalCount);
    },
    []
  );

  useEffect(() => {
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
    clearSearch();
    setFilters(defaultFilters);
  }, [clearSearch]);

  const canReset = JSON.stringify(filters) !== JSON.stringify(defaultFilters);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <DashboardContent maxWidth={false}>
      {page == 1 && <BannerSlider banners={banners} />}

      <CategoryChips />

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
