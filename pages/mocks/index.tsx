import React from "react";
import { dehydrate, QueryClient } from "react-query";
import { APIManager } from "../../api/apiManager";
import ResponsiveAppBar, { NavItemsList } from "../../components/navbar";
import { EnhancedPosts } from "../../components/posts";
import Head from "next/head";

function Mocks() {
  const navItems: NavItemsList[] = [
    { name: "Domains", navlink: "/", isExternal: false },
  ];
  return (
    <>
      <Head>
        <title>Make Mocks</title>
      </Head>
      <ResponsiveAppBar items={navItems} />
      <EnhancedPosts />
    </>
  );
}
export async function getServerSideProps(context: { query: { id: string } }) {
  try {
    let domainId = context.query.id;
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
      queryKey: ["mocks", 1, 5, domainId],
      queryFn: () => APIManager.sharedInstance().getAllRoutes(1, 5, domainId),
    });
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    return {
      redirect:{
        destination: '/500',
        permanent: false
      }
    }
  }
}
export default Mocks;
