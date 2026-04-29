import AppProviders from '@/app/providers';
import AppRouter from '@/app/router';
import '@/lib/i18n';

/**
 * App — Root component.
 * Wraps everything in providers and the router.
 */
export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
