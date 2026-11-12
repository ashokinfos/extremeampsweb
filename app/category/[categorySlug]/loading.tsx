import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import { HomeLayout, DashboardContent } from '@/shared/layouts/home';

// ----------------------------------------------------------------------

export default function CategoryLoading() {
  return (
    <HomeLayout>
      <DashboardContent maxWidth={false}>
        {/* Breadcrumbs skeleton */}
        <Skeleton variant="text" width={200} sx={{ mb: 2 }} />

        {/* Heading skeleton */}
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width={120} sx={{ mb: 3 }} />

        {/* Product grid skeleton */}
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
            <Box key={i}>
              {/* Square image area */}
              <Skeleton variant="rectangular" sx={{ width: '100%', paddingTop: '100%' }} />
              {/* Two text lines below */}
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))}
        </Box>
      </DashboardContent>
    </HomeLayout>
  );
}
