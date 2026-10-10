'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import Box from '@mui/material/Box';

import type { IBanner } from '../types/productTypes';

// ----------------------------------------------------------------------

interface Props {
  banners: IBanner[];
}

export function BannerSlider({ banners }: Props) {
  const active = banners.filter((b) => b.IsActive);

  if (active.length === 0) return null;

  return (
    <Box
      sx={{
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%',
        height: { xs: 160, sm: 180, md: 300 },
        bgcolor: 'grey.100',
        '& .swiper, & .swiper-wrapper, & .swiper-slide': {
          height: '100%',
          width: '100%',
        },
        '& .swiper-button-next, & .swiper-button-prev': {
          color: '#fff',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          '&::after': { fontSize: '14px', fontWeight: 700 },
          '&:hover': { background: 'rgba(0,0,0,0.6)' },
        },
        '& .swiper-pagination-bullet': {
          background: '#fff',
          opacity: 0.6,
        },
        '& .swiper-pagination-bullet-active': {
          background: 'var(--palette-primary-main)',
          opacity: 1,
          width: '20px',
          borderRadius: '4px',
        },
      }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={active.length > 1}
        style={{ width: '100%', height: '100%' }}
      >
        {active.map((banner) => (
          <SwiperSlide key={banner.Id}>
            <img
              src={banner.ImageUrl}
              alt={banner.AltText || banner.Name}
              style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
