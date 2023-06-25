import ResponsiveAppBar, { NavItemsList } from "../components/navbar";
import DomainGrid from "../components/DomainGrid";
import prisma from "../lib/prisma";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { DomainDTO } from "../DTO/components";
import Head from 'next/head'
export default function Home({list}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const navItems: NavItemsList[] = [
    { name: "About", navlink: "/about", isExternal: false },
  ];
  return (
    <div>
      <Head>
        <title>Make Mocks</title>
      </Head>
      <ResponsiveAppBar items={navItems} />
      <DomainGrid list={list} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  list: DomainDTO[]
}> = async () => {
  try {
    const response = await prisma.domains.findMany();
    const list: DomainDTO[] = response.map((item) => ({
      desc: item.desc ?? "",
      name: item.name,
      id: item.id,
    }));
    return { props: { list } };
  } catch (error) {
    return {
      redirect:{
        destination: '/500',
        permanent: false
      }
    }
  }
 
}