'use client';

import { useState, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MuiLink from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { DashboardContent } from '@/shared/layouts/home';
import { ProductItem, ProductSort } from '@/modules/product-catalog/components';
import { catalogService } from '@/modules/product-catalog/services/catalogService';
import { idFromCategorySlug, toCategorySlug } from '@/shared/utils';
import type { ICatalogVariant, ICatalogCategory } from '@/modules/product-catalog/types/productTypes';

// ----------------------------------------------------------------------

const PAGE_SIZE = 24;
const SIDEBAR_WIDTH = 220;

type Props = {
  categoryName: string;
};

// ----------------------------------------------------------------------

function CategorySidebar({
  categories,
  activeCategoryId,
  loading,
}: {
  categories: ICatalogCategory[];
  activeCategoryId: string;
  loading: boolean;
}) {
  // "All" is active when activeCategoryId is empty (no specific category selected)
  const allActive = !activeCategoryId;

  return (
    <Box>
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CategoryIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
          Categories
        </Typography>
      </Box>
      <Divider />
      <List dense disablePadding>
        <ListItemButton
          component={NextLink}
          href="/"
          selected={allActive}
          sx={{
            px: 2,
            py: 0.75,
            borderRadius: 1,
            mx: 0.5,
            my: 0.25,
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' },
            },
          }}
        >
          <ListItemText
            primary="All"
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: allActive ? 700 : 400,
              noWrap: true,
            }}
          />
        </ListItemButton>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="text" sx={{ mx: 2, my: 0.5, height: 32 }} />
          ))
          : categories.map((cat) => {
            const isActive = cat.Id === activeCategoryId;
            return (
              <ListItemButton
                key={cat.Id}
                component={NextLink}
                href={`/category/${toCategorySlug(cat.Name, cat.Id)}`}
                selected={isActive}
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: 1,
                  mx: 0.5,
                  my: 0.25,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemText
                  primary={cat.Name}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isActive ? 700 : 400,
                    noWrap: true,
                  }}
                />
              </ListItemButton>
            );
          })}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function CategoryView({ categoryName }: Props) {
  const params = useParams<{ categorySlug: string }>();
  const categoryId = idFromCategorySlug(params?.categorySlug ?? '');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page'));
  const previousCategoryId = useRef(categoryId);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [products, setProducts] = useState<ICatalogVariant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(() =>
    Number.isInteger(initialPage) && initialPage > 0 ? initialPage : 1
  );
  const [sortBy, setSortBy] = useState('featured');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Reset to page 1 when navigating to a different category
  useEffect(() => {
    if (previousCategoryId.current !== categoryId) setPage(1);
    previousCategoryId.current = categoryId;
  }, [categoryId]);

  useEffect(() => {
    const queryPage = Number(searchParams.get('page'));
    setPage(Number.isInteger(queryPage) && queryPage > 0 ? queryPage : 1);
  }, [searchParams]);

  useEffect(() => {
    const queryParams = new URLSearchParams(searchParams.toString());
    if (page > 1) queryParams.set('page', String(page));
    else queryParams.delete('page');
    const query = queryParams.toString();
    if (query !== searchParams.toString()) {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
  }, [page, pathname, router, searchParams]);

  const [categories, setCategories] = useState<ICatalogCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  // Fetch all categories for the sidebar
  useEffect(() => {
    catalogService
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setCatLoading(false));
  }, []);

  // Fetch products for active category
  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    catalogService
      .getCatalog({
        CategoryIds: [categoryId],
        Search: search || undefined,
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
  }, [categoryId, page, search, sortBy]);

  const submitSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput('');
    setPage(1);
    setSearch('');
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const sidebarContent = (
    <CategorySidebar
      categories={categories}
      activeCategoryId={categoryId}
      loading={catLoading}
    />
  );

  return (
    <DashboardContent maxWidth={false}>
      <Box sx={{ display: 'flex', gap: { md: 3 }, alignItems: 'flex-start' }}>

        {/* ── Desktop sidebar ── */}
        {!isMobile && (
          <Box
            component="aside"
            aria-label="Category navigation"
            sx={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              position: 'sticky',
              top: 80,
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
              py: 1,
            }}
          >
            {sidebarContent}
          </Box>
        )}

        {/* ── Mobile drawer ── */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: { width: SIDEBAR_WIDTH + 40, pt: 1 },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
              <IconButton size="small" onClick={() => setDrawerOpen(false)} aria-label="Close categories">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            {sidebarContent}
          </Drawer>
        )}

        {/* ── Main content ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>

          {/* Header row */}
          <Box sx={{ mb: 2 }}>
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

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Mobile: categories toggle */}
                {isMobile && (
                  <IconButton
                    size="small"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open categories"
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                  >
                    <MenuIcon fontSize="small" />
                  </IconButton>
                )}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography component="h1" variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {categoryName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {loading ? '…' : `${totalCount} product${totalCount !== 1 ? 's' : ''}`}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter') submitSearch(); }}
                placeholder={`Search ${categoryName}`}
                aria-label={`Search products in ${categoryName}`}
                sx={{ width: { xs: '100%', sm: 240 } }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                  endAdornment: searchInput ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch} aria-label="Clear category search"><ClearIcon fontSize="small" /></IconButton>
                    </InputAdornment>
                  ) : undefined,
                }}
              />
              <IconButton
                onClick={submitSearch}
                aria-label="Search category products"
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
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
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(5, 1fr)',
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
                {search ? `No products found for “${search}” in this category.` : 'No products in this category yet.'}
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
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(5, 1fr)',
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
              sx={{ mt: 8, mx: 'auto', display: 'flex', justifyContent: 'center' }}
            />
          )}
        </Box>
      </Box>
    </DashboardContent>
  );
}
