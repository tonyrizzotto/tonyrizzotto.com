import { useEffect, useState } from 'react';
import createCache from '@emotion/cache';
import { ThemeProvider, CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useQuery } from 'graphql-hooks';
import { useSetEnvVarContext } from './contexts/envVarContext';
import Router from './Routes';
import theme from './theme';
import { ENV_QUERY } from './queries';

const cache = createCache({
  key: 'tonyrizzotto',
});

/*
  `App` component is for anything used to initialize the application after the
  document has loaded, or been `hydrated` to the client.
 */
export default function App() {
  const [hydrated, setHydrated] = useState(false);
  const { setEnvVars } = useSetEnvVarContext();
  const { loading, data } = useQuery(ENV_QUERY);

  // After App has mounted, set hydrated to true
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Aside from hydration, we only want the rerender the initial app if the ENV Query has finished.
  useEffect(() => {
    if (!loading) setEnvVars(data.getPublicEnvVars);
  }, [loading]);

  /*
    We only want to mount our app if it has hydrated on the screen.
    For hydration to work correctly in SSR, the HTML must be exactly identical at first render
  */
  if (!hydrated) {
    return null;
  }

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router hydrated={hydrated} />
      </ThemeProvider>
    </CacheProvider>
  );
}
