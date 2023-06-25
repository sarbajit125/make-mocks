import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { RoutePageContext, RoutePageType, dummyMockDetails } from "../contexts/pageContext";
import { RouteDetails } from "../DTO/components";
import ErrorBoundary from "../components/ErrorBoundary";
export default function App({ Component, pageProps }: AppProps) {
  const tenMinsInMS = 1000 * 60 * 2;
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [mockId, setMockId] = useState<string>('');
  const [mockDetails, setMockDetails] = useState<RouteDetails>({} as RouteDetails);
  const toggleIsCreate = (isCreate: boolean) => {
    setIsCreate(isCreate);
  };

  const setMockCuid = (id: string) => {
    setMockId(id);
  };

  const setMockPage = (pageDetails: RouteDetails) => {
    setMockDetails(pageDetails);
  };
  const contextValue: RoutePageType = {
    isCreate,
    mockId,
    mockDetails,
    toggleIsCreate,
    setMockCuid,
    setMockPage,
  };
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: tenMinsInMS,
            notifyOnChangeProps: "tracked",
          },
        },
      })
  );
  return (
    <ErrorBoundary>
    <RoutePageContext.Provider
      value={contextValue}
    >
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </RoutePageContext.Provider>
    </ErrorBoundary>
  );
}
