import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
export default function App({ Component, pageProps }: AppProps) {
  const tenMinsInMS = 1000 * 60 * 2
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions:{
      queries:{
        staleTime:  tenMinsInMS,
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
