import { CONFIG } from '@/config-global';
import { NotFoundView } from '@/core/pages/not-found-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`404 page not found! | Error - ${CONFIG.appName}`}</title>

      <NotFoundView />
    </>
  );
}
