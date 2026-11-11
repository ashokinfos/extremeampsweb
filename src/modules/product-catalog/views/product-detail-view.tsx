'use client';

import { Label } from '@/shared/components/label';
import { Iconify } from '@/shared/components/iconify';
import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardContent } from '@/shared/layouts/home';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/modules/auth/contexts/hooks/useAuth';
import { useAppInfo } from '@/shared/contexts/AppInfoContext';
import ProductSchema from '@/shared/components/ProductSchema';
import { useSeoMeta } from '@/shared/contexts/hooks/useSeoMeta';
import { fCurrency, toProductSlug, idFromProductSlug } from '@/shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useCart } from '../contexts/CartContext';
import { catalogService } from '../services/catalogService';

import type { IProductDetail, IProductDetailVariant } from '../types/productTypes';

const PLACEHOLDER_IMG = '/assets/placeholder.png';

const imgUrl = (path: string | null | undefined) => (path ? path : PLACEHOLDER_IMG);

// ----------------------------------------------------------------------

const ZOOM_SCALE = 2.5; // magnification factor

function ImageGallery({
  images,
  fallback,
}: {
  images: { ImageUrl: string; AltText?: string; IsPrimary?: boolean }[];
  fallback?: string | null;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const allImages = images.length > 0 ? images : fallback ? [{ ImageUrl: fallback }] : [];
  const primary = allImages.find((i) => (i as any).IsPrimary) ?? allImages[0];
  const [selected, setSelected] = useState(primary?.ImageUrl ?? null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Magnifier state
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });  // cursor % within image
  const imgContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const p = allImages.find((i) => (i as any).IsPrimary) ?? allImages[0];
    setSelected(p?.ImageUrl ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, fallback]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x, y });
  };

  // Lens size as % of container
  const LENS_SIZE = 35; // %

  return (
    <Stack spacing={1.5} sx={{ position: 'relative' }}>
      {/* Main image with magnifier */}
      <Box
        ref={imgContainerRef}
        onMouseEnter={() => !isMobile && setShowLens(true)}
        onMouseLeave={() => setShowLens(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setLightboxOpen(true)}
        sx={{
          width: 1,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.neutral',
          aspectRatio: '1 / 1',
          position: 'relative',
          cursor: isMobile ? 'zoom-in' : 'crosshair',
          userSelect: 'none',
        }}
      >
        {/* Main image */}
        <Box
          component="img"
          src={imgUrl(selected)}
          alt="product"
          sx={{ width: 1, height: 1, objectFit: 'contain', display: 'block' }}
        />

        {/* Lens highlight box */}
        {showLens && (
          <Box
            sx={{
              position: 'absolute',
              width: `${LENS_SIZE}%`,
              height: `${LENS_SIZE}%`,
              border: '2px solid',
              borderColor: 'primary.main',
              borderRadius: 1,
              bgcolor: 'rgba(255,255,255,0.15)',
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
              left: `${lensPos.x}%`,
              top: `${lensPos.y}%`,
              // clamp so lens doesn't go out of bounds
              maxLeft: `${100 - LENS_SIZE / 2}%`,
            }}
          />
        )}

        {/* Zoom icon hint */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.4)',
            borderRadius: 1,
            px: 0.75,
            py: 0.25,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            opacity: showLens ? 0 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          <Iconify icon="solar:magnifer-zoom-in-bold" sx={{ color: '#fff', fontSize: 14 }} />
          <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.65rem' }}>
            {isMobile ? 'Tap to zoom' : 'Hover to zoom'}
          </Typography>
        </Box>
      </Box>

      {/* Zoom preview panel — shown beside image on desktop */}
      {showLens && (
        <Box
          sx={{
            position: 'absolute',
            left: 'calc(100% + 16px)',
            top: 0,
            width: 380,
            height: 380,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: 8,
            overflow: 'hidden',
            zIndex: 10,
            pointerEvents: 'none',
            backgroundImage: `url(${imgUrl(selected)})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${ZOOM_SCALE * 100}%`,
            backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
          }}
        />
      )}

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {allImages.map((img, idx) => (
            <Box
              key={idx}
              component="img"
              src={imgUrl(img.ImageUrl)}
              alt={(img as any).AltText ?? `img-${idx}`}
              onClick={() => setSelected(img.ImageUrl)}
              sx={{
                width: 64,
                height: 64,
                objectFit: 'contain',
                borderRadius: 1,
                cursor: 'pointer',
                border: (t) =>
                  `2px solid ${selected === img.ImageUrl ? t.palette.primary.main : t.palette.divider}`,
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: 'primary.light' },
              }}
            />
          ))}
        </Stack>
      )}

      {/* Lightbox — fullscreen image on click */}
      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '92vw',
            maxHeight: '92vh',
            outline: 'none',
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <Box
            component="img"
            src={imgUrl(selected)}
            alt="product zoomed"
            sx={{
              maxWidth: '92vw',
              maxHeight: '92vh',
              objectFit: 'contain',
              borderRadius: 2,
              boxShadow: 24,
              display: 'block',
            }}
          />
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
            }}
          >
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
      </Modal>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: IProductDetailVariant[];
  selectedId: string;
  onSelect: (v: IProductDetailVariant) => void;
}) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        Select Variant
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {variants.map((v) => (
          <Chip
            key={v.Id}
            label={v.VariantName}
            onClick={() => onSelect(v)}
            color={v.Id === selectedId ? 'primary' : 'default'}
            variant={v.Id === selectedId ? 'filled' : 'outlined'}
            disabled={!v.IsActive || v.StockQuantity === 0}
            sx={{ mb: 0.5 }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function PriceBlock({ variant }: { variant: IProductDetailVariant }) {
  const hasDiscount = variant.DiscountedPrice > 0 && variant.DiscountedPrice < variant.SellingPrice;
  const displayPrice = hasDiscount ? variant.DiscountedPrice : variant.SellingPrice;
  const discount = hasDiscount
    ? Math.round(((variant.SellingPrice - variant.DiscountedPrice) / variant.SellingPrice) * 100)
    : 0;

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
      <Typography variant="h4" color="primary.main">
        {fCurrency(displayPrice)}
      </Typography>
      {hasDiscount && (
        <>
          <Typography
            variant="body1"
            sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
          >
            {fCurrency(variant.SellingPrice)}
          </Typography>
          <Label color="error" variant="soft">
            {discount}% OFF
          </Label>
        </>
      )}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function FeatureTable({ features }: { features: IProductDetail['Features'] }) {
  if (!features.length) return null;

  const grouped = features.reduce<Record<string, string[]>>((acc, f) => {
    if (!acc[f.ItemType]) acc[f.ItemType] = [];
    acc[f.ItemType].push(f.ItemValue);
    return acc;
  }, {});

  return (
    <Stack spacing={0}>
      {Object.entries(grouped).map(([type, values], idx) => (
        <Stack
          key={type}
          direction="row"
          sx={{
            py: 1,
            px: 1.5,
            bgcolor: idx % 2 === 0 ? 'background.neutral' : 'transparent',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ width: 160, flexShrink: 0 }}>
            {type}
          </Typography>
          <Typography variant="body2">{values.join(', ')}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function DescriptionSection({ descriptions }: { descriptions: IProductDetail['Descriptions'] }) {
  if (!descriptions.length) return null;

  return (
    <Stack spacing={3}>
      {descriptions.map((desc) => (
        <Stack key={desc.Id} spacing={1}>
          {desc.Title && <Typography variant="h6">{desc.Title}</Typography>}
          {desc.ImageUrl && (
            <Box
              component="img"
              src={imgUrl(desc.ImageUrl)}
              alt={desc.Title}
              sx={{ width: 1, maxHeight: 320, objectFit: 'contain', borderRadius: 2 }}
            />
          )}
          {desc.Content && (
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              dangerouslySetInnerHTML={{ __html: desc.Content }}
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function DetailSkeleton() {
  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Skeleton variant="rounded" sx={{ aspectRatio: '1/1', width: 1 }} />
        <Stack direction="row" spacing={1} mt={1.5}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" width={64} height={64} />
          ))}
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="rounded" height={48} />
          <Skeleton variant="rounded" height={80} />
        </Stack>
      </Grid>
    </Grid>
  );
}

// ----------------------------------------------------------------------

export default function ProductDetailView() {
  const params = useParams<{ productSlug: string[] }>();
  const productSlug = params?.productSlug;
  const variantId = idFromProductSlug(productSlug ?? '');
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { addToCart, openDrawer } = useCart();
  const { appInfo } = useAppInfo();

  const [product, setProduct] = useState<IProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<IProductDetailVariant | null>(null);
  const [qty, setQty] = useState(1);

  useSeoMeta({
    title: product ? `${product.Name} | ${appInfo?.Name ?? 'Shop'}` : (appInfo?.Name ?? 'Product'),
    description: product?.Description
      ? product.Description.slice(0, 160)
      : `Buy ${product?.Name ?? 'this product'} online at the best price.`,
    keywords: product
      ? `${product.Name}, ${product.CategoryName ?? ''}, Class D Amplifier Manufacturer, Audio PCB Assembly India, OEM Audio Solutions, High-Efficiency Audio Amplifiers, Electronics R&D Vellore`
      : 'Class D Amplifier Manufacturer, Audio PCB Assembly India, OEM Audio Solutions',
    canonical: productSlug ? `/product/${productSlug}` : '/',
    ogType: 'product',
    ogImage:
      selectedVariant?.Images.find((i) => i.IsPrimary)?.ImageUrl ??
      selectedVariant?.Images[0]?.ImageUrl ??
      undefined,
  });

  const fetchDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await catalogService.getProductDetail(id);
      setProduct(data);
      const initial =
        data.Variants.find((v) => v.Id === id) ??
        data.Variants.find((v) => v.Id === data.SelectedVariantId) ??
        data.Variants.find((v) => v.IsDefault) ??
        data.Variants[0] ??
        null;
      setSelectedVariant(initial);
      setQty(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (variantId) fetchDetail(variantId);
  }, [variantId, fetchDetail]);

  const handleVariantSelect = (v: IProductDetailVariant) => {
    setSelectedVariant(v);
    setQty(1);
    router.replace(`/product/${toProductSlug(product?.Name ?? '', v.Id, product?.CategoryName)}`);
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    const hasDiscount =
      selectedVariant.DiscountedPrice > 0 &&
      selectedVariant.DiscountedPrice < selectedVariant.SellingPrice;
    await addToCart(
      {
        ProductId: product.Id,
        VariantId: selectedVariant.Id,
        Quantity: qty,
        ProductName: product.Name,
        VariantName: selectedVariant.VariantName,
        EffectivePrice: hasDiscount
          ? selectedVariant.DiscountedPrice
          : selectedVariant.SellingPrice,
        ImageUrl:
          selectedVariant.Images.find((i) => i.IsPrimary)?.ImageUrl ??
          selectedVariant.Images[0]?.ImageUrl ??
          null,
        StockQuantity: selectedVariant.StockQuantity,
        MetrixWeight: selectedVariant.MetrixWeight,
        ProductWeight: selectedVariant.ProductWeight,
      },
      !!user
    );
    openDrawer();
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/');
  };

  const variantImages = selectedVariant?.Images ?? [];
  const productImages = product?.Images ?? [];
  const galleryImages = variantImages.length > 0 ? variantImages : productImages;

  const inStock = (selectedVariant?.StockQuantity ?? 0) > 0;
  const schemaPrice = selectedVariant
    ? selectedVariant.DiscountedPrice > 0 &&
      selectedVariant.DiscountedPrice < selectedVariant.SellingPrice
      ? selectedVariant.DiscountedPrice
      : selectedVariant.SellingPrice
    : 0;
  const schemaImage =
    selectedVariant?.Images.find((i) => i.IsPrimary)?.ImageUrl ??
    selectedVariant?.Images[0]?.ImageUrl ??
    '';

  return (
    <DashboardContent maxWidth="lg">
      {/* Back button */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={handleBack} size="small">
          <Iconify icon="solar:arrow-left-linear" />
        </IconButton>
        <Typography
          variant="body2"
          color="text.secondary"
          onClick={handleBack}
          sx={{ cursor: 'pointer', '&:hover': { color: 'text.primary' } }}
        >
          Back to Products
        </Typography>
      </Stack>

      {product && selectedVariant && (
        <ProductSchema
          name={product.Name}
          description={product.Description ?? ''}
          sku={selectedVariant.SKU}
          image={schemaImage}
          brand={appInfo?.Name ?? 'Extreme Amps'}
          price={schemaPrice}
          availability={inStock ? 'InStock' : 'OutOfStock'}
          url={`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in'}/product/${toProductSlug(product.Name, selectedVariant.Id, product.CategoryName)}`}
        />
      )}

      {loading ? (
        <DetailSkeleton />
      ) : !product ? (
        <Typography color="text.secondary" textAlign="center" py={10}>
          Product not found.
        </Typography>
      ) : (
        <Stack spacing={4}>
          {/* Main section */}
          <Grid container spacing={{ xs: 2, md: 5 }}>
            {/* Image gallery */}
            <Grid size={{ xs: 12, md: 5 }}>
              <ImageGallery images={galleryImages} />
            </Grid>

            {/* Product info */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2.5}>
                {/* Category + stock */}
                <Stack direction="row" spacing={1} alignItems="center">
                  {product.CategoryName && (
                    <Label color="info" variant="soft">
                      {product.CategoryName}
                    </Label>
                  )}
                  <Label color={inStock ? 'success' : 'error'} variant="soft">
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </Label>
                </Stack>

                {/* Name */}
                <Typography variant={isMobile ? 'h5' : 'h4'}>{product.Name}</Typography>

                {/* Price */}
                {selectedVariant && <PriceBlock variant={selectedVariant} />}

                {/* Tax note */}
                <Typography variant="caption" color="text.secondary">
                  Incl. {product.TaxRate}% GST
                </Typography>

                <Divider />

                {/* Variant selector */}
                {product.Variants.length > 1 && selectedVariant && (
                  <VariantSelector
                    variants={product.Variants}
                    selectedId={selectedVariant.Id}
                    onSelect={handleVariantSelect}
                  />
                )}

                {/* Qty + Add to Cart */}
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      sx={{ border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1 }}
                    >
                      <Iconify icon="mingcute:minus-line" width={16} />
                    </IconButton>
                    <Typography variant="body1" sx={{ minWidth: 32, textAlign: 'center' }}>
                      {qty}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setQty((q) => Math.min(selectedVariant?.StockQuantity ?? 1, q + 1))
                      }
                      disabled={qty >= (selectedVariant?.StockQuantity ?? 1)}
                      sx={{ border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1 }}
                    >
                      <Iconify icon="mingcute:add-line" width={16} />
                    </IconButton>
                  </Stack>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Iconify icon="solar:cart-plus-bold" />}
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    sx={{ flex: 1 }}
                  >
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          {/* Features */}
          {product.Features.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Specifications
                </Typography>
                <FeatureTable features={product.Features} />
              </CardContent>
            </Card>
          )}

          {/* Descriptions */}
          {product.Descriptions.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Product Details
                </Typography>
                <DescriptionSection descriptions={product.Descriptions} />
              </CardContent>
            </Card>
          )}

          {/* All variants overview */}
          {product.Variants.length > 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Available Variants
                </Typography>
                <Stack spacing={1}>
                  {product.Variants.map((v) => {
                    const hasDiscount = v.DiscountedPrice > 0 && v.DiscountedPrice < v.SellingPrice;
                    const thumb = v.Images.find((i) => i.IsPrimary) ?? v.Images[0];
                    const isSelected = v.Id === selectedVariant?.Id;

                    return (
                      <Stack
                        key={v.Id}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        onClick={() => v.IsActive && handleVariantSelect(v)}
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          cursor: v.IsActive ? 'pointer' : 'default',
                          border: (t) =>
                            `1px solid ${isSelected ? t.palette.primary.main : t.palette.divider}`,
                          bgcolor: isSelected ? 'primary.lighter' : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': v.IsActive ? { bgcolor: 'action.hover' } : {},
                          opacity: v.IsActive ? 1 : 0.5,
                        }}
                      >
                        <Box
                          component="img"
                          src={imgUrl(thumb?.ImageUrl ?? null)}
                          alt={v.VariantName}
                          sx={{
                            width: 48,
                            height: 48,
                            objectFit: 'contain',
                            borderRadius: 1,
                            flexShrink: 0,
                          }}
                        />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap>
                            {v.VariantName}
                          </Typography>
                          {v.SKU && (
                            <Typography variant="caption" color="text.secondary">
                              SKU: {v.SKU}
                            </Typography>
                          )}
                        </Box>
                        <Stack alignItems="flex-end" flexShrink={0}>
                          <Typography variant="subtitle2" color="primary.main">
                            {fCurrency(hasDiscount ? v.DiscountedPrice : v.SellingPrice)}
                          </Typography>
                          {hasDiscount && (
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
                            >
                              {fCurrency(v.SellingPrice)}
                            </Typography>
                          )}
                        </Stack>
                        <Label
                          color={v.StockQuantity > 0 ? 'success' : 'error'}
                          variant="soft"
                          sx={{ flexShrink: 0 }}
                        >
                          {v.StockQuantity > 0 ? 'In Stock' : 'Out'}
                        </Label>
                      </Stack>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      )}
    </DashboardContent>
  );
}
