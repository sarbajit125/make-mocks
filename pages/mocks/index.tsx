import React from "react";
import { dehydrate, QueryClient } from "react-query";
import { APIManager } from "../../api/apiManager";
import ResponsiveAppBar, { NavItemsList } from "../../components/navbar";
import { EnhancedPosts } from "../../components/posts";

function Mocks() {
  const navItems: NavItemsList[] = [
    { name: "Domains", navlink: "/", isExternal: false },
  ];
  return (
    <>
      <ResponsiveAppBar items={navItems} />
      <EnhancedPosts />
    </>
  );
}
export async function getServerSideProps(context: { query: { id: string } }) {
  let domainId = context.query.id;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["mocks",1, 5, domainId],
    queryFn: () => APIManager.sharedInstance().getAllRoutes(1, 5, domainId),
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}
export default Mocks;
