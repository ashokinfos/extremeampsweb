'use client';

import NextLink from 'next/link';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

interface Category {
  Id: string;
  Name: string;
  slug: string;
}

interface HomeHeroProps {
  categories: Category[];
}

export function HomeHero({ categories }: HomeHeroProps) {
  return (
    <Box
      component="section"
      aria-label="Hero"
      sx={{ px: { xs: 2, sm: 3, lg: 3 }, pt: { xs: 3, md: 1 }, pb: { xs: 1, md: 2 },alignItems: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center' }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2 }}
      >
        Class D Amplifier Boards &amp; Audio Modules
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 2, maxWidth: "90%" }}
      >
        Extreme Amps manufactures high-efficiency Class D amplifier boards, 5.1 home theater kits, DSP audio decoders, and OEM audio PCB assemblies in Vellore, Tamil Nadu, India.
        Shop direct from the manufacturer — genuine products, competitive prices, fast shipping.
      </Typography>

      {categories.length > 0 && (
        <>
          <Typography
            component="h2"
            variant="subtitle1"
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Shop by Category
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {categories.map((cat) => (
              <NextLink
                key={cat.Id}
                href={`/category/${cat.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: '1px solid currentColor',
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  textDecoration: 'none',
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                  opacity: 0.85,
                }}
              >
                {cat.Name}
              </NextLink>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
