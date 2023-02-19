import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
export default function App({ Component, pageProps }: AppProps) {
  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions:{
      queries:{
        staleTime:  twentyFourHoursInMs,
        notifyOnChangeProps: 'tracked',
      }
    }
  }));
    return (
      <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  ) 
  
}
